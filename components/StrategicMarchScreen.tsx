import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StrategicMarchMissionData, StrategicMarchEvent, StrategicMarchEventChoice, Reward } from '../types';
import { playSound } from '../utils/audio';

interface StrategicMarchScreenProps {
  missionData: StrategicMarchMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward?: Reward, data?: {manpower: number, morale: number}) => void;
  onFail?: () => void;
}

const StrategicMarchScreen: React.FC<StrategicMarchScreenProps> = ({ missionData, onReturnToMuseum, onComplete, onFail }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resources, setResources] = useState({
    time: missionData.initialTime,
    morale: missionData.initialMorale,
    manpower: missionData.initialManpower,
  });
  const [activeEvent, setActiveEvent] = useState<StrategicMarchEvent | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);

  const armyPosition = useMemo(() => {
    return missionData.path[currentStep] || missionData.path[0];
  }, [currentStep, missionData.path]);

  const checkForEvent = useCallback((step: number) => {
    const event = missionData.events.find(e => e.triggerAtStep === step);
    if (event) {
      setActiveEvent(event);
      playSound('sfx_unlock');
    }
  }, [missionData.events]);

  // Initialize game
  useEffect(() => {
    setCurrentStep(0);
    setResources({
      time: missionData.initialTime,
      morale: missionData.initialMorale,
      manpower: missionData.initialManpower,
    });
    setIsGameOver(false);
    setGameResult(null);
    setIsAnimating(false);
    setActiveEvent(null);
    // Check for event at the starting point
    checkForEvent(0);
  }, [missionData, checkForEvent]);

  // Check for loss condition
  useEffect(() => {
    if (resources.time <= 0 && !isGameOver) {
      setIsGameOver(true);
      setGameResult('loss');
      if (onFail) onFail();
      playSound('sfx_fail');
    }
  }, [resources.time, isGameOver, onFail]);

  const advancePath = useCallback(() => {
    if (currentStep >= missionData.path.length - 1) {
        setIsGameOver(true);
        setGameResult('win');
        if(onComplete) onComplete(missionData.reward, { manpower: resources.manpower, morale: resources.morale });
        playSound('sfx_unlock');
        return;
    }

    setIsAnimating(true);
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    setTimeout(() => {
        setIsAnimating(false);
        checkForEvent(nextStep);
    }, 500); // Animation duration
  }, [currentStep, missionData.path.length, checkForEvent, onComplete, missionData.reward, resources]);


  const handleChoice = (choice: StrategicMarchEventChoice) => {
    if (isAnimating) return;
    playSound('sfx_click');
    setResources(prev => ({
      time: Math.max(0, prev.time + choice.effects.time),
      morale: Math.max(0, prev.morale + choice.effects.morale),
      manpower: Math.max(0, prev.manpower + choice.effects.manpower),
    }));
    setActiveEvent(null);
    
    setTimeout(() => advancePath(), 300); // Give a small delay after modal closes
  };
  
  const handleContinueMarch = () => {
    if (isAnimating || activeEvent) return;
    playSound('sfx_click');
    setResources(prev => ({ ...prev, time: prev.time - 2 })); // Base cost for moving
    advancePath();
  }

  const renderOutcomeOverlay = () => {
    if (!isGameOver) return null;
    const isWin = gameResult === 'win';
    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp">
            <h2 className={`text-5xl font-bold mb-4 ${isWin ? 'text-green-400' : 'text-red-500'}`}>{isWin ? 'Chiến Dịch Thành Công!' : 'Nhiệm vụ Thất bại!'}</h2>
            <p className="text-xl mb-6">{isWin ? 'Bạn đã dẫn dắt quân đội đến Thăng Long!' : 'Hết thời gian! Cuộc hành quân đã không thành công.'}</p>
            <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 font-bold py-2 px-6 rounded-lg shadow-lg">Quay về</button>
        </div>
    );
  }

  return (
    <div className="screen-container w-full max-w-5xl p-4 bg-stone-800 rounded-lg shadow-xl flex flex-col items-center">
        <h2 className="text-3xl font-bold text-amber-300 font-serif mb-4">{missionData.title}</h2>
        
        <div className="w-full flex flex-col md:flex-row gap-4 flex-grow">
            <div 
                id="march-map" 
                className="flex-grow h-96 md:h-auto bg-cover bg-center rounded-lg relative border-4 border-amber-800"
                style={{backgroundImage: `url(${missionData.mapImageUrl})`}}
            >
                {renderOutcomeOverlay()}
                <img 
                    id="army-icon"
                    src={missionData.armyIconUrl}
                    alt="Đội quân"
                    className="absolute w-12 h-12 transition-all duration-500 ease-in-out"
                    style={{
                        top: `calc(${armyPosition.y}% - 24px)`,
                        left: `calc(${armyPosition.x}% - 24px)`,
                    }}
                />
            </div>
            
            <div id="march-hud-panel" className="w-full md:w-64 flex-shrink-0 bg-amber-900/50 p-4 rounded-lg flex flex-col gap-4">
                <h3 className="text-xl font-bold text-amber-300 text-center border-b border-amber-500 pb-2">Trạng thái</h3>
                <div className="text-lg text-amber-100 flex justify-between"><span>⏳ Thời Gian:</span> <span className="font-bold">{resources.time}</span></div>
                <div className="text-lg text-amber-100 flex justify-between"><span>🔥 Sĩ Khí:</span> <span className="font-bold">{resources.morale}</span></div>
                <div className="text-lg text-amber-100 flex justify-between"><span>👥 Binh Lực:</span> <span className="font-bold">{resources.manpower.toLocaleString()}</span></div>
                <div className="mt-auto">
                    {!activeEvent && !isGameOver && (
                        <button onClick={handleContinueMarch} disabled={isAnimating} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md disabled:opacity-50">
                            Tiếp tục Hành quân
                        </button>
                    )}
                </div>
                 <button onClick={onReturnToMuseum} className="w-full bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg shadow-md">Rời nhiệm vụ</button>
            </div>
        </div>

        {activeEvent && (
            <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-20 p-4">
                <div className="bg-amber-100 dark:bg-stone-800 p-6 rounded-lg shadow-xl max-w-lg w-full text-center animate-fadeInScaleUp">
                    <p className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-4">{activeEvent.prompt}</p>
                    <div className="flex flex-col gap-3">
                        {activeEvent.choices.map((choice, index) => (
                            <button key={index} onClick={() => handleChoice(choice)} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md">
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default StrategicMarchScreen;