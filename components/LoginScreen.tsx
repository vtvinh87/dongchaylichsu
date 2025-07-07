import React, { useState } from 'react';
import { LOGO_FULL_URL, AVATAR_BASE_MALE_URL, AVATAR_BASE_FEMALE_URL } from '../imageUrls';

type Gender = 'male' | 'female';

interface LoginScreenProps {
  onLogin: (name: string, gender: Gender) => void;
  appName: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, appName }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [isAdminDetected, setIsAdminDetected] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // Check for admin name case-insensitively
    if (newName.toLowerCase() === 'admin') {
      setIsAdminDetected(true);
    } else {
      setIsAdminDetected(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim(), gender);
    } else {
      alert("Vui lòng nhập tên Nhà Sử Học Nhí!");
    }
  };

  return (
    <div className="login-screen screen-container bg-amber-100 dark:bg-stone-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all duration-500 hover:scale-105">
      <img src={LOGO_FULL_URL} alt={`${appName} Logo`} className="app-logo mx-auto" />
      
      {/* Gender Selection */}
      <div className="my-6">
        <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-3">Chọn nhân vật của bạn</label>
        <div className="flex justify-center gap-8">
          <div
            className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${gender === 'male' ? 'bg-amber-400 ring-4 ring-amber-500' : 'bg-transparent hover:bg-amber-200'}`}
            onClick={() => setGender('male')}
          >
            <img src={AVATAR_BASE_MALE_URL} alt="Nhân vật nam" className="w-24 h-24 object-contain rounded-full" />
          </div>
          <div
            className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${gender === 'female' ? 'bg-amber-400 ring-4 ring-amber-500' : 'bg-transparent hover:bg-amber-200'}`}
            onClick={() => setGender('female')}
          >
            <img src={AVATAR_BASE_FEMALE_URL} alt="Nhân vật nữ" className="w-24 h-24 object-contain rounded-full" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Tên Nhà Sử Học Nhí"
          className="w-full px-4 py-3 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 border-2 border-amber-400 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-400 focus:border-amber-600 dark:focus:border-amber-400 outline-none transition-colors duration-300"
          aria-label="Tên Nhà Sử Học Nhí"
        />
        {isAdminDetected && <p className="text-green-600 dark:text-green-400 font-bold -mt-2">Chế độ Quản trị viên sẽ được kích hoạt.</p>}
        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-opacity-50"
        >
          Bắt đầu Phiêu lưu!
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
