import React from 'react';
import { AvatarCustomization } from '../types';
import { ALL_CUSTOMIZATION_ITEMS_MAP } from '../constants';
import { AVATAR_BASE_URL } from '../imageUrls';

interface AvatarDisplayProps {
  avatar: AvatarCustomization;
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatar, className }) => {
  // Get the image URLs for the equipped items
  const outfitItem = ALL_CUSTOMIZATION_ITEMS_MAP[avatar.outfit];
  const hatItem = avatar.hat ? ALL_CUSTOMIZATION_ITEMS_MAP[avatar.hat] : null;

  return (
    <div className={`relative ${className}`} aria-label="Hiển thị nhân vật">
      {/* Base Character Image */}
      <img
        src={AVATAR_BASE_URL}
        alt="Nhân vật cơ bản"
        className="absolute inset-0 w-full h-full object-contain"
      />
      {/* Outfit Layer */}
      {outfitItem && (
        <img
          src={outfitItem.imageUrl}
          alt={outfitItem.name}
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}
      {/* Hat Layer */}
      {hatItem && (
        <img
          src={hatItem.imageUrl}
          alt={hatItem.name}
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}
    </div>
  );
};

export default AvatarDisplay;
