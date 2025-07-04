
import React from 'react';
import { AvatarCustomization, CustomizationItem } from '../types';
import { ALL_CUSTOMIZATION_ITEMS_MAP } from '../constants';
import AvatarDisplay from './AvatarDisplay';
import { playSound } from '../utils/audio';

interface CustomizationScreenProps {
  onReturnToMuseum: () => void;
  currentAvatar: AvatarCustomization;
  unlockedItemIds: string[];
  onAvatarChange: (item: CustomizationItem) => void;
  gender: 'male' | 'female';
}

interface ItemButtonProps {
  item: CustomizationItem;
  isSelected: boolean;
  isUnlocked: boolean;
  onClick: () => void;
}

const ItemButton: React.FC<ItemButtonProps> = ({ item, isSelected, isUnlocked, onClick }) => {
  const handleItemClick = () => {
    if (isUnlocked) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={`relative p-2 rounded-lg border-2 transition-all duration-200
                  ${isUnlocked ? 'cursor-pointer hover:bg-amber-200 dark:hover:bg-stone-600' : 'cursor-not-allowed opacity-50'}
                  ${isSelected ? 'bg-amber-300 dark:bg-amber-600 border-amber-500' : 'bg-white dark:bg-stone-700 border-amber-200 dark:border-stone-600'}`}
      title={isUnlocked ? item.name : 'Chưa mở khóa'}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
          <span className="text-white text-3xl" role="img" aria-label="Khóa">🔒</span>
        </div>
      )}
      <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain mx-auto" />
      <p className="text-sm text-center mt-1 font-semibold text-stone-700 dark:text-stone-200">{item.name}</p>
    </div>
  );
};


const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  onReturnToMuseum,
  currentAvatar,
  unlockedItemIds,
  onAvatarChange,
  gender,
}) => {
  const allItems = Object.values(ALL_CUSTOMIZATION_ITEMS_MAP) as CustomizationItem[];
  const outfits = allItems.filter(item => item.type === 'outfit');
  const hats = allItems.filter(item => item.type === 'hat');

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300 font-serif">Tùy chỉnh Nhân vật</h2>
        <button
          onClick={onReturnToMuseum}
          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Quay về Bảo tàng
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar Display */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center">
            <div className="w-56 h-56 md:w-64 md:h-64 mb-4 bg-amber-50 dark:bg-stone-700 rounded-full shadow-inner">
                <AvatarDisplay avatar={currentAvatar} gender={gender} className="w-full h-full" />
            </div>
             <p className="text-lg font-semibold text-stone-700 dark:text-stone-200">Nhân vật của bạn</p>
        </div>

        {/* Item Selection */}
        <div className="flex-grow">
          {/* Outfits */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-4 border-b-2 border-amber-300 dark:border-stone-600 pb-2">Trang phục</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {outfits.map(item => (
                <ItemButton
                  key={item.id}
                  item={item}
                  isSelected={currentAvatar.outfit === item.id}
                  isUnlocked={unlockedItemIds.includes(item.id)}
                  onClick={() => onAvatarChange(item)}
                />
              ))}
            </div>
          </div>

          {/* Hats */}
          <div>
            <h3 className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-4 border-b-2 border-amber-300 dark:border-stone-600 pb-2">Mũ</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {/* No Hat Option */}
               <div
                  onClick={() => onAvatarChange({ id: 'no_hat', name: 'Không đội mũ', type: 'hat', imageUrl: '' } as CustomizationItem)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-amber-200 dark:hover:bg-stone-600 flex items-center justify-center
                              ${currentAvatar.hat === null ? 'bg-amber-300 dark:bg-amber-600 border-amber-500' : 'bg-white dark:bg-stone-700 border-amber-200 dark:border-stone-600'}`}
                  title="Không đội mũ"
                >
                   <div className="w-24 h-24 flex items-center justify-center">
                       <p className="text-4xl text-stone-400 dark:text-stone-500">🚫</p>
                   </div>
                  <p className="text-sm text-center mt-1 font-semibold text-stone-700 dark:text-stone-200 w-full absolute bottom-2">Không có</p>
                </div>
              {hats.map(item => (
                <ItemButton
                  key={item.id}
                  item={item}
                  isSelected={currentAvatar.hat === item.id}
                  isUnlocked={unlockedItemIds.includes(item.id)}
                  onClick={() => onAvatarChange(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationScreen;