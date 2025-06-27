

import React from 'react';
import { MissionInfo } from '../types';

interface MissionCardProps {
  mission: MissionInfo;
  onClick: () => void;
  isLocked?: boolean;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onClick, isLocked }) => {
  const isPremiumAndLocked = mission.isPremium && isLocked;

  const lockedClasses = isLocked 
    ? "grayscale opacity-60 cursor-not-allowed" 
    : "hover:shadow-xl hover:scale-105 hover:border-amber-500 dark:hover:border-amber-600";
  
  const premiumLockedClasses = isPremiumAndLocked ? "premium-locked-visuals" : "";

  const handleCardClick = () => {
    // The click handler in App.tsx will now decide whether to show a popup or start the mission
    onClick();
  };
  
  return (
    <div
      className={`mission-card relative bg-white dark:bg-stone-700 p-4 rounded-lg shadow-lg transition-all duration-300 border-2 border-amber-300 dark:border-stone-600 ${lockedClasses} ${premiumLockedClasses}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={isLocked ? -1 : 0} 
      onKeyPress={(e) => !isLocked && e.key === 'Enter' && handleCardClick()}
      aria-disabled={isLocked}
    >
      {isLocked && !isPremiumAndLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 dark:bg-black/50 rounded-lg z-10">
          <span className="text-white text-4xl" role="img" aria-label="Khóa">🔒</span>
        </div>
      )}
       {isPremiumAndLocked && (
         <div className="premium-crown" aria-label="Nhiệm vụ Premium"></div>
       )}
      <img 
        src={mission.imageUrl} 
        alt={mission.title} 
        className={`w-full aspect-video object-cover rounded-md mb-3 ${isLocked ? 'opacity-70' : ''}`} 
      />
      <h3 className={`text-xl font-semibold mb-1 ${isLocked ? 'text-stone-500 dark:text-stone-400' : 'text-amber-700 dark:text-amber-300'}`}>{mission.title}</h3>
      {mission.description && <p className={`text-sm ${isLocked ? 'text-stone-400 dark:text-stone-500' : 'text-stone-600 dark:text-stone-300'}`}>{mission.description}</p>}
    </div>
  );
};

export default MissionCard;
