import React from 'react';
import { AvatarCustomization, CustomizationItem } from '../types';
import { ALL_CUSTOMIZATION_ITEMS_MAP } from '../constants';
import AvatarDisplay from './AvatarDisplay';

interface CustomizationScreenProps {
  onReturnToMuseum: () => void;
  currentAvatar: AvatarCustomization;
  unlockedItemIds: string[];
  onAvatarChange: (item: CustomizationItem) => void;
}

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  onReturnToMuseum,
  currentAvatar,
  unlockedItemIds,
  onAvatarChange,
}) => {
  // Group items by type (outfits, hats, etc.)
  const outfits = Object.values(ALL_CUSTOMIZATION_ITEMS_MAP).filter(item => item.type === 'outfit');
  const hats = Object.values(ALL_CUSTOMIZATION_ITEMS_MAP).filter(item => item.type === 'hat');

  const ItemCategory: React.FC<{
    title: string;
    items: CustomizationItem[];
  }> = ({ title, items }) => (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-3 border-b-2 border-amber-300 dark:border-stone-600 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {items.map(item => {
          const isLocked = !unlockedItemIds.includes(item.id);
          const isSelected = currentAvatar.outfit === item.id || currentAvatar.hat === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => !isLocked && onAvatarChange(item)}
              title={item.name}
              className={`customization-item-card p-2 bg-white dark:bg-stone-700 rounded-lg shadow-md flex flex-col items-center justify-center
                ${isLocked ? 'item-locked' : ''}
                ${isSelected ? 'item-selected' : ''}
              `}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-contain"
              />
              <p className="text-xs text-center mt-1 text-stone-600 dark:text-stone-300">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="screen-container w-full max-w-5xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300 font-serif">
          Tùy chỉnh Nhà Sử Học
        </h2>
        <button
          onClick={onReturnToMuseum}
          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Quay về Bảo tàng
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow gap-6">
        {/* Avatar Display Area */}
        <div id="avatar-display-container" className="md:w-1/3 flex-shrink-0 flex flex-col items-center justify-center bg-white/50 dark:bg-stone-700/50 p-4 rounded-xl shadow-inner">
            <AvatarDisplay avatar={currentAvatar} className="w-64 h-80" />
            <p className="mt-4 text-lg font-semibold text-stone-700 dark:text-stone-200">Nhà Sử Học Nhí</p>
        </div>

        {/* Item Palette */}
        <div id="item-palette" className="md:w-2/3 bg-white/50 dark:bg-stone-700/50 p-4 rounded-xl shadow-inner overflow-y-auto">
          <ItemCategory title="Trang phục" items={outfits} />
          <ItemCategory title="Mũ" items={hats} />
          {/* Add more categories here in the future */}
        </div>
      </div>
    </div>
  );
};

export default CustomizationScreen;
