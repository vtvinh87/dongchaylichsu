
import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { LEADERBOARD_LOCAL_STORAGE_KEY, MAX_LEADERBOARD_ENTRIES } from '../constants';
import { playSound } from '../utils/audio';

interface LeaderboardScreenProps {
  currentUserName: string;
  onReturnToMuseum: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ currentUserName, onReturnToMuseum }) => {
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem(LEADERBOARD_LOCAL_STORAGE_KEY);
    let entries: LeaderboardEntry[] = [];
    if (savedLeaderboard) {
      try {
        entries = JSON.parse(savedLeaderboard);
        if (!Array.isArray(entries)) {
          entries = [];
        }
      } catch (error) {
        console.error("Error parsing leaderboard from localStorage:", error);
        entries = [];
      }
    }
    setLeaderboardEntries(entries.sort((a,b) => b.score - a.score).slice(0, MAX_LEADERBOARD_ENTRIES));
  }, []);

  const handleReturnClick = () => {
    playSound('sfx-click');
    onReturnToMuseum();
  };

  return (
    <div className="screen-container w-full max-w-2xl p-6 md:p-8 bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-lg shadow-xl flex flex-col items-center">
      <button
        onClick={handleReturnClick}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl md:text-4xl font-bold text-amber-700 dark:text-amber-400 mb-8 font-serif text-center">
        <span role="img" aria-label="trophy" className="mr-3 text-4xl">🏆</span>
        Bảng Xếp Hạng Nhà Sử Học
      </h2>

      {leaderboardEntries.length > 0 ? (
        <ol className="list-none p-0 w-full space-y-3">
          {leaderboardEntries.map((entry, index) => (
            <li
              key={`${entry.userName}-${index}`}
              className={`flex justify-between items-center p-3 md:p-4 rounded-lg shadow-sm transition-all duration-200
                          ${entry.userName === currentUserName 
                            ? 'bg-yellow-300 dark:bg-yellow-700 border-2 border-yellow-500 dark:border-yellow-400 scale-105' 
                            : 'bg-white dark:bg-stone-700 border border-amber-200 dark:border-stone-600 hover:bg-amber-50 dark:hover:bg-stone-600'}`}
            >
              <div className="flex items-center">
                <span 
                  className={`text-lg md:text-xl font-bold mr-3 md:mr-4 w-8 text-center rounded-full
                              ${index < 3 ? 'bg-yellow-400 dark:bg-yellow-500 text-white dark:text-stone-900' : 'bg-amber-200 dark:bg-stone-600 text-amber-700 dark:text-amber-300'}`}
                >
                  {index + 1}
                </span>
                <span className={`text-md md:text-lg font-medium ${entry.userName === currentUserName ? 'text-yellow-800 dark:text-yellow-100' : 'text-amber-700 dark:text-amber-300'}`}>
                  {entry.userName}
                </span>
              </div>
              <span className={`text-md md:text-lg font-bold ${entry.userName === currentUserName ? 'text-yellow-900 dark:text-yellow-50' : 'text-green-600 dark:text-green-400'}`}>
                {entry.score} điểm
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-stone-600 dark:text-stone-400 italic text-lg mt-6 bg-white/50 dark:bg-stone-700/50 p-6 rounded-md text-center">
          Chưa có ai trên bảng xếp hạng. Hãy là người đầu tiên ghi danh!
        </p>
      )}
    </div>
  );
};

export default LeaderboardScreen;