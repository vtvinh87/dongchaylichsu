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
    type: 'rain' | 'intel' | 'evac' | 'system' | 'enemy';
}
const INTEL_ICON_URL = "https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-tinh-bao.png";

const DefenseScreen: React.FC<{
    missionData: DefenseMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
    // State
    const [turnsLeft, setTurnsLeft] = useState(missionData.turnLimit);
    const [units, setUnits] = useState<GameUnit[]>([]);
    const [draggedUnitId, setDraggedUnitId] = useState<string | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
    const [enemyProgress, setEnemyProgress] = useState(0);
    const [isRaining, setIsRaining] = useState(false);
    const [rainTurnsLeft, setRainTurnsLeft] = useState(0);
    const [intelReportSegment, setIntelReportSegment] = useState<number | null>(null);
    const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
    const [selectedUnitInfo, setSelectedUnitInfo] = useState<GameUnit | null>(null);

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

    // Functions
    const addLog = useCallback((message: string, type: EventLogEntry['type']) => {
        setEventLog(prev => [{id: Date.now(), message, type}, ...prev].slice(0, 10));
    }, []);

    const triggerRandomEvent = useCallback(() => {
        // Rain event logic
        if (rainTurnsLeft > 1) {
            setRainTurnsLeft(prev => prev - 1);
        } else if (rainTurnsLeft === 1) {
            setIsRaining(false);
            setRainTurnsLeft(0);
            addLog('Trời đã tạnh mưa.', 'rain');
        }

        const rand = Math.random();
        // 15% chance to start raining if not already raining
        if (!isRaining && rand < 0.15) {
            setIsRaining(true);
            setRainTurnsLeft(3); // Rain for 3 turns
            addLog('Trời đổ mưa lớn! Chi phí di tản tăng thêm 1 lượt.', 'rain');
        }

        // 15% chance for new intel
        setIntelReportSegment(null); // Clear old intel
        if (rand > 0.85) {
            const randomSegment = Math.floor(Math.random() * missionData.enemyProgressBarSegments);
            setIntelReportSegment(randomSegment);
            addLog(`Quân địch có thể sẽ tập trung tấn công vào khu vực được đánh dấu!`, 'intel');
        }
    }, [isRaining, rainTurnsLeft, missionData.enemyProgressBarSegments, addLog]);

    // Game initialization
    useEffect(() => {
        setTurnsLeft(missionData.turnLimit);
        setUnits(missionData.units.map(u => ({ ...u, status: 'unsafe' })));
        setIsGameOver(false);
        setOutcome(null);
        setEnemyProgress(0);
        setIsRaining(false);
        setRainTurnsLeft(0);
        setIntelReportSegment(null);
        setEventLog([]);
        addLog('Nhiệm vụ bắt đầu! Sơ tán các đơn vị đến khu vực an toàn (rừng cây).', 'system');
    }, [missionData, addLog]);

    // Game Logic
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, unitId: string) => {
        if (isGameOver) return;
        setDraggedUnitId(unitId);
        const unit = units.find(u => u.id === unitId);
        setSelectedUnitInfo(unit || null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, cellType: MapCellType) => {
        e.preventDefault();
        if (!draggedUnitId || cellType !== 'forest' || isGameOver) return;

        const unit = units.find(u => u.id === draggedUnitId);
        if (!unit || unit.status === 'evacuated') return;

        const cost = unit.evacuationCost + (isRaining ? 1 : 0);

        if (turnsLeft >= cost) {
            playSound('sfx_success');
            setTurnsLeft(prev => prev - cost);
            setEnemyProgress(prev => prev + 1);
            setUnits(prev => prev.map(u => u.id === draggedUnitId ? { ...u, status: 'evacuated' } : u));
            addLog(`Đã di tản ${unit.type} với chi phí ${cost} lượt.`, 'evac');
            addLog(`Quân địch đang đến gần hơn!`, 'enemy');
            triggerRandomEvent();
        } else {
            playSound('sfx_fail');
            addLog('Không đủ lượt đi để thực hiện hành động này!', 'system');
        }
        setDraggedUnitId(null);
        setSelectedUnitInfo(null);
    };

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
        }
    }, [units, turnsLeft, enemyProgress, isGameOver, onComplete, missionData.reward, missionData.enemyProgressBarSegments]);

    const renderOutcomeOverlay = () => {
        if (!isGameOver) return null;
        const isWin = outcome === 'win';
        return (
            <div className={`absolute inset-0 ${isWin ? 'bg-black/70' : 'bg-red-900/80'} flex flex-col justify-center items-center text-white z-50 animate-fadeInScaleUp p-4 text-center`}>
                <h3 className="text-4xl font-bold mb-4">{isWin ? "Chiến lược thành công!" : "Thất bại!"}</h3>
                <p className="text-xl mb-6">{isWin ? "Bạn đã sơ tán thành công tất cả các đơn vị!" : "Đã hết lượt đi hoặc quân địch đã đến. Hãy thử lại."}</p>
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
            <div id="defense-hud-panel" className="w-full flex flex-col md:flex-row gap-4 mb-4">
                <div className="hud-section">
                    <h3 className="font-bold mb-2">Thông tin</h3>
                    <p className="text-xl">Lượt đi: <span className="text-amber-300 font-bold">{turnsLeft}</span></p>
                    <p className="mt-2 text-sm">Đơn vị đã di tản: {units.filter(u=>u.status==='evacuated').length}/{units.length}</p>
                </div>
                <div className="hud-section">
                    <h3 className="font-bold mb-2">Đơn vị đang chọn</h3>
                    {selectedUnitInfo ? (
                        <div>
                            <p>Loại: <span className="font-semibold capitalize">{selectedUnitInfo.type}</span></p>
                            <p>Chi phí: <span className="font-semibold">{selectedUnitInfo.evacuationCost + (isRaining ? 1 : 0)} lượt {isRaining && '(+1 vì mưa)'}</span></p>
                        </div>
                    ) : <p className="text-gray-400 italic">Kéo một đơn vị để xem chi tiết.</p>}
                </div>
                 <div id="event-log" className="hud-section">
                    <h3 className="font-bold mb-2">Nhật ký sự kiện</h3>
                    <ul>
                        {eventLog.map(log => (
                            <li key={log.id}>
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
                        <div key={i} className={`h-full flex-1 border-r border-black/30 ${i === intelReportSegment ? 'animate-pulse bg-yellow-400/50' : ''}`}></div>
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
                        onDrop={(e) => handleDrop(e, cellType)}
                        onDragOver={(e) => cellType === 'forest' && e.preventDefault()}
                    >
                        {units.filter(u => u.gridIndex === i && u.status === 'unsafe').map(u => (
                            <div
                                key={u.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, u.id)}
                                onDragEnd={() => setSelectedUnitInfo(null)}
                                className={`unit-icon ${unitTypeToClass[u.type]}`}
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
