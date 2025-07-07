

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LaneBattleMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';
import * as ImageUrls from '../imageUrls';

// --- Types ---
interface Enemy {
  id: number;
  lane: number;
  top: number; // percentage from top
  isStunned: boolean;
}

interface Ally {
  id: number;
  lane: number;
  health: number; // how many enemies it can block
}

interface CollisionEffect {
  id: number;
  lane: number;
}

// --- Constants ---
const ENEMY_SPEED_PERCENT_PER_SEC = 12.5; // 100% in 8 seconds
const ALLY_HEALTH = 3; // Blocks 3 enemies

const LaneBattleScreen: React.FC<{
  missionData: LaneBattleMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
  onFail: () => void;
}> = ({ missionData, onReturnToMuseum, onComplete, onFail }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'win' | 'loss'>('idle');
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [allies, setAllies] = useState<Ally[]>([]);
  const [defensePoints, setDefensePoints] = useState(missionData.defensePoints);
  const [gameTimer, setGameTimer] = useState(missionData.duration);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [enemiesSlipped, setEnemiesSlipped] = useState(0);
  const initialDefensePoints = missionData.defensePoints;
  
  const [chargeCooldown, setChargeCooldown] = useState(0);
  const [roarCooldown, setRoarCooldown] = useState(0);
  const [callSoldiersCooldown, setCallSoldiersCooldown] = useState(0);

  const [chargeEffect, setChargeEffect] = useState<number | null>(null); // lane index
  const [roarEffect, setRoarEffect] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [hitAllyId, setHitAllyId] = useState<number | null>(null);
  const [collisionEffects, setCollisionEffects] = useState<CollisionEffect[]>([]);

  const gameLoopRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());
  const nextEnemyId = useRef(0);
  const nextAllyId = useRef(0);

  // --- State Refs for Callbacks ---
  const defensePointsRef = useRef(defensePoints);
  useEffect(() => { defensePointsRef.current = defensePoints; }, [defensePoints]);
  
  const alliesRef = useRef(allies);
  useEffect(() => { alliesRef.current = allies; }, [allies]);
  
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // --- Core Game Logic ---
  const cleanUpTimers = useCallback(() => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    timersRef.current.forEach(id => clearInterval(id));
    timersRef.current = [];
  }, []);

  const addCollisionEffect = useCallback((lane: number) => {
    const id = Date.now() + Math.random();
    setCollisionEffects(prev => [...prev, { id, lane }]);
    setTimeout(() => setCollisionEffects(prev => prev.filter(c => c.id !== id)), 400);
  }, []);

  // Game Loop for enemy movement and ally collision
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = (currentTime: number) => {
      if(gameStateRef.current !== 'playing') return;
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;

      let pointsWereLost = false;
      let slippedCount = 0;
      let defeatedCount = 0;
      let allyWasHit = false;

      // Update enemies and check collisions
      setEnemies(prevEnemies => {
        let currentDefensePoints = defensePointsRef.current;
        let currentAllies = [...alliesRef.current];

        const updatedEnemies = prevEnemies.map(enemy => {
          if (enemy.isStunned) return enemy;
          
          const newTop = enemy.top + ENEMY_SPEED_PERCENT_PER_SEC * deltaTime;

          // Check for collision with ally
          const allyInLane = currentAllies.find(a => a.lane === enemy.lane);
          if (allyInLane && newTop >= 85) { // 90% is ally pos, 85% is threshold
            addCollisionEffect(enemy.lane);
            defeatedCount++;
            playSound('sfx_dig');
            allyWasHit = true;
            setHitAllyId(allyInLane.id);
            setTimeout(() => setHitAllyId(null), 300);

            // Update ally health
            const updatedAlly = {...allyInLane, health: allyInLane.health - 1};
            if(updatedAlly.health <= 0) {
              currentAllies = currentAllies.filter(a => a.id !== allyInLane.id);
            } else {
              currentAllies = currentAllies.map(a => a.id === allyInLane.id ? updatedAlly : a);
            }
            return null; // Enemy is defeated
          }
          
          if (newTop >= 100) {
            currentDefensePoints--;
            pointsWereLost = true;
            slippedCount++;
            return null;
          }
          return { ...enemy, top: newTop };
        }).filter(e => e !== null) as Enemy[];

        // Update state outside the map loop
        if (pointsWereLost) {
            playSound('sfx_fail');
            setIsShaking(true);
            setEnemiesSlipped(prev => prev + slippedCount);
            setTimeout(() => setIsShaking(false), 400);
        }
        if (defeatedCount > 0) {
          setEnemiesDefeated(prev => prev + defeatedCount);
        }
        if(allyWasHit) {
            setAllies(currentAllies);
        }

        if (currentDefensePoints <= 0 && defensePointsRef.current > 0) {
            setGameState('loss');
        }
        setDefensePoints(currentDefensePoints);
        return updatedEnemies;
      });
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    lastFrameTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current) };
  }, [gameState, addCollisionEffect]);

  // Main Game State Manager
  useEffect(() => {
    if (gameState === 'playing') {
      const spawner = window.setInterval(() => {
        if(gameStateRef.current !== 'playing') return;
        setEnemies(prev => {
          const patternChance = Math.random();
          let newEnemies: Enemy[] = [];
          if (patternChance < 0.2) { 
            const lane1 = Math.floor(Math.random() * 3);
            let lane2 = Math.floor(Math.random() * 3);
            while (lane1 === lane2) lane2 = Math.floor(Math.random() * 3);
            newEnemies.push({ id: nextEnemyId.current++, lane: lane1, top: -10, isStunned: false });
            newEnemies.push({ id: nextEnemyId.current++, lane: lane2, top: -20, isStunned: false });
          } else { 
            const newEnemyLane = Math.floor(Math.random() * 3);
            newEnemies.push({ id: nextEnemyId.current++, lane: newEnemyLane, top: -10, isStunned: false });
          }
          return [...prev, ...newEnemies];
        });
      }, 2200);

      const clock = window.setInterval(() => {
        if(gameStateRef.current !== 'playing') return;
        setGameTimer(prev => {
          if (prev <= 1) {
            if (gameStateRef.current === 'playing') setGameState('win');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

       const cooldownTimer = window.setInterval(() => {
        if(gameStateRef.current !== 'playing') return;
        setChargeCooldown(c => Math.max(0, c - 100));
        setRoarCooldown(c => Math.max(0, c - 100));
        setCallSoldiersCooldown(c => Math.max(0, c - 100));
      }, 100);

      timersRef.current.push(clock, spawner, cooldownTimer);
    } else if (gameState === 'win') {
        cleanUpTimers();
        playSound('sfx_unlock');
        setTimeout(() => onComplete(missionData.reward), 2000);
    } else if (gameState === 'loss') {
        cleanUpTimers();
        onFail();
        playSound('sfx_fail');
    }
    return cleanUpTimers;
  }, [gameState, cleanUpTimers, onComplete, onFail, missionData.reward]);


  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (gameState !== 'playing') return;
    switch (e.key) {
      case 'ArrowLeft':
        setPlayerLane(l => Math.max(0, l - 1));
        break;
      case 'ArrowRight':
        setPlayerLane(l => Math.min(2, l + 1));
        break;
      case 'q':
        handleCharge();
        break;
      case 'w':
        handleRoar();
        break;
      case 'e':
        handleCallSoldiers();
        break;
    }
  }, [gameState]);

  // Skill Handlers
  const handleCharge = () => {
    if (chargeCooldown > 0) return;
    playSound('sfx_explosion');
    setChargeCooldown(5000); // 5s
    setChargeEffect(playerLane);
    setTimeout(() => setChargeEffect(null), 400);

    setEnemies(prev => {
        const remainingEnemies = prev.filter(enemy => {
            if (enemy.lane === playerLane && enemy.top < 90) {
              addCollisionEffect(enemy.lane);
              setEnemiesDefeated(ed => ed + 1);
              return false;
            }
            return true;
        });
        return remainingEnemies;
    });
  };

  const handleRoar = () => {
    if (roarCooldown > 0) return;
    playSound('sfx_click');
    setRoarCooldown(10000); // 10s
    setRoarEffect(true);
    setTimeout(() => setRoarEffect(false), 500);

    setEnemies(prev => prev.map(enemy => ({ ...enemy, isStunned: true })));
    setTimeout(() => {
        setEnemies(prev => prev.map(enemy => ({ ...enemy, isStunned: false })));
    }, 3000);
  };
  
  const handleCallSoldiers = () => {
    if (callSoldiersCooldown > 0 || allies.some(a => a.lane === playerLane)) return;
    playSound('sfx_success');
    setCallSoldiersCooldown(15000); // 15s
    setAllies(prev => [...prev, { id: nextAllyId.current++, lane: playerLane, health: ALLY_HEALTH }]);
  };

  const startGame = () => {
    // Reset all state variables to their initial values
    setGameState('idle'); // Ensure clean state before setting to playing
    setPlayerLane(1);
    setEnemies([]);
    setAllies([]);
    setDefensePoints(missionData.defensePoints);
    setGameTimer(missionData.duration);
    setEnemiesDefeated(0);
    setEnemiesSlipped(0);
    setChargeCooldown(0);
    setRoarCooldown(0);
    setCallSoldiersCooldown(0);
    nextEnemyId.current = 0;
    nextAllyId.current = 0;
    cleanUpTimers();
    // Start the game
    setGameState('playing');
  };

  const renderOverlay = () => {
    if (gameState === 'idle') {
      return (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 text-center">
          <h3 className="text-4xl font-bold mb-4">Sẵn sàng xung trận!</h3>
          <p className="mb-2">Di chuyển bằng phím mũi tên. Dùng Q, W, E để sử dụng kỹ năng.</p>
          <p className="mb-6 max-w-md">Ngăn chặn quân địch tràn xuống dưới cùng!</p>
          <button onClick={startGame} className="text-xl font-bold py-3 px-8 rounded-lg shadow-lg bg-green-600 hover:bg-green-700">Bắt đầu</button>
        </div>
      );
    }
    if (gameState === 'win' || gameState === 'loss') {
      return (
        <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp text-center">
          <h3 className={`text-5xl font-bold mb-4 ${gameState === 'win' ? 'text-green-400' : 'text-red-500'}`}>
            {gameState === 'win' ? 'Chiến Thắng!' : 'Thất Bại!'}
          </h3>
          <p className="text-xl">Đã diệt: {enemiesDefeated} địch | Lọt lưới: {enemiesSlipped}</p>
          <p className="text-2xl mt-2">{gameState === 'win' ? "Bạn đã bảo vệ thành công!" : "Quân địch đã tràn qua phòng tuyến."}</p>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={startGame} className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-6 rounded-lg shadow-lg">Chơi lại</button>
            <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 font-bold py-2 px-6 rounded-lg shadow-lg">Quay về</button>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div 
      id="lane-battle-screen" 
      className={isShaking ? 'lane-battle-shake' : ''}
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      autoFocus
    >
      <div id="battle-hud" className="p-2 bg-black/40 text-white flex justify-between items-center text-lg font-bold flex-shrink-0">
        <span>Thời gian: {gameTimer}s</span>
        <span>Phòng thủ: <span className={defensePoints <= initialDefensePoints * 0.3 ? 'text-red-500' : 'text-green-400'}>{defensePoints}</span> / {initialDefensePoints}</span>
      </div>
      <div id="battlefield">
        {renderOverlay()}
        {[0,1,2].map(i => <div key={i} className="lane" onClick={() => setPlayerLane(i)} />)}
        <div id="player-character" style={{ left: `${playerLane * 33.33}%` }} />
        {allies.map(ally => (
          <div key={ally.id} className={`ally-unit ${hitAllyId === ally.id ? 'ally-hit' : ''}`} style={{ left: `${ally.lane * 33.33 + 16.66}%` }}/>
        ))}
        {enemies.map(enemy => (
          <div key={enemy.id} className={`enemy-unit ${enemy.isStunned ? 'stunned' : ''}`} style={{ left: `${enemy.lane * 33.33 + 16.66}%`, top: `${enemy.top}%` }} />
        ))}
        {chargeEffect !== null && <div className="charge-visual" style={{ left: `${chargeEffect * 33.33}%`, width: '33.33%' }}/>}
        {roarEffect && <div className="roar-visual" />}
        {collisionEffects.map(effect => (
          <div key={effect.id} className="collision-effect" style={{ left: `${effect.lane * 33.33 + 16.66}%` }}>
            <img src='https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/main/pictures/Effects/Effect-va-cham.png' alt="collision"/>
          </div>
        ))}
      </div>
      <div id="battle-skill-bar">
          <button id="skill-charge" className="skill-button" onClick={handleCharge} disabled={chargeCooldown > 0} style={{ backgroundImage: `url(${ImageUrls.ICON_CHARGE_URL})`}}>
              <div className="cooldown-overlay" style={{ height: `${(chargeCooldown / 5000) * 100}%` }}/>
              {chargeCooldown > 0 && <span className="cooldown-text">{(chargeCooldown / 1000).toFixed(1)}</span>}
          </button>
           <button id="skill-roar" className="skill-button" onClick={handleRoar} disabled={roarCooldown > 0} style={{ backgroundImage: `url(${ImageUrls.ICON_ROAR_URL})`}}>
              <div className="cooldown-overlay" style={{ height: `${(roarCooldown / 10000) * 100}%` }}/>
              {roarCooldown > 0 && <span className="cooldown-text">{(roarCooldown / 1000).toFixed(1)}</span>}
          </button>
           <button id="skill-call" className="skill-button" onClick={handleCallSoldiers} disabled={callSoldiersCooldown > 0} style={{ backgroundImage: `url(${ImageUrls.ICON_CALL_SOLDIERS_URL})`}}>
              <div className="cooldown-overlay" style={{ height: `${(callSoldiersCooldown / 15000) * 100}%` }}/>
              {callSoldiersCooldown > 0 && <span className="cooldown-text">{(callSoldiersCooldown / 1000).toFixed(1)}</span>}
          </button>
      </div>
    </div>
  );
};

export default LaneBattleScreen;
