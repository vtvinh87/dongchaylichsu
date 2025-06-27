

import React, { useState, useEffect, useCallback } from 'react';
import { PuzzleMissionData, Reward, PuzzlePieceItem } from '../types';
import { INITIAL_PUZZLE_PIECES, PUZZLE_PIECES_COUNT, ALL_ARTIFACTS_MAP } from '../constants';
import PuzzlePiece from './PuzzlePiece';
import PuzzleSlot from './PuzzleSlot';

interface MissionScreenProps {
  mission: PuzzleMissionData;
  onReturnToMuseum: () => void;
  onMissionComplete: (reward: Reward) => void;
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
}) => {
  const [draggablePieces, setDraggablePieces] = useState<PuzzlePieceItem[]>([]);
  const [solvedSlots, setSolvedSlots] = useState<(PuzzlePieceItem | null)[]>(Array(PUZZLE_PIECES_COUNT).fill(null));
  const [isPuzzleComplete, setIsPuzzleComplete] = useState<boolean>(false);
  const [rewardImageUrl, setRewardImageUrl] = useState<string>('');

  useEffect(() => {
    setDraggablePieces(shuffleArray(INITIAL_PUZZLE_PIECES));
    setSolvedSlots(Array(PUZZLE_PIECES_COUNT).fill(null));
    setIsPuzzleComplete(false);
    
    // Determine the image URL for the final reward display
    if(mission.reward.type === 'artifact'){
        const artifact = ALL_ARTIFACTS_MAP[mission.reward.id];
        if(artifact) setRewardImageUrl(artifact.imageUrl);
    }
    // Could add logic for other reward types if a puzzle could grant them
    
  }, [mission]); 

  const handleDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, pieceId: number) => {
    event.dataTransfer.setData("application/json", JSON.stringify({ pieceId }));
  }, []);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); 
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    event.preventDefault();
    if (solvedSlots[slotIndex] || isPuzzleComplete) return;

    try {
        const data = event.dataTransfer.getData("application/json");
        if (!data) return;

        const { pieceId } = JSON.parse(data) as { pieceId: number };
        const pieceToPlace = draggablePieces.find(p => p.id === pieceId);

        if (pieceToPlace && pieceToPlace.id === slotIndex) { 
          const newSolvedSlots = [...solvedSlots];
          newSolvedSlots[slotIndex] = pieceToPlace;
          setSolvedSlots(newSolvedSlots);

          setDraggablePieces(prevPieces => prevPieces.filter(p => p.id !== pieceId));
          
          if (newSolvedSlots.every(slot => slot !== null)) {
            setIsPuzzleComplete(true);
            setTimeout(() => {
              onMissionComplete(mission.reward);
            }, 300); 
          }
        }
    } catch (e) {
        console.error("Error parsing drag data:", e);
    }
  }, [draggablePieces, solvedSlots, isPuzzleComplete, mission.reward, onMissionComplete]);

  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl text-center">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>
      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-6">{mission.title}</h2>

      {isPuzzleComplete ? (
        <div className="p-8 text-2xl text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-900/50 rounded-lg">
          Hoàn thành! Đang xử lý phần thưởng...
          {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-40 h-40 object-contain mx-auto my-4 rounded-lg" />}
        </div>
      ) : (
        <>
          <div id="puzzle-container" className="grid grid-cols-3 gap-1 mx-auto w-max bg-white dark:bg-stone-700 p-2 rounded-lg shadow-inner mb-6">
            {solvedSlots.map((piece, index) => (
              <PuzzleSlot
                key={index}
                slotIndex={index}
                solvedPiece={piece}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              />
            ))}
          </div>

          <div id="puzzle-pieces" className="flex flex-wrap justify-center items-center p-4 bg-white/70 dark:bg-stone-700/70 rounded-lg min-h-[100px] shadow">
            {draggablePieces.length > 0 ? draggablePieces.map((piece) => (
              <PuzzlePiece
                key={piece.id}
                piece={piece}
                onDragStart={handleDragStart}
                isSolved={!!solvedSlots.find(p => p?.id === piece.id)}
              />
            )) : <p className="text-stone-500 dark:text-stone-400 italic">Không còn mảnh ghép nào.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default MissionScreen;