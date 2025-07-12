import React from 'react';

// New image URLs for the enhanced landing page
const DESK_BG_URL = 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Background/B-ban-go.png';
const OPEN_BOOK_URL = 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Background/B-sach-mo.png';
const MAGNIFYING_GLASS_URL = 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-kinh-lup.png';
const LOGO_FULL_URL = 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Logo/Logo-full.png';


interface LandingScreenProps {
  onStartAdventure: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStartAdventure }) => {
  return (
    <div
      className="landing-screen"
      style={{ backgroundImage: `url('${DESK_BG_URL}')` }}
    >
      <div className="curators-desk">
        
        {/* The central open book */}
        <div className="open-book">
          <img src={OPEN_BOOK_URL} alt="Open Book" className="book-image" />
          <div className="book-content">
            <img src={LOGO_FULL_URL} alt="Dòng Chảy Lịch Sử Logo" className="logo-in-book" />
            <h1 className="game-title">Dòng Chảy Lịch Sử</h1>
            <p className="game-subtitle">Khám phá những câu chuyện ẩn giấu</p>
            
            <button
              className="start-button-container"
              onClick={onStartAdventure}
              aria-label="Bắt đầu Khám phá"
            >
              <img src={MAGNIFYING_GLASS_URL} alt="Khám phá" className="start-magnifier" />
              <span className="start-text">Bắt đầu Khám phá</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingScreen;