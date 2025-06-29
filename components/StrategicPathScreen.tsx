import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StrategicPathMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

interface Point {
  x: number;
  y: number;
}

const StrategicPathScreen: React.FC<{
    missionData: StrategicPathMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
    const [playerPath, setPlayerPath] = useState<Point[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    
    const { start, end, mapLayout } = missionData;

    const rewardImageUrl = useMemo(() => {
        if (missionData.reward.type === 'artifact') {
            const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
            return artifact ? artifact.imageUrl : '';
        }
        return '';
    }, [missionData.reward]);
    
    useEffect(() => {
        // Initialize the path with the start point
        setPlayerPath([start]);
        setIsComplete(false);
    }, [missionData, start]);
    
    const handleCellClick = useCallback((x: number, y: number) => {
        if (isComplete) return;

        const terrainType = mapLayout[y][x];
        // 0: jungle (passable), 1: mountain, 2: river (impassable)
        if (terrainType === 1 || terrainType === 2) {
            // Optional: add feedback for trying to click impassable terrain
            return;
        }

        const lastPoint = playerPath[playerPath.length - 1];
        if (!lastPoint) return;

        // Check for adjacency (no diagonal moves)
        const isAdjacent = Math.abs(lastPoint.x - x) + Math.abs(lastPoint.y - y) === 1;
        // Check if the cell is already in the path
        const isInPath = playerPath.some(p => p.x === x && p.y === y);

        if (isAdjacent && !isInPath) {
            playSound('sfx-click');
            const newPath = [...playerPath, { x, y }];
            setPlayerPath(newPath);

            // Check for win condition
            if (x === end.x && y === end.y) {
                setIsComplete(true);
                playSound('sfx-unlock');
                setTimeout(() => onComplete(missionData.reward), 2000);
            }
        }
    }, [isComplete, playerPath, mapLayout, end, onComplete, missionData.reward]);
    
    const getCellClass = (x: number, y: number) => {
        const terrainType = mapLayout[y][x];
        let classes = 'strategic-path-cell ';

        switch(terrainType) {
            case 0: classes += 'cell-jungle cursor-pointer'; break;
            case 1: classes += 'cell-mountain'; break;
            case 2: classes += 'cell-river'; break;
        }

        if (playerPath.some(p => p.x === x && p.y === y)) {
            classes += ' cell-player-path';
        }
        if (x === start.x && y === start.y) classes += ' cell-start';
        if (x === end.x && y === end.y) classes += ' cell-end';

        return classes;
    }

    return (
        <div className="screen-container w-full max-w-2xl p-6 bg-stone-800 rounded-lg shadow-xl text-center flex flex-col items-center">
            <button
                onClick={onReturnToMuseum}
                className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10"
            >
                Quay về
            </button>

            <h2 className="text-3xl font-bold text-amber-300 mb-2 font-serif">{missionData.title}</h2>
            <p className="text-stone-300 mb-4">Vạch đường từ điểm Vàng (Bắt đầu) đến điểm Đỏ (Kết thúc).</p>
            
            <div id="strategic-path-grid" className="w-full aspect-[10/15]">
                {mapLayout.map((row, y) => 
                    row.map((_, x) => (
                        <div 
                            key={`${y}-${x}`}
                            className={getCellClass(x, y)}
                            onClick={() => handleCellClick(x, y)}
                        >
                           {x === start.x && y === start.y && 'BĐ'}
                           {x === end.x && y === end.y && 'KT'}
                        </div>
                    ))
                )}
                 {isComplete && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp rounded-md">
                        <h3 className="text-4xl font-bold text-green-400">Đã mở đường!</h3>
                        <p className="text-xl mt-2">Con đường tiếp tế đã được khai thông.</p>
                        {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-4" />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StrategicPathScreen;
