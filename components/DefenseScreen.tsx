import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DefenseMissionData, Reward, MapCellType } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import * as ImageUrls from '../imageUrls';
import { playSound } from '../utils/audio';

interface GameItem {
    id: string;
    type: 'person' | 'food';
    iconUrl: string;
    status: 'unsafe' | 'safe';
    initialGridIndex: number;
}

interface DefenseScreenProps {
    missionData: DefenseMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
}

const DefenseScreen: React.FC<DefenseScreenProps> = ({ missionData, onReturnToMuseum, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(missionData.timeLimit);
    const [gameItems, setGameItems] = useState<GameItem[]>([]);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
    const timerRef = useRef<number | null>(null);
    const rewardImageUrl = useRef('');

    const iconMap = {
        person: ImageUrls.DEFENSE_PERSON_ICON_URL,
        food: ImageUrls.DEFENSE_FOOD_ICON_URL,
    };

    const flatLayout = useMemo(() => missionData.mapLayout.flat(), [missionData.mapLayout]);

    useEffect(() => {
        // Initialize game state when mission changes
        setTimeLeft(missionData.timeLimit);
        setGameItems(missionData.initialItems.map((item, index) => ({
            id: `item-${index}`,
            type: item.type,
            iconUrl: iconMap[item.type],
            status: 'unsafe',
            initialGridIndex: item.gridIndex,
        })));
        setIsGameOver(false);
        setOutcome(null);

        if (missionData.reward.type === 'artifact') {
            const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
            if (artifact) rewardImageUrl.current = artifact.imageUrl;
        }

        // Start timer
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setIsGameOver(true);
                    setOutcome('loss');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [missionData]);

    useEffect(() => {
        if (gameItems.length > 0 && gameItems.every(item => item.status === 'safe')) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsGameOver(true);
            setOutcome('win');
            playSound('sfx-unlock');
            setTimeout(() => onComplete(missionData.reward), 2000);
        }
    }, [gameItems, onComplete, missionData.reward]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
        setDraggedItemId(itemId);
        e.dataTransfer.setData('text/plain', itemId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, cellType: MapCellType) => {
        e.preventDefault();
        if (!draggedItemId || cellType !== 'forest') return;

        playSound('sfx-success');
        setGameItems(prevItems =>
            prevItems.map(item =>
                item.id === draggedItemId ? { ...item, status: 'safe' } : item
            )
        );
        setDraggedItemId(null);
    };

    const renderOutcome = () => {
        if (!isGameOver) return null;
        let title, message, bgColor;
        if (outcome === 'win') {
            title = "Chiến lược thành công!";
            message = "Bạn đã bảo vệ được toàn bộ người dân và lương thực!";
            bgColor = 'bg-black/70';
        } else {
            title = "Thất bại!";
            message = "Đã hết thời gian! Quân địch đã tới. Hãy thử lại.";
            bgColor = 'bg-red-900/80';
        }
        return (
            <div className={`absolute inset-0 ${bgColor} flex flex-col justify-center items-center text-white z-50 animate-fadeInScaleUp p-4`}>
                <h3 className="text-4xl font-bold mb-4">{title}</h3>
                <p className="text-xl text-center mb-6">{message}</p>
                {outcome === 'win' && rewardImageUrl.current && (
                    <img src={rewardImageUrl.current} alt="Phần thưởng" className="w-32 h-32 object-contain my-4 rounded-lg" />
                )}
                {outcome === 'loss' && (
                    <button onClick={onReturnToMuseum} className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
                        Quay về
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="screen-container w-full max-w-5xl p-4 bg-stone-900 text-white rounded-lg shadow-xl flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-amber-300 font-serif">{missionData.title}</h2>
                <div id="timer-display" className={`text-4xl font-bold ${timeLeft <= 10 ? 'low-time' : ''}`}>
                    {timeLeft}s
                </div>
                <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 font-semibold py-2 px-4 rounded-lg shadow-md z-10">
                    Quay về
                </button>
            </div>

            {/* Game Area */}
            <div id="map-grid" className="w-full aspect-square">
                {renderOutcome()}
                {flatLayout.map((cellType, index) => (
                    <div
                        key={index}
                        className={`map-cell ${cellType} ${cellType === 'forest' ? 'droppable' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, cellType)}
                    ></div>
                ))}

                {gameItems.filter(i => i.status === 'unsafe').map(item => {
                    const row = Math.floor(item.initialGridIndex / 10);
                    const col = item.initialGridIndex % 10;
                    return (
                        <div
                            key={item.id}
                            draggable={!isGameOver}
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            className="movable-item"
                            style={{ top: `${row * 10}%`, left: `${col * 10}%` }}
                        >
                            <img src={item.iconUrl} alt={item.type} className="movable-item-icon" />
                        </div>
                    );
                })}
            </div>

             {/* Item Bank */}
            <div className="w-full mt-4 p-2 bg-black/30 rounded-lg">
                 <h3 className="text-lg font-semibold text-center mb-2">Cần di tản:</h3>
                 <div className="flex justify-center gap-4">
                     {gameItems.map(item => (
                         <div key={item.id} className={`p-2 rounded-md transition-opacity duration-300 ${item.status === 'safe' ? 'opacity-30' : ''}`}>
                             <img src={item.iconUrl} alt={item.type} className="w-10 h-10" />
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default DefenseScreen;