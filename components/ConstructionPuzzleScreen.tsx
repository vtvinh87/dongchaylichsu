import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ConstructionPuzzleMissionData, Reward, ConstructionPuzzlePiece } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

// --- Helper Functions ---
const rotateMatrix = (matrix: number[][]): number[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const newMatrix: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newMatrix[c][rows - 1 - r] = matrix[r][c];
        }
    }
    return newMatrix;
};

// --- Component Props ---
interface ConstructionPuzzleScreenProps {
  missionData: ConstructionPuzzleMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

// --- Piece Data in State ---
interface PieceState {
    id: string;
    shape: number[][]; // current shape after rotation
    originalShape: number[][];
    color: string;
    rotationIndex: number; // 0, 1, 2, 3
    isPlaced: boolean;
    position?: { x: number; y: number };
}

// --- Drag Data ---
interface DragData {
    pieceId: string;
    source: 'palette' | 'grid';
    offsetX: number;
    offsetY: number;
}


const ConstructionPuzzleScreen: React.FC<ConstructionPuzzleScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
    const [pieces, setPieces] = useState<PieceState[]>([]);
    const [grid, setGrid] = useState<string[][]>([]);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    
    const rewardImageUrl = useMemo(() => {
        if (missionData.reward.type === 'artifact') {
            return ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
        }
        return '';
    }, [missionData.reward]);

    useEffect(() => {
        // Initialize state from missionData
        setPieces(missionData.pieces.map(p => ({
            id: p.id,
            shape: p.shape,
            originalShape: p.shape,
            color: p.color,
            rotationIndex: 0,
            isPlaced: false,
        })));
        setGrid(Array.from({ length: missionData.gridSize.rows }, () => 
            Array(missionData.gridSize.cols).fill('')
        ));
        setFeedback(null);
        setIsComplete(false);
    }, [missionData]);

    const handleDragStart = (e: React.DragEvent, piece: PieceState) => {
        const dragData: DragData = {
            pieceId: piece.id,
            source: piece.isPlaced ? 'grid' : 'palette',
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY,
        };
        e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const gridCell = e.target as HTMLDivElement;
        if (!gridCell.dataset.x || !gridCell.dataset.y) return;

        const x = parseInt(gridCell.dataset.x, 10);
        const y = parseInt(gridCell.dataset.y, 10);

        try {
            const dragData: DragData = JSON.parse(e.dataTransfer.getData("application/json"));
            const pieceToPlace = pieces.find(p => p.id === dragData.pieceId);
            if (!pieceToPlace) return;

            // Check for collision
            let canPlace = true;
            for (let r = 0; r < pieceToPlace.shape.length; r++) {
                for (let c = 0; c < pieceToPlace.shape[r].length; c++) {
                    if (pieceToPlace.shape[r][c]) {
                        const gridY = y + r;
                        const gridX = x + c;
                        if (gridY >= missionData.gridSize.rows || gridX >= missionData.gridSize.cols || (grid[gridY][gridX] && grid[gridY][gridX] !== pieceToPlace.id)) {
                            canPlace = false;
                            break;
                        }
                    }
                }
                if (!canPlace) break;
            }

            if (canPlace) {
                // Clear old position from grid
                const newGrid = grid.map(row => row.map(cell => cell === pieceToPlace.id ? '' : cell));
                
                // Place new position
                for (let r = 0; r < pieceToPlace.shape.length; r++) {
                    for (let c = 0; c < pieceToPlace.shape[r].length; c++) {
                        if (pieceToPlace.shape[r][c]) {
                            newGrid[y + r][x + c] = pieceToPlace.id;
                        }
                    }
                }
                setGrid(newGrid);

                // Update piece state
                setPieces(prevPieces => prevPieces.map(p =>
                    p.id === pieceToPlace.id ? { ...p, isPlaced: true, position: { x, y } } : p
                ));
            } else {
                playSound('sfx-fail');
            }

        } catch (err) { console.error(err); }
    };
    
    const handlePieceClick = (pieceId: string) => {
        const piece = pieces.find(p => p.id === pieceId);
        if (!piece || piece.isPlaced) return; // Can't rotate placed pieces for simplicity
        
        playSound('sfx-click');
        const newShape = rotateMatrix(piece.shape);
        const newRotationIndex = (piece.rotationIndex + 1) % 4;
        setPieces(prev => prev.map(p => p.id === pieceId ? {...p, shape: newShape, rotationIndex: newRotationIndex} : p));
    };

    const handleCheckSolution = () => {
        playSound('sfx_click');
        const solution = missionData.solution;
        const allCorrect = Object.keys(solution).every(pieceId => {
            const pieceState = pieces.find(p => p.id === pieceId);
            const solutionState = solution[pieceId];
            return pieceState && pieceState.isPlaced && pieceState.position?.x === solutionState.x && pieceState.position?.y === solutionState.y && pieceState.rotationIndex === solutionState.rotationIndex;
        });

        if(allCorrect) {
            setFeedback({ message: 'Hoàn hảo! Ngôi chùa đã được xây dựng!', type: 'success'});
            playSound('sfx-unlock');
            setIsComplete(true);
            setTimeout(() => onComplete(missionData.reward), 2000);
        } else {
            setFeedback({ message: 'Vị trí chưa đúng. Hãy xem lại bản thiết kế và thử lại!', type: 'error'});
        }
    }

  return (
    <div id="construction-puzzle-screen" className="screen-container w-full max-w-4xl p-6 rounded-lg shadow-xl flex flex-col items-center">
      <button onClick={onReturnToMuseum} className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10">Quay về</button>
      <h2 className="text-3xl font-bold mb-4 font-serif">{missionData.title}</h2>
      
      <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Building Grid */}
          <div id="building-grid" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
             {grid.map((row, y) => row.map((cellId, x) => {
                 const piece = pieces.find(p => p.id === cellId);
                 return (
                     <div key={`${y}-${x}`} data-x={x} data-y={y} className="grid-cell" style={{backgroundColor: piece ? piece.color : undefined}}></div>
                 );
             }))}
          </div>

          {/* Pieces Palette */}
          <div id="building-pieces-palette">
            <h3 className="text-xl font-semibold mb-3 text-center">Khối kiến trúc</h3>
            <div className="palette-inner">
                {pieces.filter(p => !p.isPlaced).map(piece => (
                    <div key={piece.id} className="piece-container" onClick={() => handlePieceClick(piece.id)} draggable onDragStart={(e) => handleDragStart(e, piece)}>
                       {piece.shape.map((row, y) => (
                           <div key={y} className="flex">
                               {row.map((cell, x) => (
                                   <div key={x} className="piece-cell" style={{backgroundColor: cell ? piece.color : 'transparent'}}></div>
                               ))}
                           </div>
                       ))}
                    </div>
                ))}
            </div>
          </div>
      </div>
      
      <div className="mt-6 text-center">
          <button onClick={handleCheckSolution} disabled={isComplete} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50">Hoàn thành</button>
          {feedback && (
              <p className={`mt-4 text-lg font-semibold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>
          )}
          {isComplete && rewardImageUrl && (
               <div className="mt-4 flex flex-col items-center animate-fadeInScaleUp">
                  <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-2 rounded-lg" />
              </div>
          )}
      </div>

    </div>
  );
};

export default ConstructionPuzzleScreen;