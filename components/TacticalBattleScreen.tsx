// components/TacticalBattleScreen.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TacticalBattleMissionData, TaySonCampaignState, Reward, PlacedUnit, UnitDefinition } from '../types';
import { playSound } from '../utils/audio';
import * as ImageUrls from '../imageUrls';

interface GameUnit extends PlacedUnit {
  instanceId: string;
  currentHp: number;
  maxHp: number;
  attack: number;
  attackRange: number;
  moveRange: number;
  iconUrl: string;
  name: string;
  hasMoved: boolean;
  hasAttacked: boolean;
}

const TacticalBattleScreen: React.FC<{
  missionData: TacticalBattleMissionData;
  campaignState: TaySonCampaignState;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
  onFail: () => void;
}> = ({ missionData, campaignState, onReturnToMuseum, onComplete, onFail }) => {
  const [units, setUnits] = useState<GameUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [highlightedTiles, setHighlightedTiles] = useState<Record<string, 'move' | 'attack'>>({});
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [gameState, setGameState] = useState<'playing' | 'win' | 'loss'>('playing');

  // New states for historical context
  const [selectedUnitInfo, setSelectedUnitInfo] = useState<UnitDefinition | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  
  const checkWinLoss = useCallback((currentUnits: GameUnit[]) => {
    const playerUnits = currentUnits.filter(u => !u.isEnemy);
    if (playerUnits.length === 0) {
      setGameState('loss');
      onFail();
      return;
    }

    if (missionData.winCondition.type === 'destroy_fort') {
      const mainFort = currentUnits.find(u => u.unitId === 'don_ngoc_hoi');
      if (!mainFort) {
        setGameState('win');
        playSound('sfx_unlock');
        setShowVictoryModal(true); // Show historical victory modal instead of completing directly
        return;
      }
    }
    
    // Default fallback / other win conditions
    const enemyUnits = currentUnits.filter(u => u.isEnemy);
    if (enemyUnits.length === 0) {
      setGameState('win');
      playSound('sfx_unlock');
      onComplete(missionData.reward);
    }
  }, [onFail, onComplete, missionData]);
  
  const calculateFortAttack = useCallback((currentUnits: GameUnit[]) => {
    const fortDef = missionData.unitDefinitions['don_ngoc_hoi'];
    if (!fortDef) return 0;

    const baseFortAttack = fortDef.attack;
    const enemySoldiers = currentUnits.filter(u => u.unitId === 'quan_thanh_bo' && u.isEnemy);
    const totalSoldierAttackPower = enemySoldiers.reduce((sum, soldier) => sum + missionData.unitDefinitions[soldier.unitId].attack, 0);
    
    return baseFortAttack + (5 * totalSoldierAttackPower);
  }, [missionData.unitDefinitions]);

  const handleAttackAction = useCallback((attacker: GameUnit, target: GameUnit) => {
    if (attacker.hasAttacked) return;

    const newHp = target.currentHp - attacker.attack;
    
    let nextUnits = units.map(u => {
        if (u.instanceId === target.instanceId) return { ...u, currentHp: newHp };
        if (u.instanceId === attacker.instanceId) return { ...u, hasAttacked: true };
        return u;
    });

    // If an enemy soldier was defeated, recalculate fort attack
    if (target.isEnemy && target.unitId === 'quan_thanh_bo' && newHp <= 0) {
        const remainingUnitsForCalc = nextUnits.filter(u => u.currentHp > 0);
        const newFortAttack = calculateFortAttack(remainingUnitsForCalc);
        nextUnits = nextUnits.map(u => {
            if (u.unitId === 'don_ngoc_hoi') {
                return { ...u, attack: newFortAttack };
            }
            return u;
        });
    }
    
    const finalUnits = nextUnits.filter(u => u.currentHp > 0);

    playSound('sfx_explosion');
    setUnits(finalUnits);
    setSelectedUnitId(null);
    setHighlightedTiles({});
    setSelectedUnitInfo(null);
    checkWinLoss(finalUnits);
  }, [units, calculateFortAttack, checkWinLoss]);

  // Initialize game state
  useEffect(() => {
    let playerUnits: GameUnit[];

    const baseMorale = campaignState.morale > 0 ? campaignState.morale : 100;
    const moraleBuff = baseMorale > 150 ? 1.2 : 1.0;

    if (missionData.playerUnits) {
        // Use fixed deployment from mission data
        playerUnits = missionData.playerUnits.map((u, i) => {
            const def = missionData.unitDefinitions[u.unitId];
            return {
                ...u, ...def, instanceId: `p_${u.unitId}_${i}`, 
                currentHp: def.maxHp, 
                attack: Math.round(def.attack * moraleBuff), // Still apply morale buff
                hasMoved: false, hasAttacked: false
            }
        });
    } else {
        // Fallback to old dynamic logic
        const dynamicPlayerUnits: GameUnit[] = [];
        const baseManpower = campaignState.manpower > 0 ? campaignState.manpower : 20000;
        const infantryCount = Math.floor(baseManpower / 10000);
        const elephantCount = baseManpower > 30000 ? 1 : 0;
        const { x_min, y_min, x_max, y_max } = missionData.deploymentZone;
        const zoneWidth = x_max - x_min + 1;
        const zoneHeight = y_max - y_min + 1;
        const maxDeployableUnits = zoneWidth * zoneHeight;
        let placedCount = 0;
        
        for(let i = 0; i < infantryCount && placedCount < maxDeployableUnits; i++) {
            const def = missionData.unitDefinitions.bo_binh_tay_son;
            const placeX = x_min + (placedCount % zoneWidth);
            const placeY = y_min + Math.floor(placedCount / zoneWidth);
            dynamicPlayerUnits.push({
                ...def, instanceId: `p_inf_${i}`, unitId: 'bo_binh_tay_son',
                currentHp: def.maxHp, attack: Math.round(def.attack * moraleBuff),
                x: placeX, y: placeY, isEnemy: false, hasMoved: false, hasAttacked: false
            });
            placedCount++;
        }
         for(let i = 0; i < elephantCount && placedCount < maxDeployableUnits; i++) {
            const def = missionData.unitDefinitions.tuong_binh_tay_son;
            const placeX = x_min + (placedCount % zoneWidth);
            const placeY = y_min + Math.floor(placedCount / zoneWidth);
            dynamicPlayerUnits.push({
                ...def, instanceId: `p_ele_${i}`, unitId: 'tuong_binh_tay_son',
                currentHp: def.maxHp, attack: Math.round(def.attack * moraleBuff),
                x: placeX, y: placeY, isEnemy: false, hasMoved: false, hasAttacked: false
            });
            placedCount++;
        }
        playerUnits = dynamicPlayerUnits;
    }

    // Create enemy units and calculate initial fort attack
    const enemyUnitsRaw: GameUnit[] = missionData.enemyUnits.map((u, i) => {
      const def = missionData.unitDefinitions[u.unitId];
      return {
        ...u, ...def, instanceId: `e_${u.unitId}_${i}`, currentHp: def.maxHp, hasMoved: false, hasAttacked: false
      }
    });

    const fortAttack = calculateFortAttack(enemyUnitsRaw);
    const finalEnemyUnits = enemyUnitsRaw.map(u => {
        if(u.unitId === 'don_ngoc_hoi') {
            return { ...u, attack: fortAttack };
        }
        return u;
    });
    
    setUnits([...playerUnits, ...finalEnemyUnits]);
    setTurn('player');
    setGameState('playing');
    setShowVictoryModal(false);
    setSelectedUnitInfo(null);
  }, [missionData, campaignState, calculateFortAttack]);

  const handleUnitClick = (unit: GameUnit) => {
    if (turn !== 'player' || gameState !== 'playing') return;

    // If an enemy unit is clicked and a player unit is already selected
    if (unit.isEnemy && selectedUnitId) {
        const attacker = units.find(u => u.instanceId === selectedUnitId);
        if (!attacker || attacker.isEnemy || attacker.hasAttacked) return;
        
        const tileKey = `${unit.y}-${unit.x}`;
        if (highlightedTiles[tileKey] === 'attack') {
            handleAttackAction(attacker, unit);
            return;
        }
    }

    if (unit.isEnemy) {
        setSelectedUnitId(null);
        setSelectedUnitInfo(null);
        setHighlightedTiles({});
        return;
    }

    if (selectedUnitId === unit.instanceId) {
      setSelectedUnitId(null);
      setSelectedUnitInfo(null);
      setHighlightedTiles({});
      return;
    }

    setSelectedUnitId(unit.instanceId);
    setSelectedUnitInfo(missionData.unitDefinitions[unit.unitId]); // Set info for display
    
    const newHighlights: Record<string, 'move' | 'attack'> = {};
    if (!unit.hasMoved) {
        for(let y = 0; y < missionData.mapLayout.length; y++) {
            for(let x = 0; x < missionData.mapLayout[0].length; x++) {
                const distance = Math.abs(unit.x - x) + Math.abs(unit.y - y);
                if (distance <= unit.moveRange && !units.some(u => u.x === x && u.y === y)) {
                    newHighlights[`${y}-${x}`] = 'move';
                }
            }
        }
    }
    if (!unit.hasAttacked) {
        units.filter(u => u.isEnemy).forEach(enemy => {
            const distance = Math.abs(unit.x - enemy.x) + Math.abs(unit.y - enemy.y);
            if (distance <= unit.attackRange) {
                newHighlights[`${enemy.y}-${enemy.x}`] = 'attack';
            }
        });
    }
    setHighlightedTiles(newHighlights);
  };

  const handleTileClick = (x: number, y: number) => {
    if (!selectedUnitId || gameState !== 'playing') return;
    
    const attacker = units.find(u => u.instanceId === selectedUnitId);
    if (!attacker) return;
    
    const tileKey = `${y}-${x}`;
    const tileType = highlightedTiles[tileKey];
    
    if (tileType === 'move' && !attacker.hasMoved) {
      const newUnits = units.map(u => u.instanceId === selectedUnitId ? { ...u, x, y, hasMoved: true } : u);
      setUnits(newUnits);
      setSelectedUnitId(null);
      setHighlightedTiles({});
      setSelectedUnitInfo(null);
      playSound('sfx_click');
    } else if (tileType === 'attack' && !attacker.hasAttacked) {
        const targetUnit = units.find(u => u.x === x && u.y === y && u.isEnemy);
        if(targetUnit) {
            handleAttackAction(attacker, targetUnit);
        }
    }
  };

  const endTurn = () => {
    if (turn !== 'player' || gameState !== 'playing') return;
    setSelectedUnitId(null);
    setHighlightedTiles({});
    setSelectedUnitInfo(null);
    // Reset player unit states for the next turn
    setUnits(prev => prev.map(u => u.isEnemy ? u : { ...u, hasMoved: false, hasAttacked: false }));
    setTurn('enemy');
  };
  
  // Enemy AI
  useEffect(() => {
    if (turn !== 'enemy' || gameState !== 'playing') return;

    const enemyTurnTimeout = setTimeout(() => {
        let tempUnits = [...units];
        const playerUnits = tempUnits.filter(u => !u.isEnemy);
        if (playerUnits.length === 0) {
            setTurn('player');
            return;
        }

        const enemiesToAct = tempUnits.filter(u => u.isEnemy);

        enemiesToAct.forEach(enemy => {
            // Re-fetch current state of units for each enemy's action
            const currentPlayers = tempUnits.filter(u => !u.isEnemy);
            if (currentPlayers.length === 0) return;

            // Simple AI: find closest player
            let target = currentPlayers[0];
            let minDistance = Infinity;
            currentPlayers.forEach(p => {
                const dist = Math.abs(p.x - enemy.x) + Math.abs(p.y - enemy.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    target = p;
                }
            });

            // Attack if in range
            if (minDistance <= enemy.attackRange) {
                const newHp = target.currentHp - enemy.attack;
                tempUnits = tempUnits.map(u => u.instanceId === target.instanceId ? { ...u, currentHp: newHp } : u);
            } 
            // Else, move
            else if (enemy.moveRange > 0) {
                let newX = enemy.x;
                let newY = enemy.y;
                if (Math.abs(target.x - enemy.x) > Math.abs(target.y - enemy.y)) {
                    newX += Math.sign(target.x - enemy.x);
                } else {
                    newY += Math.sign(target.y - enemy.y);
                }
                
                // Check if target tile is empty
                if (!tempUnits.some(u => u.x === newX && u.y === newY)) {
                    tempUnits = tempUnits.map(u => u.instanceId === enemy.instanceId ? { ...u, x: newX, y: newY } : u);
                }
            }
        });

        // Filter out defeated units at the end
        const finalUnits = tempUnits.filter(u => u.currentHp > 0);
        setUnits(finalUnits);
        checkWinLoss(finalUnits);
        setTurn('player');

    }, 1000);

    return () => clearTimeout(enemyTurnTimeout);
  }, [turn, gameState, checkWinLoss, units]);
  
  const getTileClass = (x: number, y: number) => {
      let className = 'tile ';
      className += missionData.mapLayout[y][x];
      
      if(highlightedTiles[`${y}-${x}`]) {
          className += ` highlight-${highlightedTiles[`${y}-${x}`]}`;
      }
      return className;
  }
  
  const renderOverlay = () => {
    if(gameState === 'win' && !showVictoryModal) return <div className="overlay win">CHIẾN THẮNG!</div>;
    if(gameState === 'loss') return <div className="overlay loss">THẤT BẠI!</div>;
    return null;
  };
  
  const handleVictoryModalClose = () => {
    setShowVictoryModal(false);
    onComplete(missionData.reward);
  };
  
  return (
    <div className="tactical-battle-screen">
       <button
        onClick={onReturnToMuseum}
        className="absolute top-6 right-6 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-20"
        aria-label="Rời đi"
      >
        Rời đi
      </button>

      {showVictoryModal && (
          <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-30 p-4">
              <div className="bg-amber-100 dark:bg-stone-800 p-6 rounded-lg shadow-xl max-w-lg w-full text-center animate-fadeInScaleUp">
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Chiến Thắng Lịch Sử!</h3>
                  <p className="text-stone-800 dark:text-stone-200 my-4">
                      Đồn Ngọc Hồi đã bị hạ! Đây là một bước ngoặt quyết định trong trận chiến lịch sử, mở đường cho quân ta tiến thẳng về giải phóng Thăng Long.
                  </p>
                  <button onClick={handleVictoryModalClose} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md">
                      Tuyệt vời!
                  </button>
              </div>
          </div>
      )}
      <div className="tactical-battle-layout">
          <div 
              className="grid-container"
              style={{ 
                  backgroundImage: `url(${ImageUrls.TACTICAL_BATTLE_BACKGROUND_URL})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
              }}
          >
            {renderOverlay()}
            {missionData.mapLayout.map((row, y) => (
              row.map((_, x) => (
                <div key={`${y}-${x}`} className={getTileClass(x, y)} onClick={() => handleTileClick(x, y)} />
              ))
            ))}
            {units.map(unit => (
              <div 
                key={unit.instanceId}
                className={`unit ${unit.isEnemy ? 'enemy' : 'player'} ${selectedUnitId === unit.instanceId ? 'selected' : ''}`}
                style={{ top: `${unit.y * (100 / missionData.mapLayout.length)}%`, left: `${unit.x * (100 / missionData.mapLayout[0].length)}%` }}
                onClick={(e) => { e.stopPropagation(); handleUnitClick(unit); }}
              >
                <div className="unit-base"></div>
                <img src={unit.iconUrl} alt={unit.name}/>
                <div className="hp-bar-bg"><div className="hp-bar-fill" style={{width: `${(unit.currentHp / unit.maxHp) * 100}%`}}></div></div>
              </div>
            ))}
          </div>

          <div id="info-panel">
             <div id="turn-indicator" className="text-center">
                <h3 className="text-xl font-bold">{turn === 'player' ? 'Lượt của bạn' : 'Lượt của địch'}</h3>
                {turn === 'player' && gameState === 'playing' && (
                    <button onClick={endTurn} disabled={turn !== 'player' || gameState !== 'playing'} className="mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                        Kết thúc lượt
                    </button>
                )}
             </div>
             <div id="campaign-stats" className="text-sm">
                <p>Binh lực ban đầu: <span className="font-bold">{campaignState.manpower.toLocaleString()}</span></p>
                <p>Sĩ khí ban đầu: <span className="font-bold">{campaignState.morale}</span></p>
                {campaignState.morale > 150 && <p className="text-green-400 font-semibold">Sĩ khí cao giúp tăng 20% sát thương!</p>}
             </div>
             <div id="unit-info" className="flex-grow bg-white/10 p-3 rounded-md">
                <h4 className="font-bold text-lg border-b border-white/20 pb-1 mb-2">Thông tin Đơn vị</h4>
                {selectedUnitInfo ? (
                    <div>
                        <p><span className="font-semibold">Tên:</span> {selectedUnitInfo.name}</p>
                        <p><span className="font-semibold">HP:</span> {units.find(u => u.instanceId === selectedUnitId)?.currentHp} / {selectedUnitInfo.maxHp}</p>
                        <p><span className="font-semibold">Tấn công:</span> {units.find(u => u.instanceId === selectedUnitId)?.attack || selectedUnitInfo.attack}</p>
                        <p><span className="font-semibold">Tầm đánh:</span> {selectedUnitInfo.attackRange}</p>
                        <p><span className="font-semibold">Tầm di chuyển:</span> {selectedUnitInfo.moveRange}</p>
                        {selectedUnitInfo.description && <p className="mt-2 text-sm italic text-amber-200">{selectedUnitInfo.description}</p>}
                    </div>
                ) : <p className="italic text-gray-400">Chọn một đơn vị để xem chi tiết.</p>}
             </div>
          </div>
      </div>
    </div>
  );
};

export default TacticalBattleScreen;
