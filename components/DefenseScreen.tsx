import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DefenseMissionData, Reward, MapCellType, EvacuationUnit, EvacuationUnitType } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

// New types for this component
interface GameUnit extends EvacuationUnit {
    status: 'unsafe' | 'evacuated';
}
interface EventLogEntry {
    id: number;
    message: string;
    type: 'rain' | 'intel' | 'evac' | 'system' | 'enemy' | 'enemy_surge';
}
const INTEL_ICON_URL = "https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-tinh-bao.png";

const DefenseScreen: React.FC<{
    missionData: DefenseMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
    onFail: () => void;
}> = ({ missionData, onReturnToMuseum, onComplete, onFail }) => {
    // State
    const [turnsLeft, setTurnsLeft] = useState(missionData.turnLimit);
    const [units, setUnits] = useState<GameUnit[]>([]);
    const [draggedUnitId, setDraggedUnitId] = useState<string | null>(null);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null); // For tap-to-select
    const [isGameOver, setIsGameOver] = useState(false);
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
    const [enemyProgress, setEnemyProgress] = useState(0);
    const [isRaining, setIsRaining] = useState(false);
    const [intelPosition, setIntelPosition] = useState<number | null>(null);
    const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
    const [selectedUnitInfo, setSelectedUnitInfo] = useState<GameUnit | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);

    // Time-based event scheduling state
    const [elapsedTime, setElapsedTime] = useState(0);
    const [intelSpawnTimes, setIntelSpawnTimes] = useState<number[]>([]);
    const [rainEvents, setRainEvents] = useState<{ start: number, end: number }[]>([]);
    const [surgeTimes, setSurgeTimes] = useState<number[]>([]);


    // Mappings and Memos
    const rewardImageUrl = useMemo(() => {
        return missionData.reward.type === 'artifact' ? ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '' : '';
    }, [missionData.reward]);

    const unitTypeToClass: Record<EvacuationUnitType, string> = {
        civilian: 'unit-civilian',
        supplies: 'unit-supplies',
        wounded: 'unit-wounded',
    };
    
    const flatLayout = useMemo(() => missionData.mapLayout.flat(), [missionData.mapLayout]);

    const findShortestPath = useCallback((startIdx: number, endIdx: number, mapLayout: MapCellType[][]): number => {
        const rows = mapLayout.length;
        const cols = mapLayout[0].length;
        if (rows === 0 || cols === 0) return Infinity;

        const queue: { pos: { y: number; x: number }, dist: number }[] = [{
            pos: { y: Math.floor(startIdx / cols), x: startIdx % cols },
            dist: 0
        }];
        const visited = new Set<number>([startIdx]);

        const isValid = (y: number, x: number) => y >= 0 && y < rows && x >= 0 && x < cols;

        while (queue.length > 0) {
            const { pos, dist } = queue.shift()!;
            
            const neighbors = [
                { y: pos.y - 1, x: pos.x }, { y: pos.y + 1, x: pos.x },
                { y: pos.y, x: pos.x - 1 }, { y: pos.y, x: pos.x + 1 }
            ];

            for (const n of neighbors) {
                const nIdx = n.y * cols + n.x;

                if (nIdx === endIdx) {
                    return dist + 1; // Found the target cell
                }

                if (isValid(n.y, n.x) && !visited.has(nIdx)) {
                    const cellType = mapLayout[n.y][n.x];
                    // Path can only go through road or village cells.
                    if (cellType === 'road' || cellType === 'village') {
                        visited.add(nIdx);
                        queue.push({ pos: n, dist: dist + 1 });
                    }
                }
            }
        }
        return Infinity; // No path found
    }, []);

    const addLog = useCallback((message: string, type: EventLogEntry['type']) => {
        setEventLog(prev => [{id: Date.now() + Math.random(), message, type}, ...prev].slice(0, 10));
    }, []);
    
    // Extracted movement logic to be reusable for both drag-and-drop and tap-to-place
    const executeMove = useCallback((unitId: string, targetCellIndex: number) => {
        const unit = units.find(u => u.id === unitId);
        if (!unit || unit.status === 'evacuated') return;
    
        const distance = findShortestPath(unit.gridIndex, targetCellIndex, missionData.mapLayout);
    
        if (distance === Infinity) {
            playSound('sfx_fail');
            addLog('Không tìm thấy đường đến khu vực an toàn này!', 'system');
        } else {
            const rainCost = isRaining ? 1 : 0;
            const totalCost = unit.evacuationCost + distance + rainCost;
    
            if (turnsLeft >= totalCost) {
                playSound('sfx_success');
                setTurnsLeft(prev => prev - totalCost);
                setEnemyProgress(prev => Math.min(prev + 1, missionData.enemyProgressBarSegments));
                setUnits(prev => prev.map(u => u.id === unitId ? { ...u, status: 'evacuated' } : u));
                addLog(`Di tản ${unit.type} tốn ${totalCost} lượt (gốc ${unit.evacuationCost} + ${distance} ô + ${rainCost} mưa).`, 'evac');
                addLog(`Quân địch đang đến gần hơn!`, 'enemy');
            } else {
                playSound('sfx_fail');
                addLog(`Không đủ lượt đi! Cần ${totalCost}, chỉ có ${turnsLeft}.`, 'system');
            }
        }
    
        // Reset selection/drag states
        setSelectedUnitId(null);
        setSelectedUnitInfo(null);
        setDraggedUnitId(null);
    }, [units, findShortestPath, missionData.mapLayout, missionData.enemyProgressBarSegments, isRaining, turnsLeft, addLog]);


    // Game initialization and event scheduling
    useEffect(() => {
        setTurnsLeft(missionData.turnLimit);
        setUnits(missionData.units.map(u => ({ ...u, status: 'unsafe' })));
        setIsGameOver(false);
        setOutcome(null);
        setEnemyProgress(0);
        setIsRaining(false);
        setIntelPosition(null);
        setEventLog([]);
        setTimeLeft(60);
        setElapsedTime(0);
        setSelectedUnitId(null);
    
        // --- Schedule Random Events ---
        const gameDuration = 60;
        const spawnStartSecond = 5;
        const spawnEndSecond = 55;
    
        // 1. Schedule Rain Events first
        const newRainEvents: { start: number, end: number }[] = [];
        const numRainEvents = Math.floor(Math.random() * 2) + 2; // 2 to 3 rain events
        const usedTimes = new Set<number>();
    
        for (let i = 0; i < numRainEvents; i++) {
            const rainDuration = Math.floor(Math.random() * 9) + 10; // 10-18 seconds duration
            let rainStart = -1;
            let attempt = 0;
            
            while (attempt < 20) {
                let potentialStart = Math.floor(Math.random() * (gameDuration - rainDuration - spawnStartSecond)) + spawnStartSecond;
                let isOverlapping = false;
                for (let t = potentialStart; t < potentialStart + rainDuration; t++) {
                    if (usedTimes.has(t)) {
                        isOverlapping = true;
                        break;
                    }
                }
                if (!isOverlapping) {
                    rainStart = potentialStart;
                    break;
                }
                attempt++;
            }
            
            if (rainStart === -1) {
                rainStart = Math.floor(Math.random() * (gameDuration - rainDuration - spawnStartSecond)) + spawnStartSecond;
            }
            
            const rainEnd = rainStart + rainDuration;
            newRainEvents.push({ start: rainStart, end: rainEnd });
            
            for (let t = rainStart; t < rainEnd; t++) {
                usedTimes.add(t);
            }
        }
        setRainEvents(newRainEvents);
    
        // 2. Schedule Intel Spawns with bias during rain
        const numIntel = Math.floor(Math.random() * 4) + 5; // 5 to 8 intel drops
        const RAIN_BIAS_FACTOR = 3; // A second during rain is 3x more likely to be picked
        
        const weightedSpawnSeconds: number[] = [];
        for (let t = spawnStartSecond; t <= spawnEndSecond; t++) {
            const isDuringRain = newRainEvents.some(event => t >= event.start && t < event.end);
            const weight = isDuringRain ? RAIN_BIAS_FACTOR : 1;
            for (let i = 0; i < weight; i++) {
                weightedSpawnSeconds.push(t);
            }
        }
    
        const intelTimes = new Set<number>();
        const shuffledWeightedSeconds = weightedSpawnSeconds.sort(() => 0.5 - Math.random());
        for (const time of shuffledWeightedSeconds) {
            if (intelTimes.size >= numIntel) break;
            intelTimes.add(time);
        }
        setIntelSpawnTimes(Array.from(intelTimes).sort((a, b) => a - b));
    
        // 3. Schedule Enemy Surges
        const numSurges = Math.random() < 0.4 ? 2 : 1; // 40% chance of 2 surges
        const surgeT = new Set<number>();
        while (surgeT.size < numSurges) {
            surgeT.add(Math.floor(Math.random() * 45) + 10); // Surges between 10s and 54s
        }
        setSurgeTimes(Array.from(surgeT).sort((a, b) => a - b));
    
        addLog('Nhiệm vụ bắt đầu! Sơ tán các đơn vị đến khu vực an toàn (rừng cây).', 'system');
    }, [missionData, addLog]);

     // Timer and Event Trigger effect
    useEffect(() => {
        if (isGameOver) return;
        if (timeLeft <= 0) {
            setIsGameOver(true);
            setOutcome('loss');
            onFail();
            addLog('Hết giờ! Quân địch đã tràn vào!', 'system');
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
            setElapsedTime(e => {
                const newElapsedTime = e + 1;

                // --- Check for scheduled events ---
                // Intel Spawn with 3-second timeout
                if (intelSpawnTimes.length > 0 && newElapsedTime >= intelSpawnTimes[0]) {
                    if (intelPosition === null) {
                        const occupiedCells = new Set(units.filter(u => u.status === 'unsafe').map(u => u.gridIndex));
                        const emptyCells = flatLayout
                            .map((cell, index) => ((cell === 'empty' || cell === 'road') && !occupiedCells.has(index) ? index : -1))
                            .filter(index => index !== -1);
                        
                        if (emptyCells.length > 0) {
                            const newIntelPos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                            setIntelPosition(newIntelPos);
                            addLog('Phát hiện tin tình báo! Thu thập nhanh trong 3 giây!', 'intel');
                            setIntelSpawnTimes(its => its.slice(1));

                            setTimeout(() => {
                                setIntelPosition(currentPos => {
                                    if (currentPos === newIntelPos) {
                                        addLog('Tin tình báo đã biến mất!', 'system');
                                        return null;
                                    }
                                    return currentPos;
                                });
                            }, 3000);
                        }
                    }
                }

                // Rain Event
                const nowIsRaining = rainEvents.some(event => newElapsedTime >= event.start && newElapsedTime < event.end);
                const wasRaining = rainEvents.some(event => (newElapsedTime - 1) >= event.start && (newElapsedTime - 1) < event.end);

                if (nowIsRaining && !wasRaining) {
                    setIsRaining(true);
                    addLog('Trời đổ mưa lớn! Chi phí di tản tăng thêm 1 lượt.', 'rain');
                } else if (!nowIsRaining && wasRaining) {
                    setIsRaining(false);
                    addLog('Trời đã tạnh mưa.', 'rain');
                }

                // Enemy Surge
                if (surgeTimes.length > 0 && newElapsedTime >= surgeTimes[0]) {
                    setEnemyProgress(prev => Math.min(prev + 2, missionData.enemyProgressBarSegments));
                    addLog('Quân địch tấn công dồn dập!', 'enemy_surge');
                    setSurgeTimes(st => st.slice(1));
                }

                return newElapsedTime;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isGameOver, addLog, intelSpawnTimes, rainEvents, surgeTimes, intelPosition, units, flatLayout, missionData.enemyProgressBarSegments, onFail]);


    // Game Logic
    const handleCellClick = (cellIndex: number) => {
        if (isGameOver) return;

        // Priority 1: Intel collection
        if (intelPosition !== null && intelPosition === cellIndex) {
            playSound('sfx_collect');
            setTurnsLeft(prev => prev + 2);
            setIntelPosition(null);
            addLog('Thu thập tin tình báo thành công! +2 lượt đi.', 'intel');
            return;
        }

        // Priority 2: Placing a selected unit (for touch/click interface)
        if (selectedUnitId) {
            const targetCellType = flatLayout[cellIndex];
            if (targetCellType === 'forest') {
                executeMove(selectedUnitId, cellIndex);
            } else {
                // Tapping somewhere else deselects the unit
                setSelectedUnitId(null);
                setSelectedUnitInfo(null);
            }
            return;
        }
    };
    
    // New handler for tap-to-select
    const handleUnitClick = (unit: GameUnit) => {
        if (isGameOver || unit.status === 'evacuated') return;
        playSound('sfx_click');
        if (selectedUnitId === unit.id) {
            setSelectedUnitId(null);
            setSelectedUnitInfo(null);
        } else {
            setSelectedUnitId(unit.id);
            setSelectedUnitInfo(unit);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, unitId: string) => {
        if (isGameOver) return;
        setDraggedUnitId(unitId);
        const unit = units.find(u => u.id === unitId);
        setSelectedUnitInfo(unit || null);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetCellIndex: number) => {
        e.preventDefault();
        const cellType = flatLayout[targetCellIndex];
        if (!draggedUnitId || cellType !== 'forest' || isGameOver) return;
        executeMove(draggedUnitId, targetCellIndex);
    }, [draggedUnitId, isGameOver, flatLayout, executeMove]);

    // Win/Loss Condition Checks
    useEffect(() => {
        if (isGameOver) return;
        if (units.length > 0 && units.every(u => u.status === 'evacuated')) {
            setIsGameOver(true);
            setOutcome('win');
            playSound('sfx_unlock');
            setTimeout(() => onComplete(missionData.reward), 2000);
        } else if (turnsLeft <= 0 || enemyProgress >= missionData.enemyProgressBarSegments) {
            setIsGameOver(true);
            setOutcome('loss');
            onFail();
        }
    }, [units, turnsLeft, enemyProgress, isGameOver, onComplete, missionData.reward, missionData.enemyProgressBarSegments, onFail]);

    const renderOutcomeOverlay = () => {
        if (!isGameOver) return null;
        const isWin = outcome === 'win';
        let lossMessage = "Đã hết lượt đi hoặc quân địch đã đến. Hãy thử lại.";
        if (timeLeft <= 0 && outcome === 'loss') {
            lossMessage = "Hết giờ! Quân địch đã tràn vào! Hãy thử lại.";
        }
        return (
            <div className={`absolute inset-0 ${isWin ? 'bg-black/70' : 'bg-red-900/80'} flex flex-col justify-center items-center text-white z-50 animate-fadeInScaleUp p-4 text-center`}>
                <h3 className="text-4xl font-bold mb-4">{isWin ? "Chiến lược thành công!" : "Thất bại!"}</h3>
                <p className="text-xl mb-6">{isWin ? "Bạn đã sơ tán thành công tất cả các đơn vị!" : lossMessage}</p>
                {isWin && rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-4 rounded-lg" />}
                {!isWin && <button onClick={onReturnToMuseum} className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">Quay về</button>}
            </div>
        );
    };

    return (
        <div className="screen-container w-full max-w-5xl p-4 bg-stone-900 text-white rounded-lg shadow-xl flex flex-col items-center flex-grow">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-3xl font-bold text-amber-300 font-serif">{missionData.title}</h2>
                <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 font-semibold py-2 px-4 rounded-lg shadow-md z-10">Quay về</button>
            </div>

            {/* HUD */}
            <div id="defense-hud-panel" className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="hud-section">
                    <h3 className="font-bold mb-2">Thông tin</h3>
                    <p className="text-xl">Lượt đi: <span className="text-amber-300 font-bold">{turnsLeft}</span></p>
                    <p className="mt-2 text-sm">Đơn vị đã di tản: {units.filter(u=>u.status==='evacuated').length}/{units.length}</p>
                     <div id="defense-screen-timer" className={timeLeft <= 10 ? 'low-time' : ''}>
                        ⏳ {timeLeft}s
                    </div>
                </div>
                <div className="hud-section">
                    <h3 className="font-bold mb-2">Đơn vị đang chọn</h3>
                    {selectedUnitInfo ? (
                        <div>
                            <p>Loại: <span className="font-semibold capitalize">{selectedUnitInfo.type}</span></p>
                            <p>Chi phí gốc: <span className="font-semibold">{selectedUnitInfo.evacuationCost} lượt</span></p>
                             {isRaining && <p className="text-cyan-300">Chi phí mưa: +1 lượt</p>}
                            <p className="italic text-gray-400 text-sm">Chi phí cuối cùng sẽ cộng thêm khoảng cách đến khu rừng.</p>
                        </div>
                    ) : <p className="text-gray-400 italic">Kéo hoặc chạm vào một đơn vị.</p>}
                </div>
                 <div id="event-log" className="hud-section">
                    <h3 className="font-bold mb-2">Nhật ký sự kiện</h3>
                    <ul>
                        {eventLog.map(log => (
                            <li key={log.id} className={`log-entry log-${log.type}`}>
                                {log.type === 'intel' && <img src={INTEL_ICON_URL} alt="Intel Icon" />}
                                {log.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


            {/* Enemy Progress Bar */}
            <div className="w-full mb-4">
                <label className="text-sm font-semibold mb-1 block">Tiến trình của địch</label>
                <div id="enemy-threat-meter">
                   <div id="enemy-threat-meter-progress" style={{ width: `${(enemyProgress / missionData.enemyProgressBarSegments) * 100}%` }}></div>
                   {/* This part below is just for visual segments, the progress is the colored bar above */}
                   {Array.from({ length: missionData.enemyProgressBarSegments }).map((_, i) => (
                        <div key={i} className={`h-full flex-1 border-r border-black/30`}></div>
                    ))}
                </div>
            </div>

            {/* Main grid */}
            <div id="defense-map-grid" className="w-full flex-grow aspect-square grid grid-cols-10 grid-rows-10 gap-px p-1 bg-green-900/50 rounded-lg relative" onDragOver={(e) => e.preventDefault()}>
                {renderOutcomeOverlay()}
                {isRaining && <div id="rain-overlay"></div>}
                {flatLayout.map((cellType, i) => (
                    <div
                        key={i}
                        className={`map-cell cell-${cellType}`}
                        onDrop={(e) => handleDrop(e, i)}
                        onDragOver={(e) => cellType === 'forest' && e.preventDefault()}
                        onClick={() => handleCellClick(i)}
                    >
                         {intelPosition === i && (
                            <div
                                className="intel-item"
                                title="Thu thập tin tình báo (+2 lượt)"
                            />
                        )}
                        {units.filter(u => u.gridIndex === i && u.status === 'unsafe').map(u => (
                            <div
                                key={u.id}
                                draggable={!isGameOver}
                                onClick={(e) => { e.stopPropagation(); handleUnitClick(u); }}
                                onDragStart={(e) => handleDragStart(e, u.id)}
                                onDragEnd={() => { setSelectedUnitInfo(null); setDraggedUnitId(null); }}
                                className={`unit-icon ${unitTypeToClass[u.type]} ${selectedUnitId === u.id ? 'selected' : ''}`}
                                title={`${u.type} (Cost: ${u.evacuationCost})`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DefenseScreen;
