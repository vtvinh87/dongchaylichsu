import React, { useState, useEffect, useRef } from 'react';
import { TacticalMapMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';

interface TacticalMapScreenProps {
  missionData: TacticalMapMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward?: Reward) => void;
}

interface PlacedStake {
  id: number;
  x: number;
  y: number;
}

const TacticalMapScreen: React.FC<TacticalMapScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
  const [placedStakes, setPlacedStakes] = useState<PlacedStake[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when mission data changes
    setPlacedStakes([]);
    setIsComplete(false);
  }, [missionData]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isComplete || placedStakes.length >= missionData.targetStakes) return;

    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    playSound('sfx-click');

    const newStakes = [...placedStakes, { id: Date.now(), x, y }];
    setPlacedStakes(newStakes);

    if (newStakes.length >= missionData.targetStakes) {
      setIsComplete(true);
      playSound('sfx-unlock');
      setTimeout(() => {
        onComplete(missionData.reward);
      }, 2000);
    }
  };

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-stone-800 rounded-lg shadow-xl text-center flex flex-col">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-30"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      <div className="relative mb-4">
        <h2 className="text-3xl font-bold text-amber-300 font-serif">{missionData.title}</h2>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-3/4 mt-2">
            <div className="w-full bg-gray-600 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full transition-all duration-300" style={{ width: `${(placedStakes.length / missionData.targetStakes) * 100}%` }}></div>
            </div>
            <p className="text-white font-bold text-lg mt-1">{placedStakes.length} / {missionData.targetStakes}</p>
        </div>
      </div>
      
      <div 
        id="tactical-map"
        ref={mapRef}
        className="w-full flex-grow mt-8 bg-cover bg-center rounded-lg shadow-inner border-4 border-amber-800"
        style={{ backgroundImage: `url(${missionData.backgroundUrl})`}}
        onClick={handleMapClick}
      >
        {placedStakes.map(stake => (
          <img
            key={stake.id}
            src={missionData.stakeImageUrl}
            alt="Cọc gỗ"
            className="placed-stake"
            style={{ left: `${stake.x}px`, top: `${stake.y}px` }}
          />
        ))}
        {isComplete && (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp">
                <h3 className="text-4xl font-bold text-green-400">Trận địa hoàn tất!</h3>
                <p className="text-xl mt-2">Bãi cọc đã sẵn sàng chờ quân địch.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TacticalMapScreen;
