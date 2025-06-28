import React, { useState, useEffect } from 'react';
import { CoinMintingMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';

interface CoinMintingScreenProps {
  missionData: CoinMintingMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const CoinMintingScreen: React.FC<CoinMintingScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedMetalId, setSelectedMetalId] = useState<string | null>(null);
  const [selectedMoldId, setSelectedMoldId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentTask = missionData.tasks[currentTaskIndex];

  useEffect(() => {
    setCurrentTaskIndex(0);
    setSelectedMetalId(null);
    setSelectedMoldId(null);
    setFeedback(null);
    setShowResult(false);
  }, [missionData]);

  const handleMint = () => {
    if (!selectedMetalId || !selectedMoldId || showResult) return;

    if (
      selectedMetalId === currentTask.requiredMetalId &&
      selectedMoldId === currentTask.requiredMoldId
    ) {
      playSound('sfx-success');
      setFeedback({ message: 'Đúc thành công!', success: true });
      setShowResult(true);
      setTimeout(() => {
        // Check for next task or complete mission
        if (currentTaskIndex < missionData.tasks.length - 1) {
            // Not supported yet, but for future proofing
            setCurrentTaskIndex(prev => prev + 1);
            setShowResult(false);
            setFeedback(null);
            setSelectedMetalId(null);
            setSelectedMoldId(null);
        } else {
            playSound('sfx-unlock');
            onComplete(missionData.reward);
        }
      }, 2000);
    } else {
      playSound('sfx-click'); // Or a dedicated error sound
      setFeedback({ message: 'Sai rồi! Hãy thử lại với nguyên liệu và khuôn khác.', success: false });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl text-center flex flex-col">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2 font-serif">{missionData.title}</h2>
      <div id="task-display" className="p-4 bg-white/50 dark:bg-stone-700/50 rounded-lg mb-6">
        <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">
          Nhiệm vụ: Hãy đúc đồng <span className="text-amber-600 dark:text-amber-400 font-bold">{currentTask.name}</span>.
        </p>
      </div>

      <div id="selection-area" className="flex flex-col md:flex-row gap-8 mb-6">
        {/* Metal Selection */}
        <div className="selection-group flex-1">
          <h3 className="text-xl font-semibold mb-3">1. Chọn kim loại</h3>
          <div className="flex justify-center gap-4">
            {missionData.metalOptions.map(option => (
              <div
                key={option.id}
                onClick={() => !showResult && setSelectedMetalId(option.id)}
                className={`selection-card p-3 bg-white dark:bg-stone-700 rounded-lg shadow-md cursor-pointer ${selectedMetalId === option.id ? 'selected' : ''}`}
              >
                <img src={option.imageUrl} alt={option.name} className="w-20 h-20 object-contain mx-auto" />
                <p className="font-semibold mt-2">{option.name}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Mold Selection */}
        <div className="selection-group flex-1">
          <h3 className="text-xl font-semibold mb-3">2. Chọn khuôn đúc</h3>
          <div className="flex justify-center gap-4">
            {missionData.moldOptions.map(option => (
              <div
                key={option.id}
                onClick={() => !showResult && setSelectedMoldId(option.id)}
                className={`selection-card p-3 bg-white dark:bg-stone-700 rounded-lg shadow-md cursor-pointer ${selectedMoldId === option.id ? 'selected' : ''}`}
              >
                <img src={option.imageUrl} alt={option.name} className="w-20 h-20 object-contain mx-auto" />
                <p className="font-semibold mt-2">{option.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleMint}
        disabled={!selectedMetalId || !selectedMoldId || showResult}
        className="w-full max-w-xs mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        Tiến hành Đúc
      </button>

      <div id="result-display" className="h-40 flex flex-col justify-center items-center">
        {showResult && feedback?.success && (
          <img src={currentTask.coinImageUrl} alt={currentTask.name} className="w-32 h-32 object-contain" />
        )}
        {feedback && (
          <p className={`mt-4 text-lg font-semibold ${feedback.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CoinMintingScreen;
