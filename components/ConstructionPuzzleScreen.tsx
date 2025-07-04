import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ConstructionPuzzleMissionData, Reward, ConstructionPuzzlePiece } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

// --- Helper Functions ---
const rotateMatrix = (matrix: number[][]): number[][] => {
    const rows = matrix.length;
    if (rows === 0) return [];
    const cols = matrix[0].length;
    const newMatrix: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newMatrix[c][rows - 1 - r] = matrix[r][c];
        }
    }
    return newMatrix;
};

// Define z-index order for the pieces
const pieceZIndexMap: Record<string, number> = {
    'foundation': 10,
    'gate': 10,
    'corridor': 20,
    'main_hall': 30,
    'roof': 40,
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
    shape: number[][];
    imageUrl?: string;
    rotationIndex: number;
    isPlaced: boolean;
    position?: { x: number; y: number };
}

// --- Drag Data ---
interface DragData {
    pieceId: string;
    source: 'palette' | 'grid';
}

const CELL_SIZE_PX = 40;

const ConstructionPuzzleScreen: React.FC<ConstructionPuzzleScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
}) => {
    const [pieces, setPieces] = useState<PieceState[]>([]);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [draggedPiece, setDraggedPiece] = useState<PieceState | null>(null);
    const [highlight, setHighlight] = useState<{ x: number; y: number; width: number; height: number; valid: boolean } | null>(null);
    const [hintedPieceId, setHintedPieceId] = useState<string | null>(null);
    
    const dragSourceRef = useRef<'palette' | 'grid' | null>(null);

    const rewardImageUrl = useMemo(() => {
        if (missionData.reward.type === 'artifact') {
            return ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
        }
        return '';
    }, [missionData.reward]);

    const initializePieces = useCallback(() => {
        setPieces(missionData.pieces.map(p => ({
            id: p.id,
            shape: p.shape,
            imageUrl: p.imageUrl,
            rotationIndex: 0,
            isPlaced: false,
        })));
        setFeedback(null);
        setIsComplete(false);
        setHintedPieceId(null);
    }, [missionData.pieces]);

    useEffect(() => {
        initializePieces();
    }, [initializePieces]);
    
    const checkCollision = useCallback((pieceToCheck: PieceState, gridX: number, gridY: number): boolean => {
        // Only check collision with pieces on the same z-index layer.
        const otherPlacedPiecesOnSameLayer = pieces.filter(p =>
            p.isPlaced &&
            p.id !== pieceToCheck.id &&
            (pieceZIndexMap[p.id] || 0) === (pieceZIndexMap[pieceToCheck.id] || 0)
        );
    
        for (let r = 0; r < pieceToCheck.shape.length; r++) {
            for (let c = 0; c < pieceToCheck.shape[r].length; c++) {
                if (pieceToCheck.shape[r][c]) {
                    const checkX = gridX + c;
                    const checkY = gridY + r;
    
                    // 1. Check grid bounds
                    if (checkY < 0 || checkY >= missionData.gridSize.rows || checkX < 0 || checkX >= missionData.gridSize.cols) {
                        return true; // Out of bounds
                    }
    
                    // 2. Check for collision with other placed pieces on the same layer
                    for (const otherPiece of otherPlacedPiecesOnSameLayer) {
                        if (otherPiece.position) {
                            const otherX = checkX - otherPiece.position.x;
                            const otherY = checkY - otherPiece.position.y;
    
                            if (otherY >= 0 && otherY < otherPiece.shape.length &&
                                otherX >= 0 && otherX < otherPiece.shape[otherY].length &&
                                otherPiece.shape[otherY][otherX]) {
                                return true; // Collision with another piece on the same layer
                            }
                        }
                    }
                }
            }
        }
        return false; // No collision
    }, [pieces, missionData.gridSize]);


    const handleDragStart = (e: React.DragEvent, piece: PieceState) => {
        const source = piece.isPlaced ? 'grid' : 'palette';
        dragSourceRef.current = source;
        const dragData: DragData = { pieceId: piece.id, source };
        e.dataTransfer.setData("application/json", JSON.stringify(dragData));
        setDraggedPiece(piece);

        if (source === 'grid') {
            // Temporarily un-place it so it disappears from the grid while dragging
            // and doesn't collide with itself.
            setTimeout(() => {
                setPieces(prev => prev.map(p => p.id === piece.id ? { ...p, isPlaced: false } : p));
            }, 0);
        }
    };
    
    const handleDragEnd = () => {
        // If a piece was dragged from the grid and was not successfully placed somewhere else (handled by onDrop), revert it.
        if (dragSourceRef.current === 'grid' && draggedPiece) {
            const isNowPlaced = pieces.find(p => p.id === draggedPiece.id)?.isPlaced;
            if (!isNowPlaced) {
                // Revert the piece to its original placed state.
                setPieces(prev => prev.map(p =>
                    p.id === draggedPiece.id ? { ...p, isPlaced: true } : p
                ));
            }
        }
        setDraggedPiece(null);
        setHighlight(null);
        dragSourceRef.current = null;
    };

    const handleGridDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedPiece) return;
        const gridElement = e.currentTarget;
        const rect = gridElement.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;
        const gridX = Math.floor(dropX / CELL_SIZE_PX);
        const gridY = Math.floor(dropY / CELL_SIZE_PX);
        
        const collision = checkCollision(draggedPiece, gridX, gridY);
        setHighlight({
            x: gridX, y: gridY,
            width: draggedPiece.shape[0].length,
            height: draggedPiece.shape.length,
            valid: !collision
        });
    };
    
    const handleGridDragLeave = () => {
        setHighlight(null);
    };
    
    const handleDropOnGrid = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setHighlight(null);
        
        if (!draggedPiece || !highlight?.valid) {
            // if drag failed, revert the piece if it came from the grid
            if (dragSourceRef.current === 'grid' && draggedPiece) {
                 setPieces(prev => prev.map(p =>
                    p.id === draggedPiece.id ? { ...p, isPlaced: true } : p
                ));
            }
            return;
        }
        
        setPieces(prev => prev.map(p => 
            p.id === draggedPiece.id 
                ? {...p, isPlaced: true, position: {x: highlight.x, y: highlight.y}} 
                : p
        ));
        playSound('sfx_success');
        dragSourceRef.current = null; // Mark drop as handled
    };
    
    const handleDropOnPalette = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const data: DragData = JSON.parse(e.dataTransfer.getData("application/json"));
            // We only care if the piece came from the grid
            if (data.source === 'grid') {
                setPieces(prev => prev.map(p => 
                    p.id === data.pieceId ? { ...p, isPlaced: false, position: undefined, rotationIndex: 0, shape: missionData.pieces.find(mp => mp.id === data.pieceId)!.shape } : p
                ));
                playSound('sfx_click');
                dragSourceRef.current = null; // Mark drop as handled to prevent snap-back
            }
        } catch (error) {
            console.error("Palette drop error:", error);
        }
    };
    
    const handlePaletteClick = (pieceId: string) => {
        const piece = pieces.find(p => p.id === pieceId);
        if (!piece || piece.isPlaced) return;
        
        playSound('sfx_click');
        let newShape = piece.shape;
        newShape = rotateMatrix(newShape);
        
        setPieces(prev => prev.map(p => p.id === pieceId ? {...p, shape: newShape, rotationIndex: (p.rotationIndex + 1) % 4} : p));
    };

    const handleReset = useCallback(() => {
        playSound('sfx_click');
        initializePieces();
    }, [initializePieces]);

    const handleCheckSolution = () => {
        playSound('sfx_click');
        const solution = missionData.solution;
        const allPlaced = pieces.every(p => p.isPlaced);
        if (!allPlaced) {
            setFeedback({ message: 'Vui lòng đặt tất cả các khối kiến trúc vào lưới!', type: 'error'});
            return;
        }

        const allCorrect = pieces.every(pieceState => {
            const solutionState = solution[pieceState.id];
            if (!solutionState) return false;
            return pieceState.isPlaced &&
                   pieceState.position?.x === solutionState.x &&
                   pieceState.position?.y === solutionState.y &&
                   pieceState.rotationIndex === solutionState.rotationIndex;
        });

        if (allCorrect) {
            setFeedback({ message: 'Hoàn hảo! Ngôi chùa đã được xây dựng!', type: 'success'});
            playSound('sfx_unlock');
            setIsComplete(true);
            setTimeout(() => onComplete(missionData.reward), 2000);
        } else {
            setFeedback({ message: 'Vị trí chưa đúng. Hãy xem lại bản thiết kế và thử lại!', type: 'error'});
        }
    };

    const handleHint = () => {
        playSound('sfx_unlock');
        const solution = missionData.solution;
      
        // Find the first piece that's not correctly placed
        const pieceToHint = pieces.find(p => {
            const sol = solution[p.id];
            if (!sol) return false;
            if (!p.isPlaced) return true; // It's in the palette, so it's not correct
            // It's placed, check if position and rotation are correct
            return p.position?.x !== sol.x || p.position?.y !== sol.y || p.rotationIndex !== sol.rotationIndex;
        });
      
        if (!pieceToHint) {
            setFeedback({ message: 'Tất cả các khối đã được đặt đúng!', type: 'success' });
            return;
        }
      
        const solutionState = solution[pieceToHint.id];
        const baseShape = missionData.pieces.find(p => p.id === pieceToHint.id)!.shape;
      
        // Rotate the shape to match the solution
        let finalShape = baseShape;
        for (let i = 0; i < solutionState.rotationIndex; i++) {
            finalShape = rotateMatrix(finalShape);
        }
      
        // Update the piece state
        setPieces(prevPieces => 
            prevPieces.map(p => 
                p.id === pieceToHint.id 
                ? { 
                    ...p, 
                    isPlaced: true, 
                    position: { x: solutionState.x, y: solutionState.y },
                    rotationIndex: solutionState.rotationIndex,
                    shape: finalShape
                  }
                : p
            )
        );
      
        // Set up the hint flash effect
        setHintedPieceId(pieceToHint.id);
        setTimeout(() => {
            setHintedPieceId(null);
        }, 1500); // Match animation duration
    };

  return (
    <div id="construction-puzzle-screen" className="screen-container w-full max-w-5xl p-6 rounded-lg shadow-xl flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4">
          <h2 className="text-3xl font-bold font-serif">{missionData.title}</h2>
          <div>
              <button onClick={handleHint} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-2">Gợi ý</button>
              <button onClick={handleReset} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-2">Làm lại</button>
              <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Quay về</button>
          </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 w-full items-start">
          {/* Building Grid */}
          <div 
            id="building-grid" 
            onDragOver={handleGridDragOver} 
            onDragLeave={handleGridDragLeave}
            onDrop={handleDropOnGrid}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${missionData.gridSize.cols}, ${CELL_SIZE_PX}px)`,
                gridTemplateRows: `repeat(${missionData.gridSize.rows}, ${CELL_SIZE_PX}px)`,
            }}
          >
              {/* Render the background grid cells */}
              {Array.from({ length: missionData.gridSize.rows * missionData.gridSize.cols }).map((_, i) => (
                  <div key={i} className="grid-cell" />
              ))}

              {/* Render the placed pieces */}
              {pieces
                  .filter(p => p.isPlaced)
                  .sort((a, b) => (pieceZIndexMap[a.id] || 0) - (pieceZIndexMap[b.id] || 0))
                  .map(piece => (
                  <div 
                    key={piece.id}
                    className={`placed-puzzle-piece ${hintedPieceId === piece.id ? 'hinted-piece' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece)}
                    onDragEnd={handleDragEnd}
                    style={{
                        position: 'absolute',
                        left: `${piece.position!.x * CELL_SIZE_PX}px`,
                        top: `${piece.position!.y * CELL_SIZE_PX}px`,
                        width: `${piece.shape[0].length * CELL_SIZE_PX}px`,
                        height: `${piece.shape.length * CELL_SIZE_PX}px`,
                        zIndex: pieceZIndexMap[piece.id] || 10,
                    }}
                  >
                      <img 
                        src={piece.imageUrl} 
                        alt={piece.id}
                      />
                  </div>
              ))}
              {highlight && (
                  <div
                      className={`highlight-overlay ${highlight.valid ? 'valid' : 'invalid'}`}
                      style={{
                          position: 'absolute',
                          left: `${highlight.x * CELL_SIZE_PX}px`,
                          top: `${highlight.y * CELL_SIZE_PX}px`,
                          width: `${highlight.width * CELL_SIZE_PX}px`,
                          height: `${highlight.height * CELL_SIZE_PX}px`,
                      }}
                  />
              )}
          </div>

          {/* Pieces Palette */}
          <div 
            id="building-pieces-palette" 
            className="w-full md:w-72 p-3 rounded-lg flex-shrink-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnPalette}
          >
            <h3 className="text-xl font-semibold mb-3 text-center">Khối kiến trúc</h3>
            <div className="palette-inner">
                {pieces.filter(p => !p.isPlaced).map(piece => (
                    <div 
                        key={piece.id}
                        className="palette-piece-container" 
                        onClick={() => handlePaletteClick(piece.id)} 
                        title="Nhấp để xoay"
                    >
                      <img 
                        src={piece.imageUrl} 
                        alt={piece.id} 
                        className="palette-piece-image"
                        draggable
                        onDragStart={(e) => handleDragStart(e, piece)}
                        onDragEnd={handleDragEnd}
                        style={{ transform: `rotate(${piece.rotationIndex * 90}deg)`}}
                      />
                    </div>
                ))}
                {pieces.every(p => p.isPlaced) && <p className="text-sm italic text-stone-500">Tất cả các khối đã được đặt.</p>}
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