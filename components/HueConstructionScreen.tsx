// components/HueConstructionScreen.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HueConstructionMissionData, Reward, HueBuilding } from '../types';
import { playSound } from '../utils/audio';

// --- Types ---
const scoreEffectIcons = {
    uy_nghi: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-uy-nghi.png',
    phong_thuy: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-phong-thuy.png',
    than_dao: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-dung-dao.png'
};

const constructionRanks = [
  { threshold: 1500, title: 'Bậc thầy Kiến tạo' },
  { threshold: 1000, title: 'Nhà Quy hoạch Sáng giá' },
  { threshold: 700, title: 'Kiến trúc sư Tài ba' },
  { threshold: 0, title: 'Kiến trúc sư Tập sự' }
];

type ScorePopup = {
    id: number;
    iconUrl: string;
    x: number;
    y: number;
};

type HistoricalEvent = {
    id: string;
    title: string;
    description: string;
    choices: {
        text: string;
        effect: () => void;
    }[];
};

interface HueConstructionScreenProps {
    missionData: HueConstructionMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward, data?: any) => void;
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const MISTAKE_LIMIT = 3;

// --- Component ---
const HueConstructionScreen: React.FC<HueConstructionScreenProps> = ({
    missionData,
    onReturnToMuseum,
    onComplete,
    inventory,
    setInventory,
}) => {
    // Game State
    const [phase, setPhase] = useState(1);
    const [uyNghi, setUyNghi] = useState(0);
    const [vatTu, setVatTu] = useState(missionData.initialVatTu);
    const [placedBuildings, setPlacedBuildings] = useState<Record<string, { x: number; y: number }>>({});
    
    // UI State
    const [draggedBuilding, setDraggedBuilding] = useState<HueBuilding | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<HueBuilding | null>(null); // For mobile tap-to-select
    const [dragOverZone, setDragOverZone] = useState<string | null>(null);
    const [showAdvisor, setShowAdvisor] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);
    const [activeHistoricalEvent, setActiveHistoricalEvent] = useState<HistoricalEvent | null>(null);

    // New states for enhanced gameplay
    const [timeLeft, setTimeLeft] = useState(90);
    const [mistakes, setMistakes] = useState(0);
    const [currentCosts, setCurrentCosts] = useState<Record<string, number>>({});
    const [isPaused, setIsPaused] = useState(true); // Game starts paused

    // Results State
    const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [scoreBreakdown, setScoreBreakdown] = useState({ base: 0, phongThuy: 0, thanDao: 0 });
    const [finalRank, setFinalRank] = useState('');
    const [finalReward, setFinalReward] = useState(0);
    const [lossReason, setLossReason] = useState('');

    const historicalEvents: HistoricalEvent[] = useMemo(() => [
        {
            id: 'flood',
            title: 'Lụt lội ở Thuận Hóa',
            description: 'Tâu Bệ hạ, một trận lụt lớn bất ngờ ập đến, kho vật tư bị thiệt hại. Tuy nhiên, nhờ giúp dân chống lụt, uy tín của triều đình tăng cao.',
            choices: [
                { text: 'Chấp nhận thực tại.', effect: () => { setVatTu(v => Math.max(0, v - 100)); setUyNghi(u => u + 50); } },
            ]
        },
        {
            id: 'trade',
            title: 'Thương nhân ngoại quốc đến',
            description: 'Một đoàn thuyền buôn từ phương Tây cập bến, họ mong muốn trao đổi vật liệu xây dựng quý hiếm để lấy các sản vật địa phương. Đây là cơ hội tốt để có thêm Vật tư.',
            choices: [
                { text: 'Tiến hành trao đổi (+150 Vật tư)', effect: () => setVatTu(v => v + 150) },
                { text: 'Từ chối, tự lực cánh sinh', effect: () => { /* No change */ } },
            ]
        },
        {
            id: 'plague',
            title: 'Dịch bệnh hoành hành',
            description: 'Dịch bệnh đang lây lan trong dân chúng. Chúng ta cần hành động!',
            choices: [
                { text: 'Xuất ngân khố, mua thuốc men cứu chữa (-100 Vật tư, +50 Uy nghi)', effect: () => { setVatTu(v => Math.max(0, v - 100)); setUyNghi(u => u + 50); } },
                { text: 'Cầu trời khấn phật cho qua tai kiếp', effect: () => setUyNghi(u => Math.max(0, u - 20)) },
            ]
        },
        {
            id: 'corruption',
            title: 'Quan lại tham nhũng',
            description: 'Phát hiện một số quan viên trong công bộ lợi dụng chức quyền, khai khống chi phí xây dựng để tham ô. Uy tín triều đình bị ảnh hưởng.',
            choices: [
                { text: 'Trừng trị nghiêm khắc, tịch thu tài sản (-100 Vật tư, +40 Uy nghi)', effect: () => { setVatTu(v => Math.max(0, v - 100)); setUyNghi(u => u + 40); } },
                { text: 'Làm ngơ để yên chuyện (-30 Uy nghi)', effect: () => setUyNghi(u => Math.max(0, u - 30)) },
            ]
        },
        {
            id: 'fire',
            title: 'Hỏa hoạn tại công trường',
            description: 'Một vụ hỏa hoạn không may đã xảy ra tại kho chứa gỗ, gây thiệt hại nặng nề về vật tư.',
            choices: [
                { text: 'Thật không may! (-200 Vật tư)', effect: () => setVatTu(v => Math.max(0, v - 200)) },
            ]
        },
        {
            id: 'typhoon',
            title: 'Bão lớn đổ bộ',
            description: 'Một cơn bão lớn bất ngờ đổ bộ, làm hư hại các công trình đang xây dựng dở dang và cuốn trôi một số vật tư.',
            choices: [
                { text: 'Khẩn trương khắc phục! (-150 Vật tư)', effect: () => setVatTu(v => Math.max(0, v - 150)) },
            ]
        },
        {
            id: 'good_omen',
            title: 'Phát hiện điềm lành',
            description: 'Tâu Bệ hạ, các nhà chiêm tinh vừa quan sát thấy rồng vàng xuất hiện trên sông Hương. Đây là điềm đại cát, lòng dân phấn khởi, sĩ khí tăng cao!',
            choices: [
                { text: 'Thật là trời giúp ta! (+100 Uy nghi)', effect: () => setUyNghi(u => u + 100) },
            ]
        }
    ], []);


    const resetGame = useCallback(() => {
        setPhase(1);
        setUyNghi(0);
        setVatTu(missionData.initialVatTu);
        setPlacedBuildings({});
        setDraggedBuilding(null);
        setSelectedBuilding(null);
        setShowAdvisor(true);
        setIsComplete(false);
        setScorePopups([]);
        setIsPhaseTransitioning(false);
        setActiveHistoricalEvent(null);
        setShowResultsModal(false);
        setScoreBreakdown({ base: 0, phongThuy: 0, thanDao: 0 });
        setFinalRank('');
        setFinalReward(0);
        setTimeLeft(90);
        setMistakes(0);
        const initialCosts = missionData.buildings.reduce((acc, b) => ({ ...acc, [b.id]: b.cost }), {});
        setCurrentCosts(initialCosts);
        setIsPaused(true);
        setLossReason('');
    }, [missionData]);

    useEffect(() => {
        resetGame();
    }, [missionData, resetGame]);

    const handleGameOver = useCallback((reason: string) => {
        setIsComplete(true);
        setIsPaused(true);
        setLossReason(reason);
        setFinalRank("Thất bại");
        setFinalReward(0);
        setTimeout(() => setShowResultsModal(true), 1500);
    }, []);
    
    const triggerHistoricalEvent = useCallback(() => {
        const event = historicalEvents[Math.floor(Math.random() * historicalEvents.length)];
        setActiveHistoricalEvent(event);
    }, [historicalEvents]);

    // Game loop timer
    useEffect(() => {
        if (isPaused || isComplete) return;

        const intervalId = setInterval(() => {
            // Timer countdown
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    handleGameOver("Hết giờ!");
                    return 0;
                }
                const newTime = prevTime - 1;
                
                // Cost fluctuation (e.g., every 15 seconds)
                if (newTime > 0 && newTime % 15 === 0) {
                    setCurrentCosts(prevCosts => {
                        const newCosts: Record<string, number> = {};
                        missionData.buildings.forEach(b => {
                            const fluctuation = (Math.random() - 0.5) * 0.4; // +/- 20%
                            newCosts[b.id] = Math.max(10, Math.round(b.cost * (1 + fluctuation)));
                        });
                        return newCosts;
                    });
                }

                // Random event trigger
                if (newTime > 0 && newTime % 12 === 0 && Math.random() < 0.45) {
                    if (!activeHistoricalEvent && !showAdvisor) {
                        setIsPaused(true); // Pause for event
                        triggerHistoricalEvent();
                    }
                }
                
                return newTime;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isPaused, isComplete, missionData.buildings, handleGameOver, activeHistoricalEvent, showAdvisor, triggerHistoricalEvent]);

    const paletteBuildings = useMemo(() => {
        return missionData.buildings.filter(b => b.phase === phase && !placedBuildings[b.id]);
    }, [phase, placedBuildings, missionData.buildings]);

    const createScorePopup = (type: keyof typeof scoreEffectIcons, x: number, y: number) => {
        const newPopup: ScorePopup = {
            id: Date.now() + Math.random(),
            iconUrl: scoreEffectIcons[type],
            x,
            y,
        };
        setScorePopups(currentPopups => [...currentPopups, newPopup]);
        setTimeout(() => {
            setScorePopups(currentPopups => currentPopups.filter(p => p.id !== newPopup.id));
        }, 1500);
    };

    const calculateScore = useCallback((building: HueBuilding, locationId: string) => {
        const dropZone = missionData.dropZones.find(dz => dz.id === locationId);
        if (!dropZone) return;

        let basePoints = 50;
        let phongThuyPoints = 0;
        let thanDaoPoints = 0;

        if (building.id === locationId) {
            basePoints += 50;
            phongThuyPoints = dropZone.phongThuyBonus || 0;
            thanDaoPoints = dropZone.thanDaoBonus || 0;
        }

        const totalScoreForBuilding = basePoints + phongThuyPoints + thanDaoPoints;
        setUyNghi(prev => prev + totalScoreForBuilding);
        setScoreBreakdown(prev => ({
            base: prev.base + basePoints,
            phongThuy: prev.phongThuy + phongThuyPoints,
            thanDao: prev.thanDao + thanDaoPoints,
        }));
        
        createScorePopup('uy_nghi', dropZone.x, dropZone.y);
        if (phongThuyPoints > 0) createScorePopup('phong_thuy', dropZone.x + 5, dropZone.y);
        if (thanDaoPoints > 0) createScorePopup('than_dao', dropZone.x - 5, dropZone.y);
    }, [missionData.dropZones]);
    
    // Unified function to handle placing a building, works for both D&D and Tap
    const placeBuilding = (building: HueBuilding, zoneId: string) => {
        const zone = missionData.dropZones.find(z => z.id === zoneId);
        if (!zone || zone.phase !== phase || placedBuildings[zone.id]) {
            playSound('sfx_fail');
            return;
        }

        const currentCost = currentCosts[building.id] || building.cost;
        if (vatTu < currentCost) {
            playSound('sfx_fail');
            alert("Không đủ Vật tư!");
            return;
        }

        if (building.id !== zoneId) {
            playSound('sfx_fail');
            const newMistakeCount = mistakes + 1;
            const penalty = 20;
            setMistakes(newMistakeCount);
            setVatTu(v => Math.max(0, v - penalty));
            alert(`Đặt sai vị trí! Bị phạt ${penalty} Vật tư. (Lỗi ${newMistakeCount}/${MISTAKE_LIMIT})`);

            if (newMistakeCount >= MISTAKE_LIMIT) {
                handleGameOver("Phạm quá nhiều lỗi!");
            }
            return;
        }

        playSound('sfx_build');
        setVatTu(prev => prev - currentCost);
        setPlacedBuildings(prev => ({ ...prev, [zoneId]: { x: zone.x, y: zone.y } }));
        calculateScore(building, zoneId);
    };
    
    const handlePaletteItemClick = (building: HueBuilding) => {
        const currentCost = currentCosts[building.id] || building.cost;
        if (vatTu < currentCost || isPhaseTransitioning) return;
        playSound('sfx_click');
        setSelectedBuilding(prev => (prev?.id === building.id ? null : building));
    };
    
    const handleZoneClick = (zoneId: string) => {
        if (selectedBuilding) {
            placeBuilding(selectedBuilding, zoneId);
            setSelectedBuilding(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, zoneId: string) => {
        e.preventDefault();
        setDragOverZone(null);
        if (draggedBuilding) {
            placeBuilding(draggedBuilding, zoneId);
        }
        setDraggedBuilding(null);
    };

    const handleWinGame = useCallback(() => {
        setIsComplete(true);
        setIsPaused(true);
        playSound('sfx_unlock');
    
        const totalScore = scoreBreakdown.base + scoreBreakdown.phongThuy + scoreBreakdown.thanDao;
        const calculatedRank = constructionRanks.find(rank => totalScore >= rank.threshold)?.title || 'Kiến trúc sư Tập sự';
        const calculatedReward = Math.floor(totalScore / 10);
    
        setFinalRank(calculatedRank);
        setFinalReward(calculatedReward);
        
        setTimeout(() => {
            setShowResultsModal(true);
        }, 1500);
    }, [scoreBreakdown]);

    const advanceToNextPhase = useCallback(() => {
        setPhase(current => current + 1);
        setShowAdvisor(true);
        setIsPaused(true); // Pause for advisor
        playSound('sfx_unlock');
        setIsPhaseTransitioning(false);
    }, []);

    const handleEventChoice = (effect: () => void) => {
        playSound('sfx_click');
        effect();
        setActiveHistoricalEvent(null);
        setIsPaused(false);
    };

    useEffect(() => {
        if (isComplete || isPhaseTransitioning) return;
    
        const buildingsForCurrentPhase = missionData.buildings.filter(b => b.phase === phase);
        if (buildingsForCurrentPhase.length === 0) return;
    
        const allPlacedForPhase = buildingsForCurrentPhase.every(b => placedBuildings[b.id]);
    
        if (allPlacedForPhase) {
            setIsPhaseTransitioning(true);
            const maxPhase = Math.max(...missionData.phaseGoals.map(g => g.phase));
            if (phase >= maxPhase) {
                handleWinGame();
            } else {
                setTimeout(() => advanceToNextPhase(), 1000);
            }
        }
    }, [placedBuildings, phase, isComplete, isPhaseTransitioning, missionData, handleWinGame, advanceToNextPhase]);

    const handleReturnToMuseumWithReward = () => {
        if (lossReason === '') {
            setInventory(prev => ({
                ...prev,
                'vat-tu': (prev['vat-tu'] || 0) + finalReward,
            }));
            onComplete(missionData.reward);
        } else {
            onReturnToMuseum(); // Return without reward on loss
        }
    };

    const renderResultsModal = () => {
        if (!showResultsModal) return null;
        const isWin = lossReason === '';
        const totalScore = scoreBreakdown.base + scoreBreakdown.phongThuy + scoreBreakdown.thanDao;
        return (
            <div id="results-screen-modal">
                <div className="results-content">
                    <div className="results-box">
                        <h2 className={isWin ? 'text-green-700' : 'text-red-700'}>
                            {isWin ? 'Hoàn Thành Nhiệm Vụ' : 'Nhiệm Vụ Thất Bại'}
                        </h2>
                        <h3 className="text-stone-700">{isWin ? `Danh hiệu: ` : `Lý do: `}<span id="player-rank" className={isWin ? 'text-amber-700' : 'text-red-600'}>{isWin ? finalRank : lossReason}</span></h3>
                        {isWin && (
                            <>
                                <ul id="score-breakdown-list">
                                    <li><span>Điểm Xây dựng cơ bản:</span> <span>{scoreBreakdown.base}</span></li>
                                    <li><span>Điểm thưởng Phong Thủy:</span> <span>{scoreBreakdown.phongThuy}</span></li>
                                    <li><span>Điểm thưởng Thần Đạo:</span> <span>{scoreBreakdown.thanDao}</span></li>
                                    <li><span>Tổng Uy Nghi:</span> <span>{totalScore}</span></li>
                                </ul>
                                <p id="final-reward-text">Phần thưởng tổng kết: <span id="final-reward">{finalReward}</span> Vật tư</p>
                            </>
                        )}
                    </div>
                    <div className="results-buttons">
                        <button className="play-again-btn" onClick={resetGame}>Chơi lại</button>
                        <button className="return-museum-btn" onClick={handleReturnToMuseumWithReward}>{isWin ? 'Về Bảo tàng & Nhận thưởng' : 'Về Bảo tàng'}</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div id="hue-construction-screen">
            {renderResultsModal()}

            {showAdvisor && missionData.advisorTips[phase] && !activeHistoricalEvent && (
                <div id="advisor-modal" onClick={() => { setShowAdvisor(false); setIsPaused(false); }}>
                    <div className="advisor-content" onClick={e => e.stopPropagation()}>
                        <h3>{missionData.advisorTips[phase].title}</h3>
                        <p>{missionData.advisorTips[phase].text}</p>
                        <button onClick={() => { setShowAdvisor(false); setIsPaused(false); }}>Thần đã rõ!</button>
                    </div>
                </div>
            )}

            {activeHistoricalEvent && (
                <div id="historical-event-modal" className="advisor-modal">
                    <div className="advisor-content" onClick={e => e.stopPropagation()}>
                        <h3>Sự Kiện Bất Ngờ: {activeHistoricalEvent.title}</h3>
                        <p>{activeHistoricalEvent.description}</p>
                        <div className="event-choices">
                            {activeHistoricalEvent.choices.map((choice, index) => (
                                <button key={index} onClick={() => handleEventChoice(choice.effect)}>
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            <div id="construction-hud">
                <div className="hud-stat">Lỗi: <span className={mistakes > 0 ? 'text-red-400' : 'text-white'}>{mistakes}/{MISTAKE_LIMIT}</span></div>
                <div className="hud-stat">Thời gian: <span className={timeLeft <= 15 ? 'text-red-400' : 'text-white'}>{timeLeft}s</span></div>
                <div className="hud-stat">Uy Nghi: <span>{uyNghi}</span></div>
                <h2 className="text-2xl font-bold text-center flex-grow text-white text-shadow-glow">Thuận Thiên Ý - Kiến Tạo Kinh Thành</h2>
                <div className="hud-stat">Vật Tư: <span>{vatTu}</span></div>
            </div>

            <div id="game-body">
                <div id="building-palette">
                    <h3 id="palette-title">Công Trình Giai Đoạn {phase}</h3>
                    <div id="palette-items">
                        {paletteBuildings.map(building => {
                            const currentCost = currentCosts[building.id] || building.cost;
                            return (
                                <div 
                                    key={building.id}
                                    draggable={vatTu >= currentCost && !isPhaseTransitioning}
                                    onDragStart={() => setDraggedBuilding(building)}
                                    onClick={() => handlePaletteItemClick(building)}
                                    className={`palette-item ${vatTu < currentCost || isPhaseTransitioning ? 'disabled' : ''} ${selectedBuilding?.id === building.id ? 'selected-for-placement' : ''}`}
                                    title={`${building.name} (Chi phí: ${currentCost})`}
                                >
                                    <img src={building.iconUrl} alt={building.name} />
                                    <div className="item-info">
                                        <p className="font-bold">{building.name}</p>
                                        <p className="text-sm">Chi phí: {currentCost} Vật tư</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div id="hue-planning-grid" onClick={() => setSelectedBuilding(null)}>
                    <div id="phase-indicator">Giai Đoạn: {phase}</div>
                    
                    {missionData.dropZones.filter(z => z.phase === phase).map(zone => (
                        <div
                            key={zone.id}
                            className={`drop-zone ${dragOverZone === zone.id ? 'drag-over' : ''}`}
                            style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                            onDragOver={e => { e.preventDefault(); setDragOverZone(zone.id); }}
                            onDragLeave={() => setDragOverZone(null)}
                            onDrop={(e) => { e.stopPropagation(); handleDrop(e, zone.id); }}
                            onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}
                        />
                    ))}

                    {Object.entries(placedBuildings).map(([id, pos]) => {
                         const building = missionData.buildings.find(b => b.id === id);
                         if (!building) return null;
                         const zone = missionData.dropZones.find(z => z.id === id);
                         if (!zone) return null;

                        return <img key={id} src={building.iconUrl} alt={building.name} className="placed-building" style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }} />;
                    })}

                    {scorePopups.map(p => (
                        <div key={p.id} className="score-popup" style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundImage: `url(${p.iconUrl})` }} />
                    ))}
                    
                    {isComplete && !showResultsModal && (
                        <div id="completion-overlay">
                            <h2>Kinh Thành Hoàn Tất!</h2>
                            <p className="text-xl text-amber-800">Ngài đã xây dựng nên một công trình để đời, xứng danh Thiên tử!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HueConstructionScreen;
