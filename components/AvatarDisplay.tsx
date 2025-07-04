

import React from 'react';
import { AvatarCustomization } from '../types';
import { ALL_CUSTOMIZATION_ITEMS_MAP } from '../constants';
import { AVATAR_BASE_MALE_URL, AVATAR_BASE_FEMALE_URL } from '../imageUrls';

interface AvatarDisplayProps {
  avatar: AvatarCustomization;
  gender: 'male' | 'female';
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatar, gender, className }) => {
  // Get the image URLs for the equipped items
  const outfitItem = ALL_CUSTOMIZATION_ITEMS_MAP[avatar.outfit];
  const hatItem = avatar.hat ? ALL_CUSTOMIZATION_ITEMS_MAP[avatar.hat] : null;

  const baseAvatarUrl = gender === 'female' ? AVATAR_BASE_FEMALE_URL : AVATAR_BASE_MALE_URL;

  return (
    <div className={`relative ${className}`} aria-label="Hiển thị nhân vật">
      {/* Base Character Image */}
      <img
        src={baseAvatarUrl}
        alt="Nhân vật cơ bản"
        className="absolute inset-0 w-full h-full object-contain"
      />
      {/* Outfit Layer - Do not render the 'default' outfit image as it's part of the base avatars now */}
      {outfitItem && avatar.outfit !== 'default_outfit' && (
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