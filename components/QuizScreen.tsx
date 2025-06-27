

import React, { useState, useEffect } from 'react';
import { QuizMissionData, Reward } from '../types';
import { ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface QuizScreenProps {
  missionData: QuizMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ missionData, onReturnToMuseum, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [rewardImageUrl, setRewardImageUrl] = useState('');

  useEffect(() => {
    // Reset state when mission data changes
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizOver(false);

    let url = '';
    if (missionData.reward.type === 'artifact') {
        url = ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
    } else if (missionData.reward.type === 'fragment') {
        url = ALL_FRAGMENTS_MAP[missionData.reward.id]?.imageUrl || '';
    }
    setRewardImageUrl(url);

  }, [missionData]);

  const currentQuestion = missionData.questions[currentQuestionIndex];
  const totalQuestions = missionData.questions.length;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      playSound('sfx-success');
      setScore(prev => prev + 1);
    } else {
      // playSound('sfx-error'); // Optional: Add an error sound
    }
  };

  const handleNextQuestion = () => {
    playSound('sfx-click');
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizOver(true);
      setTimeout(() => onComplete(missionData.reward), 1500);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-amber-200 hover:bg-amber-300 dark:bg-stone-600 dark:hover:bg-stone-500 border-amber-500 dark:border-amber-600 text-amber-800 dark:text-amber-200';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-500 dark:bg-green-600 border-green-700 dark:border-green-500 text-white transform scale-105';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'bg-red-500 dark:bg-red-600 border-red-700 dark:border-red-500 text-white';
    }
    return 'bg-stone-200 dark:bg-stone-700 border-stone-400 dark:border-stone-500 text-stone-500 dark:text-stone-400 opacity-60';
  };

  if (isQuizOver) {
    return (
        <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl text-center flex flex-col items-center justify-center animate-fadeInScaleUp">
            <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">Hoàn thành!</h2>
            <p className="text-xl text-stone-700 dark:text-stone-200 mb-4">
                Bạn đã trả lời đúng {score} trên {totalQuestions} câu hỏi.
            </p>
            {rewardImageUrl && (
                <img 
                    src={rewardImageUrl} 
                    alt="Phần thưởng" 
                    className="w-40 h-40 object-contain mx-auto my-4 rounded-lg"
                />
            )}
            <p className="text-lg text-green-700 dark:text-green-300 font-semibold">
                Đang nhận phần thưởng...
            </p>
        </div>
    );
  }

  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl text-center">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-2 font-serif">{missionData.title}</h2>
      <p className="text-md text-stone-600 dark:text-stone-400 mb-6">Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}</p>
      
      <div id="question-container" className="bg-white dark:bg-stone-700 p-6 rounded-lg shadow-inner min-h-[120px] flex items-center justify-center mb-6">
        <p id="question-text" className="text-lg md:text-xl font-semibold text-stone-800 dark:text-stone-100">
            {currentQuestion.question}
        </p>
      </div>

      <div id="answer-options" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-lg shadow-sm border-2 font-semibold transition-all duration-300 
                        ${getButtonClass(option)}
                        disabled:cursor-not-allowed`}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div id="feedback-container" className="mt-4 animate-fadeInScaleUp">
           <button
            onClick={handleNextQuestion}
            className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "Câu tiếp theo" : "Hoàn thành"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;