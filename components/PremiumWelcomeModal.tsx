import React from 'react';
import { playSound } from '../utils/audio';

interface PremiumWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumFeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start text-left text-base sm:text-lg">
    <span className="text-yellow-400 mr-3 mt-1 text-xl">✨</span>
    <span>{children}</span>
  </li>
);


const PremiumWelcomeModal: React.FC<PremiumWelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const handleCloseAction = () => {
    playSound('sfx_click');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 flex justify-center items-center z-[1000] p-4 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-welcome-title"
    >
      <div 
        className="modal-content bg-gradient-to-br from-amber-50 to-amber-100 dark:from-stone-800 dark:to-stone-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg text-center relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fadeInScaleUp border-2 border-yellow-400 dark:border-yellow-500"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
        
        <div className="text-6xl mb-4">👑</div>
        <h2 id="premium-welcome-title" className="text-3xl font-bold text-amber-700 dark:text-amber-300 mb-4 font-serif">Chúc mừng Nhà Sử Học Premium!</h2>
        <p className="text-stone-600 dark:text-stone-300 mb-6">Bạn đã mở khóa những đặc quyền tuyệt vời nhất để bắt đầu một hành trình khám phá lịch sử không giới hạn!</p>
        
        <div className="bg-white/50 dark:bg-stone-700/50 p-4 rounded-lg my-6">
            <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-3">Các đặc quyền đã mở khóa:</h3>
            <ul className="space-y-2 text-stone-700 dark:text-stone-200 inline-block mx-auto">
                <PremiumFeatureItem>Trò chuyện <strong>KHÔNG GIỚI HẠN</strong> với các nhân vật AI.</PremiumFeatureItem>
                <PremiumFeatureItem>Mở khóa các nhiệm vụ <strong>"Giả sử Lịch sử"</strong> độc quyền.</PremiumFeatureItem>
                <PremiumFeatureItem>Huy hiệu Premium & Vật phẩm trang trí đặc biệt.</PremiumFeatureItem>
                <PremiumFeatureItem>Truy cập sớm các nội dung mới trong tương lai!</PremiumFeatureItem>
            </ul>
        </div>

        <button
            onClick={handleCloseAction}
            className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white dark:text-stone-900 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400 dark:focus:ring-yellow-500 focus:ring-opacity-50"
        >
            Bắt đầu Khám Phá Ngay!
        </button>
      </div>
    </div>
  );
};

export default PremiumWelcomeModal;