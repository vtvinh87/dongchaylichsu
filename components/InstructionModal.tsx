import React, { useState } from 'react';
import { INSTRUCTION_DATA } from '../constants';
import { playSound } from '../utils/audio';

interface InstructionModalProps {
  gameType: string;
  isOpen: boolean;
  onClose: (gameType: string, shouldRemember: boolean) => void;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ gameType, isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const instruction = INSTRUCTION_DATA[gameType];

  if (!isOpen || !instruction) {
    return null;
  }

  const handleCloseAction = () => {
    playSound('sfx-click');
    onClose(gameType, dontShowAgain);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex justify-center items-center z-[200] p-4 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instruction-modal-title"
    >
      <div
        className="modal-content bg-amber-50 dark:bg-stone-800 p-6 rounded-xl shadow-2xl w-full max-w-lg text-center relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fadeInScaleUp"
      >
        <h2 id="instruction-modal-title" className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">
          {instruction.title}
        </h2>
        
        <p id="instruction-text" className="text-stone-900 dark:text-stone-200 text-base text-left leading-relaxed mb-6">
          {instruction.text}
        </p>

        <div className="flex items-center justify-center mb-6">
          <input
            type="checkbox"
            id="dont-show-again"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="dont-show-again" className="ml-2 block text-sm text-stone-900 dark:text-stone-300">
            Không hiển thị lại hướng dẫn này
          </label>
        </div>

        <button
          onClick={handleCloseAction}
          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-8 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-opacity-50"
        >
          Đã hiểu!
        </button>
      </div>
    </div>
  );
};

export default InstructionModal;