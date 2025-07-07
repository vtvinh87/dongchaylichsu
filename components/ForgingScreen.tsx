import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ForgingMissionData, Reward } from '../types';
import { ALL_FRAGMENTS_MAP } from '../constants';
import { playSound } from '../utils/audio';
import { FORGE_ANVIL_BG_URL, FORGE_SPARKS_GIF_URL } from '../imageUrls';

type GameState = 'idle' | 'playing' | 'win' | 'loss';

interface ForgingScreenProps {
  missionData: ForgingMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
  onFail: () => void;
}

const ForgingScreen: React.FC<ForgingScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
  onFail,
}) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showSparks, setShowSparks] = useState(false);
  const [sparksPosition, setSparksPosition] = useState({ top: '50%', left: '50%' });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const hitMarkerRef = useRef<HTMLDivElement>(null);
  const forceBarRef = useRef<HTMLDivElement>(null);
  const rewardImageUrl = useRef('');
  const forgeScreenRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
      gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    // Reset state when mission data changes
    setProgress(0);
    setScore(0);
    setTimeLeft(30);
    setGameState('idle');
    setShowSparks(false);

    if (missionData.reward.type === 'fragment') {
      const fragment = ALL_FRAGMENTS_MAP[missionData.reward.id];
      if (fragment) rewardImageUrl.current = fragment.imageUrl;
    }
  }, [missionData]);

  // Update high score
  useEffect(() => {
      if (score > highScore) {
          setHighScore(score);
      }
  }, [score, highScore]);

  const handleForgeAttempt = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;

    const markerEl = hitMarkerRef.current;
    const barEl = forceBarRef.current;
    const screenEl = forgeScreenRef.current;
    if (!markerEl || !barEl || !screenEl) return;

    // Pause the animation to get position
    markerEl.style.animationPlayState = 'paused';

    const barRect = barEl.getBoundingClientRect();
    const markerRect = markerEl.getBoundingClientRect();
    const screenRect = screenEl.getBoundingClientRect();

    const sparksLeftPx = markerRect.left + markerRect.width / 2 - screenRect.left;
    const sparksTopPx = barRect.top - screenRect.top;
    setSparksPosition({ top: `${sparksTopPx}px`, left: `${sparksLeftPx}px` });
    setShowSparks(true);
    setTimeout(() => setShowSparks(false), 400);

    const markerCenter = markerRect.left + markerRect.width / 2;
    const positionPercent = Math.round(((markerCenter - barRect.left) / barRect.width) * 100);

    let progressIncrease = 0;
    let scoreIncrease = 0;
    const distance = Math.abs(50 - positionPercent); // Distance from center (0-50)

    // Calculate score based on distance. 100 at center, -100 at edges.
    scoreIncrease = Math.round(100 - (distance * 4));

    // Calculate progress and play sound based on zones
    if (distance <= 5) { // Perfect zone (45-55)
        progressIncrease = 20;
        playSound('sfx_success');
    } else if (distance <= 25) { // Good zone (25-75)
        progressIncrease = 10;
        playSound('sfx_click');
    } else { // Miss zone (<25, >75)
        progressIncrease = -5;
        playSound('sfx_fail');
    }

    setProgress(prev => Math.max(0, prev + progressIncrease));
    setScore(prev => prev + scoreIncrease);


    setTimeout(() => {
      if (markerEl && gameStateRef.current === 'playing') {
        markerEl.style.animationPlayState = 'running';
      }
    }, 100);
  }, []);

  // Game Logic Effects
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('loss');
            onFail();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, onFail]);

  useEffect(() => {
    if (progress >= missionData.targetProgress && gameState === 'playing') {
      setGameState('win');
      playSound('sfx_unlock');
      setTimeout(() => {
        onComplete(missionData.reward);
      }, 2000);
    }
  }, [progress, missionData, onComplete, gameState]);

  // Keyboard support for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameStateRef.current === 'playing') {
        e.preventDefault();
        handleForgeAttempt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleForgeAttempt]);

  const renderOverlay = () => {
    if (gameState === 'idle') {
      return (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 text-center">
            <h3 className="text-4xl font-bold mb-4">Sẵn sàng rèn vũ khí!</h3>
            <p className="mb-6">Nhấn chuột hoặc phím cách khi thanh trượt ở vùng xanh lá.</p>
            <button onClick={() => setGameState('playing')} className="bg-amber-500 hover:bg-amber-600 font-bold py-3 px-8 rounded-lg text-xl shadow-lg">Bắt đầu</button>
        </div>
      );
    }
    if (gameState === 'win' || gameState === 'loss') {
        const isWin = gameState === 'win';
        const title = isWin ? "Vũ khí hoàn thành!" : (timeLeft <= 0 ? "Hết giờ!" : "Thất bại!");
        const message = isWin ? "Bạn đã rèn thành công một vũ khí sắc bén." : "Hãy thử lại nhé!";
        return (
             <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp p-4 text-center">
                <h3 className={`text-4xl font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>{title}</h3>
                <p className="text-xl mt-2">{message}</p>
                {isWin && rewardImageUrl.current && <img src={rewardImageUrl.current} alt="Phần thưởng" className="w-32 h-32 object-contain my-4" />}
                {!isWin && <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 font-bold py-2 px-6 rounded-lg mt-4">Quay về</button>}
            </div>
        )
    }
    return null;
  }

  return (
    <div
      ref={forgeScreenRef}
      id="forging-screen"
      className="screen-container w-full p-6 rounded-lg shadow-xl text-center flex flex-col items-center justify-center cursor-pointer"
      style={{
        backgroundImage: `url(${FORGE_ANVIL_BG_URL})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1f2937',
      }}
      onClick={() => gameState === 'playing' && handleForgeAttempt()}
    >
      {renderOverlay()}
      
      {gameState !== 'idle' && (
        <button
            onClick={(e) => { e.stopPropagation(); onReturnToMuseum(); }}
            className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10"
        >
            Quay về
        </button>
      )}

      {gameState === 'playing' && (
        <div id="forging-timer">
            ⏳ {timeLeft}s
        </div>
      )}

      <div className="w-full max-w-md mx-auto mt-auto mb-8 bg-black/50 p-6 rounded-xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-amber-300 mb-2 font-serif">{missionData.title}</h2>
        <div className="flex justify-around items-center w-full mb-2 text-amber-200 font-semibold text-lg">
          <span>Điểm: {score}</span>
          <span>Kỷ lục: {highScore}</span>
        </div>
        <p className="text-amber-100 mb-4">Tiến độ: {progress} / {missionData.targetProgress}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-6 mb-4 border border-gray-900">
          <div
            className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(progress / missionData.targetProgress) * 100}%` }}
          ></div>
        </div>

        {/* Force Bar */}
        <div ref={forceBarRef} className="force-bar-container mb-4">
          <div className="force-bar-zone force-bar-good-zone"></div>
          <div className="force-bar-zone force-bar-perfect-zone"></div>
          <div ref={hitMarkerRef} className="hit-marker" style={{ animationPlayState: gameState === 'playing' ? 'running' : 'paused' }}></div>
        </div>
      </div>
      
      <img
        src={FORGE_SPARKS_GIF_URL}
        alt="sparks"
        className="sparks-effect"
        style={{
            top: sparksPosition.top,
            left: sparksPosition.left,
            opacity: showSparks ? 1 : 0
        }}
      />
    </div>
  );
};

export default ForgingScreen;
