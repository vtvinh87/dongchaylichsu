

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CoinMintingMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';
import * as ImageUrls from '../imageUrls';

type GameStage = 'intro' | 'engraving' | 'engraving-complete' | 'smelting' | 'casting' | 'finished';
type Result = 'win' | 'loss' | null;

// --- Game Parameters ---

// Stage 1: Engraving
const ENGRAVING_CHARS = [
    { 
      char: '光', 
      imageUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Letters/L-quang.png',
      dots: [
        { x: 50, y: 10 }, { x: 50, y: 30 }, { x: 30, y: 30 }, { x: 70, y: 30 },
        { x: 50, y: 90 }, { x: 40, y: 80 }, { x: 60, y: 80 }
      ]
    },
    { 
      char: '中',
      imageUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Letters/L-trung.png',
      dots: [
        { x: 20, y: 90 }, { x: 20, y: 10 }, { x: 80, y: 10 }, { x: 80, y: 90 },
        { x: 50, y: 10 }, { x: 50, y: 90 }
      ]
    },
    { 
      char: '通',
      imageUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Letters/L-thong.png',
      dots: [
        { x: 50, y: 10 }, { x: 30, y: 30 }, { x: 70, y: 30 }, { x: 30, y: 50 },
        { x: 70, y: 50 }, { x: 50, y: 70 }, { x: 40, y: 90 }, { x: 60, y: 90 }
      ]
    },
    { 
      char: '寶',
      imageUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Letters/L-bao.png',
      dots: [
        { x: 50, y: 10 }, { x: 25, y: 25 }, { x: 75, y: 25 }, { x: 35, y: 40 },
        { x: 65, y: 40 }, { x: 50, y: 55 }, { x: 35, y: 70 }, { x: 65, y: 70 },
        { x: 50, y: 90 }
      ]
    },
];

// Stage 2: Smelting
const SMELTING_DURATION_GOAL_MS = 5000;
const SMELTING_TICK_INTERVAL_MS = 100;
const SMELTING_GREEN_ZONE = { bottom: 65, top: 85 };
const TEMP_DECAY_PER_TICK = 0.4;
const BELLOWS_HEAT_PULSE = 8;

// Stage 3: Casting
const CASTING_LEVELS = [
    { sweetSpot: { start: 65, end: 85 }, speed: 1800 }, // Level 1: width 20, slow
    { sweetSpot: { start: 70, end: 82 }, speed: 1200 }, // Level 2: width 12, medium
    { sweetSpot: { start: 72, end: 80 }, speed: 900 },  // Level 3: width 8, fast
];

const STAGE_TIME_LIMIT = 30;

const CoinMintingScreen: React.FC<{
  missionData: CoinMintingMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}> = ({ missionData, onReturnToMuseum, onComplete }) => {
    const [stage, setStage] = useState<GameStage>('intro');
    const [attempts, setAttempts] = useState(3);
    const [result, setResult] = useState<Result>(null);
    const [timeLeft, setTimeLeft] = useState(STAGE_TIME_LIMIT);

    // Stage 1 State
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [clickedDotIndices, setClickedDotIndices] = useState<number[]>([]);

    // Stage 2 State
    const [temperature, setTemperature] = useState(30);
    const [smeltingProgress, setSmeltingProgress] = useState(0);
    const [bellowsPosition, setBellowsPosition] = useState({ top: '50%', left: '50%' });

    // Stage 3 State
    const [castingRound, setCastingRound] = useState(0);
    
    // Refs
    const nextCharTimeoutRef = useRef<number | null>(null);
    const nextStageTimeoutRef = useRef<number | null>(null);
    const smeltingIntervalRef = useRef<number | null>(null);
    const castingIndicatorRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<number | null>(null);
    const winTimeoutRef = useRef<number | null>(null);

    const task = missionData.tasks[0];
    const rewardImageUrl = ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';

    const resetStage = useCallback((failedStage: GameStage) => {
        playSound('sfx_fail');
        setAttempts(prev => {
            const newAttempts = prev - 1;
            if (newAttempts <= 0) {
                setResult('loss');
                setStage('finished');
            } else {
                switch(failedStage) {
                    case 'engraving':
                        setClickedDotIndices([]);
                        break;
                    case 'smelting':
                        setTemperature(30);
                        setSmeltingProgress(0);
                        break;
                    case 'casting':
                        // No specific state reset needed, just let the animation run.
                        break;
                }
                 setTimeLeft(STAGE_TIME_LIMIT);
            }
            return newAttempts;
        });
    }, []);

    // Timer Logic
    useEffect(() => {
        if (['engraving', 'smelting', 'casting'].includes(stage) && result === null) {
            setTimeLeft(STAGE_TIME_LIMIT); // Reset timer when stage starts
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        resetStage(stage as GameStage); // Cast is safe here
                        return STAGE_TIME_LIMIT;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeLeft(STAGE_TIME_LIMIT);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [stage, result, resetStage]);
    
    const advanceStage = useCallback(() => {
        playSound('sfx_success');
        setStage(currentStage => {
            if (currentStage === 'intro') return 'engraving';
            if (currentStage === 'engraving') return 'engraving-complete';
            if (currentStage === 'engraving-complete') return 'smelting';
            if (currentStage === 'smelting') return 'casting';
            if (currentStage === 'casting') {
                setResult('win');
                return 'finished';
            }
            return currentStage;
        });
    }, []);

    // --- STAGE 1: ENGRAVING LOGIC ---
    const handleDotClick = useCallback((charIndex: number, dotIndex: number) => {
        setClickedDotIndices(prevIndices => {
            if (charIndex !== currentCharIndex || dotIndex !== prevIndices.length) {
                resetStage('engraving');
                return [];
            }
    
            playSound('sfx_click');
            const newIndices = [...prevIndices, dotIndex];
    
            if (newIndices.length === ENGRAVING_CHARS[charIndex].dots.length) {
                if (currentCharIndex < ENGRAVING_CHARS.length - 1) {
                    nextCharTimeoutRef.current = window.setTimeout(() => {
                        setCurrentCharIndex(prev => prev + 1);
                        setClickedDotIndices([]);
                    }, 500);
                } else {
                    nextStageTimeoutRef.current = window.setTimeout(advanceStage, 1000);
                }
            }
            return newIndices;
        });
    }, [currentCharIndex, resetStage, advanceStage]);

    // --- STAGE 2: SMELTING LOGIC ---
    const pumpBellows = useCallback(() => {
        if (stage !== 'smelting') return;
        setTemperature(prev => Math.min(100, prev + BELLOWS_HEAT_PULSE));
        const newTop = Math.random() * 80 + 10;
        const newLeft = Math.random() * 80 + 10;
        setBellowsPosition({ top: `${newTop}%`, left: `${newLeft}%` });
    }, [stage]);
    
    useEffect(() => {
        if (stage !== 'smelting') {
             if (smeltingIntervalRef.current) clearInterval(smeltingIntervalRef.current);
             return;
        }

        smeltingIntervalRef.current = window.setInterval(() => {
            setTemperature(currentTemp => {
                const newTemp = Math.max(0, currentTemp - TEMP_DECAY_PER_TICK);
                
                setSmeltingProgress(currentProgress => {
                    if (newTemp >= SMELTING_GREEN_ZONE.bottom && newTemp <= SMELTING_GREEN_ZONE.top) {
                        const progressIncreasePerTick = (SMELTING_TICK_INTERVAL_MS / SMELTING_DURATION_GOAL_MS) * 100;
                        const newProgress = currentProgress + progressIncreasePerTick;
                        
                        if (newProgress >= 100) {
                            if (smeltingIntervalRef.current) clearInterval(smeltingIntervalRef.current);
                            advanceStage();
                            return 100;
                        }
                        return newProgress;
                    }
                    return currentProgress > 0 ? 0 : currentProgress; // Reset progress if out of zone
                });
                
                return newTemp;
            });
        }, SMELTING_TICK_INTERVAL_MS);

        return () => { if (smeltingIntervalRef.current) clearInterval(smeltingIntervalRef.current); };
    }, [stage, advanceStage]);

    // --- STAGE 3: CASTING LOGIC ---
    const handleCastAttempt = useCallback(() => {
        if (stage !== 'casting' || !castingIndicatorRef.current) return;

        const indicator = castingIndicatorRef.current;
        const bar = indicator.parentElement;
        if (!bar) return;

        indicator.style.animationPlayState = 'paused';

        const indicatorRect = indicator.getBoundingClientRect();
        const barRect = bar.getBoundingClientRect();
        
        const positionPercent = ((indicatorRect.left - barRect.left) / barRect.width) * 100;
        const currentLevel = CASTING_LEVELS[castingRound];
        
        if (positionPercent >= currentLevel.sweetSpot.start && positionPercent <= currentLevel.sweetSpot.end) {
            playSound('sfx_success');
            if (castingRound < CASTING_LEVELS.length - 1) {
                setCastingRound(prev => prev + 1);
                 setTimeout(() => { if (indicator) indicator.style.animationPlayState = 'running'; }, 100);
            } else {
                setResult('win');
                setStage('finished');
            }
        } else {
            resetStage('casting');
            setTimeout(() => { if (indicator) indicator.style.animationPlayState = 'running'; }, 100);
        }
    }, [stage, advanceStage, resetStage, castingRound]);
    
    // --- GENERAL CLEANUP ---
    useEffect(() => {
        return () => {
            if (nextCharTimeoutRef.current) clearTimeout(nextCharTimeoutRef.current);
            if (nextStageTimeoutRef.current) clearTimeout(nextStageTimeoutRef.current);
            if (smeltingIntervalRef.current) clearInterval(smeltingIntervalRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
            if (winTimeoutRef.current) clearTimeout(winTimeoutRef.current);
        };
    }, []);
    
    useEffect(() => {
        if (result === 'win') {
            winTimeoutRef.current = window.setTimeout(() => onComplete(missionData.reward), 2000);
        }
    }, [result, onComplete, missionData.reward]);

    const getDotFillColor = (isClicked: boolean, isNext: boolean) => {
        if (isNext) return '#fde047';
        if (isClicked) return '#facc15';
        return '#a1a1aa';
    };

    const renderContent = () => {
        switch (stage) {
            case 'intro': return (
                <div className="minting-stage-container animate-fadeInScaleUp">
                    <p className="minting-instructions">Hoàng đế Quang Trung giao phó cho bạn nhiệm vụ trọng đại: đúc đồng "Quang Trung Thông Bảo".<br/>Hãy chứng tỏ tài năng của mình qua 3 công đoạn: Khắc Khuôn, Luyện Kim, và Đúc Tiền.</p>
                    <button onClick={advanceStage} className="minting-start-button">Bắt đầu nhiệm vụ!</button>
                </div>
            );
            case 'engraving': return (
                <div className="minting-stage-container animate-fadeInScaleUp">
                    <p className="minting-instructions">Giai đoạn 1: Khắc Khuôn. Nhấp vào điểm đang phát sáng để khắc chữ.</p>
                    <div className="w-full max-w-lg flex flex-wrap justify-center items-center gap-2 md:gap-4 p-4 bg-stone-700 border-4 border-stone-900 rounded-lg">
                        {ENGRAVING_CHARS.map((charData, charIdx) => (
                            <div key={charIdx} className={`char-mold ${currentCharIndex > charIdx ? 'completed' : ''}`}>
                                {currentCharIndex > charIdx ? (
                                    <img src={charData.imageUrl} alt={charData.char} className="w-full h-full object-contain p-2" />
                                ) : currentCharIndex === charIdx ? (
                                    <svg width="100" height="100" viewBox="0 0 100 100">
                                        {charData.dots.map((dot, dotIdx) => {
                                            const isClicked = clickedDotIndices.includes(dotIdx);
                                            const isNext = clickedDotIndices.length === dotIdx;
                                            return <circle key={dotIdx} cx={dot.x} cy={dot.y} r="6" onClick={() => handleDotClick(charIdx, dotIdx)} className={`engraving-dot ${isNext ? 'next-dot' : ''}`} style={{ fill: getDotFillColor(isClicked, isNext) }} />;
                                        })}
                                        {clickedDotIndices.map((clickedIdx, i) => {
                                            if (i === 0) return null;
                                            const p1 = charData.dots[clickedDotIndices[i-1]];
                                            const p2 = charData.dots[clickedIdx];
                                            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="engraving-line" />;
                                        })}
                                    </svg>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'engraving-complete': return (
                 <div className="minting-stage-container animate-fadeInScaleUp">
                    <div className="bg-amber-50 dark:bg-stone-800 p-6 rounded-lg shadow-xl max-w-2xl text-center">
                        <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300">Khuôn đã hoàn thành!</h3>
                        <div className="flex justify-center gap-4 my-4">
                            {ENGRAVING_CHARS.map(char => <img key={char.char} src={char.imageUrl} alt={char.char} className="w-20 h-20 bg-stone-600 rounded p-1"/>)}
                        </div>
                        <h4 className="text-xl font-semibold text-amber-600 dark:text-amber-400">Ý nghĩa lịch sử:</h4>
                        <p className="text-stone-700 dark:text-stone-300 text-left mt-2">
                           Tiền "Quang Trung thông bảo" là một trong những loại tiền xu được đúc dưới triều đại nhà Tây Sơn, đánh dấu một giai đoạn lịch sử quan trọng của Việt Nam. Việc đúc tiền này thể hiện sự độc lập, tự chủ của nhà Tây Sơn và mong muốn khẳng định chủ quyền của mình. Tiền "Quang Trung thông bảo" không chỉ được sử dụng trong nước mà còn được lưu thông ở cả các nước láng giềng, chứng tỏ sự ảnh hưởng của nhà Tây Sơn thời bấy giờ.
                        </p>
                        <button onClick={() => setStage('smelting')} className="minting-start-button mt-6">Tiếp tục Luyện Kim</button>
                    </div>
                </div>
            );
            case 'smelting': return (
                <div className="minting-stage-container animate-fadeInScaleUp">
                     <p className="minting-instructions">Giai đoạn 2: Luyện Kim. Nhấn nút để thổi bễ, giữ nhiệt độ trong vùng màu xanh lá cây.</p>
                     <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        <div id="furnace-visual" className={`w-28 h-28 md:w-36 md:h-36 ${temperature > 60 ? 'heating' : ''}`}></div>
                        <div id="temp-gauge" className="w-12 h-56 md:w-16 md:h-72">
                            <div id="temp-indicator" style={{ height: `${temperature}%` }}></div>
                            <div id="temp-green-zone" style={{ bottom: `${SMELTING_GREEN_ZONE.bottom}%`, height: `${SMELTING_GREEN_ZONE.top - SMELTING_GREEN_ZONE.bottom}%` }}></div>
                        </div>
                        <div id="bellows-container" className="w-48 h-48 md:w-64 md:h-64">
                           <button
                             onClick={pumpBellows}
                             className="bellows-button w-16 h-16 md:w-20 md:h-20 text-3xl md:text-4xl"
                             style={{ top: bellowsPosition.top, left: bellowsPosition.left }}
                             title="Thổi Bễ"
                             aria-label="Thổi Bễ"
                           >
                             🔥
                           </button>
                        </div>
                     </div>
                     <div id="smelting-progress-bar"><div id="smelting-progress-fill" style={{width: `${smeltingProgress}%`}}></div></div>
                </div>
            );
            case 'casting': 
                 const currentCastingLevel = CASTING_LEVELS[castingRound];
                 return (
                 <div className="minting-stage-container animate-fadeInScaleUp" onClick={handleCastAttempt}>
                     <p className="minting-instructions">Giai đoạn 3: Đúc Tiền (Lần {castingRound + 1}/{CASTING_LEVELS.length}). Nhấp chuột khi thanh chỉ báo nằm trong vùng màu xanh lá.</p>
                     <div id="casting-bar">
                        <div id="casting-sweet-spot" style={{ left: `${currentCastingLevel.sweetSpot.start}%`, width: `${currentCastingLevel.sweetSpot.end - currentCastingLevel.sweetSpot.start}%`}}></div>
                        <div ref={castingIndicatorRef} id="casting-indicator" style={{animation: `move-casting-marker ${currentCastingLevel.speed}ms linear infinite alternate`}}></div>
                     </div>
                 </div>
            );
            case 'finished': return (
                 <div className="minting-stage-container animate-fadeInScaleUp">
                    <h3 className={`text-4xl font-bold ${result === 'win' ? 'text-green-400' : 'text-red-400'}`}>{result === 'win' ? 'Đúc thành công!' : 'Nhiệm vụ thất bại!'}</h3>
                    {result === 'win' && <img src={rewardImageUrl} alt={task.name} className="w-40 h-40 my-4"/>}
                    <p className="minting-instructions">{result === 'win' ? 'Bạn đã tạo ra một đồng tiền hoàn hảo cho triều đại!' : `Bạn đã hết số lần thử. Cần cẩn thận hơn!`}</p>
                    {result === 'loss' && <button onClick={onReturnToMuseum} className="minting-start-button">Quay về</button>}
                 </div>
            );
        }
    };


    return (
        <div 
          className="screen-container w-full max-w-4xl p-6 rounded-lg shadow-xl text-center flex flex-col" 
          style={{backgroundImage: `url(${ImageUrls.FORGE_ANVIL_BG_URL})`, backgroundSize: 'cover'}}
        >
            <div className="w-full flex justify-between items-start z-10">
                 <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Quay về</button>
                 {stage !== 'intro' && stage !== 'finished' && stage !== 'engraving-complete' && (
                    <div className="minting-hud">
                        <span className="mr-4">Số lần thử: {attempts} ❤️</span>
                        <span>Thời gian: {timeLeft}s</span>
                    </div>
                )}
            </div>
            <div className="flex-grow flex items-center justify-center w-full">
                {renderContent()}
            </div>
        </div>
    );
};

export default CoinMintingScreen;