import React, { useEffect } from 'react';

import { ARMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';

interface ArScreenComponentProps {
  missionData: ARMissionData;
  onReturnAndClaimReward: () => void;
  onMarkerActuallyFound: (reward: Reward) => void;
  arRewardMessage: string | null;
}

const ArScreenComponent: React.FC<ArScreenComponentProps> = ({ 
  missionData, 
  onReturnAndClaimReward,
  onMarkerActuallyFound,
  arRewardMessage
}) => {

  useEffect(() => {
    const sceneEl = document.querySelector('a-scene');
    if (!sceneEl) return;

    let markerFoundOnce = false;
    const markerFoundHandler = () => {
      if (!markerFoundOnce) {
        onMarkerActuallyFound(missionData.reward);
        markerFoundOnce = true;
      }
    };
    
    const attachMarkerListener = () => {
        const markerEl = sceneEl.querySelector('a-marker');
        if (markerEl) {
            markerEl.addEventListener('markerfound', markerFoundHandler);
        }
    };

    if ((sceneEl as any).hasLoaded) {
      attachMarkerListener();
    } else {
      sceneEl.addEventListener('loaded', attachMarkerListener, { once: true });
    }

    return () => {
      const markerEl = sceneEl.querySelector('a-marker');
      markerEl?.removeEventListener('markerfound', markerFoundHandler);
      sceneEl.removeEventListener('loaded', attachMarkerListener);
    };
  }, [missionData.reward, missionData.markerPatternUrl, onMarkerActuallyFound]);


  const handleBackButtonClick = () => {
    playSound('sfx_click');
    onReturnAndClaimReward();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const rootDiv = document.getElementById('root');
    if (rootDiv) {
        rootDiv.style.padding = '0';
    }

    return () => {
      document.body.style.overflow = '';
      if (rootDiv) {
        rootDiv.style.padding = '';
      }
    };
  }, []);


  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, margin: 0, padding: 0, overflow: 'hidden' }}>
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="logarithmicDepthBuffer: true; antialias: true; colorManagement: true;"
        vr-mode-ui="enabled: false"
        gesture-detector="true"
        id="arScene"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <a-assets timeout="20000"> {/* Increased timeout */}
            <a-asset-item id="arModel" src={missionData.modelUrl} response-type="arraybuffer"></a-asset-item>
        </a-assets>

        {/* Ensure marker URL is correct and accessible */}
        <a-marker type="pattern" url={missionData.markerPatternUrl}>
          <a-entity
            gltf-model="#arModel"
            scale="0.1 0.1 0.1" 
            position="0 0.05 0"    
            rotation="-90 0 0"   
            animation__rotate="property: rotation; to: -90 360 0; loop: true; dur: 10000; easing: linear; startEvents: model-loaded" 
            gesture-handler="true" 
          >
          </a-entity>
        </a-marker>
        <a-camera></a-camera>
      </a-scene>
      
      {arRewardMessage && (
        <div 
            id="ar-reward-notification"
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white p-3 rounded-md shadow-lg text-center z-[10003] transition-opacity duration-500 ease-in-out"
            style={{ animation: 'fadeInOut 3s forwards' }}
        >
          {arRewardMessage}
        </div>
      )}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
          }
        `}
      </style>

      <button 
        id="ar-back-button"
        onClick={handleBackButtonClick}
      >
        Quay về Bảo tàng &amp; Nhận Thưởng
      </button>
    </div>
  );
};

export default ArScreenComponent;