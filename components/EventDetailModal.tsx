import React from 'react';
import { TimelineEventItem } from '../types';
import { playSound } from '../utils/audio';

interface EventDetailModalProps {
  eventItem: TimelineEventItem | null;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ eventItem, onClose }) => {
  if (!eventItem) {
    return null;
  }

  const handleClose = () => {
    playSound('sfx_click');
    onClose();
  };

  return (
    <div id="event-detail-modal-backdrop" className="animate-fadeInScaleUp" onClick={handleClose}>
      <div id="event-detail-modal-content" className="animate-fadeInScaleUp" onClick={(e) => e.stopPropagation()}>
        <img src={eventItem.imageUrl} alt={eventItem.text} />
        <h3 className="text-2xl font-bold font-serif mb-2">{eventItem.text}</h3>
        <p className="text-base text-left leading-relaxed">{eventItem.details}</p>
        <button
          onClick={handleClose}
          className="mt-6 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-6 rounded-lg shadow-md"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default EventDetailModal;