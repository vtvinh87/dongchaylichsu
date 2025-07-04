import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavalBattleMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';

const NavalBattleScreen: React.FC<{
  missionData: NavalBattleMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward?: Reward) => void;
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'win' | 'loss'>('idle');
  const [shipPosition, setShipPosition] = useState(-10); // Start off-screen
  const [tideLevel, setTideLevel] = useState(100); // Start at high tide
  const [isTideFalling, setIsTideFalling] = useState(true);

  const animationFrameRef = useRef<number | null>(null);
  const battleAreaRef = useRef<HTMLDivElement>(null);
  const lastFrameTimeRef = useRef(performance.now());
  const gameStateRef = useRef(gameState);

  useEffect(() => {
      gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') {
      return;
    }
    const intervalId = setInterval(() => {
        setTideLevel(prevTide => {
            if (isTideFalling) {
                const newTide = prevTide - (100 / (missionData.tideDuration / 2));
                if (newTide <= 0) setIsTideFalling(false);
                return Math.max(0, newTide);
            } else {
                const newTide = prevTide + (100 / (missionData.tideDuration / 2));
                if (newTide >= 100) setIsTideFalling(true);
                return Math.min(100, newTide);
            }
        });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameState, isTideFalling, missionData.tideDuration]);


  const gameLoop = useCallback((currentTime: number) => {
    if (gameStateRef.current !== 'playing') return;

    const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = currentTime;

    const battleAreaWidth = battleAreaRef.current?.offsetWidth || 0;
    if (battleAreaWidth === 0) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
    }
    
    const pixelsPerSecond = missionData.shipSpeed;
    const pixelsToMove = pixelsPerSecond * deltaTime;

    setShipPosition(prev => {
      const newPos = prev + (pixelsToMove / battleAreaWidth * 100);
      if (newPos > 110) { // Ship has passed
        setGameState('loss');
        return 110;
      }
      return newPos;
    });

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [missionData.shipSpeed]);

  const startGame = () => {
    playSound('sfx_click');
    setGameState('playing');
  };
  
  useEffect(() => {
    if (gameState === 'playing') {
        lastFrameTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState === 'win' || gameState === 'loss') {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }
    return () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  }, [gameState, gameLoop]);


  const handleAttack = () => {
    if (gameState !== 'playing') return;

    const { trapZone } = missionData;
    const isShipInTrap = shipPosition >= trapZone.start && shipPosition <= trapZone.end;
    const isTideRight = tideLevel < 40; // Attack on low tide

    if (isShipInTrap && isTideRight) {
      playSound('sfx_unlock');
      setGameState('win');
      setTimeout(() => onComplete(missionData.reward), 2000);
    } else {
      playSound('sfx_fail');
      setGameState('loss');
    }
  };

  const renderOverlay = () => {
    let title = '', message = '';
    let showReturnButton = false;

    if (gameState === 'idle') {
      return (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-10">
          <h3 className="text-4xl font-bold mb-4">Trận chiến sắp bắt đầu!</h3>
          <p className="mb-6">Canh đúng thời điểm hạm đội địch lọt vào bãi cọc khi thủy triều rút để tổng tấn công!</p>
          <button onClick={startGame} className="attack-button bg-green-600 hover:bg-green-700">Bắt đầu</button>
        </div>
      );
    }

    if (gameState === 'win') {
      title = 'Chiến Thắng Vang Dội!';
      message = 'Bạn đã làm nên lịch sử!';
    } else if (gameState === 'loss') {
      title = 'Thất Bại!';
      message = 'Quân địch đã thoát khỏi bãi cọc. Hãy thử lại!';
      showReturnButton = true;
    }

    if (title) {
      return (
        <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white z-10 animate-fadeInScaleUp">
          <h3 className={`text-5xl font-bold mb-4 ${gameState === 'win' ? 'text-green-400' : 'text-red-500'}`}>{title}</h3>
          <p className="text-2xl">{message}</p>
          {showReturnButton && (
            <button onClick={onReturnToMuseum} className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">Quay về</button>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-stone-900 text-white rounded-lg shadow-xl flex flex-col items-center">
      <h2 className="text-3xl font-bold text-amber-300 mb-4 font-serif">{missionData.title}</h2>
      
      <div ref={battleAreaRef} className="naval-battle-area" style={{ backgroundImage: `url(${missionData.backgroundUrl})`}}>
        {renderOverlay()}
        <div className="tide-bar-container">
            <div className="tide-bar-fill" style={{ height: `${tideLevel}%` }}></div>
        </div>
        <div className="trap-zone-indicator" style={{ left: `${missionData.trapZone.start}%`, width: `${missionData.trapZone.end - missionData.trapZone.start}%`}}></div>
        <img src={missionData.enemyShipIconUrl} alt="Hạm đội địch" className="enemy-ship-icon" style={{ left: `${shipPosition}%` }} />
      </div>

      <div className="naval-battle-controls mt-6">
        <button onClick={handleAttack} disabled={gameState !== 'playing'} className="attack-button">
          Tổng Phản Công
        </button>
      </div>
    </div>
  );
};

export default NavalBattleScreen;
