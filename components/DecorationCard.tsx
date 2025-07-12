
import React from 'react';
import { Decoration } from '../types';

interface DecorationCardProps {
  decoration: Decoration;
}

const DecorationCard: React.FC<DecorationCardProps> = ({ decoration }) => {
  return (
    <div
      className="bg-yellow-50 dark:bg-stone-700 p-3 rounded-lg shadow-lg text-center transition-all duration-300 hover:scale-110 border-2 border-yellow-400 dark:border-yellow-500 relative group"
      title={decoration.name}
    >
       <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-lg bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
       <div className="absolute top-1 right-1 text-yellow-500" title="Vật phẩm Premium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
       </div>
      <img src={decoration.imageUrl} alt={decoration.name} className="w-20 h-20 object-contain mx-auto rounded-full bg-white/50 dark:bg-stone-600/50 p-1" />
    </div>
  );
};

export default DecorationCard;