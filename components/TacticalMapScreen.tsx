import React, { useState, useEffect, useMemo } from 'react';
import { TacticalMapMissionData, Reward, BachDangCampaignState } from '../types';
import { playSound } from '../utils/audio';

interface TacticalMapScreenProps {
  missionData: TacticalMapMissionData;
  bachDangCampaign: BachDangCampaignState;
  onReturnToMuseum: () => void;
  onComplete: (reward?: Reward, data?: { stakesPlacedCorrectly: number }) => void;
}

const TacticalMapScreen: React.FC<TacticalMapScreenProps> = ({
  missionData,
  bachDangCampaign,
  onReturnToMuseum,
  onComplete,
}) => {
  const [placedStakes, setPlacedStakes] = useState<Record<string, boolean>>({}); // key is zone ID
  const [isComplete, setIsComplete] = useState(false);

  const validZones = useMemo(() => {
    if (!missionData.dropZones) return [];
    return missionData.dropZones.filter(zone =>
      bachDangCampaign.scoutedLocations.includes(zone.id)
    );
  }, [missionData.dropZones, bachDangCampaign.scoutedLocations]);

  useEffect(() => {
    // Reset state when mission data changes
    setPlacedStakes({});
    setIsComplete(false);
  }, [missionData]);

  const handleZoneClick = (zoneId: string) => {
    if (isComplete || placedStakes[zoneId]) return;

    playSound('sfx_success');
    setPlacedStakes(prev => ({ ...prev, [zoneId]: true }));
  };
  
  const handleCompleteMission = () => {
    if (isComplete) return;
    setIsComplete(true);
    playSound('sfx_unlock');
    const stakeCount = Object.keys(placedStakes).length;
    setTimeout(() => {
        onComplete(missionData.reward, { stakesPlacedCorrectly: stakeCount });
    }, 2000);
  };

  const placedStakeCount = Object.keys(placedStakes).length;

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-stone-800 rounded-lg shadow-xl text-center flex flex-col flex-grow">
      {/* Top Bar with Return button and Progress */}
      <div className="flex justify-between items-center w-full mb-4 z-30">
        <button
          onClick={onReturnToMuseum}
          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          aria-label="Quay về Bảo tàng"
        >
          Quay về Bảo tàng
        </button>
        <h2 className="text-3xl font-bold text-amber-300 font-serif">{missionData.title}</h2>
        <div className="text-white font-bold text-lg">Cọc đã đặt: {placedStakeCount}</div>
      </div>
      
      <p className="text-stone-300 mb-4">Nhấp vào các khu vực đã trinh sát (màu xanh) để đặt cọc.</p>

      <div 
        id="tactical-map"
        className="w-full flex-grow relative mt-8 bg-cover bg-center rounded-lg shadow-inner border-4 border-amber-800"
        style={{ backgroundImage: `url(${missionData.backgroundUrl})`}}
      >
        {/* Render valid drop zones */}
        {validZones.map(zone => (
            <div
                key={zone.id}
                className="valid-stake-location"
                style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                }}
                onClick={() => handleZoneClick(zone.id)}
            >
                {/* Render a stake if it has been placed in this zone */}
                {placedStakes[zone.id] && (
                    <img
                        src={missionData.stakeImageUrl}
                        alt="Cọc gỗ"
                        className="placed-stake-in-zone"
                    />
                )}
            </div>
        ))}

        {isComplete && (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp">
                <h3 className="text-4xl font-bold text-green-400">Trận địa hoàn tất!</h3>
                <p className="text-xl mt-2">Đã bố trí xong cọc. Chuẩn bị cho trận chiến quyết định!</p>
            </div>
        )}
      </div>
      
      <div className="tactical-map-controls mt-4">
        <button 
            onClick={handleCompleteMission}
            disabled={isComplete}
            className="complete-button"
        >
            Hoàn thành Bố trí
        </button>
      </div>
    </div>
  );
};

export default TacticalMapScreen;
