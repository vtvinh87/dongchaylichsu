import React from 'react';
import { playSound } from '../utils/audio';

interface PremiumScreenProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-center text-base sm:text-lg">
    <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
    <span>{children}</span>
  </li>
);

const PremiumPlan: React.FC<{ title: string; price: string; description: string; onSelect: () => void; isPopular?: boolean; }> = ({ title, price, description, onSelect, isPopular }) => {
  const handleSelect = () => {
    playSound('sfx_click');
    onSelect();
  };

  return (
    <div className={`relative border-2 rounded-xl p-6 text-center transition-all duration-300 ${isPopular ? 'border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-stone-700/50 scale-105' : 'border-amber-300 dark:border-stone-600 bg-white dark:bg-stone-700 hover:border-amber-400'}`}>
      {isPopular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-yellow-500 dark:bg-yellow-400 text-white dark:text-stone-900 text-xs font-bold px-3 py-1 rounded-full">PHỔ BIẾN NHẤT</div>}
      <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-400">{title}</h3>
      <p className="text-stone-500 dark:text-stone-400 mt-1">{description}</p>
      <div className="text-4xl font-extrabold text-stone-800 dark:text-stone-100 my-4">{price}</div>
      <button 
        onClick={handleSelect}
        className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-opacity-50"
      >
        Chọn gói này
      </button>
    </div>
  );
};


const PremiumScreen: React.FC<PremiumScreenProps> = ({ onClose, onUpgrade }) => {
  const handleCloseClick = () => {
    playSound('sfx_click');
    onClose();
  };

  return (
    <div className="screen-container w-full max-w-4xl p-4 md:p-8 bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-lg shadow-2xl flex flex-col items-center relative animate-fadeInScaleUp">
        <button
            onClick={handleCloseClick}
            className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 text-4xl font-bold leading-none z-10"
            aria-label="Đóng"
        >
            &times;
        </button>

        <header className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-700 dark:text-amber-400 mb-2 font-serif">
                <span role="img" aria-label="star" className="mr-3">⭐</span>
                Trở thành Nhà Sử Học Premium
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 max-w-2xl">Mở khóa toàn bộ tiềm năng của Dòng Chảy Lịch Sử và nhận những đặc quyền độc nhất!</p>
        </header>

        <div className="w-full grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white/50 dark:bg-stone-700/50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mb-4">Đặc quyền Premium:</h3>
                <ul className="space-y-3 text-stone-700 dark:text-stone-200">
                    <PremiumFeature>Trò chuyện <span className="font-bold">KHÔNG GIỚI HẠN</span> với các Nhân vật AI</PremiumFeature>
                    <PremiumFeature>Mở khóa các nhiệm vụ <span className="font-bold">"Giả sử Lịch sử"</span> đặc biệt</PremiumFeature>
                    <PremiumFeature>Huy hiệu Premium độc quyền trên Bảng Xếp Hạng</PremiumFeature>
                    <PremiumFeature>Truy cập sớm các Saga và Cổ vật mới</PremiumFeature>
                    <PremiumFeature>Trải nghiệm không quảng cáo (trong tương lai)</PremiumFeature>
                </ul>
            </div>

            <div className="space-y-6">
                <PremiumPlan 
                    title="Gói Năm"
                    price="299.000đ"
                    description="Tiết kiệm hơn 40%!"
                    onSelect={onUpgrade}
                    isPopular={true}
                />
                <PremiumPlan 
                    title="Gói Tháng"
                    price="49.000đ"
                    description="Trải nghiệm linh hoạt"
                    onSelect={onUpgrade}
                />
            </div>
        </div>
        
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-8 text-center">
            Đây là giao dịch giả lập cho mục đích trình diễn. Nhấn "Chọn gói này" sẽ nâng cấp tài khoản của bạn lên Premium ngay lập tức mà không cần thanh toán.
        </p>

    </div>
  );
};

export default PremiumScreen;