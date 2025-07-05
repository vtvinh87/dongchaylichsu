
import React from 'react';
import { PuzzlePieceItem } from '../types';

interface PuzzleSlotProps {
  slotIndex: number;
  solvedPiece: PuzzlePieceItem | null;
  onDrop: (event: React.DragEvent<HTMLDivElement>, slotIndex: number) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onClick: (slotIndex: number) => void;
  justSolved?: boolean;
}

const PuzzleSlot: React.FC<PuzzleSlotProps> = ({ slotIndex, solvedPiece, onDrop, onDragOver, onClick, justSolved }) => {
  const GRID_SIZE = 3;
  const PIECE_SIZE = 80; // Corresponds to w-20, h-20 which is 5rem (80px)

  const style = solvedPiece ? {
    backgroundImage: `url(${solvedPiece.imageUrl})`,
    backgroundSize: `${PIECE_SIZE * GRID_SIZE}px ${PIECE_SIZE * GRID_SIZE}px`,
    // In this puzzle, a piece is correct if its ID matches the slot index.
    backgroundPosition: `-${(slotIndex % GRID_SIZE) * PIECE_SIZE}px -${Math.floor(slotIndex / GRID_SIZE) * PIECE_SIZE}px`,
    borderStyle: 'solid' as const,
  } : {};

  return (
    <div
      onDrop={(e) => onDrop(e, slotIndex)}
      onDragOver={onDragOver}
      onClick={() => onClick(slotIndex)}
      style={style}
      className={`w-20 h-20 border-2 rounded flex items-center justify-center 
                  ${solvedPiece ? 'border-green-500 dark:border-green-600' : 'border-dashed border-amber-400 dark:border-amber-600 bg-amber-100/50 dark:bg-stone-600/50 cursor-pointer'}
                  ${justSolved ? 'animate-pulse ring-4 ring-yellow-400' : ''}
                  transition-all duration-200`}
      aria-label={`Ô ghép ${slotIndex + 1}`}
    >
      {!solvedPiece && (
        <span className="text-amber-500 dark:text-amber-400 text-2xl font-bold">{slotIndex + 1}</span>
      )}
    </div>
  );
};

export default PuzzleSlot;
