

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
    setLeaderboardEntries(entries.sort((a, b) => b.score - a.score).slice(0, MAX_LEADERBOARD_ENTRIES));
  }, []);

  const handleReturnClick = () => {
    playSound('sfx_click');
    onReturnToMuseum();
  };

  const getTrophy = (index: number) => {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
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
                            : 'bg-white dark:bg-stone-700 border border-amber-200 dark:border-stone-600'}`}
            >
              <span className={`font-bold text-lg text-amber-600 dark:text-amber-400 w-12 text-center ${index < 3 ? 'text-2xl' : ''}`}>{getTrophy(index)}</span>
              <span className="flex-grow text-lg font-semibold text-stone-800 dark:text-stone-100">{entry.userName}</span>
              <span className="font-bold text-xl text-green-600 dark:text-green-400">{entry.score.toLocaleString()} điểm</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-stone-600 dark:text-stone-400 italic text-lg bg-white/30 dark:bg-stone-700/30 p-6 rounded-md">
          Chưa có ai trên bảng xếp hạng. Hãy là người đầu tiên!
        </p>
      )}
    </div>
  );
};

export default LeaderboardScreen;