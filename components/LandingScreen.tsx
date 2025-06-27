import React, { useEffect } from 'react';
import { LANDING_PAGE_BACKGROUND_URL } from '../imageUrls';

interface LandingScreenProps {
  onStartAdventure: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStartAdventure }) => {
  useEffect(() => {
    // This effect can be used for any logic specific to when the landing screen is mounted.
    // For now, it's a good place to ensure the theme is correctly applied if needed, though
    // App.tsx handles the global theme.
  }, []);

  return (
    <div
      className="landing-screen"
      style={{ backgroundImage: `url('${LANDING_PAGE_BACKGROUND_URL}')` }}
    >
      <div className="landing-content">
        <h1 className="text-white">Dòng Chảy Lịch Sử</h1>
        <h2 className="text-amber-200">Cuộc Phiêu Lưu Khám Phá Lịch Sử Việt Nam!</h2>
        <button
          id="start-adventure-button"
          onClick={onStartAdventure}
        >
          Bắt đầu Khám phá
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
