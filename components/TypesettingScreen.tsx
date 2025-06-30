import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TypesettingMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

// A type for the drag data
interface DragData {
  letter: string;
  sourceType: 'tray' | 'slot';
  sourceIndex: number; // index in tray or slot
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const TypesettingScreen: React.FC<{
    missionData: TypesettingMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
    
    const [trayLetters, setTrayLetters] = useState<string[]>([]);
    const [composedSlots, setComposedSlots] = useState<(string | null)[]>([]);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    const rewardImageUrl = useMemo(() => {
        if (missionData.reward.type === 'artifact') {
            const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
            return artifact ? artifact.imageUrl : '';
        }
        return '';
    }, [missionData.reward]);
    
    useEffect(() => {
        setTrayLetters(shuffleArray([...missionData.availableLetters]));
        setComposedSlots(Array(missionData.targetText.length).fill(null));
        setIsComplete(false);
        setFeedback(null);
    }, [missionData]);

    const handleDragStart = (e: React.DragEvent, data: DragData) => {
        e.dataTransfer.setData('application/json', JSON.stringify(data));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    
    const handleDrop = (e: React.DragEvent, dropTargetType: 'tray' | 'slot', dropTargetIndex: number) => {
        e.preventDefault();
        e.stopPropagation(); // Stop the event from bubbling to parent drop zones.
        try {
            const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
            const { letter, sourceType, sourceIndex } = data;

            const newTrayLetters = [...trayLetters];
            const newComposedSlots = [...composedSlots];
            
            if (sourceType === 'tray' && dropTargetType === 'slot') {
                if (newComposedSlots[dropTargetIndex] === null) {
                    newTrayLetters.splice(sourceIndex, 1);
                    newComposedSlots[dropTargetIndex] = letter;
                } else {
                    const letterInSlot = newComposedSlots[dropTargetIndex] as string;
                    newTrayLetters.splice(sourceIndex, 1, letterInSlot);
                    newComposedSlots[dropTargetIndex] = letter;
                }
            } else if (sourceType === 'slot' && dropTargetType === 'tray') {
                newComposedSlots[sourceIndex] = null;
                newTrayLetters.push(letter);
            } else if (sourceType === 'slot' && dropTargetType === 'slot') {
                const letterAtDropTarget = newComposedSlots[dropTargetIndex];
                newComposedSlots[dropTargetIndex] = letter;
                newComposedSlots[sourceIndex] = letterAtDropTarget;
            }
            
            setTrayLetters(newTrayLetters);
            setComposedSlots(newComposedSlots);
            setFeedback(null);
            
        } catch (error) {
            console.error("Drag and drop error:", error);
        }
    };
    
    const handleCheckComposition = () => {
        if (isComplete) return;
        
        const composedText = composedSlots.join('');
        const targetText = missionData.targetText;

        if (composedText === targetText) {
            playSound('sfx_unlock');
            setFeedback({ message: 'Chính xác! Bản in hoàn hảo!', type: 'success'});
            setIsComplete(true);
            setTimeout(() => onComplete(missionData.reward), 2000);
        } else {
            playSound('sfx_fail');
            setFeedback({ message: 'Sắp chữ sai rồi! Hãy kiểm tra lại.', type: 'error'});
        }
    };

    return (
        <div id="typesetting-screen" className="screen-container w-full max-w-4xl p-6 rounded-lg shadow-xl flex flex-col items-center">
            <button
                onClick={onReturnToMuseum}
                className="absolute top-4 left-4 bg-stone-700 hover:bg-stone-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10"
            >
                Quay về Bảo tàng
            </button>

            <h2 className="text-3xl font-bold mb-4">{missionData.title}</h2>
            
            <div className="w-full bg-white/10 p-4 rounded-lg shadow-inner mb-4">
                <h3 className="text-lg font-semibold mb-2 text-center">Tít báo mẫu:</h3>
                <div id="text-template">
                    {missionData.targetText}
                </div>
            </div>
            
            <div 
                id="composition-area"
                className="w-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'tray', -1)} 
            >
                {composedSlots.map((letter, index) => (
                    <div 
                        key={index}
                        className="composition-slot"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'slot', index)}
                    >
                        {letter && (
                            <div 
                                className="letter-block"
                                draggable
                                onDragStart={(e) => handleDragStart(e, { letter, sourceType: 'slot', sourceIndex: index})}
                            >
                                {letter}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div id="letter-tray" className="w-full mt-6" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'tray', -1)}>
                {trayLetters.map((letter, index) => (
                    <div 
                        key={`${letter}-${index}`}
                        className="letter-block"
                        draggable
                        onDragStart={(e) => handleDragStart(e, { letter, sourceType: 'tray', sourceIndex: index})}
                    >
                        {letter}
                    </div>
                ))}
                {trayLetters.length === 0 && <p className="text-black/50 italic">Khay chữ trống.</p>}
            </div>
            
            <div className="mt-6 text-center">
                <button
                    onClick={handleCheckComposition}
                    disabled={isComplete}
                    className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-8 text-lg rounded-lg shadow-xl transition-all disabled:opacity-50"
                >
                    Tiến hành In
                </button>
                {feedback && (
                    <p className={`mt-4 text-lg font-semibold animate-fadeInScaleUp ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback.message}
                    </p>
                )}
                {isComplete && (
                    <div className="mt-4 flex flex-col items-center animate-fadeInScaleUp">
                        {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-2 rounded-lg" />}
                        <p className="text-green-600">Đang nhận phần thưởng...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TypesettingScreen;