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

  const isCampaignComplete = progress >= questChain.steps.length;

  const handleStepClick = (missionId: string, stepIndex: number) => {
    if (isCampaignComplete || stepIndex === progress) {
        playSound('sfx_click');
        onStartStep(missionId);
    }
  };

  return (
    <div id="campaign-hub-screen" className="screen-container">
       <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-800/70 hover:bg-amber-700/80 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
      >
        Quay về
      </button>

      <div className="campaign-title-container">
        <h2 className="text-4xl">{questChain.title}</h2>
        <p className="mt-2 text-lg">{questChain.description}</p>
      </div>
      
      <div className="campaign-stages-container">
        <div className="stage-connector"></div>
        {questChain.steps.map((step, index) => {
          let status: 'completed' | 'active' | 'locked' = 'locked';
          if (isCampaignComplete) {
              status = 'completed'; // Visually they are all done.
          } else {
              if (index < progress) status = 'completed';
              if (index === progress) status = 'active';
          }
          
          const isClickable = isCampaignComplete || status === 'active';

          return (
            <div key={step.id} className={`stage-card ${status} ${isClickable ? 'active' : ''}`} onClick={() => handleStepClick(step.missionId, index)}>
                <img src={step.iconUrl} alt={step.title} className="stage-icon"/>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {status === 'locked' && <div className="lock-icon">🔒</div>}
                {(status === 'completed') && <div className="lock-icon" style={{fontSize: '3rem', color: '#047857', opacity: 1}}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestChainScreen;