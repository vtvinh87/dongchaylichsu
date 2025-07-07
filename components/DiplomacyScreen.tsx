

import React, { useState, useEffect, useCallback } from 'react';
import { DiplomacyMissionData, Reward } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface DiplomacyScreenProps {
  missionData: DiplomacyMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
  onFail: () => void;
}

const DiplomacyScreen: React.FC<DiplomacyScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
  onFail,
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [goodwill, setGoodwill] = useState(missionData.initialGoodwill);
  const [isChoiceMade, setIsChoiceMade] = useState(false);
  const [isMissionOver, setIsMissionOver] = useState(false);
  const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
  const [lastChoicePoints, setLastChoicePoints] = useState(0);
  const [rewardImageUrl, setRewardImageUrl] = useState('');

  useEffect(() => {
    // Reset state when mission data changes
    setCurrentRoundIndex(0);
    setGoodwill(missionData.initialGoodwill);
    setIsChoiceMade(false);
    setIsMissionOver(false);
    setOutcome(null);
    setLastChoicePoints(0);

    if (missionData.reward.type === 'artifact') {
        const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
        if (artifact) setRewardImageUrl(artifact.imageUrl);
    }
  }, [missionData]);

  const currentRound = missionData.rounds[currentRoundIndex];

  const handleSelectChoice = (points: number) => {
    if (isChoiceMade) return;
    
    if(points > 0) {
        playSound('sfx_success');
    } else {
        playSound('sfx_fail');
    }
    
    setIsChoiceMade(true);
    setLastChoicePoints(points);
    
    const newGoodwill = Math.max(0, Math.min(missionData.targetGoodwill, goodwill + points));
    setGoodwill(newGoodwill);

    setTimeout(() => {
        if (newGoodwill <= 0) {
            setOutcome('loss');
            setIsMissionOver(true);
            onFail();
        } else if (newGoodwill >= missionData.targetGoodwill) {
            playSound('sfx_unlock');
            setOutcome('win');
            setIsMissionOver(true);
            setTimeout(() => onComplete(missionData.reward), 1500);
        } else if (currentRoundIndex >= missionData.rounds.length - 1) {
            // Ran out of rounds without winning or losing
            setOutcome('loss');
            setIsMissionOver(true);
            onFail();
        } else {
            // Go to next round
            setCurrentRoundIndex(prev => prev + 1);
            setIsChoiceMade(false);
        }
    }, 1200); // Delay to show feedback before moving on
  };
  
  const getGoodwillBarColor = () => {
      const percentage = (goodwill / missionData.targetGoodwill) * 100;
      if (percentage < 30) return 'bg-red-500';
      if (percentage < 60) return 'bg-yellow-500';
      return 'bg-green-500';
  };

  const getChoiceButtonClass = (points: number) => {
    if (!isChoiceMade) {
        return '';
    }
    if (points === lastChoicePoints) {
        return points > 0 ? 'selected-correct' : 'selected-wrong';
    }
    return 'opacity-50';
  }

  const renderOutcome = () => {
    if (!isMissionOver) return null;

    let title, message;
    if (outcome === 'win') {
        title = "Thành công!";
        message = "Bạn đã thuyết phục được nhà vua! Phần thưởng xứng đáng dành cho bạn.";
    } else { // loss
        title = "Thất bại...";
        message = "Rất tiếc, cuộc đối thoại đã không thành công. Hãy thử lại với những lựa chọn khôn khéo hơn!";
    }

    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp p-4">
            <h3 className="text-4xl font-bold text-amber-300 mb-4">{title}</h3>
            <p className="text-xl text-center mb-4">{message}</p>
            {outcome === 'win' && rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-4 rounded-lg" />}
            {outcome === 'loss' && (
                 <button 
                    onClick={onReturnToMuseum} 
                    className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
                    Quay về
                </button>
            )}
        </div>
    );
  };

  return (
    <div className="frosted-glass-container max-w-2xl">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600/50 hover:bg-amber-700/50 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-300 z-10"
        aria-label="Quay về Bảo tàng"
      >
        Quay về
      </button>

      {renderOutcome()}

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">{missionData.title}</h2>

      {/* Character Info */}
      <div id="character-info" className="flex flex-col items-center mb-4">
        <img 
            src={missionData.characterImageUrl} 
            alt={missionData.characterName} 
            className="w-32 h-32 object-cover rounded-full border-4 border-amber-300 dark:border-amber-600 shadow-lg"
        />
        <h3 className="text-2xl font-semibold mt-2 text-stone-800 dark:text-stone-100">{missionData.characterName}</h3>
      </div>

      {/* Goodwill Bar */}
      <div id="goodwill-container" className="mb-6 w-full max-w-sm">
        <label htmlFor="goodwill-bar" className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1">Thiện chí</label>
        <div id="goodwill-bar-container">
            <div id="goodwill-bar" className={getGoodwillBarColor()} style={{ width: `${(goodwill / missionData.targetGoodwill) * 100}%` }}></div>
        </div>
      </div>

      {/* Dialogue and Choices */}
      <div className="space-y-6 w-full">
        <div id="npc-dialogue-box">
            <p className="text-lg italic text-stone-700 dark:text-stone-200">
                "{currentRound.npc_dialogue}"
            </p>
        </div>

        <div id="player-choices-box" className="flex flex-col gap-3">
            {currentRound.player_choices.map((choice, index) => (
                <button
                    key={index}
                    onClick={() => handleSelectChoice(choice.points)}
                    disabled={isChoiceMade}
                    className={`diplomacy-choice-button ${getChoiceButtonClass(choice.points)}`}
                >
                    {choice.text}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DiplomacyScreen;
