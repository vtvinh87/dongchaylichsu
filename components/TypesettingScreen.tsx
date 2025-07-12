import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TypesettingMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

// A piece of type with a unique ID
interface LetterPiece {
  id: string; // Unique ID, e.g., 'A-1'
  letter: string;
}

// Data transferred during drag
interface DragData {
  piece: LetterPiece;
  sourceType: 'tray' | 'slot';
  sourceSlotIndex?: number; // Index if coming from a slot
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
    onFail?: () => void;
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
    
    // De-duplicated and unique-ID'd list of available letters for the tray
    const [trayPieces, setTrayPieces] = useState<LetterPiece[]>([]);

    // An array representing the placed letters in the composition slots.
    // The index of the array corresponds to the non-space character index.
    const [slottedPieces, setSlottedPieces] = useState<(LetterPiece | null)[]>([]);

    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    
    // Memoize the target characters (without spaces) and the total number of slots needed.
    const { targetChars, totalSlots } = useMemo(() => {
        const chars = missionData.targetText.split('').filter(c => c !== ' ');
        return { targetChars: chars, totalSlots: chars.length };
    }, [missionData.targetText]);

    const rewardImageUrl = useMemo(() => {
        if (missionData.reward.type === 'artifact') {
            return ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
        }
        return '';
    }, [missionData.reward]);
    
    // Initialize state when the mission changes
    useEffect(() => {
        const initialPieces = shuffleArray(
            missionData.availableLetters.map((letter, index): LetterPiece => ({ id: `${letter}-${index}`, letter }))
        );
        setTrayPieces(initialPieces);
        setSlottedPieces(Array(totalSlots).fill(null));
        setIsComplete(false);
        setFeedback(null);
    }, [missionData, totalSlots]);

    const handleDragStart = (e: React.DragEvent, data: DragData) => {
        e.dataTransfer.setData('application/json', JSON.stringify(data));
        e.dataTransfer.effectAllowed = 'move';
        (e.currentTarget as HTMLElement).classList.add('dragging');
    };
    
    const handleDragEnd = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).classList.remove('dragging');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    
    const handleDropOnSlot = useCallback((e: React.DragEvent, targetSlotIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
            const { piece, sourceType, sourceSlotIndex } = data;

            // Prevent dropping on itself
            if (sourceType === 'slot' && sourceSlotIndex === targetSlotIndex) return;

            const newSlots = [...slottedPieces];
            const pieceInTargetSlot = newSlots[targetSlotIndex];

            // Place the dragged piece
            newSlots[targetSlotIndex] = piece;

            if (sourceType === 'tray') {
                // Remove from tray and add the displaced piece back (if any)
                setTrayPieces(prevTray => {
                    const newTray = prevTray.filter(p => p.id !== piece.id);
                    if (pieceInTargetSlot) {
                        newTray.push(pieceInTargetSlot);
                    }
                    return newTray;
                });
            } else if (sourceSlotIndex !== undefined) {
                // Swap pieces between slots
                newSlots[sourceSlotIndex] = pieceInTargetSlot;
            }

            setSlottedPieces(newSlots);
        } catch (error) {
            console.error("Drag/drop error on slot:", error);
        }
    }, [slottedPieces]);
    
    const handleDropOnTray = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        try {
            const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
            // Only handle pieces coming from a slot
            if (data.sourceType !== 'slot' || data.sourceSlotIndex === undefined) return;
            
            const { piece, sourceSlotIndex } = data;
            
            // Remove from slot
            setSlottedPieces(currentSlots => {
                const newSlots = [...currentSlots];
                if (newSlots[sourceSlotIndex]?.id === piece.id) {
                    newSlots[sourceSlotIndex] = null;
                }
                return newSlots;
            });
            
            // Add back to tray if it's not already there
            setTrayPieces(currentTray => {
                if (!currentTray.some(p => p.id === piece.id)) {
                    return [...currentTray, piece];
                }
                return currentTray;
            });
        } catch (error) {
            console.error("Drag/drop error on tray:", error);
        }
    }, []);
    
    const handleCheckComposition = () => {
        if (isComplete) return;
        
        const isCorrect = targetChars.every((char, i) => slottedPieces[i]?.letter === char);

        if (isCorrect) {
            playSound('sfx_unlock');
            setFeedback({ message: 'Chính xác! Bản in hoàn hảo!', type: 'success'});
            setIsComplete(true);
            setTimeout(() => onComplete(missionData.reward), 2000);
        } else {
            playSound('sfx_fail');
            setFeedback({ message: 'Sắp chữ sai rồi! Hãy kiểm tra lại.', type: 'error'});
            setTimeout(() => setFeedback(null), 2000);
        }
    };
    
    let slotCounter = -1;

    return (
        <div id="typesetting-screen" className="screen-container w-full max-w-4xl p-6 rounded-lg shadow-xl flex flex-col items-center">
            <button onClick={onReturnToMuseum} className="absolute top-4 left-4 bg-stone-700 hover:bg-stone-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10">
                Quay về
            </button>

            <h2 className="text-3xl font-bold mb-4">{missionData.title}</h2>
            
            <div className="w-full bg-white/10 p-4 rounded-lg shadow-inner mb-4">
                <h3 className="text-lg font-semibold mb-2 text-center">Văn bản mẫu:</h3>
                <div id="text-template">
                    {missionData.targetText}
                </div>
            </div>
            
            <div id="composition-area">
                {missionData.targetText.split('').map((char, index) => {
                    if (char === ' ') {
                        return <div key={`space-${index}`} className="composition-spacer" />;
                    }
                    slotCounter++;
                    const currentSlotIndex = slotCounter;
                    const pieceInSlot = slottedPieces[currentSlotIndex];
                    
                    return (
                        <div 
                            key={`slot-${currentSlotIndex}`}
                            className="composition-slot"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDropOnSlot(e, currentSlotIndex)}
                        >
                            {pieceInSlot ? (
                                <div 
                                    className="letter-block"
                                    draggable={!isComplete}
                                    onDragStart={(e) => handleDragStart(e, { piece: pieceInSlot, sourceType: 'slot', sourceSlotIndex: currentSlotIndex })}
                                    onDragEnd={handleDragEnd}
                                >
                                    <span>{pieceInSlot.letter}</span>
                                </div>
                            ) : (
                               <div className="slot-placeholder"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div id="letter-tray" onDragOver={handleDragOver} onDrop={handleDropOnTray}>
                <h3 className="text-lg font-semibold mb-2 text-center">Khay chữ di động</h3>
                <div id="tray-inner">
                    {trayPieces.map((piece) => (
                        <div 
                            key={piece.id}
                            className="letter-block"
                            draggable={!isComplete}
                            onDragStart={(e) => handleDragStart(e, { piece, sourceType: 'tray' })}
                            onDragEnd={handleDragEnd}
                        >
                             <span>{piece.letter}</span>
                        </div>
                    ))}
                    {trayPieces.length === 0 && !isComplete && <p className="text-white/50 italic w-full">Tất cả chữ đã được xếp.</p>}
                </div>
            </div>
            
            <div className="mt-6 text-center h-28">
                {!isComplete && (
                  <button
                      onClick={handleCheckComposition}
                      disabled={slottedPieces.some(p => p === null)}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-8 text-lg rounded-lg shadow-xl transition-all disabled:opacity-50"
                  >
                      Tiến hành In
                  </button>
                )}
                {feedback && (
                    <p className={`mt-4 text-lg font-semibold animate-fadeInScaleUp ${feedback.type === 'success' ? 'text-green-300' : 'text-red-400'}`}>
                        {feedback.message}
                    </p>
                )}
                {isComplete && (
                    <div className="mt-4 flex flex-col items-center animate-fadeInScaleUp">
                        {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-24 h-24 object-contain my-2 rounded-lg" />}
                        <p className="text-green-300">Đang nhận phần thưởng...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TypesettingScreen;
