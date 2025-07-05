
import React from 'react';
import { PuzzlePieceItem } from '../types';

interface PuzzlePieceProps {
  piece: PuzzlePieceItem;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, pieceId: number) => void;
  onClick: (pieceId: number) => void;
  isSolved: boolean;
  isSelected: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ piece, onDragStart, onClick, isSolved, isSelected }) => {
  if (isSolved) return null; 

  const GRID_SIZE = 3;
  const PIECE_SIZE = 80; // Corresponds to w-20, h-20 which is 5rem (80px)
  const col = piece.id % GRID_SIZE;
  const row = Math.floor(piece.id / GRID_SIZE);

  const style = {
    backgroundImage: `url(${piece.imageUrl})`,
    backgroundSize: `${PIECE_SIZE * GRID_SIZE}px ${PIECE_SIZE * GRID_SIZE}px`,
    backgroundPosition: `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`,
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, piece.id)}
      onClick={() => onClick(piece.id)}
      style={style}
      className={`w-20 h-20 m-1 cursor-grab active:cursor-grabbing transition-all duration-300 rounded shadow-md border-2 border-amber-400 dark:border-amber-500 ${isSelected ? 'selected' : ''}`}
      aria-label={`Mảnh ghép ${piece.id + 1}`}
      role="button"
      aria-pressed={isSelected}
    >
      {/* Replaced <img> with background styles on the div */}
    </div>
  );
};

export default PuzzlePiece;
