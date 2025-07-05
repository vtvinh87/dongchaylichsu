
import React, { useState, useEffect, useCallback } from 'react';
import { PuzzleMissionData, Reward, PuzzlePieceItem } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import PuzzlePiece from './PuzzlePiece';
import PuzzleSlot from './PuzzleSlot';
import { playSound } from '../utils/audio';

interface MissionScreenProps {
  mission: PuzzleMissionData;
  onReturnToMuseum: () => void;
  onMissionComplete: (reward: Reward) => void;
  onGrantBonusSupplies: (amount: number) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MissionScreen: React.FC<MissionScreenProps> = ({
  mission,
  onReturnToMuseum,
  onMissionComplete,
  onGrantBonusSupplies,
}) => {
  const [draggablePieces, setDraggablePieces] = useState<PuzzlePieceItem[]>([]);
  const [solvedSlots, setSolvedSlots] = useState<(PuzzlePieceItem | null)[]>([]);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState<boolean>(false);
  const [rewardImageUrl, setRewardImageUrl] = useState<string>('');
  
  const [timeLeft, setTimeLeft] = useState(mission.timeLimit || 90);
  const [timeChallengeSuccess, setTimeChallengeSuccess] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [funFactModal, setFunFactModal] = useState<{ isOpen: boolean; text: string }>({ isOpen: false, text: '' });
  const [justSolvedSlotIndex, setJustSolvedSlotIndex] = useState<number | null>(null);

  // New state for tap-to-select functionality
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);

  useEffect(() => {
    setDraggablePieces(shuffleArray(mission.pieces));
    setSolvedSlots(Array(mission.pieces.length).fill(null));
    setIsPuzzleComplete(false);
    setTimeLeft(mission.timeLimit || 90);
    setTimeChallengeSuccess(true);
    setIsTimerRunning(true); // Start timer immediately
    setSelectedPieceId(null);
    
    if (mission.reward.type === 'artifact'){
        const artifact = ALL_ARTIFACTS_MAP[mission.reward.id];
        if(artifact) setRewardImageUrl(artifact.imageUrl);
    }
  }, [mission]); 

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0 && !isPuzzleComplete) {
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && isTimerRunning) {
        setIsTimerRunning(false);
        if (timeChallengeSuccess) {
            setTimeChallengeSuccess(false);
            alert("Hết giờ thử thách! Bạn có thể tiếp tục hoàn thành puzzle nhưng sẽ không nhận được phần thưởng thêm.");
        }
    }
  }, [timeLeft, isTimerRunning, isPuzzleComplete, timeChallengeSuccess]);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, pieceId: number) => {
    if (isPuzzleComplete) return;
    setSelectedPieceId(null); // Deselect if starting a drag
    event.dataTransfer.setData("application/json", JSON.stringify({ pieceId }));
  }, [isPuzzleComplete]);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); 
  }, []);

  const placePiece = useCallback((pieceId: number, slotIndex: number) => {
    const pieceToPlace = draggablePieces.find(p => p.id === pieceId);
    if (!pieceToPlace || pieceToPlace.id !== slotIndex) {
        playSound('sfx_fail');
        return false;
    }

    // Success logic
    playSound('sfx-success');
    setIsTimerRunning(false); // Pause timer
    setJustSolvedSlotIndex(slotIndex);

    if (pieceToPlace.funFact) {
        setFunFactModal({ isOpen: true, text: pieceToPlace.funFact });
    }
    
    const newSolvedSlots = [...solvedSlots];
    newSolvedSlots[slotIndex] = pieceToPlace;
    setSolvedSlots(newSolvedSlots);

    setDraggablePieces(prevPieces => prevPieces.filter(p => p.id !== pieceId));
    
    const isNowComplete = newSolvedSlots.every(slot => slot !== null);
    if (isNowComplete) {
        setIsPuzzleComplete(true);
        if (!pieceToPlace.funFact) {
            onMissionComplete(mission.reward);
            if (timeChallengeSuccess) {
                onGrantBonusSupplies(50);
            }
        }
    }
    return true;
  }, [draggablePieces, solvedSlots, mission.reward, onMissionComplete, timeChallengeSuccess, onGrantBonusSupplies]);


  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    event.preventDefault();
    if (solvedSlots[slotIndex] || isPuzzleComplete) return;
    setSelectedPieceId(null);

    try {
        const data = event.dataTransfer.getData("application/json");
        if (!data) return;

        const { pieceId } = JSON.parse(data) as { pieceId: number };
        placePiece(pieceId, slotIndex);
    } catch (e) {
        console.error("Error parsing drag data:", e);
    }
  }, [solvedSlots, isPuzzleComplete, placePiece]);

  const handleCloseFunFactModal = () => {
    playSound('sfx_click');
    setFunFactModal({ isOpen: false, text: '' });
    setJustSolvedSlotIndex(null);
    if (isPuzzleComplete) {
        onMissionComplete(mission.reward);
        if (timeChallengeSuccess) {
            onGrantBonusSupplies(50);
        }
    } else {
        setIsTimerRunning(true);
    }
  };

  const handlePieceClick = (pieceId: number) => {
    if (isPuzzleComplete) return;
    playSound('sfx_click');
    setSelectedPieceId(prev => (prev === pieceId ? null : pieceId));
  };
  
  const handleSlotClick = (slotIndex: number) => {
    if (isPuzzleComplete || selectedPieceId === null || solvedSlots[slotIndex]) return;
    
    const success = placePiece(selectedPieceId, slotIndex);
    // Always deselect after a placement attempt
    setSelectedPieceId(null);
  };
  
  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl text-center relative">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-20"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      {mission.timeLimit && (
        <div id="mission-timer" className={timeLeft <= 10 ? 'low-time' : ''}>
          ⏳ {timeLeft}s
        </div>
      )}

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-6">{mission.title}</h2>

      {isPuzzleComplete ? (
        <div className="p-8 text-2xl text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-900/50 rounded-lg">
          Hoàn thành! Đang xử lý phần thưởng...
          {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-40 h-40 object-contain mx-auto my-4 rounded-lg" />}
        </div>
      ) : (
        <>
          <div id="puzzle-container" className="grid grid-cols-3 gap-1 mx-auto w-max bg-white/10 dark:bg-stone-700/10 p-2 rounded-lg shadow-inner mb-6">
            {solvedSlots.map((piece, index) => (
              <PuzzleSlot
                key={index}
                slotIndex={index}
                solvedPiece={piece}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => handleSlotClick(index)}
                justSolved={index === justSolvedSlotIndex}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 mb-6 min-h-[100px] bg-amber-50 dark:bg-stone-700/50 p-3 rounded-lg">
              {draggablePieces.map(piece => (
                  <PuzzlePiece
                    key={piece.id}
                    piece={piece}
                    onDragStart={handleDragStart}
                    onClick={() => handlePieceClick(piece.id)}
                    isSolved={solvedSlots.some(s => s?.id === piece.id)}
                    isSelected={selectedPieceId === piece.id}
                  />
              ))}
          </div>
        </>
      )}

      {funFactModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
          <div className="bg-amber-50 dark:bg-stone-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center animate-fadeInScaleUp">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-2">💡 Bạn có biết?</h3>
            <p className="text-stone-700 dark:text-stone-200 mb-4">{funFactModal.text}</p>
            <button
              onClick={handleCloseFunFactModal}
              className="action-button"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionScreen;
