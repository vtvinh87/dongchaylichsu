
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ConstructionPuzzleMissionData, Reward, ConstructionPuzzlePiece } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

// --- Helper Functions ---
const rotateMatrix = (matrix: number[][]): number[][] => {
    if (!matrix || matrix.length === 0 || !matrix[0]) return [[]];
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
  onFail?: () => void;
}

// --- Piece Data in State ---
interface PieceState extends ConstructionPuzzlePiece {
    rotationIndex: number;
    currentShape: number[][]; // Store current shape after rotation
    isPlaced: boolean;
    position?: { x: number; y: number };
}

const CELL_SIZE_PX = 40;

const ConstructionPuzzleScreen: React.FC<ConstructionPuzzleScreenProps> = ({
  missionData,
  onReturnToMuseum,
  onComplete,
  onFail,
}) => {
    const [pieces, setPieces] = useState<PieceState[]>([]);
    const [selectedPalettePieceId, setSelectedPalettePieceId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [showSolution, setShowSolution] = useState(false); // State for hint feature
    
    const rewardImageUrl = useMemo(() => {
        if (missionData.reward.type === 'artifact') {
            return ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
        }
        return '';
    }, [missionData.reward]);

    const initializePieces = useCallback(() => {
        setPieces(missionData.pieces.map(p => ({
            ...p,
            currentShape: p.shape, // Start with original shape
            rotationIndex: 0,
            isPlaced: false,
        })));
        setSelectedPalettePieceId(null);
        setFeedback(null);
        setIsComplete(false);
        setShowSolution(false);
    }, [missionData.pieces]);

    useEffect(() => {
        initializePieces();
    }, [initializePieces]);

    const checkCollision = useCallback((pieceToCheck: PieceState, gridX: number, gridY: number): boolean => {
        for (let r = 0; r < pieceToCheck.currentShape.length; r++) {
            for (let c = 0; c < pieceToCheck.currentShape[0].length; c++) {
                if (pieceToCheck.currentShape[r][c]) {
                    const checkX = gridX + c;
                    const checkY = gridY + r;

                    if (checkX < 0 || checkX >= missionData.gridSize.cols || checkY < 0 || checkY >= missionData.gridSize.rows) {
                        return true; // Out of bounds
                    }

                    for (const otherPiece of pieces) {
                        if (otherPiece.isPlaced && otherPiece.id !== pieceToCheck.id && otherPiece.position) {
                            const otherX = otherPiece.position.x;
                            const otherY = otherPiece.position.y;
                            for (let or = 0; or < otherPiece.currentShape.length; or++) {
                                for (let oc = 0; oc < otherPiece.currentShape[0].length; oc++) {
                                    if (otherPiece.currentShape[or][oc] && checkX === otherX + oc && checkY === otherY + or) {
                                        return true; // Collision with another piece
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }, [pieces, missionData.gridSize]);

    const handleGridCellClick = useCallback((x: number, y: number) => {
        if (!selectedPalettePieceId || isComplete) return;

        const pieceToPlace = pieces.find(p => p.id === selectedPalettePieceId);
        if (!pieceToPlace) return;

        if (checkCollision(pieceToPlace, x, y)) {
            playSound('sfx_fail');
            return;
        }

        playSound('sfx_build');
        setPieces(prev => prev.map(p => p.id === selectedPalettePieceId ? { ...p, isPlaced: true, position: { x, y } } : p));
        setSelectedPalettePieceId(null);
    }, [selectedPalettePieceId, pieces, isComplete, checkCollision]);
    
    const handlePlacedPieceClick = useCallback((pieceToReturn: PieceState) => {
        if (isComplete) return;
        playSound('sfx_click');
        setPieces(prev => prev.map(p => p.id === pieceToReturn.id ? { ...p, isPlaced: false, position: undefined } : p));
    }, [isComplete]);


    const checkSolution = useCallback(() => {
        if (pieces.some(p => !p.isPlaced)) {
            setFeedback({ message: 'Vui lòng đặt tất cả các khối kiến trúc.', type: 'error' });
            setTimeout(() => setFeedback(null), 2500);
            return;
        }
        const isCorrect = pieces.every(p => {
            const solutionPos = missionData.solution[p.id];
            if (!solutionPos || !p.position) return false;
            return p.position.x === solutionPos.x && p.position.y === solutionPos.y && p.rotationIndex === solutionPos.rotationIndex;
        });
        if (isCorrect) {
            playSound('sfx_unlock');
            setFeedback({ message: 'Chính xác! Ngôi chùa đã hoàn thành!', type: 'success' });
            setIsComplete(true);
            setTimeout(() => onComplete(missionData.reward), 2000);
        } else {
            playSound('sfx_fail');
            setFeedback({ message: 'Vị trí các khối chưa đúng. Hãy thử sắp xếp lại!', type: 'error' });
            if (onFail) onFail();
            setTimeout(() => setFeedback(null), 2500);
        }
    }, [pieces, missionData.solution, onComplete, missionData.reward, onFail]);

    const handleRotate = useCallback((pieceId: string) => {
        if (isComplete) return;
        playSound('sfx_click');
        setPieces(prevPieces => prevPieces.map(p => {
            if (p.id === pieceId && !p.isPlaced) {
                return { ...p, currentShape: rotateMatrix(p.currentShape), rotationIndex: (p.rotationIndex + 1) % 4 };
            }
            return p;
        }));
    }, [isComplete]);

    const unplacedPieces = pieces.filter(p => !p.isPlaced);
    const placedPieces = pieces.filter(p => p.isPlaced);

    return (
        <div className="screen-container w-full max-w-4xl p-6 bg-stone-800 rounded-lg shadow-xl text-center flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-amber-300 font-serif">{missionData.title}</h2>
                <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
                    Quay về
                </button>
            </div>
            <p className="text-stone-300 mb-4">Chọn một khối, xoay nếu cần, rồi đặt vào lưới.</p>
            <div className="flex flex-col md:flex-row gap-6 flex-grow">
                <div
                    className="flex-grow bg-stone-700/50 p-2 rounded-lg relative"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${missionData.gridSize.cols}, ${CELL_SIZE_PX}px)`,
                        gridTemplateRows: `repeat(${missionData.gridSize.rows}, ${CELL_SIZE_PX}px)`,
                        width: `${missionData.gridSize.cols * CELL_SIZE_PX}px`,
                        height: `${missionData.gridSize.rows * CELL_SIZE_PX}px`,
                        margin: 'auto',
                    }}
                >
                    {Array.from({ length: missionData.gridSize.rows * missionData.gridSize.cols }).map((_, i) => (
                        <div key={i} className="border border-stone-600/50" onClick={() => handleGridCellClick(i % missionData.gridSize.cols, Math.floor(i / missionData.gridSize.cols))} />
                    ))}
                    {placedPieces.map(piece => (
                        <div
                            key={piece.id}
                            className="absolute cursor-pointer"
                            style={{
                                left: `${piece.position!.x * CELL_SIZE_PX}px`,
                                top: `${piece.position!.y * CELL_SIZE_PX}px`,
                                zIndex: 10,
                            }}
                            onClick={() => handlePlacedPieceClick(piece)}
                        >
                            <img src={piece.imageUrl} alt={piece.name} className="pointer-events-none" style={{ width: `${piece.currentShape[0].length * CELL_SIZE_PX}px`, height: `${piece.currentShape.length * CELL_SIZE_PX}px`}} />
                        </div>
                    ))}
                    {showSolution && Object.values(missionData.solution).map(sol => {
                        const originalPiece = missionData.pieces.find(p => p.id === Object.keys(missionData.solution).find(key => missionData.solution[key] === sol));
                        if (!originalPiece) return null;
                        let shape = originalPiece.shape;
                        for(let i = 0; i < sol.rotationIndex; i++) shape = rotateMatrix(shape);
                        
                        return (
                            <div key={`sol-${originalPiece.id}`} className="absolute pointer-events-none" style={{ left: `${sol.x * CELL_SIZE_PX}px`, top: `${sol.y * CELL_SIZE_PX}px`, width: `${shape[0].length * CELL_SIZE_PX}px`, height: `${shape.length * CELL_SIZE_PX}px`, zIndex: 5}}>
                                <div className="w-full h-full border-2 border-dashed border-yellow-400 bg-yellow-400/20 rounded-sm" />
                            </div>
                        )
                    })}
                </div>
                <div className="w-full md:w-56 flex-shrink-0 bg-stone-700 p-4 rounded-lg space-y-2">
                    <h3 className="text-xl font-semibold text-amber-300 mb-3">Các khối kiến trúc</h3>
                    {unplacedPieces.map(piece => (
                        <div key={piece.id} className={`p-2 rounded-md bg-stone-600 cursor-pointer ${selectedPalettePieceId === piece.id ? 'ring-2 ring-yellow-400' : ''}`} onClick={() => setSelectedPalettePieceId(piece.id)}>
                            <img src={piece.imageUrl} alt={piece.name} className="w-24 h-auto mx-auto pointer-events-none" />
                            <button onClick={(e) => { e.stopPropagation(); handleRotate(piece.id); }} className="mt-2 w-full text-xs py-1 bg-stone-800 hover:bg-stone-900 rounded">Xoay</button>
                        </div>
                    ))}
                    {unplacedPieces.length === 0 && <p className="text-stone-400 italic">Tất cả đã được đặt.</p>}
                </div>
            </div>
            <div className="mt-6 h-20 flex items-center justify-center gap-4">
                {feedback && <p className={`text-lg font-semibold animate-fadeInScaleUp ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>}
                {isComplete && <img src={rewardImageUrl} alt="Phần thưởng" className="w-20 h-20 object-contain mx-auto animate-fadeInScaleUp" />}
                {!isComplete && (
                    <>
                        <button
                            onClick={() => setShowSolution(prev => !prev)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
                        >
                            {showSolution ? 'Ẩn giải pháp' : 'Xem giải pháp'}
                        </button>
                        <button
                            onClick={checkSolution}
                            disabled={isComplete || unplacedPieces.length > 0}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50"
                        >
                            Hoàn thành
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConstructionPuzzleScreen;
