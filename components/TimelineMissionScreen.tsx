


import React, { useState, useEffect, useCallback } from 'react';
import { TimelineMissionData, TimelineEventItem, Reward } from '../types';
import { ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP } from '../constants';
import TimelineEventCard from './TimelineEventCard';
import TimelineSlot from './TimelineSlot';
import EventDetailModal from './EventDetailModal';
import { playSound } from '../utils/audio';

interface TimelineMissionScreenProps {
  missionData: TimelineMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const TimelineMissionScreen: React.FC<TimelineMissionScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
  const [eventPoolItems, setEventPoolItems] = useState<TimelineEventItem[]>([]);
  const [timelineSlots, setTimelineSlots] = useState<(TimelineEventItem | null)[]>([]);
  const [isTimelineComplete, setIsTimelineComplete] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<TimelineEventItem | null>(null);
  const [rewardImageUrl, setRewardImageUrl] = useState<string>('');

  // New state for updated features
  const [timeLeft, setTimeLeft] = useState(missionData.timeLimit || 120);
  const [timeChallengeSuccess, setTimeChallengeSuccess] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState<TimelineEventItem | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string>("");

  useEffect(() => {
    setEventPoolItems(shuffleArray([...missionData.events]));
    setTimelineSlots(Array(missionData.events.length).fill(null));
    setIsTimelineComplete(false);
    
    let url = '';
    if (missionData.reward.type === 'artifact') {
        url = ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
    } else if (missionData.reward.type === 'fragment') {
        url = ALL_FRAGMENTS_MAP[missionData.reward.id]?.imageUrl || '';
    }
    setRewardImageUrl(url);
    
    setTimeLeft(missionData.timeLimit || 120);
    setTimeChallengeSuccess(true);
    setIsTimerRunning(true);
    setCompletionMessage("");
    setSelectedEventForModal(null);

  }, [missionData]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimeChallengeSuccess(false);
      alert("Hết giờ thử thách! Bạn có thể tiếp tục hoàn thành nhưng sẽ không nhận được thưởng thêm.");
    }
  }, [timeLeft, isTimerRunning]);

  const handleShowDetails = (item: TimelineEventItem) => {
    playSound('sfx_click');
    setSelectedEventForModal(item);
  };

  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, item: TimelineEventItem) => {
    setDraggedItem(item);
    event.dataTransfer.setData('text/plain', item.id); 
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDropOnSlot = useCallback((event: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    event.preventDefault();
    if (!draggedItem || timelineSlots[slotIndex] !== null) {
      return; 
    }

    if (draggedItem.correctOrder === slotIndex + 1) {
      playSound('sfx-success');
      const newTimelineSlots = [...timelineSlots];
      newTimelineSlots[slotIndex] = draggedItem;
      setTimelineSlots(newTimelineSlots);

      setEventPoolItems(prevPool => prevPool.filter(item => item.id !== draggedItem.id));
      
      const allSlotsFilled = newTimelineSlots.every(slot => slot !== null);
      if (allSlotsFilled) {
        setIsTimerRunning(false);
        setIsTimelineComplete(true);
        playSound('sfx_unlock');
        if (timeChallengeSuccess) {
          setCompletionMessage("Hoàn thành xuất sắc! Bạn đã vượt qua thử thách thời gian!");
        } else {
          setCompletionMessage("Hoàn thành! Bạn đã sắp xếp đúng dòng thời gian!");
        }
        setTimeout(() => onComplete(missionData.reward), 2500);
      }
    } else {
      playSound('sfx_fail');
    }
    setDraggedItem(null);
  }, [draggedItem, timelineSlots, missionData.reward, onComplete, timeChallengeSuccess]);
  
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-lg shadow-xl flex flex-col items-center relative">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-20"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      {missionData.timeLimit && (
        <div id="timeline-timer" className={timeLeft <= 10 ? 'low-time' : ''}>
          ⏳ {timeLeft}s
        </div>
      )}

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2 font-serif">{missionData.title}</h2>
      {!isTimelineComplete && (
        <p className="text-stone-600 dark:text-stone-300 mb-6 text-center">{missionData.instructionText}</p>
      )}

      {isTimelineComplete ? (
        <div className="p-8 text-2xl text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-900/50 rounded-lg text-center animate-fadeInScaleUp">
          <p>{completionMessage}</p>
          {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-40 h-40 object-contain mx-auto my-4 rounded-lg" />}
        </div>
      ) : (
        <>
          <div id="timeline-slots" className="flex flex-wrap justify-center items-stretch gap-4 mb-8 p-3 bg-white/50 dark:bg-stone-700/50 rounded-lg w-full">
            {timelineSlots.map((item, index) => (
              <TimelineSlot
                key={`slot-${index}`}
                slotIndex={index}
                placedEvent={item}
                onDrop={handleDropOnSlot}
                onDragOver={handleDragOver}
              />
            ))}
          </div>

          <div id="event-pool" className="flex flex-wrap justify-center items-start gap-3 p-4 bg-white/70 dark:bg-stone-600/70 rounded-lg min-h-[150px] w-full shadow-inner">
            {eventPoolItems.length > 0 ? (
              eventPoolItems.map(item => (
                <TimelineEventCard
                  key={item.id}
                  eventItem={item}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onShowDetails={handleShowDetails}
                />
              ))
            ) : (
              !isTimelineComplete && <p className="text-stone-500 dark:text-stone-400 italic">Không còn sự kiện nào để sắp xếp.</p>
            )}
          </div>
        </>
      )}
      <EventDetailModal
        eventItem={selectedEventForModal}
        onClose={() => setSelectedEventForModal(null)}
      />
    </div>
  );
};

export default TimelineMissionScreen;