import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Tutorial, TutorialStep } from '../types';

interface TutorialOverlayProps {
  tutorialData: Tutorial;
  stepIndex: number;
  onNext: () => void;
  onSkip: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ tutorialData, stepIndex, onNext, onSkip }) => {
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 0 0 rgba(0,0,0,0.7)',
  });
  const [boxStyle, setBoxStyle] = useState<React.CSSProperties>({});
  const [currentStep, setCurrentStep] = useState<TutorialStep>(tutorialData.steps[stepIndex]);

  useLayoutEffect(() => {
    setCurrentStep(tutorialData.steps[stepIndex]);
  }, [tutorialData, stepIndex]);

  useLayoutEffect(() => {
    const step = currentStep;
    if (!step) return;

    let targetElement: HTMLElement | null = null;
    if (step.elementSelector) {
        targetElement = document.querySelector(step.elementSelector);
    }
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setHighlightStyle({
        position: 'absolute',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transition: 'all 0.3s ease-in-out',
      });

      const boxPosition: React.CSSProperties = {
          position: 'absolute',
          transition: 'all 0.3s ease-in-out',
      };
      const margin = 16;
      
      switch (step.position) {
          case 'top':
              boxPosition.left = `${rect.left + rect.width / 2}px`;
              boxPosition.top = `${rect.top - margin}px`;
              boxPosition.transform = 'translateX(-50%) translateY(-100%)';
              break;
          case 'left':
              boxPosition.left = `${rect.left - margin}px`;
              boxPosition.top = `${rect.top + rect.height / 2}px`;
              boxPosition.transform = 'translateX(-100%) translateY(-50%)';
              break;
          case 'right':
              boxPosition.left = `${rect.right + margin}px`;
              boxPosition.top = `${rect.top + rect.height / 2}px`;
              boxPosition.transform = 'translateY(-50%)';
              break;
          case 'bottom':
          default:
              boxPosition.left = `${rect.left + rect.width / 2}px`;
              boxPosition.top = `${rect.bottom + margin}px`;
              boxPosition.transform = 'translateX(-50%)';
              break;
      }
      setBoxStyle(boxPosition);

    } else { // For centered steps
      setHighlightStyle({
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        transform: 'translate(-50%, -50%)',
        boxShadow: 'none', // No highlight for centered box
        transition: 'all 0.3s ease-in-out',
      });
      setBoxStyle({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.3s ease-in-out',
      });
    }

  }, [currentStep]);


  if (!currentStep) {
    return null;
  }

  return (
    <div id="tutorial-overlay-backdrop">
        <div 
          className="tutorial-highlight" 
          style={highlightStyle}
        />
        <div id="tutorial-box" style={boxStyle} className="animate-fadeInScaleUp">
          <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-2">{currentStep.title}</h3>
          <p className="text-stone-700 dark:text-stone-200 mb-4">{currentStep.text}</p>
          <div className="flex justify-between items-center">
            <button onClick={onSkip} className="text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:underline">
                Bỏ qua
            </button>
            <button 
              onClick={onNext} 
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
            >
                Tiếp theo &rarr;
            </button>
          </div>
        </div>
    </div>
  );
};

export default TutorialOverlay;
