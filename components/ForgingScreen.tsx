import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ForgingMissionData, Reward } from '../types';
import { ALL_FRAGMENTS_MAP } from '../constants';
import { playSound } from '../utils/audio';
import { FORGE_ANVIL_BG_URL, FORGE_SPARKS_GIF_URL } from '../imageUrls';

interface ForgingScreenProps {
  missionData: ForgingMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const ForgingScreen: React.FC<ForgingScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const [hitMarkerClass, setHitMarkerClass] = useState('hit-marker');

  const hitMarkerRef = useRef<HTMLDivElement>(null);
  const forceBarRef = useRef<HTMLDivElement>(null);
  const rewardImageUrl = useRef('');

  useEffect(() => {
    setProgress(0);
    setIsComplete(false);
    setShowSparks(false);
    setHitMarkerClass('hit-marker');

    if (missionData.reward.type === 'fragment') {
      const fragment = ALL_FRAGMENTS_MAP[missionData.reward.id];
      if (fragment) rewardImageUrl.current = fragment.imageUrl;
    }
  }, [missionData]);

  const handleForgeAttempt = useCallback(() => {
    if (isComplete || !hitMarkerRef.current || !forceBarRef.current) return;

    // Pause the animation
    hitMarkerRef.current.style.animationPlayState = 'paused';

    const markerRect = hitMarkerRef.current.getBoundingClientRect();
    const barRect = forceBarRef.current.getBoundingClientRect();
    
    // Calculate position as a percentage of the bar's width
    const markerCenter = markerRect.left + markerRect.width / 2;
    const positionPercent = ((markerCenter - barRect.left) / barRect.width) * 100;

    let progressIncrease = 0;
    if (positionPercent >= 45 && positionPercent <= 55) { // Perfect zone (45% to 55%)
      progressIncrease = 20;
      playSound('sfx-success');
    } else if (positionPercent >= 25 && positionPercent <= 75) { // Good zone (25% to 75%)
      progressIncrease = 10;
      playSound('sfx-click');
    } else { // Miss
      progressIncrease = -5;
    }
    
    // Trigger sparks effect
    setShowSparks(true);
    setTimeout(() => setShowSparks(false), 300);

    setProgress(prev => Math.max(0, prev + progressIncrease));

    // Resume animation after a short delay
    setTimeout(() => {
        if (hitMarkerRef.current) {
            hitMarkerRef.current.style.animationPlayState = 'running';
        }
    }, 100);

  }, [isComplete]);

  useEffect(() => {
      if (progress >= missionData.targetProgress) {
          setIsComplete(true);
          playSound('sfx-unlock');
          setTimeout(() => {
              onComplete(missionData.reward);
          }, 2000);
      }
  }, [progress, missionData, onComplete]);


  // Add keyboard support for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleForgeAttempt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleForgeAttempt]);

  return (
    <div 
        className="screen-container w-full max-w-2xl p-6 rounded-lg shadow-xl text-center flex flex-col items-center justify-center cursor-pointer"
        onClick={handleForgeAttempt}
        style={{
            backgroundImage: `url(${FORGE_ANVIL_BG_URL})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#1f2937' // dark background
        }}
    >
        {isComplete && (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp p-4">
                <h3 className="text-4xl font-bold text-green-400">Vũ khí hoàn thành!</h3>
                <p className="text-xl mt-2">Bạn đã rèn thành công một vũ khí sắc bén.</p>
                {rewardImageUrl.current && <img src={rewardImageUrl.current} alt="Phần thưởng" className="w-32 h-32 object-contain my-4" />}
            </div>
        )}

      <button
        onClick={(e) => { e.stopPropagation(); onReturnToMuseum(); }}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10"
      >
        Quay về Bảo tàng
      </button>

      <div className="w-full max-w-md mx-auto mt-auto mb-8 bg-black/50 p-6 rounded-xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-amber-300 mb-4 font-serif">{missionData.title}</h2>
        <p className="text-amber-100 mb-6">Nhấn chuột hoặc phím cách để đập búa!</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-6 mb-4 border border-gray-900">
            <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-300" 
                style={{ width: `${(progress / missionData.targetProgress) * 100}%` }}
            ></div>
        </div>

        {/* Force Bar */}
        <div ref={forceBarRef} className="force-bar-container mb-4">
          <div className="force-bar-zone force-bar-good-zone"></div>
          <div className="force-bar-zone force-bar-perfect-zone"></div>
          <div ref={hitMarkerRef} className={hitMarkerClass}></div>
        </div>
      </div>
       <img 
            src={FORGE_SPARKS_GIF_URL}
            alt="sparks"
            className={`sparks-effect ${showSparks ? 'show' : ''}`}
        />
    </div>
  );
};

export default ForgingScreen;
