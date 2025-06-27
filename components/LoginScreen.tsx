import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
  appName: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, appName }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    } else {
      alert("Vui lòng nhập tên Nhà Sử Học Nhí!");
    }
  };

  return (
    <div className="screen-container bg-amber-100 dark:bg-stone-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all duration-500 hover:scale-105">
      <h1 className="text-5xl font-bold text-amber-700 dark:text-amber-400 mb-8 font-serif">{appName}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên Nhà Sử Học Nhí"
          className="w-full px-4 py-3 bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 border-2 border-amber-400 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-400 focus:border-amber-600 dark:focus:border-amber-400 outline-none transition-colors duration-300"
          aria-label="Tên Nhà Sử Học Nhí"
        />
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