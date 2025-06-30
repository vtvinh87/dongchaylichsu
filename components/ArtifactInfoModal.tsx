

import React from 'react';
import { Artifact, MemoryFragment } from '../types';
import { playSound } from '../utils/audio'; 

interface ArtifactInfoModalProps {
  item: Artifact | MemoryFragment;
  isOpen: boolean;
  onClose: () => void;
}

const ArtifactInfoModal: React.FC<ArtifactInfoModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) {
    return null;
  }

  const handleCloseAction = () => {
    playSound('sfx_click');
    onClose();
  };

  const isArtifact = 'detailedDescription' in item;
  const description = isArtifact ? item.detailedDescription : item.description;
  const title = isArtifact ? item.name : `Đã nhận: ${item.name}`;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleCloseAction} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content bg-amber-50 dark:bg-stone-800 p-6 rounded-xl shadow-2xl w-full max-w-lg text-center relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fadeInScaleUp"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={handleCloseAction}
          className="modal-close-button absolute top-3 right-4 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 text-3xl font-bold leading-none"
          aria-label="Đóng"
        >
          &times;
        </button>
        <h2 id="modal-title" className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">{title}</h2>
        <img 
          id="modal-image"
          src={item.imageUrl} 
          alt={`Hình ảnh ${item.name}`} 
          className="max-w-[150px] h-auto mx-auto mb-5 rounded-lg border-2 border-amber-300 dark:border-amber-700 p-1 bg-white dark:bg-stone-700"
        />
        <p id="modal-description" className="text-stone-700 dark:text-stone-200 text-base text-left leading-relaxed">
          {description}
        </p>
        <button
            onClick={handleCloseAction}
            className="mt-6 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-opacity-50"
        >
            Tuyệt vời!
        </button>
      </div>
      {/* Animation is defined in index.html global styles or App.tsx for shared use */}
    </div>
  );
};

export default ArtifactInfoModal;