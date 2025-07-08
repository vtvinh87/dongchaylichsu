// components/TacticalBattleScreen.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TacticalBattleMissionData, TaySonCampaignState, Reward, PlacedUnit, UnitDefinition } from '../types';
import { playSound } from '../utils/audio';

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
  
  // Initialize game state
  useEffect(() => {
    const playerUnits: GameUnit[] = [];
    const baseMorale = campaignState.morale > 0 ? campaignState.morale : 100; // Default morale if none
    const baseManpower = campaignState.manpower > 0 ? campaignState.manpower : 20000; // Default manpower

    // Determine unit count based on manpower
    const infantryCount = Math.floor(baseManpower / 10000);
    const elephantCount = baseManpower > 30000 ? 1 : 0;
    
    // Apply morale buff
    const moraleBuff = baseMorale > 150 ? 1.2 : 1.0;

    let unitsToPlace = infantryCount + elephantCount;
    let placedCount = 0;
    
    // Create player units
    for(let i = 0; i < infantryCount && placedCount < 5; i++) {
        const def = missionData.unitDefinitions.bo_binh_tay_son;
        playerUnits.push({
            ...def,
            instanceId: `p_inf_${i}`,
            unitId: 'bo_binh_tay_son',
            currentHp: def.maxHp,
            attack: Math.round(def.attack * moraleBuff),
            x: placedCount % 10, y: 5, isEnemy: false, hasMoved: false, hasAttacked: false
        });
        placedCount++;
    }
     for(let i = 0; i < elephantCount && placedCount < 5; i++) {
        const def = missionData.unitDefinitions.tuong_binh_tay_son;
        playerUnits.push({
            ...def,
            instanceId: `p_ele_${i}`,
            unitId: 'tuong_binh_tay_son',
            currentHp: def.maxHp,
            attack: Math.round(def.attack * moraleBuff),
            x: placedCount % 10, y: 5, isEnemy: false, hasMoved: false, hasAttacked: false
        });
        placedCount++;
    }

    // Create enemy units
    const enemyUnits: GameUnit[] = missionData.enemyUnits.map((u, i) => {
      const def = missionData.unitDefinitions[u.unitId];
      return {
        ...u, ...def, instanceId: `e_${u.unitId}_${i}`, currentHp: def.maxHp, hasMoved: false, hasAttacked: false
      }
    });
    
    setUnits([...playerUnits, ...enemyUnits]);
    setTurn('player');
    setGameState('playing');
  }, [missionData, campaignState]);

  const handleUnitClick = (unit: GameUnit) => {
    if (turn !== 'player' || unit.isEnemy || gameState !== 'playing') return;
    
    if (selectedUnitId === unit.instanceId) {
      setSelectedUnitId(null);
      setHighlightedTiles({});
      return;
    }

    setSelectedUnitId(unit.instanceId);
    
    const newHighlights: Record<string, 'move' | 'attack'> = {};
    // Highlight move tiles
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
    // Highlight attack tiles
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
    
    const selectedUnit = units.find(u => u.instanceId === selectedUnitId);
    if (!selectedUnit) return;
    
    const tileKey = `${y}-${x}`;
    const tileType = highlightedTiles[tileKey];
    
    if (tileType === 'move') {
      const newUnits = units.map(u => u.instanceId === selectedUnitId ? { ...u, x, y, hasMoved: true } : u);
      setUnits(newUnits);
      setSelectedUnitId(null);
      setHighlightedTiles({});
      playSound('sfx_click');
    } else if (tileType === 'attack') {
      const targetUnit = units.find(u => u.x === x && u.y === y && u.isEnemy);
      if (targetUnit) {
        // Attack logic
        const newHp = targetUnit.currentHp - selectedUnit.attack;
        const newUnits = units.map(u => {
          if (u.instanceId === targetUnit.instanceId) {
            return { ...u, currentHp: newHp };
          }
          if (u.instanceId === selectedUnitId) {
            return { ...u, hasAttacked: true };
          }
          return u;
        }).filter(u => u.currentHp > 0);
        
        setUnits(newUnits);
        setSelectedUnitId(null);
        setHighlightedTiles({});
        playSound('sfx_explosion');
        checkWinLoss(newUnits);
      }
    }
  };

  const endTurn = () => {
    if (turn !== 'player' || gameState !== 'playing') return;
    setSelectedUnitId(null);
    setHighlightedTiles({});
    // Reset player unit states
    setUnits(prev => prev.map(u => u.isEnemy ? u : { ...u, hasMoved: false, hasAttacked: false }));
    setTurn('enemy');
  };

  const checkWinLoss = useCallback((currentUnits: GameUnit[]) => {
    const playerUnits = currentUnits.filter(u => !u.isEnemy);
    const enemyUnits = currentUnits.filter(u => u.isEnemy);

    if(playerUnits.length === 0) {
      setGameState('loss');
      onFail();
    } else if (enemyUnits.length === 0) {
      setGameState('win');
      onComplete(missionData.reward);
    }
  }, [onFail, onComplete, missionData.reward]);
  
  // Minimal Enemy AI
  useEffect(() => {
    if (turn === 'enemy' && gameState === 'playing') {
      let currentUnits = [...units];
      let hasActions = true;

      const performEnemyActions = () => {
        if (!hasActions) {
          setTurn('player');
          return;
        }
        
        const enemyUnits = currentUnits.filter(u => u.isEnemy && (!u.hasMoved || !u.hasAttacked));
        if (enemyUnits.length === 0) {
          hasActions = false;
          setUnits(prev => prev.map(u => u.isEnemy ? { ...u, hasMoved: false, hasAttacked: false } : u));
          setTurn('player');
          return;
        }
        
        const enemy = enemyUnits[0];
        // ... (simplified AI logic)
        // Find nearest player unit
        const playerUnits = currentUnits.filter(u => !u.isEnemy);
        if (playerUnits.length === 0) return; // Should be handled by win/loss check but good practice
        
        let target = playerUnits[0];
        let minDistance = Infinity;
        
        playerUnits.forEach(p => {
            const dist = Math.abs(p.x - enemy.x) + Math.abs(p.y - enemy.y);
            if(dist < minDistance) {
                minDistance = dist;
                target = p;
            }
        });
        
        // Attack if in range
        if(minDistance <= enemy.attackRange && !enemy.hasAttacked) {
             const newHp = target.currentHp - enemy.attack;
             currentUnits = currentUnits.map(u => {
                 if(u.instanceId === target.instanceId) return {...u, currentHp: newHp};
                 if(u.instanceId === enemy.instanceId) return {...u, hasAttacked: true};
                 return u;
             }).filter(u => u.currentHp > 0);
        } 
        // Move if not in range
        else if(!enemy.hasMoved) {
            let newX = enemy.x;
            let newY = enemy.y;
            if(enemy.x < target.x) newX++;
            else if (enemy.x > target.x) newX--;
            else if (enemy.y < target.y) newY++;
            else if (enemy.y > target.y) newY--;
            
            if(!currentUnits.some(u => u.x === newX && u.y === newY)) {
                currentUnits = currentUnits.map(u => u.instanceId === enemy.instanceId ? {...u, x: newX, y: newY, hasMoved: true} : u);
            } else {
                 currentUnits = currentUnits.map(u => u.instanceId === enemy.instanceId ? {...u, hasMoved: true} : u);
            }
        } else {
            // Cannot move or attack, mark as done
            currentUnits = currentUnits.map(u => u.instanceId === enemy.instanceId ? {...u, hasAttacked: true} : u);
        }
        setUnits(currentUnits);
        checkWinLoss(currentUnits);
        setTimeout(performEnemyActions, 500); // Next enemy action
      };
      
      setTimeout(performEnemyActions, 500);
    }
  }, [turn, gameState, units, checkWinLoss]);
  
  const getTileClass = (x: number, y: number) => {
      let className = 'tile ';
      className += missionData.mapLayout[y][x];
      
      if(highlightedTiles[`${y}-${x}`]) {
          className += ` highlight-${highlightedTiles[`${y}-${x}`]}`;
      }
      return className;
  }
  
  const renderOverlay = () => {
    if(gameState === 'win') return <div className="overlay win">CHIẾN THẮNG!</div>;
    if(gameState === 'loss') return <div className="overlay loss">THẤT BẠI!</div>;
    return null;
  };
  
  return (
    <div className="tactical-battle-screen">
      {renderOverlay()}
      <div className="grid-container">
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
            onClick={() => handleUnitClick(unit)}
          >
            <img src={unit.iconUrl} alt={unit.name}/>
            <div className="hp-bar-bg"><div className="hp-bar-fill" style={{width: `${(unit.currentHp / unit.maxHp) * 100}%`}}></div></div>
          </div>
        ))}
      </div>
      <div className="hud">
        <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
            Rời trận
        </button>
        <button onClick={endTurn} disabled={turn !== 'player' || gameState !== 'playing'}>Kết thúc lượt</button>
      </div>
    </div>
  );
};

export default TacticalBattleScreen;
