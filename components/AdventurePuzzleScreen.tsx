import React, { useState, useEffect, useMemo } from 'react';
import { AdventurePuzzleMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

// Helper function to normalize strings for comparison
const normalizeString = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");
};


const AdventurePuzzleScreen: React.FC<{
    missionData: AdventurePuzzleMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
    onFail?: () => void;
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
    const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const currentRiddle = missionData.riddles[currentRiddleIndex];

    const rewardImageUrl = useMemo(() => {
        if (missionData.reward.type === 'artifact') {
            const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
            return artifact ? artifact.imageUrl : '';
        }
        return '';
    }, [missionData.reward]);

    useEffect(() => {
        // Reset state on new mission
        setCurrentRiddleIndex(0);
        setInputValue('');
        setFeedback(null);
        setIsComplete(false);
    }, [missionData]);
    
    const handleSubmit = () => {
        if (!inputValue.trim()) return;

        const userAnswer = normalizeString(inputValue);
        const correctAnswer = normalizeString(currentRiddle.correctAnswer);

        if (userAnswer === correctAnswer) {
            playSound('sfx_success');
            setFeedback(null);
            setInputValue('');

            if (currentRiddleIndex < missionData.riddles.length - 1) {
                setCurrentRiddleIndex(prev => prev + 1);
            } else {
                setIsComplete(true);
                playSound('sfx_unlock');
                setTimeout(() => {
                    onComplete(missionData.reward);
                }, 2000);
            }
        } else {
            playSound('sfx_fail');
            setFeedback(currentRiddle.hint || 'Câu trả lời không đúng. Hãy thử lại!');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div id="adventure-puzzle-screen" className="screen-container">
            <button
                onClick={onReturnToMuseum}
                className="absolute top-4 left-4 bg-amber-800 hover:bg-amber-900 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10"
            >
                Quay về
            </button>
            
            <div className="adventure-puzzle-content">
                <h2 className="text-3xl font-bold font-serif mb-4">{missionData.title}</h2>
                
                {isComplete ? (
                    <div className="text-center animate-fadeInScaleUp">
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">Hành trình thành công!</h3>
                        <p className="text-lg">Bạn đã tìm ra con đường an toàn. Chúc may mắn trên hành trình mới!</p>
                        {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-4 mx-auto" />}
                    </div>
                ) : (
                    <>
                        <div id="riddle-display" className="mb-6">
                            <p className="whitespace-pre-wrap">{currentRiddle.riddleText}</p>
                        </div>

                        <div id="answer-input-area">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập câu trả lời của bạn..."
                            />
                            <button onClick={handleSubmit}>Trả lời</button>
                        </div>

                        {feedback && (
                            <div className="feedback-display mt-4">
                                <p>{feedback}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdventurePuzzleScreen;
