
import React from 'react';
import { TimelineEventItem } from '../types';

interface TimelineEventCardProps {
  eventItem: TimelineEventItem;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, item: TimelineEventItem) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  onClick: (item: TimelineEventItem) => void;
  isSelected: boolean;
}

const TimelineEventCard: React.FC<TimelineEventCardProps> = ({ eventItem, onDragStart, onDragEnd, onClick, isSelected }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, eventItem)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(eventItem)}
      className={`event-card-with-image bg-amber-200 dark:bg-stone-600 rounded-md shadow-md cursor-grab active:cursor-grabbing border-2 border-amber-400 dark:border-amber-500 hover:shadow-lg transition-all duration-200 text-center w-28 sm:w-32 ${isSelected ? 'selected' : ''}`}
      aria-label={`Sự kiện: ${eventItem.text}`}
      title="Nhấp để chọn, kéo để sắp xếp"
      role="button"
      aria-pressed={isSelected}
    >
      <img src={eventItem.imageUrl} alt={eventItem.text} draggable="false" />
      <h3 className="text-xs sm:text-sm text-amber-800 dark:text-amber-100 font-bold select-none">{eventItem.text}</h3>
    </div>
  );
};

export default TimelineEventCard;
