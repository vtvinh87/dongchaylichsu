



import React, { useState, useEffect, useCallback } from 'react';
import { NarrativeMissionData, NarrativeNode, Reward } from '../types';
import { playSound } from '../utils/audio'; 

interface NarrativeMissionScreenProps {
  missionData: NarrativeMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward?: Reward) => void;
  onFail: () => void;
}

const NarrativeMissionScreen: React.FC<NarrativeMissionScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
  onFail,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(missionData.startNodeId);
  const [showCompletionMessage, setShowCompletionMessage] = useState<boolean>(false);
  const [completionText, setCompletionText] = useState<string>('');
  
  const currentNode: NarrativeNode | undefined = missionData.nodes[currentNodeId];

  useEffect(() => {
    setCurrentNodeId(missionData.startNodeId);
    setShowCompletionMessage(false);
    setCompletionText('');
  }, [missionData]);

  const handleChoiceClick = useCallback((targetNodeId: string) => {
    playSound('sfx_click');
    const nextNode = missionData.nodes[targetNodeId];
    if (nextNode) {
      setCurrentNodeId(targetNodeId);
      if (nextNode.isTerminal) {
        setCompletionText(nextNode.text); 
        setShowCompletionMessage(true);
      }
    }
  }, [missionData.nodes]);

  const handleEndMissionButton = useCallback(() => {
    playSound('sfx_click');
    if (currentNode?.isTerminal) {
      if (currentNode.isSuccessOutcome && currentNode.grantsMissionReward) {
        onComplete(missionData.reward);
      } else {
        onFail();
        onReturnToMuseum();
      }
    } else {
      onReturnToMuseum();
    }
  }, [currentNode, missionData.reward, onComplete, onReturnToMuseum, onFail]);


  if (!currentNode) {
    console.error("Current narrative node is undefined for mission:", missionData.id, "node ID:", currentNodeId );
    onReturnToMuseum(); 
    return <p className="text-red-500 dark:text-red-300 p-4 bg-red-100 dark:bg-red-900/50 rounded-md">Lỗi: Không tìm thấy nội dung nhiệm vụ. Đang điều hướng về bảo tàng...</p>;
  }

  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-lg shadow-xl flex flex-col min-h-[70vh]">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
        aria-label="Quay về Bảo tàng"
        hidden={showCompletionMessage} 
      >
        Quay về Bảo tàng
      </button>
      
      <h2 id="narrative-title" className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1 font-serif text-center">
        {missionData.title}
      </h2>
      {currentNode.title && !showCompletionMessage && (
         <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-500 mb-4 text-center">{currentNode.title}</h3>
      )}

      {!showCompletionMessage ? (
        <>
          <p id="story-text" className="text-lg md:text-xl text-stone-700 dark:text-stone-200 leading-relaxed mb-6 flex-grow whitespace-pre-line">
            {currentNode.text}
          </p>
          <div id="choices-container" className="flex flex-col space-y-3">
            {currentNode.choices.map((choice, index) => (
              <button
                key={`${currentNodeId}-choice-${index}`} 
                onClick={() => handleChoiceClick(choice.targetNodeId)}
                className="choice-button w-full bg-amber-200 hover:bg-amber-300 dark:bg-stone-600 dark:hover:bg-stone-500 border-2 border-amber-500 dark:border-amber-600 text-amber-800 dark:text-amber-200 font-semibold py-3 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 text-base md:text-lg"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-lg md:text-xl text-stone-700 dark:text-stone-200 leading-relaxed mb-6 whitespace-pre-line text-center">{completionText}</p>
          <button
            onClick={handleEndMissionButton}
            className="choice-button bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 text-base md:text-lg"
          >
            Kết thúc nhiệm vụ
          </button>
        </div>
      )}
    </div>
  );
};

export default NarrativeMissionScreen;
