
import React from 'react';
import { TimelineEventItem } from '../types';

interface TimelineEventCardProps {
  eventItem: TimelineEventItem;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, item: TimelineEventItem) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
}

const TimelineEventCard: React.FC<TimelineEventCardProps> = ({ eventItem, onDragStart, onDragEnd }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, eventItem)}
      onDragEnd={onDragEnd}
      className="bg-amber-200 dark:bg-stone-600 p-3 rounded-md shadow-md cursor-grab active:cursor-grabbing border-2 border-amber-400 dark:border-amber-500 hover:shadow-lg transition-all duration-200 min-w-[150px] max-w-[200px] text-center"
      aria-label={`Sự kiện: ${eventItem.text}`}
    >
      <p className="text-sm text-amber-800 dark:text-amber-100 font-medium select-none">{eventItem.text}</p>
    </div>
  );
};

export default TimelineEventCard;
