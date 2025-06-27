
import React from 'react';
import { TimelineEventItem } from '../types';

interface TimelineSlotProps {
  slotIndex: number;
  placedEvent: TimelineEventItem | null;
  onDrop: (event: React.DragEvent<HTMLDivElement>, slotIndex: number) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  totalSlots: number;
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({ slotIndex, placedEvent, onDrop, onDragOver, totalSlots }) => {
  const isCorrectlyPlaced = placedEvent && placedEvent.correctOrder === slotIndex + 1;

  return (
    <div
      onDrop={(e) => onDrop(e, slotIndex)}
      onDragOver={onDragOver}
      className={`relative flex-shrink-0 w-32 h-24 sm:w-36 sm:h-28 md:w-40 md:h-32 border-2 rounded-lg flex flex-col items-center justify-center p-2 text-center transition-colors duration-200
                  ${isCorrectlyPlaced ? 'bg-green-100 dark:bg-green-800/70 border-green-500 dark:border-green-600 shadow-inner' : 
                    placedEvent ? 'bg-red-100 dark:bg-red-800/70 border-red-500 dark:border-red-600' : 
                    'bg-amber-50 dark:bg-stone-700 border-dashed border-amber-400 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-stone-600'}`}
      aria-label={`Ô dòng thời gian ${slotIndex + 1}. ${placedEvent ? `Chứa sự kiện: ${placedEvent.text}` : 'Trống.'}`}
    >
      {placedEvent ? (
        <p className={`text-xs sm:text-sm font-semibold ${isCorrectlyPlaced ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}`}>
          {placedEvent.text}
        </p>
      ) : (
        <span className="text-2xl sm:text-3xl font-bold text-amber-400 dark:text-amber-500">{slotIndex + 1}</span>
      )}
      {slotIndex < totalSlots - 1 && (
        <div 
          className="absolute top-1/2 -right-4 sm:-right-5 transform -translate-y-1/2 text-amber-400 dark:text-amber-600 font-bold text-xl sm:text-2xl"
          aria-hidden="true"
        >
          →
        </div>
      )}
    </div>
  );
};

export default TimelineSlot;
