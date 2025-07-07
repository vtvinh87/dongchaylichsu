import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RhythmMissionData, Reward } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

// --- Constants ---
const LANE_KEYS = ['a', 's', 'd'];
const NOTE_FALL_DURATION_MS = 2000;
const HIT_WINDOW_PERFECT_MS = 50;
const HIT_WINDOW_GOOD_MS = 100;
const HIT_WINDOW_OK_MS = 150;
const POINTS_PERFECT = 10;
const POINTS_GOOD = 5;
const POINTS_OK = 2;


// --- Types ---
interface ActiveNote {
    id: number;
    lane: number;
    spawnTime: number; // Time in audio when note was spawned
    hitTime: number; // Time in audio when note should be hit
    element: HTMLDivElement | null;
}

type HitFeedback = 'Perfect' | 'Good' | 'Ok' | 'Miss';

interface FeedbackDisplay {
    id: number;
    text: HitFeedback;
    color: string;
}

// --- Component ---
const RhythmScreen: React.FC<{
  missionData: RhythmMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
  onFail: () => void;
}> = ({ missionData, onReturnToMuseum, onComplete, onFail }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState<FeedbackDisplay[]>([]);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playAreaRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number>(0);
    const notesRef = useRef<ActiveNote[]>([]);
    const nextNoteIndexRef = useRef(0);
    const rewardImageUrl = useRef('');
    
    // Refs to hold latest state for callbacks without causing dependency changes
    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);
    
    const scoreRef = useRef(score);
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);


    useEffect(() => {
        // Pre-fetch artifact image URL
        if (missionData.reward.type === 'artifact') {
            const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
            if (artifact) rewardImageUrl.current = artifact.imageUrl;
        }
    }, [missionData.reward]);

    const cleanupGame = useCallback(() => {
        cancelAnimationFrame(animationFrameRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reset time
            audioRef.current.onended = null;
        }
         // Clear any remaining note elements from the DOM
        if (playAreaRef.current) {
            const notes = playAreaRef.current.querySelectorAll('.rhythm-note');
            notes.forEach(note => note.remove());
        }
        notesRef.current = [];
        nextNoteIndexRef.current = 0;
    }, []);

    const showFeedback = (text: HitFeedback, color: string) => {
        const newFeedback = { id: Date.now(), text, color };
        setFeedback(prev => [...prev, newFeedback]);
        setTimeout(() => {
            setFeedback(prev => prev.filter(f => f.id !== newFeedback.id));
        }, 500);
    };

    const gameLoop = useCallback((timestamp: number) => {
        if (!audioRef.current || !playAreaRef.current || gameStateRef.current !== 'playing') return;
        
        const currentTimeMs = audioRef.current.currentTime * 1000;
        const noteMap = missionData.noteMap;
        
        // Spawn new notes
        while (nextNoteIndexRef.current < noteMap.length && noteMap[nextNoteIndexRef.current].time <= currentTimeMs) {
            const noteData = noteMap[nextNoteIndexRef.current];
            
            const noteElement = document.createElement('div');
            noteElement.className = 'rhythm-note';
            noteElement.style.animationDuration = `${NOTE_FALL_DURATION_MS}ms`;

            const laneElement = playAreaRef.current.children[noteData.lane - 1] as HTMLElement;
            if (laneElement) {
                laneElement.appendChild(noteElement);
            }
            
            notesRef.current.push({
                id: Date.now() + Math.random(),
                lane: noteData.lane,
                spawnTime: currentTimeMs,
                hitTime: noteData.time + NOTE_FALL_DURATION_MS,
                element: noteElement,
            });
            nextNoteIndexRef.current++;
        }

        // Remove missed notes
        notesRef.current = notesRef.current.filter(note => {
            if (currentTimeMs > note.hitTime + HIT_WINDOW_OK_MS) {
                note.element?.remove();
                setCombo(0); // Reset combo on miss
                showFeedback('Miss', '#ef4444');
                return false;
            }
            return true;
        });

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [missionData.noteMap]);

    const startGame = useCallback(() => {
        cleanupGame(); // Ensure clean state before starting

        if (!audioRef.current) {
            const audio = new Audio(missionData.songUrl);
            audioRef.current = audio;
            audio.load();
        }
        
        // Reset state
        setScore(0);
        setCombo(0);
        setFeedback([]);
        
        const audio = audioRef.current;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Playback started successfully.
                setGameState('playing');
                animationFrameRef.current = requestAnimationFrame(gameLoop);
            }).catch(error => {
                // The user interrupting playback by pausing it is not an error.
                if (error.name !== 'AbortError') {
                    console.error("Audio play failed:", error);
                    setGameState('idle'); // Revert state if play fails
                }
            });
        }

        audio.onended = () => {
            setTimeout(() => { // Give a moment for last notes to be processed
                setGameState('finished');
                 if (scoreRef.current >= missionData.targetScore) {
                    playSound('sfx-unlock');
                    setTimeout(() => onComplete(missionData.reward), 1500);
                } else {
                    onFail();
                }
            }, NOTE_FALL_DURATION_MS / 2); // Wait half fall duration
        };

    }, [missionData, onComplete, gameLoop, cleanupGame, onFail]);


    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (gameStateRef.current !== 'playing') return;
        
        const laneIndex = LANE_KEYS.indexOf(e.key.toLowerCase());
        if (laneIndex === -1) return;

        const lane = laneIndex + 1;
        const currentTimeMs = (audioRef.current?.currentTime || 0) * 1000;
        
        const targetNoteIndex = notesRef.current.findIndex(note => 
            note.lane === lane && 
            Math.abs(currentTimeMs - note.hitTime) <= HIT_WINDOW_OK_MS
        );
        
        if (targetNoteIndex !== -1) {
            const note = notesRef.current[targetNoteIndex];
            const diff = Math.abs(currentTimeMs - note.hitTime);

            let feedbackText: HitFeedback;
            let points = 0;

            if (diff <= HIT_WINDOW_PERFECT_MS) {
                feedbackText = 'Perfect';
                points = POINTS_PERFECT;
            } else if (diff <= HIT_WINDOW_GOOD_MS) {
                feedbackText = 'Good';
                points = POINTS_GOOD;
            } else {
                feedbackText = 'Ok';
                points = POINTS_OK;
            }

            playSound('sfx-success');
            setScore(prev => prev + points);
            setCombo(prev => prev + 1);
            showFeedback(feedbackText, '#22c55e');
            
            note.element?.remove();
            notesRef.current.splice(targetNoteIndex, 1);
        }

    }, []); // Empty dependency array, uses refs for dynamic values


    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        // The main cleanup when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            cleanupGame();
        };
    }, [handleKeyPress, cleanupGame]);

    const renderOverlay = () => {
        if (gameState === 'idle') {
            return (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20">
                    <h3 className="text-4xl font-bold mb-4">Sẵn sàng!</h3>
                    <p className="mb-6">Sử dụng phím 'A', 'S', 'D' để gõ đúng nhịp.</p>
                    <button onClick={startGame} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg">Bắt đầu</button>
                </div>
            );
        }
        if (gameState === 'finished') {
             const isWin = score >= missionData.targetScore;
             return (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp">
                    <h3 className={`text-4xl font-bold mb-4 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                        {isWin ? 'Hoàn thành xuất sắc!' : 'Cần luyện tập thêm!'}
                    </h3>
                    <p className="text-2xl mb-4">Điểm số: {score}</p>
                    {isWin && rewardImageUrl.current && (
                        <>
                         <img src={rewardImageUrl.current} alt="Phần thưởng" className="w-32 h-32 object-contain my-4 rounded-lg" />
                         <p className="text-lg">Đang nhận phần thưởng...</p>
                        </>
                    )}
                    <div className="flex gap-4 mt-4">
                        {!isWin && (
                            <button onClick={startGame} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
                                Chơi lại
                            </button>
                        )}
                        <button onClick={onReturnToMuseum} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
                            Quay về
                        </button>
                    </div>
                </div>
            )
        }
        return null;
    }


  return (
    <div className="screen-container w-full max-w-lg p-4 bg-stone-900/80 rounded-lg shadow-xl text-center flex flex-col items-center">
        {gameState !== 'finished' && (
            <button
                onClick={onReturnToMuseum}
                className="absolute top-6 right-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-30"
                aria-label="Quay về Bảo tàng"
            >
                Quay về
            </button>
        )}

        <h2 className="text-3xl font-bold text-amber-300 mb-2 font-serif">{missionData.title}</h2>
        <div className="flex gap-4 text-white mb-2">
            <span>Điểm: {score}</span>
            <span>Combo: {combo}</span>
        </div>
        
        <div className="rhythm-play-area" ref={playAreaRef}>
             {renderOverlay()}
            {[1, 2, 3].map(lane => (
                <div key={lane} className="rhythm-lane"></div>
            ))}
            <div className="hit-line">
                {LANE_KEYS.map(key => <div key={key} className="hit-key">{key.toUpperCase()}</div>)}
            </div>
             {feedback.map(f => (
                <div key={f.id} className="hit-feedback" style={{ color: f.color }}>
                    {f.text}
                </div>
            ))}
        </div>
    </div>
  );
};

export default RhythmScreen;
