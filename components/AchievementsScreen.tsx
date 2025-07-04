import React from 'react';
import { ALL_ACHIEVEMENTS_MAP } from '../constants';
import { Achievement } from '../types';

interface AchievementsScreenProps {
  unlockedAchievementIds: string[];
  onReturnToMuseum: () => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  unlockedAchievementIds,
  onReturnToMuseum,
}) => {
  const allAchievements = Object.values(ALL_ACHIEVEMENTS_MAP) as Achievement[];

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300 font-serif">
          <span role="img" aria-label="medal icon" className="mr-3">🎖️</span>
          Bảng Thành Tựu
        </h2>
        <button
          onClick={onReturnToMuseum}
          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Quay về Bảo tàng
        </button>
      </div>

      {/* Achievements List */}
      <div id="achievements-list" className="flex-grow overflow-y-auto pr-2">
        {allAchievements.map(achievement => {
          const isUnlocked = unlockedAchievementIds.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`achievement-card flex items-center gap-4 p-4 bg-white/80 dark:bg-stone-700/70 rounded-lg shadow-md ${isUnlocked ? '' : 'achievement-locked'}`}
            >
              <div className="flex-shrink-0 w-20 h-20 bg-amber-100 dark:bg-stone-600 rounded-full p-2 flex items-center justify-center">
                <img
                  src={achievement.iconUrl}
                  alt={achievement.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                  {achievement.name}
                </h3>
                <p className="text-stone-600 dark:text-stone-400">
                  {isUnlocked ? achievement.description : '???'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsScreen;