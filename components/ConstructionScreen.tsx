


import React, { useState, useEffect, useCallback } from 'react';
import { ConstructionMissionData, Reward, Resources } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface ConstructionScreenProps {
  missionData: ConstructionMissionData;
  onReturnToMuseum: () => void;
  onMissionComplete: (reward: Reward) => void;
}

type GamePhase = 'collecting' | 'building' | 'complete';
type PlacedWall = { gridIndex: number };

const GRID_SIZE = 100; // 10x10 grid

const ConstructionScreen: React.FC<ConstructionScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onMissionComplete,
}) => {
  const [resources, setResources] = useState<Resources>({ wood: 0, stone: 0 });
  const [phase, setPhase] = useState<GamePhase>('collecting');
  const [placedWalls, setPlacedWalls] = useState<PlacedWall[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [rewardImageUrl, setRewardImageUrl] = useState('');

  useEffect(() => {
    // Reset state when mission data changes
    setResources({ wood: 0, stone: 0 });
    setPhase('collecting');
    setPlacedWalls([]);
    
    if (missionData.reward.type === 'artifact') {
        const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
        if (artifact) setRewardImageUrl(artifact.imageUrl);
    }

  }, [missionData]);

  const handleCollectResource = () => {
    if (isCollecting || phase !== 'collecting') return;

    setIsCollecting(true);
    // Add a little visual flair to the collection button
    playSound('sfx-click');

    // Simulate collecting resources
    setTimeout(() => {
      setResources(prev => {
        const newResources = {
          wood: prev.wood + 5,
          stone: prev.stone + 10,
        };

        // Check if goal is met
        if (newResources.wood >= missionData.resourceGoal.wood && newResources.stone >= missionData.resourceGoal.stone) {
          setPhase('building');
          playSound('sfx-unlock');
        }
        return newResources;
      });
      setIsCollecting(false);
    }, 300);
  };
  
  const handlePlaceWall = (gridIndex: number) => {
    if (phase !== 'building' || placedWalls.some(w => w.gridIndex === gridIndex)) {
        return;
    }

    const { wood: woodCost, stone: stoneCost } = missionData.buildingCost;
    if (resources.wood >= woodCost && resources.stone >= stoneCost) {
        playSound('sfx-success');
        
        setResources(prev => ({
            wood: prev.wood - woodCost,
            stone: prev.stone - stoneCost,
        }));

        const newPlacedWalls = [...placedWalls, { gridIndex }];
        setPlacedWalls(newPlacedWalls);

        if (newPlacedWalls.length >= missionData.winCondition) {
            setPhase('complete');
            setTimeout(() => {
                onMissionComplete(missionData.reward);
            }, 1500);
        }
    } else {
        // Optional: show a message that they don't have enough resources
        alert("Không đủ tài nguyên!");
    }
  };

  const ResourceDisplay: React.FC<{ label: string; value: number; goal: number; icon: string }> = ({ label, value, goal, icon }) => (
    <div className="flex items-center gap-2 bg-white/80 dark:bg-stone-800/80 p-2 rounded-lg text-sm">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-stone-700 dark:text-stone-200">{label}:</span>
        <span className="font-bold text-amber-700 dark:text-amber-400">{Math.min(value, goal)} / {goal}</span>
    </div>
  );
  
  const renderGameContent = () => {
    if (phase === 'complete') {
        return (
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white animate-fadeInScaleUp z-10">
                <h3 className="text-4xl font-bold">Thành Cổ Loa hoàn tất!</h3>
                <p className="text-xl mt-2">Bạn đã xây dựng thành công một công trình vĩ đại!</p>
                {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-24 h-24 object-contain my-4 rounded-lg" />}
            </div>
        );
    }
    return null;
  }

  return (
    <div className="screen-container w-full h-full max-w-5xl max-h-[90vh] mx-auto p-4 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col items-center justify-center gap-4">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-6 left-6 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-20"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 font-serif">{missionData.title}</h2>
      
      <div className="w-full flex flex-col md:flex-row gap-4 flex-grow">
        {/* Control Panel */}
        <div id="control-panel" className="w-full md:w-1/3 bg-white/60 dark:bg-stone-700/60 p-4 rounded-lg shadow-inner flex flex-col gap-4">
            <div>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-2">Bảng điều khiển</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                    {phase === 'collecting' && 'Giai đoạn 1: Hãy thu thập đủ tài nguyên để bắt đầu xây dựng.'}
                    {phase === 'building' && 'Giai đoạn 2: Chọn vị trí trên bản đồ để xây tường thành.'}
                    {phase === 'complete' && 'Nhiệm vụ hoàn thành!'}
                </p>
            </div>
            
            <div id="resource-display" className="space-y-2">
                <ResourceDisplay label="Gỗ" value={resources.wood} goal={missionData.resourceGoal.wood} icon="🪵" />
                <ResourceDisplay label="Đá" value={resources.stone} goal={missionData.resourceGoal.stone} icon="🪨" />
            </div>

            {phase === 'collecting' && (
                <button 
                    onClick={handleCollectResource} 
                    disabled={isCollecting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                >
                    {isCollecting ? 'Đang thu thập...' : 'Thu thập Tài nguyên'}
                </button>
            )}

            {phase === 'building' && (
                <div id="building-palette" className="bg-amber-50 dark:bg-stone-600/50 p-3 rounded-lg animate-fadeInScaleUp">
                    <h4 className="text-md font-semibold text-center mb-2">Chọn để xây:</h4>
                    <div className="flex justify-center items-center gap-2 p-2 rounded-md bg-white dark:bg-stone-800 shadow-sm">
                        <div className="w-12 h-12 bg-stone-500 rounded border-2 border-stone-700" title="Tường thành"></div>
                        <div className="text-left">
                            <p className="font-bold">Tường thành</p>
                            <p className="text-xs">Chi phí: {missionData.buildingCost.wood} 🪵, {missionData.buildingCost.stone} 🪨</p>
                        </div>
                    </div>
                </div>
            )}
             <div className="mt-auto text-center text-sm text-stone-500 dark:text-stone-400">
                Mục tiêu: Xây {missionData.winCondition} đoạn tường thành.
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(placedWalls.length / missionData.winCondition) * 100}%` }}></div>
                </div>
                <p className="font-semibold">{placedWalls.length} / {missionData.winCondition}</p>
            </div>
        </div>

        {/* Construction Site */}
        <div id="construction-site" className="relative w-full md:w-2/3 aspect-square bg-green-200 dark:bg-green-900/50 rounded-lg shadow-lg grid grid-cols-10 grid-rows-10 gap-0.5 p-1">
            {Array.from({ length: GRID_SIZE }).map((_, index) => {
                 const isWall = placedWalls.some(w => w.gridIndex === index);
                 return (
                    <div
                        key={index}
                        onClick={() => handlePlaceWall(index)}
                        className={`w-full h-full rounded-sm transition-colors duration-200 ${
                            isWall 
                                ? 'bg-stone-500 dark:bg-stone-600' 
                                : 'bg-green-300/50 dark:bg-green-800/50 hover:bg-yellow-300/50 dark:hover:bg-yellow-400/50 cursor-pointer'
                        }`}
                        title={isWall ? 'Tường thành' : `Ô ${index + 1}`}
                    />
                );
            })}
            {renderGameContent()}
        </div>
      </div>
    </div>
  );
};

export default ConstructionScreen;