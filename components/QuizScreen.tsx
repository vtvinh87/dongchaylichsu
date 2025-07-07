

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QuizMissionData, Reward, QuizQuestion } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';
import { GoogleGenAI } from '@google/genai';


// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface QuizScreenProps {
  missionData: QuizMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
  onFail: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ missionData, onReturnToMuseum, onComplete, onFail }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [isQuizOver, setIsQuizOver] = useState(false);
  
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintText, setHintText] = useState('');
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [hintUsedForQuestion, setHintUsedForQuestion] = useState(false);

  const rewardImageUrl = useMemo(() => {
    if (missionData.reward.type === 'artifact') {
        const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
        return artifact ? artifact.imageUrl : '';
    }
    return '';
  }, [missionData.reward]);

  const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
    const prompt = `Tạo một bài trắc nghiệm lịch sử Việt Nam gồm 5 câu hỏi. Mỗi câu hỏi phải có 4 lựa chọn và 1 đáp án đúng. Yêu cầu đầu ra PHẢI là một đối tượng JSON hợp lệ duy nhất, không có bất kỳ văn bản nào khác hoặc markdown code fences (như \`\`\`json). JSON phải tuân thủ nghiêm ngặt định dạng sau: { "questions": [ { "question": "Nội dung câu hỏi...", "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"], "correctAnswer": "Lựa chọn đúng" } ] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: { responseMimeType: "application/json" },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    // Attempt to fix a specific AI-generated JSON error where a word is inserted
    // instead of a closing brace and comma. E.g., "... \", hatchery {"
    // This regex finds a closing quote, whitespace, a word, and an opening brace,
    // and replaces it with the correct "},{".
    jsonStr = jsonStr.replace(/"\s+[a-zA-Z_]+\s+\{/g, '"}, {');
    
    try {
      const data = JSON.parse(jsonStr);
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error("Dữ liệu nhận về từ AI không chứa mảng 'questions' hợp lệ.");
      }
      return data.questions as QuizQuestion[];
    } catch (e: any) {
        console.error("Lỗi khi phân tích JSON từ AI:", e.message);
        console.error("Chuỗi JSON nhận được:", jsonStr);
        throw new Error("Không thể phân tích dữ liệu câu hỏi từ AI.");
    }
  };


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setQuestions([]);

    fetchQuizQuestions()
      .then(fetchedQuestions => {
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
        } else {
          throw new Error("Dữ liệu câu hỏi nhận được rỗng.");
        }
      })
      .catch(e => {
        console.error("Lỗi khi xử lý câu hỏi đã tải trước:", e);
        setError("Rất tiếc, không thể tải câu hỏi vào lúc này. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [missionData.id]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setShuffledOptions(shuffleArray(currentQuestion.options));
      setHintUsedForQuestion(false);
    }
  }, [questions, currentQuestionIndex]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      playSound('sfx_success');
      setScore(prev => prev + 1);
    } else {
      playSound('sfx_fail');
      setLives(prev => prev - 1);
    }
  };
  
  const endQuiz = useCallback((isWin: boolean, finalScore: number) => {
    setIsQuizOver(true);
    if(isWin) {
        setTimeout(() => onComplete(missionData.reward), 2000);
    } else {
        onFail();
    }
  }, [missionData.reward, onComplete, onFail]);

  const handleNextQuestion = useCallback(() => {
    playSound('sfx_click');
    
    const wasCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    const livesAfterAnswer = wasCorrect ? lives : lives - 1;

    if (livesAfterAnswer < 0) {
        endQuiz(false, score);
        return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
    } else {
        endQuiz(score >= 3, score); // Win if score is 3 or more.
    }
  }, [currentQuestionIndex, lives, questions.length, score, selectedAnswer, endQuiz]);

  const handleUseHint = async () => {
    if (hintUsedForQuestion || isAnswered || isHintLoading) {
        return;
    }
    playSound('sfx_click');
    setIsHintLoading(true);
    setHintText('');
    setIsHintModalOpen(true);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const questionText = questions[currentQuestionIndex].question;
        const prompt = `Cung cấp một gợi ý ngắn gọn, hữu ích, nhưng không tiết lộ trực tiếp câu trả lời cho câu hỏi lịch sử sau: "${questionText}". Viết bằng tiếng Việt.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
        });

        setHintText(response.text);
        setHintUsedForQuestion(true);
    } catch (e) {
        setHintText("Rất tiếc, không thể lấy gợi ý lúc này. Vui lòng thử lại sau.");
        console.error("Hint API error:", e);
    } finally {
        setIsHintLoading(false);
    }
  };
  

  // Check for game over condition after lives change
  useEffect(() => {
    if(lives < 0) {
        endQuiz(false, score);
    }
  }, [lives, score, endQuiz]);

  const getButtonClass = (option: string) => {
    if (!isAnswered) return 'base';
    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    const isSelected = option === selectedAnswer;
    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    return 'disabled';
  };

  if (isLoading) {
    return (
      <div className="frosted-glass-container max-w-3xl">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-xl text-amber-800 dark:text-amber-300">Đang soạn câu hỏi từ dòng chảy lịch sử...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="frosted-glass-container max-w-3xl">
            <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button onClick={onReturnToMuseum} className="mt-4 bg-amber-600 hover:bg-amber-700 text-white dark:text-stone-900 font-semibold py-2 px-6 rounded-lg shadow-md">Quay về Bảo tàng</button>
        </div>
    );
  }

  if (isQuizOver) {
    const isWin = score >= 3 && lives >= 0;
    return (
        <div className="frosted-glass-container max-w-3xl animate-fadeInScaleUp">
            <h2 className={`text-4xl font-bold font-serif mb-4 ${isWin ? 'text-green-600' : 'text-red-600'}`}>{isWin ? "Chiến Thắng!" : "Cần Cố Gắng Hơn!"}</h2>
            <p className="text-xl text-stone-700 dark:text-stone-200 mb-4">
                Bạn đã trả lời đúng {score} / {questions.length} câu hỏi.
            </p>
            {isWin && rewardImageUrl && (
                <>
                    <img src={rewardImageUrl} alt="Phần thưởng" className="w-40 h-40 object-contain mx-auto my-4 rounded-lg" />
                    <p className="text-lg text-green-700 dark:text-green-300 font-semibold">Đang nhận phần thưởng...</p>
                </>
            )}
             {!isWin && (
                 <button onClick={onReturnToMuseum} className="mt-4 bg-amber-600 hover:bg-amber-700 text-white dark:text-stone-900 font-semibold py-2 px-6 rounded-lg shadow-md">Quay về</button>
             )}
        </div>
    );
  }
  
  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
    <div className="frosted-glass-container max-w-3xl">
      <button onClick={onReturnToMuseum} className="absolute top-4 left-4 bg-amber-600/50 hover:bg-amber-700/50 dark:bg-amber-800/50 dark:hover:bg-amber-700/50 text-white dark:text-stone-100 font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-300 z-10">
        Quay về
      </button>

      <div className="quiz-header">
         <div id="quiz-lives">{lives >= 0 ? "❤️".repeat(lives) : '💔'}</div>
         <h2 className="text-2xl md:text-3xl font-bold text-amber-800 dark:text-amber-300 font-serif text-center">{missionData.title}</h2>
         <div id="quiz-progress">Câu {currentQuestionIndex + 1}/{questions.length}</div>
      </div>
      
      <div className="quiz-question-box">
        <p id="question-text">
            {currentQuestion.question}
        </p>
      </div>
      
      <button id="hint-button" onClick={handleUseHint} disabled={hintUsedForQuestion || isAnswered || isHintLoading}>
        💡 Gợi ý
      </button>

      <div id="answer-options">
        {shuffledOptions.map((option, index) => (
          <button key={index} onClick={() => handleAnswerSelect(option)} disabled={isAnswered} className={`quiz-option ${getButtonClass(option)}`}>
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div id="feedback-container" className="mt-6 animate-fadeInScaleUp">
           <button onClick={handleNextQuestion} className="action-button">
            {currentQuestionIndex < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
          </button>
        </div>
      )}
    </div>
    
    {isHintModalOpen && (
        <div className="hint-modal-overlay animate-fadeInScaleUp" onClick={() => setIsHintModalOpen(false)}>
            <div className="hint-modal-content" onClick={e => e.stopPropagation()}>
                <h3>💡 Gợi ý cho bạn</h3>
                {isHintLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <p>{hintText}</p>
                )}
                <button className="action-button" onClick={() => setIsHintModalOpen(false)}>
                    Đã hiểu
                </button>
            </div>
        </div>
    )}
    </>
  );
};

export default QuizScreen;
