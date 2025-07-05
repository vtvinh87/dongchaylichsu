
import React from 'react';
import { TimelineEventItem } from '../types';

interface TimelineSlotProps {
  slotIndex: number;
  placedEvent: TimelineEventItem | null;
  onDrop: (event: React.DragEvent<HTMLDivElement>, slotIndex: number) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onClick: (slotIndex: number) => void;
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({ slotIndex, placedEvent, onDrop, onDragOver, onClick }) => {
  const isCorrectlyPlaced = placedEvent && placedEvent.correctOrder === slotIndex + 1;

  return (
    <div
      onDrop={(e) => onDrop(e, slotIndex)}
      onDragOver={onDragOver}
      onClick={() => onClick(slotIndex)}
      className={`timeline-slot-with-image relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 border-2 rounded-lg flex flex-col items-center justify-center p-2 text-center transition-colors duration-200
                  ${isCorrectlyPlaced ? 'bg-green-100 dark:bg-green-800/70 border-green-500 dark:border-green-600 shadow-inner' : 
                    placedEvent ? 'bg-red-100 dark:bg-red-800/70 border-red-500 dark:border-red-600' : 
                    'bg-amber-50 dark:bg-stone-700 border-dashed border-amber-400 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-stone-600'}
                  ${!placedEvent ? 'cursor-pointer' : ''}`}
      aria-label={`Ô dòng thời gian ${slotIndex + 1}. ${placedEvent ? `Chứa sự kiện: ${placedEvent.text}. Nhấp để xem chi tiết.` : 'Trống. Nhấp để đặt sự kiện đã chọn.'}`}
    >
      {placedEvent ? (
        <div className="w-full h-full cursor-pointer">
            <img src={placedEvent.imageUrl} alt={placedEvent.text} className="w-full h-full object-cover rounded-md" />
        </div>
      ) : (
        <span className="text-2xl sm:text-3xl font-bold text-amber-400 dark:text-amber-500">{slotIndex + 1}</span>
      )}
    </div>
  );
};

export default TimelineSlot;
