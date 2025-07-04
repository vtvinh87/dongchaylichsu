

import React, { useState, useEffect } from 'react';
import { HiddenObjectMissionData, Reward, HiddenObjectItem } from '../types';
import { ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP } from '../constants';
import { playSound } from '../utils/audio';
import EventDetailModal from './EventDetailModal';

interface HiddenObjectScreenProps {
  missionData: HiddenObjectMissionData;
  onReturnToMuseum: () => void;
  onMissionComplete: (reward?: Reward, data?: { foundItemIds: string[] }) => void;
}

const HiddenObjectScreen: React.FC<HiddenObjectScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onMissionComplete,
}) => {
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [rewardImageUrl, setRewardImageUrl] = useState('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<HiddenObjectItem | null>(null);

  useEffect(() => {
    // Reset state when mission changes
    setFoundItems([]);
    setIsComplete(false);
    setSelectedItemForModal(null);
    
    let url = '';
    if (missionData.reward?.type === 'artifact') {
        url = ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
    } else if (missionData.reward?.type === 'fragment') {
        url = ALL_FRAGMENTS_MAP[missionData.reward.id]?.imageUrl || '';
    }
    setRewardImageUrl(url);

  }, [missionData]);

  const handleItemClick = (item: HiddenObjectItem) => {
    if (foundItems.includes(item.id) || isComplete) {
      return;
    }
    playSound('sfx-success');
    setSelectedItemForModal(item);
  };
  
  const handleModalClose = () => {
    if (!selectedItemForModal) return;

    const newFoundItems = [...foundItems, selectedItemForModal.id];
    setFoundItems(newFoundItems);
    setSelectedItemForModal(null);

    if (newFoundItems.length === missionData.objectsToFind.length) {
      setIsComplete(true);
      setTimeout(() => {
        onMissionComplete(missionData.reward, { foundItemIds: newFoundItems });
      }, 1500); // Wait for the completion animation/message
    }
  };

  return (
    <div className="screen-container w-full h-full max-w-6xl max-h-[90vh] mx-auto p-4 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col items-center justify-center">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-6 left-6 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-20"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">{missionData.title}</h2>
      
      <div className="relative w-full aspect-[16/9] bg-stone-200 dark:bg-stone-900 rounded-md overflow-hidden shadow-lg border-4 border-amber-300 dark:border-stone-600">
        <img src={missionData.backgroundImageUrl} alt="Bối cảnh phiên chợ" className="w-full h-full object-cover" />

        {missionData.objectsToFind.map(item => (
          <div
            key={item.id}
            className={`absolute cursor-pointer rounded-sm transition-all duration-300 ${foundItems.includes(item.id) ? 'bg-green-500/50 border-2 border-white pointer-events-none' : 'hover:bg-yellow-300/40'}`}
            style={{
              left: `${item.coords.x}%`,
              top: `${item.coords.y}%`,
              width: `${item.coords.width}%`,
              height: `${item.coords.height}%`,
            }}
            onClick={() => handleItemClick(item)}
            title={`Tìm: ${item.name}`}
            aria-label={`Tìm: ${item.name}`}
          />
        ))}
        {isComplete && (
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white animate-fadeInScaleUp">
                <h3 className="text-4xl font-bold">Hoàn Thành!</h3>
                <p className="text-xl mt-2">Bạn đã tìm thấy tất cả vật phẩm!</p>
                {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-24 h-24 object-contain my-4 rounded-lg" />}
            </div>
        )}
      </div>

      <div id="item-list" className="w-full mt-4 p-3 bg-white/70 dark:bg-stone-700/70 rounded-lg shadow-inner flex justify-center items-center gap-4 flex-wrap">
        {missionData.objectsToFind.map(item => (
          <div
            key={`list-${item.id}`}
            className={`flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${foundItems.includes(item.id) ? 'opacity-40 line-through' : 'bg-amber-50 dark:bg-stone-600'}`}
          >
            <img src={item.iconUrl} alt={item.name} className="w-8 h-8 object-contain" />
            <span className="font-semibold text-stone-700 dark:text-stone-200">{item.name}</span>
          </div>
        ))}
      </div>

      <EventDetailModal
        eventItem={selectedItemForModal ? {
            id: selectedItemForModal.id,
            text: selectedItemForModal.name,
            details: selectedItemForModal.details,
            imageUrl: selectedItemForModal.iconUrl,
            correctOrder: 0, // Dummy data
        } : null}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default HiddenObjectScreen;