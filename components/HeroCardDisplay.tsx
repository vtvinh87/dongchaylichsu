
import React from 'react';
import { HeroCard } from '../types';

interface HeroCardDisplayProps {
  heroCard: HeroCard;
}

const HeroCardDisplay: React.FC<HeroCardDisplayProps> = ({ heroCard }) => {
  return (
    <div className="bg-white dark:bg-stone-700 p-3 rounded-lg shadow-md text-center transition-transform duration-300 hover:scale-110 border border-amber-200 dark:border-stone-600">
      <img 
        src={heroCard.imageUrl} 
        alt={heroCard.name} 
        className="w-24 h-32 object-cover mx-auto mb-2 rounded-md bg-amber-50 dark:bg-stone-600 p-1"
      />
      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{heroCard.name}</p>
      {heroCard.description && <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{heroCard.description}</p>}
    </div>
  );
};

export default HeroCardDisplay;
