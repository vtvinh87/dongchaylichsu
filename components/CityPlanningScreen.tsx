
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HueConstructionMissionData, Reward, HueBuilding } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

interface CityPlanningScreenProps {
  missionData: HueConstructionMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const CityPlanningScreen: React.FC<CityPlanningScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
  const [placedBuildings, setPlacedBuildings] = useState<Record<string, boolean>>({});
  const [draggedBuilding, setDraggedBuilding] = useState<HueBuilding | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const rewardImageUrl = useMemo(() => {
    if (missionData.reward.type === 'artifact') {
      const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
      return artifact ? artifact.imageUrl : '';
    }
    return '';
  }, [missionData.reward]);

  useEffect(() => {
    // Reset state when mission data changes
    setPlacedBuildings({});
    setDraggedBuilding(null);
    setDragOverZone(null);
    setIsComplete(false);
  }, [missionData]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, building: HueBuilding) => {
    setDraggedBuilding(building);
    // Use a custom drag image to make it look nicer if desired, for now default is fine
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, buildingId: string) => {
    e.preventDefault();
    setDragOverZone(buildingId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetBuildingId: string) => {
    e.preventDefault();
    setDragOverZone(null);
    if (draggedBuilding && draggedBuilding.id === targetBuildingId) {
      playSound('sfx_success');
      const newPlacedBuildings = { ...placedBuildings, [targetBuildingId]: true };
      setPlacedBuildings(newPlacedBuildings);

      // Check for mission completion
      if (Object.keys(newPlacedBuildings).length === missionData.buildings.length) {
        setIsComplete(true);
        playSound('sfx_unlock');
        setTimeout(() => {
          onComplete(missionData.reward);
        }, 2000);
      }
    } else {
      if(draggedBuilding) {
        playSound('sfx_fail');
      }
    }
    setDraggedBuilding(null);
  };

  const unplacedBuildings = missionData.buildings.filter(b => !placedBuildings[b.id]);

  return (
    <div className="screen-container w-full max-w-6xl p-4 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col items-center flex-grow">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-6 left-6 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-20"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">{missionData.title}</h2>
      
      <div className="w-full flex flex-col md:flex-row gap-6 flex-grow">
        {/* Map Area */}
        <div 
          id="citadel-map-container"
          className="flex-grow"
          style={{ backgroundImage: `url(${missionData.mapImageUrl})` }}
        >
          {missionData.dropZones.map(zone => (
            <div
              key={zone.id}
              className={`building-drop-zone ${dragOverZone === zone.id ? 'drag-over' : ''}`}
              style={{ top: `${zone.y}%`, left: `${zone.x}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
              onDragOver={(e) => handleDragOver(e, zone.id)}
              onDragLeave={() => setDragOverZone(null)}
              onDrop={(e) => handleDrop(e, zone.id)}
            >
               {!placedBuildings[zone.id] && <span className="text-white text-shadow-lg font-bold text-sm hidden sm:block">{missionData.buildings.find(b => b.id === zone.id)?.name}</span>}
            </div>
          ))}
          {missionData.dropZones.map(zone => placedBuildings[zone.id] && (
            (() => {
                const building = missionData.buildings.find(b => b.id === zone.id);
                if (!building) return null;
                return (
                    <img
                        key={`placed-${building.id}`}
                        src={building.iconUrl}
                        alt={building.name}
                        className="placed-building-icon visible"
                        style={{ top: `${zone.y}%`, left: `${zone.x}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                    />
                );
            })()
          ))}
           {isComplete && (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp rounded-md">
                <h3 className="text-4xl font-bold text-green-400">Kinh thành hoàn tất!</h3>
                <p className="text-xl mt-2">Bạn đã tái hiện thành công một công trình vĩ đại.</p>
                {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-4 rounded-lg" />}
            </div>
        )}
        </div>

        {/* Building Palette */}
        <div id="construction-palette" className="w-full md:w-64 flex-shrink-0 bg-white/70 dark:bg-stone-700/70 p-4 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-center mb-3 text-amber-800 dark:text-amber-300">Công trình cần đặt</h3>
          <div className="space-y-4">
            {unplacedBuildings.length > 0 ? (
                unplacedBuildings.map(building => (
                  <div
                    key={building.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, building)}
                    className="p-2 rounded-lg bg-white dark:bg-stone-600 flex items-center gap-3 cursor-grab hover:bg-amber-100 dark:hover:bg-stone-500 shadow-md"
                  >
                    <img src={building.iconUrl} alt={building.name} className="w-12 h-12 object-contain flex-shrink-0" />
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{building.name}</span>
                  </div>
                ))
            ) : (
                <p className="text-center italic text-stone-500 dark:text-stone-400">Tất cả công trình đã được đặt!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPlanningScreen;
