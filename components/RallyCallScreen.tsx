import React, { useState, useEffect, useMemo } from 'react';
import { RallyCallMissionData, Reward } from '../types';
import { playSound } from '../utils/audio';
import { ALL_FRAGMENTS_MAP, ALL_ARTIFACTS_MAP } from '../constants';
import * as ImageUrls from '../imageUrls';

type ParsedPart = { type: 'blank'; index: number } | { type: 'word'; text: string } | { type: 'text'; text: string };

interface RallyCallScreenProps {
    missionData: RallyCallMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward?: Reward) => void;
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const RallyCallScreen: React.FC<RallyCallScreenProps> = ({
    missionData,
    onReturnToMuseum,
    onComplete,
    inventory,
    setInventory,
}) => {
    // --- Common State ---
    const [isComplete, setIsComplete] = useState(false);
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);

    // --- Discriminated Union Check ---
    const isFillBlankGame = 'fullText' in missionData && missionData.fullText !== undefined;

    // --- State for Morale Game ---
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [morale, setMorale] = useState(0);
    const [isShaking, setIsShaking] = useState(false);

    // --- State for Fill-in-the-Blank Game ---
    const [isLoadingPuzzle, setIsLoadingPuzzle] = useState(false);
    const [puzzleError, setPuzzleError] = useState<string | null>(null);
    const [generatedText, setGeneratedText] = useState(''); // Text with _BLANK_ from Gemini
    const [definitions, setDefinitions] = useState<Record<string, string>>({}); // Definitions from Gemini
    const [blanks, setBlanks] = useState<string[]>([]); // Correct answers from Gemini
    const [wordBank, setWordBank] = useState<string[]>([]);
    const [filledSlots, setFilledSlots] = useState<(string | null)[]>([]);
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [highlightedElements, setHighlightedElements] = useState<{ slot: number; word: string } | null>(null);

    // --- Memos ---
    const rewardImageUrl = useMemo(() => {
        const reward = missionData.reward;
        if (reward.type === 'artifact') return ALL_ARTIFACTS_MAP[reward.id]?.imageUrl || '';
        if (reward.type === 'fragment') return ALL_FRAGMENTS_MAP[reward.id]?.imageUrl || '';
        return '';
    }, [missionData.reward]);

    const parsedHichContent: ParsedPart[] = useMemo(() => {
        if (!isFillBlankGame || !generatedText) return [];
    
        // Create a regex to split the text by blanks and defined words
        const regexParts: string[] = ['(_BLANK_)'];
        Object.keys(definitions).forEach(key => {
            if (key.trim()) {
                 const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                 regexParts.push(`(${escapedKey})`);
            }
        });
        const splitRegex = new RegExp(regexParts.join('|'), 'g');
    
        const parts = generatedText.split(splitRegex).filter(Boolean);
        let blankCounter = 0;
    
        return parts.reduce((acc: ParsedPart[], part) => {
            if (part === '_BLANK_') {
                acc.push({ type: 'blank', index: blankCounter++ });
            } else if (definitions[part]) {
                acc.push({ type: 'word', text: part });
            } else {
                 acc.push({ type: 'text', text: part });
            }
            return acc;
        }, []);
    }, [isFillBlankGame, generatedText, definitions]);

    // --- Effects ---
    useEffect(() => {
        // General reset
        setIsComplete(false);
        setOutcome(null);
        setTooltip({ visible: false, content: '', x: 0, y: 0 });
        setHighlightedElements(null);

        if (isFillBlankGame) {
            const generatePuzzle = async () => {
                setIsLoadingPuzzle(true);
                setPuzzleError(null);
                try {
                    const response = await fetch('/.netlify/functions/gemini-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'generate_hich_puzzle',
                            hichText: missionData.fullText,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `Lỗi máy chủ: ${response.status}`);
                    }
                    
                    const data = await response.json();

                    if (!data.modifiedText || !Array.isArray(data.answers) || typeof data.definitions !== 'object') {
                        throw new Error("Dữ liệu nhận về từ AI không hợp lệ.");
                    }
                    
                    setGeneratedText(data.modifiedText);
                    setBlanks(data.answers);
                    setWordBank(shuffleArray(data.answers));
                    setFilledSlots(Array(data.answers.length).fill(null));
                    setDefinitions(data.definitions);

                } catch (e: any) {
                    console.error("Failed to generate puzzle:", e);
                    setPuzzleError(e.message || "Không thể tạo thử thách. Vui lòng thử lại.");
                } finally {
                    setIsLoadingPuzzle(false);
                }
            };

            generatePuzzle();

        } else {
            // Setup for morale game
            setCurrentRoundIndex(0);
            setMorale(0);
        }
    }, [missionData, isFillBlankGame]);

    // --- Morale Game Handlers ---
    const handleMoraleChoiceClick = (points: number) => {
        if (isComplete) return;

        const newMorale = morale + points;
        setMorale(newMorale);
        playSound(points > 10 ? 'sfx_success' : 'sfx_click');
        
        if (points > 20) { // Shake screen on big morale boosts
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);
        }

        if (currentRoundIndex < missionData.rounds!.length - 1) {
            setTimeout(() => setCurrentRoundIndex(prev => prev + 1), 500);
        } else {
            setIsComplete(true);
            const maxMorale = missionData.rounds!.reduce((acc, round) => acc + Math.max(...round.choices.map(c => c.moralePoints)), 0);
            if (newMorale >= maxMorale * 0.7) { // 70% threshold to win
                setOutcome('win');
                playSound('sfx_unlock');
                setTimeout(() => onComplete(missionData.reward), 2000);
            } else {
                setOutcome('loss');
                playSound('sfx_fail');
            }
        }
    };
    
    // --- Fill-in-the-Blank Handlers ---
    const handleWordDragStart = (e: React.DragEvent, word: string, source: 'bank' | 'slot', index: number) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ word, source, index }));
    };
    const handleSlotDrop = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const { word, source, index: sourceIndex } = data;
        
        const newSlots = [...filledSlots];
        const newBank = [...wordBank];

        const wordInTargetSlot = newSlots[slotIndex];

        if (source === 'bank') {
            newBank.splice(sourceIndex, 1);
            if (wordInTargetSlot) newBank.push(wordInTargetSlot);
        } else { // source is 'slot'
            newSlots[sourceIndex] = wordInTargetSlot;
        }

        newSlots[slotIndex] = word;
        setFilledSlots(newSlots);
        setWordBank(newBank);
    };

    const handleBankDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.source !== 'slot') return;
        
        const newSlots = [...filledSlots];
        newSlots[data.index] = null;
        setFilledSlots(newSlots);
        setWordBank(prev => [...prev, data.word]);
    };

    const handleTooltip = (e: React.MouseEvent, term: string) => {
        const definition = definitions[term];
        if (definition) {
            setTooltip({ visible: true, content: definition, x: e.clientX, y: e.clientY });
        }
    };
    const hideTooltip = () => setTooltip(prev => ({ ...prev, visible: false }));

    const handleHint = () => {
        if (!isFillBlankGame || (inventory['vat-tu'] || 0) < 10) {
            playSound('sfx_fail');
            alert((inventory['vat-tu'] || 0) < 10 ? "Không đủ Vật tư!" : "Lỗi!");
            return;
        }

        const firstEmptySlot = filledSlots.findIndex(s => s === null);
        if (firstEmptySlot === -1) {
            alert("Tất cả các ô đã được điền!");
            return;
        }

        playSound('sfx-click');
        setInventory(prev => ({ ...prev, 'vat-tu': prev['vat-tu'] - 10 }));
        
        const correctWord = blanks[firstEmptySlot];
        setHighlightedElements({ slot: firstEmptySlot, word: correctWord });
        setTimeout(() => setHighlightedElements(null), 2500);
    };

    const checkHichAnswers = () => {
        if (!isFillBlankGame) return;
        const isCorrect = filledSlots.every((word, i) => word === blanks[i]);
        setIsComplete(true);
        if (isCorrect) {
            playSound('sfx-unlock');
            setOutcome('win');
            setTimeout(() => onComplete(missionData.reward), 2000);
        } else {
            playSound('sfx-fail');
            setOutcome('loss');
        }
    };


    // --- RENDER LOGIC ---
    const renderOutcomeOverlay = (title: string, message: string) => {
        if (!isComplete) return null;
        return (
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp p-4">
                <h3 className="text-4xl font-bold">{title}</h3>
                <p className="mt-2 text-xl text-center">{message}</p>
                {outcome === 'win' && rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-24 h-24 object-contain my-4" />}
                {outcome === 'loss' && <button onClick={onReturnToMuseum} className="action-button mt-4 bg-amber-600 text-white">Quay về</button>}
            </div>
        );
    };

    // RENDER MORALE GAME
    if (!isFillBlankGame) {
        const currentRound = missionData.rounds![currentRoundIndex];
        const maxMoralePossible = missionData.rounds!.reduce((acc, round) => acc + Math.max(...round.choices.map(c => c.moralePoints)), 0);
        const moralePercentage = maxMoralePossible > 0 ? (morale / maxMoralePossible) * 100 : 0;
        let moraleBarColor = 'bg-red-500';
        if (moralePercentage > 70) moraleBarColor = 'bg-yellow-400';
        else if (moralePercentage > 35) moraleBarColor = 'bg-yellow-500';

        return (
            <div className={`rally-call-screen screen-container w-full max-w-2xl min-h-[80vh] rounded-lg shadow-xl ${isShaking ? 'screen-shaking' : ''}`} style={{ backgroundImage: `url(${moralePercentage > 50 ? ImageUrls.RALLY_CALL_BG_HIGH_MORALE_URL : ImageUrls.RALLY_CALL_BG_LOW_MORALE_URL})` }}>
                <div className="rally-content">
                    <button onClick={onReturnToMuseum} className="absolute top-4 left-4 bg-amber-800/70 hover:bg-amber-700/80 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10">Quay về</button>
                    <header className="text-center mb-4">
                        <h2 className="text-3xl font-bold text-amber-200 mb-2 font-serif text-shadow-lg">{missionData.title}</h2>
                        <label htmlFor="morale-bar" className="block text-sm font-semibold text-amber-100 mb-1">SĨ KHÍ</label>
                        <div className="morale-bar-container"><div id="morale-bar" className={`morale-bar-fill ${moraleBarColor}`} style={{ width: `${moralePercentage}%` }}></div></div>
                    </header>
                    {!isComplete && currentRound && (
                        <>
                            <div className="oath-prompt"><p>{currentRound.prompt}</p></div>
                            <div className="oath-choices-grid">
                                {currentRound.choices.map((choice, index) => (
                                    <button key={choice.id} onClick={() => handleMoraleChoiceClick(choice.moralePoints)} className="oath-choice-button p-4 rounded-lg text-lg">
                                        <img src={choice.iconUrl} alt="" />
                                        <span>{choice.text}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                {renderOutcomeOverlay(
                    outcome === 'win' ? 'Thành công!' : 'Thất bại!',
                    outcome === 'win' ? 'Lời hiệu triệu đã vang dội non sông!' : 'Cần thêm khí thế! Hãy thử lại.'
                )}
            </div>
        );
    }
    
    // RENDER FILL-IN-THE-BLANK GAME (with loading/error states)
    if (isLoadingPuzzle) {
        return (
            <div className="screen-container w-full max-w-4xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mb-4"></div>
                <p className="text-xl text-amber-600 dark:text-amber-400">Đang tạo thử thách mới...</p>
            </div>
        );
    }

    if (puzzleError) {
         return (
            <div className="screen-container w-full max-w-4xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-xl text-red-600 dark:text-red-400 mb-4">Lỗi: {puzzleError}</p>
                <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">Quay về Bảo tàng</button>
            </div>
        );
    }

    return (
        <div className="screen-container w-full max-w-4xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col items-center">
            <button onClick={onReturnToMuseum} className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-10">Quay về</button>
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300 mb-4">{missionData.title}</h2>

            <div id="hich-content" className="w-full bg-amber-50 dark:bg-stone-700 p-6 rounded-lg shadow-inner text-lg leading-loose">
                {parsedHichContent.map((part, i) => {
                    if (part.type === 'blank') {
                        const isHighlighted = highlightedElements?.slot === part.index;
                        return (
                            <div key={`blank-${part.index}`} className={`blank-slot ${isHighlighted ? 'highlight-hint' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleSlotDrop(e, part.index)}>
                                {filledSlots[part.index] && (
                                    <div className="draggable-phrase" draggable onDragStart={(e) => handleWordDragStart(e, filledSlots[part.index]!, 'slot', part.index)}>
                                        {filledSlots[part.index]}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    if (part.type === 'word') {
                        return <span key={`word-${i}`} className="difficult-word" onMouseEnter={(e) => handleTooltip(e, part.text)} onMouseLeave={hideTooltip}>{part.text}</span>;
                    }
                    return <span key={`text-${i}`}>{part.text}</span>;
                })}
            </div>
            
            <div id="tooltip" className={tooltip.visible ? 'visible' : ''} style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}>{tooltip.content}</div>

            <div className="flex flex-col md:flex-row gap-4 w-full mt-6">
                <div id="word-bank" className="flex-grow p-4 bg-amber-100 dark:bg-stone-800 border-2 border-dashed border-amber-400 dark:border-amber-600 rounded-lg" onDragOver={(e) => e.preventDefault()} onDrop={handleBankDrop}>
                    {wordBank.map((word, i) => {
                         const isHighlighted = highlightedElements?.word === word;
                        return (
                             <div key={`${word}-${i}`} className={`draggable-phrase m-1 ${isHighlighted ? 'highlight-hint' : ''}`} draggable onDragStart={(e) => handleWordDragStart(e, word, 'bank', i)}>
                                {word}
                            </div>
                        );
                    })}
                    {wordBank.length === 0 && <p className="text-center text-stone-500 italic">Tất cả các từ đã được sử dụng.</p>}
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                     <button onClick={handleHint} className="action-button bg-blue-500 hover:bg-blue-600 text-white" disabled={(inventory['vat-tu'] || 0) < 10}>Gợi ý (10 Vật tư)</button>
                     <button onClick={checkHichAnswers} className="action-button bg-green-600 hover:bg-green-700 text-white">Kiểm tra Đáp án</button>
                </div>
            </div>

            {renderOutcomeOverlay(
                 outcome === 'win' ? 'Hoàn thành!' : 'Thất bại!',
                 outcome === 'win' ? 'Bạn đã soạn thành công Hịch Tướng Sĩ!' : 'Có lỗi sai trong bài hịch. Hãy thử lại!'
            )}
        </div>
    );
};

export default RallyCallScreen;