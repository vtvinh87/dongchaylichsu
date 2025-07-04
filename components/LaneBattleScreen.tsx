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
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
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

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = (currentTime: number) => {
      if(gameStateRef.current !== 'playing') return;
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;

      let pointsWereLost = false;
      let slippedCount = 0;
      setEnemies(prevEnemies => {
        let currentDefensePoints = defensePointsRef.current;
        const updatedEnemies = prevEnemies.map(enemy => {
          if (enemy.isStunned) return enemy;
          
          const newTop = enemy.top + ENEMY_SPEED_PERCENT_PER_SEC * deltaTime;
          
          if (newTop >= 100) {
            currentDefensePoints--;
            pointsWereLost = true;
            slippedCount++;
            return null;
          }
          return { ...enemy, top: newTop };
        }).filter(e => e !== null) as Enemy[];

        if (pointsWereLost) {
            playSound('sfx_fail');
            setIsShaking(true);
            setEnemiesSlipped(prev => prev + slippedCount);
            setTimeout(() => setIsShaking(false), 400);
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
  }, [gameState]);
  
  // Game State Manager
  useEffect(() => {
    if (gameState === 'playing') {
      // Improved Spawner
      const spawner = window.setInterval(() => {
        setEnemies(prev => {
          const patternChance = Math.random();
          let newEnemies: Enemy[] = [];
          if (patternChance < 0.2) { // 20% chance for a double spawn
            const lane1 = Math.floor(Math.random() * 3);
            let lane2 = Math.floor(Math.random() * 3);
            while (lane1 === lane2) {
              lane2 = Math.floor(Math.random() * 3);
            }
            newEnemies.push({ id: nextEnemyId.current++, lane: lane1, top: -10, isStunned: false });
            newEnemies.push({ id: nextEnemyId.current++, lane: lane2, top: -20, isStunned: false });
          } else { // 80% chance for a single spawn
            const newEnemyLane = Math.floor(Math.random() * 3);
            newEnemies.push({ id: nextEnemyId.current++, lane: newEnemyLane, top: -10, isStunned: false });
          }
          return [...prev, ...newEnemies];
        });
      }, 2200); // Slightly adjusted interval

      const clock = window.setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            if (gameStateRef.current === 'playing') setGameState('win');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      const cooldownTimer = window.setInterval(() => {
          setChargeCooldown(c => Math.max(0, c - 1));
          setRoarCooldown(c => Math.max(0, c - 1));
          setCallSoldiersCooldown(c => Math.max(0, c - 1));
      }, 1000);

      timersRef.current.push(spawner, clock, cooldownTimer);
    } else if (gameState === 'win') {
        cleanUpTimers();
        playSound('sfx_unlock');
        setTimeout(() => onComplete(missionData.reward), 2000);
    } else if (gameState === 'loss') {
        cleanUpTimers();
        playSound('sfx_fail');
    }
    
    return () => {
        cleanUpTimers();
    };
  }, [gameState, cleanUpTimers, onComplete, missionData.reward]);

  // Player Controls (Keyboard)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameStateRef.current !== 'playing') return;

    if (e.key === 'ArrowLeft') {
      setPlayerLane(prev => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowRight') {
      setPlayerLane(prev => Math.min(2, prev + 1));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Player Controls (Mouse)
  const handleLaneClick = (laneIndex: number) => {
    if (gameState === 'playing') {
      setPlayerLane(laneIndex);
    }
  };

  // Skill Handlers
  const handleCharge = () => {
    if (chargeCooldown > 0 || gameState !== 'playing') return;
    playSound('sfx_explosion');
    setChargeCooldown(10);
    setChargeEffect(playerLane);
    setTimeout(() => setChargeEffect(null), 400);
    setEnemies(prev => {
        const enemiesInLane = prev.filter(e => e.lane === playerLane);
        setEnemiesDefeated(prevCount => prevCount + enemiesInLane.length);
        return prev.filter(e => e.lane !== playerLane)
    });
  };

  const handleRoar = () => {
    if (roarCooldown > 0 || gameState !== 'playing') return;
    playSound('sfx_explosion');
    setRoarCooldown(20);
    setRoarEffect(true);
    setTimeout(() => setRoarEffect(false), 500);
    setEnemies(prev => prev.map(e => ({ ...e, isStunned: true })));
    setTimeout(() => {
      setEnemies(prev => prev.map(e => ({ ...e, isStunned: false })));
    }, 3000);
  };

  const handleCallSoldiers = () => {
    if (callSoldiersCooldown > 0 || gameState !== 'playing') return;
    playSound('sfx_success');
    setCallSoldiersCooldown(10);
    const newAlly: Ally = { id: nextAllyId.current++, lane: playerLane, health: ALLY_HEALTH };
    setAllies(prev => [...prev.filter(a => a.lane !== playerLane), newAlly]);
  };
  
  // Ally-Enemy Collision
  useEffect(() => {
    if (!allies.length || !enemies.length || gameState !== 'playing') return;

    let newAllies = [...alliesRef.current];
    const enemiesToRemove = new Set<number>();
    const newEffects: CollisionEffect[] = [];

    enemies.forEach(enemy => {
        if (enemy.top > 80) { // Check when near the bottom
            const allyInLaneIndex = newAllies.findIndex(ally => ally.lane === enemy.lane);
            if (allyInLaneIndex !== -1) {
                enemiesToRemove.add(enemy.id);
                newAllies[allyInLaneIndex].health--;
                playSound('sfx_fail');
                setHitAllyId(newAllies[allyInLaneIndex].id);
                
                const effect: CollisionEffect = { id: Date.now() + enemy.id, lane: enemy.lane };
                newEffects.push(effect);
                setTimeout(() => {
                  setCollisionEffects(prev => prev.filter(e => e.id !== effect.id));
                }, 600); // Duration for the GIF animation

                setTimeout(() => setHitAllyId(null), 300);
                if (newAllies[allyInLaneIndex].health <= 0) {
                    newAllies.splice(allyInLaneIndex, 1);
                }
            }
        }
    });

    if (newEffects.length > 0) {
      setCollisionEffects(prev => [...prev, ...newEffects]);
    }

    if (enemiesToRemove.size > 0) {
        setEnemiesDefeated(prevCount => prevCount + enemiesToRemove.size);
        setAllies(newAllies);
        setEnemies(prev => prev.filter(e => !enemiesToRemove.has(e.id)));
    }
  }, [enemies, allies.length, gameState]);

  const renderOverlay = () => {
    if (gameState === 'win' || gameState === 'loss') {
        const isWin = gameState === 'win';
        return (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-50 animate-fadeInScaleUp text-center p-4">
                <h3 className={`text-4xl font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>{isWin ? 'Chiến thắng!' : 'Thất bại!'}</h3>
                <p className="mt-2 text-xl">{isWin ? 'Bạn đã bảo vệ thành công!' : 'Quân địch đã chọc thủng phòng tuyến!'}</p>
                <button onClick={onReturnToMuseum} className="mt-6 bg-amber-600 hover:bg-amber-700 font-bold py-2 px-6 rounded-lg">Quay về</button>
            </div>
        )
    }
    if (gameState === 'idle') {
         return (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-50 text-center p-4">
                <h3 className="text-4xl font-bold mb-4">Sẵn sàng chiến đấu!</h3>
                <p className="mb-2 max-w-sm">Chặn đứng các đợt tấn công của quân địch. Sống sót cho đến khi hết giờ!</p>
                <div className="flex items-center gap-2 text-amber-200 mb-6">
                    <div className="key-hint">←</div>
                    <span>Di chuyển</span>
                    <div className="key-hint">→</div>
                </div>
                <button onClick={() => setGameState('playing')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg">Bắt đầu</button>
            </div>
        );
    }
    return null;
  };
  
  return (
    <div id="lane-battle-screen" className={isShaking ? 'lane-battle-shake' : ''}>
      {renderOverlay()}
      <div className="absolute top-2 left-2 p-2 bg-black/50 text-white rounded-md z-20 text-sm space-y-1">
          <div>
            <span className="font-bold">Máu:</span>
            <div className="health-bar-container">
              <div 
                className="health-bar-fill" 
                style={{ width: `${(defensePoints / initialDefensePoints) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>Địch bị diệt: <span className="font-bold text-green-400">{enemiesDefeated}</span></div>
          <div>Địch lọt lưới: <span className="font-bold text-red-400">{enemiesSlipped}</span></div>
          <div>Thời gian: <span className="font-bold text-amber-400">{gameTimer}s</span></div>
      </div>
       {gameState === 'playing' && (
          <button 
            onClick={onReturnToMuseum}
            className="absolute top-2 right-2 bg-amber-700 hover:bg-amber-800 text-white rounded-full z-20 w-8 h-8 flex items-center justify-center font-bold text-lg"
            aria-label="Quay về Bảo tàng"
            title="Quay về Bảo tàng"
          >
            &times;
          </button>
       )}
      <div id="battlefield">
        {[0, 1, 2].map(laneIndex => (
          <div key={laneIndex} className="lane" onClick={() => handleLaneClick(laneIndex)}>
            {enemies.filter(e => e.lane === laneIndex).map(enemy => (
              <div key={enemy.id} className={`enemy-unit ${enemy.isStunned ? 'stunned' : ''}`} style={{ top: `${enemy.top}%` }} />
            ))}
            {allies.filter(a => a.lane === laneIndex).map(ally => (
              <div key={ally.id} className={`ally-unit ${hitAllyId === ally.id ? 'ally-hit' : ''}`} />
            ))}
            {collisionEffects.filter(e => e.lane === laneIndex).map(effect => (
              <div key={effect.id} className="collision-effect">
                <img src="https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Gif/linh-va-cham.gif" alt="" />
              </div>
            ))}
            {chargeEffect === laneIndex && <div className="charge-visual" />}
          </div>
        ))}
      </div>
      {roarEffect && <div className="roar-visual" />}
      <div id="player-character" style={{ left: `${playerLane * 33.33}%` }} />
      <div id="battle-skill-bar">
        <button id="skill-charge" className={`skill-button ${chargeCooldown === 0 ? 'skill-ready' : ''}`} style={{backgroundImage: `url(${ImageUrls.ICON_CHARGE_URL})`}} onClick={handleCharge} disabled={chargeCooldown > 0} title="Xung Phong">
            {chargeCooldown > 0 && <div className="cooldown-overlay" style={{ height: `${(chargeCooldown / 10) * 100}%` }} />}
            {chargeCooldown > 0 && <span className="cooldown-text">{chargeCooldown}</span>}
        </button>
        <button id="skill-roar" className={`skill-button ${roarCooldown === 0 ? 'skill-ready' : ''}`} style={{backgroundImage: `url(${ImageUrls.ICON_ROAR_URL})`}} onClick={handleRoar} disabled={roarCooldown > 0} title="Hò Reo">
            {roarCooldown > 0 && <div className="cooldown-overlay" style={{ height: `${(roarCooldown / 20) * 100}%` }} />}
            {roarCooldown > 0 && <span className="cooldown-text">{roarCooldown}</span>}
        </button>
        <button id="skill-call-soldiers" className={`skill-button ${callSoldiersCooldown === 0 ? 'skill-ready' : ''}`} style={{backgroundImage: `url(${ImageUrls.ICON_CALL_SOLDIERS_URL})`}} onClick={handleCallSoldiers} disabled={callSoldiersCooldown > 0} title="Gọi Lính">
            {callSoldiersCooldown > 0 && <div className="cooldown-overlay" style={{ height: `${(callSoldiersCooldown / 10) * 100}%` }} />}
            {callSoldiersCooldown > 0 && <span className="cooldown-text">{callSoldiersCooldown}</span>}
        </button>
      </div>
    </div>
  );
};

export default LaneBattleScreen;