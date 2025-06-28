import React, { useState, useEffect } from 'react';
import { RallyCallMissionData, Reward } from '../types';
import { ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface RallyCallScreenProps {
  missionData: RallyCallMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const RallyCallScreen: React.FC<RallyCallScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [composedHich, setComposedHich] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [rewardImageUrl, setRewardImageUrl] = useState('');

  useEffect(() => {
    // Reset state when mission data changes
    setCurrentRoundIndex(0);
    setComposedHich('');
    setIsComplete(false);

    let url = '';
    if (missionData.reward.type === 'artifact') {
        const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
        if (artifact) setRewardImageUrl(artifact.imageUrl);
    } else if (missionData.reward.type === 'fragment') {
        const fragment = ALL_FRAGMENTS_MAP[missionData.reward.id];
        if (fragment) setRewardImageUrl(fragment.imageUrl);
    }
  }, [missionData]);

  const currentRound = missionData.rounds[currentRoundIndex];

  const handleChoiceSelect = (choice: string) => {
    playSound('sfx-click');
    const lineToAdd = `${currentRound.prefix || ''}${choice}`;
    setComposedHich(prev => prev + lineToAdd + '\n');
    
    if (currentRoundIndex < missionData.rounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      playSound('sfx-unlock');
      setTimeout(() => {
        onComplete(missionData.reward);
      }, 2000);
    }
  };

  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl text-center flex flex-col">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">
        {missionData.title}
      </h2>
      
      <div 
        id="hich-content" 
        className="w-full flex-grow mb-6 animate-fadeInScaleUp"
      >
        {composedHich}
        {isComplete && (
            <div className="flex flex-col justify-center items-center text-green-800 dark:text-green-300 h-full">
                <p className="text-2xl font-bold mt-4">Bài hịch đã hoàn thành!</p>
                <p className="text-lg">Lời hiệu triệu vang dội khắp non sông!</p>
                {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-24 h-24 object-contain my-2 rounded-lg" />}
            </div>
        )}
      </div>

      {!isComplete && currentRound && (
        <div className="animate-fadeInScaleUp">
            {currentRound.prefix && (
                <div className="mb-4 p-4 bg-white/50 dark:bg-stone-700/50 rounded-lg">
                    <p className="text-lg italic text-stone-700 dark:text-stone-300">
                        {currentRound.prefix}
                        <span className="text-amber-600 dark:text-amber-400 font-bold">...</span>
                    </p>
                </div>
            )}
            <div id="phrase-choices" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentRound.options.map((option, index) => (
                    <button
                    key={index}
                    onClick={() => handleChoiceSelect(option)}
                    className="phrase-choice-button w-full p-4 rounded-lg shadow-md text-lg font-semibold transition-transform transform hover:scale-105"
                    >
                    {option}
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default RallyCallScreen;