// components/NewspaperPublisherScreen.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { NewspaperPublisherMissionData, Reward, ArticleChoice, UpgradeDefinition, SpecialEvent, SpecialEventStage } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP } from '../constants';

// --- Helper Components ---

const StatBar: React.FC<{ label: string; value: number; max: number; icon: string }> = ({ label, value, max, icon }) => {
    const percentage = (value / max) * 100;
    let barColor = 'bg-green-500';
    if (label === 'Nguy Cơ') {
        if (percentage > 75) barColor = 'bg-red-500';
        else if (percentage > 40) barColor = 'bg-yellow-500';
        else barColor = 'bg-blue-500';
    } else if (label === 'Ngân Sách' && percentage < 25) {
        barColor = 'bg-red-500';
    }
    return (
        <div className="stat-bar-container">
            <span className="stat-icon">{icon}</span>
            <div className="stat-bar-track">
                <div className={`stat-bar-fill ${barColor}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="stat-label">{label}: {value}/{max}</span>
        </div>
    );
};

const ArticleCard: React.FC<{ choice: ArticleChoice; onSelect: () => void; disabled: boolean }> = ({ choice, onSelect, disabled }) => (
    <div className={`article-card ${disabled ? 'disabled' : ''} ${choice.isSpecial ? 'special-article' : ''}`} onClick={!disabled ? onSelect : undefined}>
        {choice.isSpecial && <span className="special-article-badge">⭐</span>}
        <h4>{choice.headline}</h4>
        <p>{choice.description}</p>
    </div>
);

// --- Main Component ---
const NewspaperPublisherScreen: React.FC<{
    missionData: NewspaperPublisherMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward: Reward) => void;
    onFail: () => void;
}> = ({ missionData, onReturnToMuseum, onComplete, onFail }) => {
    // --- State ---
    const [stats, setStats] = useState(missionData.initialStats);
    const [currentWeek, setCurrentWeek] = useState(1);
    const [phase, setPhase] = useState<'planning' | 'typesetting' | 'result' | 'event'>('planning');
    const [selectedArticle, setSelectedArticle] = useState<ArticleChoice | null>(null);
    const [typesettingInput, setTypesettingInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(missionData.typesettingTimeLimit);
    const [resultMessage, setResultMessage] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null); // For city feedback
    const [isGameOver, setIsGameOver] = useState(false);
    const [isHqModalOpen, setIsHqModalOpen] = useState(false);
    const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);
    const [activeSpecialEvent, setActiveSpecialEvent] = useState<{ event: SpecialEvent, stageIndex: number } | null>(null);

    const timerRef = useRef<number | null>(null);

    const rewardImageUrl = useMemo(() => {
        if (missionData.reward?.type === 'artifact') {
            return ALL_ARTIFACTS_MAP[missionData.reward.id]?.imageUrl || '';
        }
        return '';
    }, [missionData.reward]);
    
    // --- Game Logic ---
    const resetGameState = useCallback(() => {
        setStats(missionData.initialStats);
        setCurrentWeek(1);
        setPhase('planning');
        setSelectedArticle(null);
        setTypesettingInput('');
        setResultMessage('');
        setFeedbackMessage(null);
        setIsGameOver(false);
        setPurchasedUpgrades([]);
        setIsHqModalOpen(false);
        setActiveSpecialEvent(null);
    }, [missionData]);

    useEffect(() => {
        resetGameState();
    }, [missionData, resetGameState]);
    
    const checkWinLossConditions = useCallback(() => {
        if (stats.nganSach <= 0) {
            setIsGameOver(true);
            setResultMessage('Phá sản! Tờ báo không thể tiếp tục hoạt động vì hết vốn.');
            onFail();
        } else if (stats.nguyCo >= missionData.maxStats.nguyCo) {
            setIsGameOver(true);
            setResultMessage('Nguy hiểm! Tờ báo của bạn đã bị chính quyền Pháp đóng cửa vĩnh viễn.');
            onFail();
        } else if (currentWeek > missionData.durationInWeeks) {
             setIsGameOver(true);
             setResultMessage('Thành công! Bạn đã lèo lái tờ báo qua được giai đoạn khó khăn và tạo được tiếng vang lớn!');
             onComplete(missionData.reward!);
        }
    }, [stats, currentWeek, missionData, onFail, onComplete]);
    
    // Timer for typesetting
    useEffect(() => {
        if (phase === 'typesetting' && !isGameOver) {
            const hasPrinterUpgrade = purchasedUpgrades.includes('may_in_tot_hon');
            setTimeLeft(hasPrinterUpgrade ? missionData.typesettingTimeLimit + 15 : missionData.typesettingTimeLimit);
            
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        handleTypesettingSubmit(false); // Time ran out, fail the typesetting
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [phase, isGameOver, purchasedUpgrades, missionData.typesettingTimeLimit]);
    
    // Check for game over after each state update
    useEffect(() => {
        if (!isGameOver) {
            checkWinLossConditions();
        }
    }, [stats, currentWeek, isGameOver, checkWinLossConditions]);
    
    const handleSelectArticle = (choice: ArticleChoice) => {
        playSound('sfx_click');
        setSelectedArticle(choice);
        setPhase('typesetting');
    };
    
    const generateFeedbackMessage = (oldStats: typeof stats, newStats: typeof stats): string | null => {
        const uyTinChange = newStats.uyTin - oldStats.uyTin;
        if (uyTinChange > 15) return "Thư độc giả: 'Cảm ơn quý báo đã nói lên tiếng lòng của người dân Sài Gòn!'";
        if (newStats.nguyCo > 70) return "Trích báo Le Courrier de Saigon: 'Tờ Gia Định Báo lại tiếp tục có những bài viết với luận điệu chống đối...'";
        if (newStats.nganSach < 50) return "Tin nhắn từ chủ xưởng in: 'Chủ bút à, tiền giấy và mực in sắp tới hạn trả rồi đấy...'";
        return null;
    };

    const handleTypesettingSubmit = (success: boolean) => {
        if (timerRef.current) clearInterval(timerRef.current);

        const oldStats = { ...stats };
        if (success) {
            playSound('sfx_success');
            setResultMessage(`Số báo tuần ${currentWeek} đã được phát hành thành công!`);
            const newStats = {
                uyTin: Math.min(missionData.maxStats.uyTin, stats.uyTin + selectedArticle!.effects.uyTin),
                nganSach: Math.min(missionData.maxStats.nganSach, stats.nganSach + selectedArticle!.effects.nganSach),
                nguyCo: Math.min(missionData.maxStats.nguyCo, Math.max(0, stats.nguyCo + selectedArticle!.effects.nguyCo)),
            };
            setStats(newStats);
            setFeedbackMessage(generateFeedbackMessage(oldStats, newStats));
        } else {
            playSound('sfx_fail');
            const budgetPenalty = 20;
            const prestigePenalty = 10;
            setResultMessage(`In lỗi! Tờ báo bị độc giả chê cười và bạn bị phạt ${budgetPenalty} tiền. (-${prestigePenalty} Uy tín)`);
            const newStats = {
                ...stats,
                uyTin: Math.max(0, stats.uyTin - prestigePenalty),
                nganSach: Math.max(0, stats.nganSach - budgetPenalty),
            };
            setStats(newStats);
            setFeedbackMessage(`Độc giả phàn nàn: "Báo tuần này in sai nhiều quá, đọc chẳng hiểu gì!"`);
        }
        setPhase('result');
    };

    const handleCheckTypesetting = () => {
        if (!selectedArticle) return;
        const isCorrect = typesettingInput.trim().toLowerCase() === selectedArticle.headline.toLowerCase();
        handleTypesettingSubmit(isCorrect);
    };

    const handleNextWeek = () => {
        playSound('sfx_click');
        setCurrentWeek(prev => prev + 1);
        setSelectedArticle(null);
        setTypesettingInput('');
        setResultMessage('');
        setFeedbackMessage(null);
        
        // Check for special event trigger
        const event = missionData.specialEvents.find(e => e.triggerAfterWeek === currentWeek);
        if (event) {
            setActiveSpecialEvent({ event, stageIndex: 0 });
            setPhase('event');
        } else {
            setPhase('planning');
        }
    };
    
    const handlePurchaseUpgrade = (upgrade: UpgradeDefinition) => {
        if (stats.nganSach >= upgrade.cost && !purchasedUpgrades.includes(upgrade.id)) {
            playSound('sfx_unlock');
            setStats(prev => ({...prev, nganSach: prev.nganSach - upgrade.cost}));
            setPurchasedUpgrades(prev => [...prev, upgrade.id]);
        } else {
            playSound('sfx_fail');
        }
    };
    
    const handleEventChoice = (choiceIndex: number) => {
        if (!activeSpecialEvent) return;
        playSound('sfx_click');
        const event = activeSpecialEvent.event;
        const stage = event.stages[activeSpecialEvent.stageIndex];
        const choice = stage.choices[choiceIndex];

        if (event.id === 'lu-lut-sai-gon' && activeSpecialEvent.stageIndex === 0 && choiceIndex === 1) {
             // User chose to skip the event
            setActiveSpecialEvent(null);
            setPhase('planning');
            return;
        }

        setStats(prev => ({
            uyTin: Math.min(missionData.maxStats.uyTin, prev.uyTin + (choice.effects.uyTin || 0)),
            nganSach: Math.min(missionData.maxStats.nganSach, prev.nganSach + (choice.effects.nganSach || 0)),
            nguyCo: Math.min(missionData.maxStats.nguyCo, Math.max(0, prev.nguyCo + (choice.effects.nguyCo || 0))),
        }));
        
        if (choice.historicalNote) {
            setFeedbackMessage(choice.historicalNote);
        }

        if (stage.isTerminal) {
            setActiveSpecialEvent(null);
            handleNextWeek(); // Directly proceed to the next week after event conclusion
        } else {
            setActiveSpecialEvent(prev => prev ? ({...prev, stageIndex: prev.stageIndex + 1}) : null);
        }
    };

    const renderPhaseContent = () => {
        if (isGameOver) {
            return (
                 <div className="newspaper-phase-container">
                    <h3>Kết Quả Cuối Cùng</h3>
                    <p className="result-message">{resultMessage}</p>
                    {rewardImageUrl && currentWeek > missionData.durationInWeeks && <img src={rewardImageUrl} alt="Phần thưởng" className="reward-image" />}
                    <button className="action-button" onClick={onReturnToMuseum}>Quay về Bảo tàng</button>
                </div>
            );
        }

        switch(phase) {
            case 'planning':
                const regularChoices = missionData.weeklyArticleChoices[Math.min(currentWeek - 1, missionData.weeklyArticleChoices.length - 1)];
                const availableSpecialChoices = missionData.specialArticleChoices
                    .filter(c => purchasedUpgrades.includes(c.requiredUpgrade!));
                const allChoices = [...regularChoices, ...availableSpecialChoices];

                return (
                    <div className="newspaper-phase-container">
                        <h3>Kế hoạch xuất bản - Tuần {currentWeek} <button className="hq-button" onClick={() => setIsHqModalOpen(true)}>🏢</button></h3>
                        <p>Chọn một bài viết chính để đăng trong số này.</p>
                        <div className="article-choices">
                            {allChoices.map((choice, index) => (
                                <ArticleCard key={index} choice={choice} onSelect={() => handleSelectArticle(choice)} disabled={false} />
                            ))}
                        </div>
                    </div>
                );
            case 'typesetting':
                return (
                     <div className="newspaper-phase-container">
                        <h3>Giai đoạn Sắp chữ</h3>
                        <div className="typesetting-timer">Thời gian: {timeLeft}</div>
                        <p>Hãy sắp chữ lại tiêu đề bài báo đã chọn một cách chính xác:</p>
                        <p className="headline-sample">"{selectedArticle?.headline}"</p>
                        <input 
                            type="text" 
                            className="typesetting-input"
                            value={typesettingInput}
                            onChange={(e) => setTypesettingInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCheckTypesetting()}
                            placeholder="Gõ lại tiêu đề tại đây..."
                            autoFocus
                        />
                        <button className="action-button" onClick={handleCheckTypesetting}>Xác nhận Bản in</button>
                    </div>
                );
            case 'result':
                 return (
                     <div className="newspaper-phase-container">
                        <h3>Kết quả Tuần {currentWeek}</h3>
                        <p className="result-message">{resultMessage}</p>
                        {feedbackMessage && <p className="feedback-from-city">"{feedbackMessage}"</p>}
                        <button className="action-button" onClick={handleNextWeek}>Bắt đầu tuần tiếp theo</button>
                    </div>
                );
            case 'event':
                if (!activeSpecialEvent) return null;
                const currentStage = activeSpecialEvent.event.stages[activeSpecialEvent.stageIndex];
                return (
                    <div className="newspaper-phase-container special-event-modal">
                        <h3>{activeSpecialEvent.event.title}</h3>
                        <p>{currentStage.prompt}</p>
                        <div className="article-choices">
                            {currentStage.choices.map((choice, index) => (
                                <button key={index} className="action-button event-choice" onClick={() => handleEventChoice(index)}>
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    </div>
                );
        }
    };


    return (
        <div className="newspaper-screen">
            {isHqModalOpen && (
                <div className="newspaper-modal-overlay" onClick={() => setIsHqModalOpen(false)}>
                    <div className="hq-modal" onClick={e => e.stopPropagation()}>
                        <h3>Quản lý Tòa soạn</h3>
                        <div className="upgrades-list">
                            {missionData.upgrades.map(upgrade => {
                                const isPurchased = purchasedUpgrades.includes(upgrade.id);
                                const canAfford = stats.nganSach >= upgrade.cost;
                                return (
                                <div key={upgrade.id} className={`upgrade-item ${isPurchased ? 'purchased' : ''}`}>
                                    <div className="upgrade-info">
                                        <h4>{upgrade.name}</h4>
                                        <p>{upgrade.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => handlePurchaseUpgrade(upgrade)}
                                        disabled={isPurchased || !canAfford}
                                        className="purchase-button"
                                    >
                                        {isPurchased ? 'Đã có' : `Mua (${upgrade.cost} 💰)`}
                                    </button>
                                </div>
                                )
                            })}
                        </div>
                        <button className="action-button mt-4" onClick={() => setIsHqModalOpen(false)}>Đóng</button>
                    </div>
                </div>
            )}
            <h2 className="main-title">{missionData.title}</h2>
            
            <div className="stats-dashboard">
                <StatBar label="Uy Tín" value={stats.uyTin} max={missionData.maxStats.uyTin} icon="🏅" />
                <StatBar label="Ngân Sách" value={stats.nganSach} max={missionData.maxStats.nganSach} icon="💰" />
                <StatBar label="Nguy Cơ" value={stats.nguyCo} max={missionData.maxStats.nguyCo} icon="👁️" />
            </div>

            <div className="game-area">
                {renderPhaseContent()}
            </div>
        </div>
    );
};

export default NewspaperPublisherScreen;