import React, { useEffect } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
  notification: Achievement | null;
  onDismiss: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3800); // slightly less than the animation duration

      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) {
    return null;
  }

  return (
    <div id="achievement-toast">
      <div className="flex items-center gap-4 bg-gradient-to-br from-stone-800 to-stone-900 text-white p-4 rounded-lg shadow-2xl border-2 border-yellow-400 max-w-sm mx-auto">
        <div className="flex-shrink-0 w-16 h-16 bg-yellow-400/20 rounded-full p-2 flex items-center justify-center">
          <img
            src={notification.iconUrl}
            alt={notification.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-sm font-bold text-yellow-300">
            THÀNH TỰU MỞ KHÓA!
          </h3>
          <p className="text-lg font-semibold text-white">
            {notification.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
