import React from 'react';
import { QuestChain } from '../types';
import { playSound } from '../utils/audio';

interface QuestChainScreenProps {
  questChain: QuestChain;
  progress: number; // Index of the current step
  onStartStep: (missionId: string) => void;
  onReturnToMuseum: () => void;
}

const QuestChainScreen: React.FC<QuestChainScreenProps> = ({
  questChain,
  progress,
  onStartStep,
  onReturnToMuseum,
}) => {

  const handleStepClick = (missionId: string, stepIndex: number) => {
    if (stepIndex === progress) {
        playSound('sfx-click');
        onStartStep(missionId);
    }
  };

  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-50 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col items-center">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2 font-serif">{questChain.title}</h2>
      <p className="text-stone-600 dark:text-stone-300 mb-8 text-center">{questChain.description}</p>
      
      <div className="w-full">
        {questChain.steps.map((step, index) => {
          let status: 'completed' | 'active' | 'locked' = 'locked';
          if (index < progress) status = 'completed';
          if (index === progress) status = 'active';

          return (
            <div key={step.id} className={`quest-step step-${status} flex items-start gap-4 mb-8`}>
              <div className="quest-step-icon">
                {status === 'completed' ? '✓' : status === 'active' ? '▶' : '🔒'}
              </div>
              <div className={`w-full p-4 rounded-lg shadow-md transition-all duration-300 ${
                  status === 'active' ? 'bg-amber-100 dark:bg-stone-700 cursor-pointer hover:shadow-lg hover:scale-105' : 
                  status === 'completed' ? 'bg-green-100 dark:bg-green-900/50 opacity-80' : 
                  'bg-gray-100 dark:bg-stone-900/50 opacity-60'
              }`}
                onClick={() => handleStepClick(step.missionId, index)}
              >
                  <div className="flex items-center gap-4">
                      <img src={step.iconUrl} alt={step.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                      <div>
                          <h3 className={`text-xl font-bold ${
                              status === 'active' ? 'text-amber-800 dark:text-amber-300' :
                              status === 'completed' ? 'text-green-800 dark:text-green-300' :
                              'text-gray-600 dark:text-gray-400'
                          }`}>{step.title}</h3>
                          <p className={`text-sm ${
                              status === 'active' ? 'text-stone-700 dark:text-stone-200' :
                              'text-stone-500 dark:text-stone-400'
                          }`}>{step.description}</p>
                      </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestChainScreen;
