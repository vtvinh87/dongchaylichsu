import React, { useState, useEffect, useMemo } from 'react';
import { DefenseMissionData, Reward, MapCellType, EvacuationUnit, EvacuationUnitType } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import * as ImageUrls from '../imageUrls';
import { playSound } from '../utils/audio';

interface GameUnit extends EvacuationUnit {
    status: 'unsafe' | 'evacuated';
    iconUrl: string;
}

interface DefenseScreenProps {
    missionData: DefenseMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
}

const DefenseScreen: React.FC<DefenseScreenProps> = ({ missionData, onReturnToMuseum, onComplete }) => {
    const [turnsLeft, setTurnsLeft] = useState(missionData.turnLimit);
    const [units, setUnits] = useState<GameUnit[]>([]);
    const [draggedUnitId, setDraggedUnitId] = useState<string | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
    const [isRaining, setIsRaining] = useState(false);
    const [rainTurnsLeft, setRainTurnsLeft] = useState(0);
    const [intelReportSegment, setIntelReportSegment] = useState<number | null>(null);
    const [enemyProgress, setEnemyProgress] = useState(0);

    const rewardImageUrl = useMemo(() => {
        return missionData.reward.type === 'artifact' ? ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '' : '';
    }, [missionData.reward]);

    const unitIconMap: Record<EvacuationUnitType, string> = {
        civilian: ImageUrls.DEFENSE_PERSON_ICON_URL,
        supplies: ImageUrls.DEFENSE_SUPPLIES_ICON_URL,
        wounded: ImageUrls.DEFENSE_WOUNDED_ICON_URL,
    };

    const flatLayout = useMemo(() => missionData.mapLayout.flat(), [missionData.mapLayout]);

    useEffect(() => {
        // Initialize game state
        setTurnsLeft(missionData.turnLimit);
        setUnits(missionData.units.map(u => ({
            ...u,
            status: 'unsafe',
            iconUrl: unitIconMap[u.type]
        })));
        setIsGameOver(false);
        setOutcome(null);
        setIsRaining(false);
        setRainTurnsLeft(0);
        setIntelReportSegment(null);
        setEnemyProgress(0);
    }, [missionData]);
    
    // Check for win condition
    useEffect(() => {
        if (units.length > 0 && units.every(u => u.status === 'evacuated')) {
            setIsGameOver(true);
            setOutcome('win');
            playSound('sfx-unlock');
            setTimeout(() => onComplete(missionData.reward), 2000);
        }
    }, [units, onComplete, missionData.reward]);

    const triggerRandomEvent = () => {
        // Rain event logic
        if (rainTurnsLeft > 1) {
            setRainTurnsLeft(prev => prev - 1);
        } else {
            setIsRaining(false);
            setRainTurnsLeft(0);
        }

        const rand = Math.random();
        if (rand < 0.15 && !isRaining) { // 15% chance to start raining
            setIsRaining(true);
            setRainTurnsLeft(3); // Rain lasts for 3 turns
            alert("Trời bắt đầu mưa lớn! Việc di tản sẽ khó khăn hơn.");
        }

        // Intel event logic
        setIntelReportSegment(null); // Clear old intel
        if (rand > 0.85) { // 15% chance for new intel
            const randomSegment = Math.floor(Math.random() * missionData.enemyProgressBarSegments);
            setIntelReportSegment(randomSegment);
            alert("Tình báo! Địch có thể sẽ tập trung tấn công vào khu vực được đánh dấu!");
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, unitId: string) => {
        if (isGameOver) return;
        setDraggedUnitId(unitId);
        e.dataTransfer.setData('application/json', JSON.stringify({ unitId }));
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
            triggerRandomEvent();
        } else {
            playSound('sfx_fail');
            alert('Không đủ lượt đi để thực hiện hành động này!');
        }
        setDraggedUnitId(null);
    };
    
    // Check for loss condition
    useEffect(() => {
        if (!isGameOver && (turnsLeft <= 0 || enemyProgress >= missionData.enemyProgressBarSegments)) {
            if (!units.every(u => u.status === 'evacuated')) {
                setIsGameOver(true);
                setOutcome('loss');
            }
        }
    }, [turnsLeft, enemyProgress, units, isGameOver, missionData.enemyProgressBarSegments]);

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
        <div className="screen-container w-full max-w-5xl p-4 bg-stone-900 text-white rounded-lg shadow-xl flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-3xl font-bold text-amber-300 font-serif">{missionData.title}</h2>
                <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">Lượt đi: <span className="text-amber-300">{turnsLeft}</span></div>
                    <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 font-semibold py-2 px-4 rounded-lg shadow-md z-10">Quay về</button>
                </div>
            </div>

            {/* Enemy Progress Bar */}
            <div className="w-full mb-4">
                <label className="text-sm font-semibold mb-1 block">Tiến trình của địch</label>
                <div id="enemy-progress-bar" className="flex w-full h-5 bg-gray-600 rounded-full overflow-hidden border-2 border-gray-800">
                    {Array.from({ length: missionData.enemyProgressBarSegments }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-full flex-1 transition-colors duration-500 ${i < enemyProgress ? 'bg-red-600' : ''} ${i === intelReportSegment ? 'animate-pulse bg-yellow-400' : ''}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Main grid */}
            <div id="defense-map-grid" className="w-full flex-grow aspect-square grid grid-cols-10 grid-rows-10 gap-0.5 p-1 bg-green-900/50 rounded-lg relative" onDragOver={(e) => e.preventDefault()}>
                {renderOutcomeOverlay()}
                {isRaining && <div className="absolute inset-0 bg-blue-800/20 pointer-events-none z-10 rain-animation"></div>}
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
                                className="unit-icon-container"
                                title={`${u.type} (Cost: ${u.evacuationCost})`}
                            >
                                <img src={u.iconUrl} alt={u.type} className="unit-icon" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DefenseScreen;
