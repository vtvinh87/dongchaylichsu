import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { StrategicPathMissionData, Reward, ActiveSideQuestState, NotebookPage } from '../types';
import { playSound } from '../utils/audio';
import { ALL_ARTIFACTS_MAP, NOTEBOOK_PAGES, MISSION_DONG_LOC_PATH_ID, MISSION_CUA_CHUA_PATH_ID, MISSION_SEBANGHIENG_PATH_ID, SIDE_QUESTS } from '../constants';
import NotebookModal from './NotebookModal';
import { NOTEBOOK_ICON_URL } from '../imageUrls';

interface Point {
  x: number;
  y: number;
}

type ActiveSkill = 'sanlap' | 'xaycau' | 'luacambien' | 'gobo' | 'phada' | 'xaycauphao' | null;
type TimeOfDay = 'day' | 'night';

const StrategicPathScreen: React.FC<{
    missionData: StrategicPathMissionData;
    onReturnToMuseum: () => void;
    onComplete: (reward?: Reward) => void;
    unlockedNotebookPages: number[];
    onUnlockNotebookPage: (pageIndex: number) => void;
    onTriggerDialogue: (scriptKey: string) => void;
    activeSideQuest: ActiveSideQuestState | null;
    onCompleteSideQuestStage: (questId: string) => void;
}> = ({ missionData, onReturnToMuseum, onComplete, unlockedNotebookPages, onUnlockNotebookPage, onTriggerDialogue, activeSideQuest, onCompleteSideQuestStage }) => {
    const [playerPath, setPlayerPath] = useState<Point[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [currentMapLayout, setCurrentMapLayout] = useState(missionData.mapLayout);
    const [supplies, setSupplies] = useState(missionData.initialSupplies);
    const [activeSkill, setActiveSkill] = useState<ActiveSkill>(null);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
    const [riskLevel, setRiskLevel] = useState(0);
    
    const [isNotebookOpen, setIsNotebookOpen] = useState(false);
    const [pageUnlockNotification, setPageUnlockNotification] = useState<string | null>(null);

    const [bombTimers, setBombTimers] = useState<Record<string, number>>({});
    
    // New state for Se Bang Hieng mission
    const [convoyPosition, setConvoyPosition] = useState<Point | null>(null);
    const [convoyProgress, setConvoyProgress] = useState(0); // Index in convoyPath
    const [showFlashFlood, setShowFlashFlood] = useState(false);
    const [visitedAllies, setVisitedAllies] = useState<Set<string>>(new Set());
    const [bridgeCostModifier, setBridgeCostModifier] = useState(1.0);

    const isInitialMount = useRef(true);
    
    const { start, end } = missionData;

    const notebookPagesForModal = useMemo(() => {
        const pages: NotebookPage[] = [];
        Object.entries(NOTEBOOK_PAGES).forEach(([key, value]) => {
            const index = parseInt(key, 10);
            // Check if key is a number and value is a NotebookPage object
            if (!isNaN(index) && value && typeof value === 'object' && !Array.isArray(value) && 'content' in value) {
                pages[index] = value as NotebookPage;
            }
        });
        return pages.filter(Boolean); // Filter out empty/undefined slots
    }, []);

    const rewardImageUrl = useMemo(() => {
        if (missionData.reward && missionData.reward.type === 'artifact') {
            const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
            return artifact ? artifact.imageUrl : '';
        }
        return '';
    }, [missionData.reward]);
    
    useEffect(() => {
        setPlayerPath([start]);
        setCurrentMapLayout(missionData.mapLayout);
        setSupplies(missionData.initialSupplies);
        setActiveSkill(null);
        setIsComplete(false);
        setCurrentTurn(0);
        setTimeOfDay('day');
        setRiskLevel(0);
        setVisitedAllies(new Set());
        setBridgeCostModifier(1.0);
        setShowFlashFlood(false);
        
        // Reset and initialize mission-specific states
        setBombTimers({});
        setConvoyPosition(null);
        setConvoyProgress(0);

        if (missionData.id === MISSION_DONG_LOC_PATH_ID) {
            const initialTimers: Record<string, number> = {};
            missionData.mapLayout.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell === 9) { // 9 is timed bomb
                        initialTimers[`${y}-${x}`] = 30;
                    }
                });
            });
            setBombTimers(initialTimers);
        }
        
        if (missionData.id === MISSION_SEBANGHIENG_PATH_ID && missionData.convoyPath) {
            setConvoyPosition(missionData.convoyPath[0]);
        }

        isInitialMount.current = true;
    }, [missionData, start]);

    // Timer countdown effect
    useEffect(() => {
        if (isComplete || Object.keys(bombTimers).length === 0) {
            return;
        }

        const timerId = setInterval(() => {
            let layoutToUpdate: number[][] | null = null;
            let totalSuppliesLost = 0;
            let explosions = 0;

            const nextTimers = { ...bombTimers };

            for (const key in bombTimers) {
                const newTime = bombTimers[key] - 1;
                if (newTime <= 0) {
                    explosions++;
                    playSound('sfx_explosion');
                    totalSuppliesLost += 50;
                    if (!layoutToUpdate) {
                        layoutToUpdate = currentMapLayout.map(r => [...r]);
                    }
                    const [y, x] = key.split('-').map(Number);
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (ny >= 0 && ny < layoutToUpdate.length && nx >= 0 && nx < layoutToUpdate[0].length) {
                                if (layoutToUpdate[ny][nx] !== 1 && layoutToUpdate[ny][nx] !== 2) {
                                    layoutToUpdate[ny][nx] = 3; // Crater
                                }
                            }
                        }
                    }
                    delete nextTimers[key];
                } else {
                    nextTimers[key] = newTime;
                }
            }
            
            setBombTimers(nextTimers);
            
            if (explosions > 0 && layoutToUpdate) {
                alert(`Bom đã nổ! Mất ${totalSuppliesLost} Vật tư!`);
                setSupplies(s => Math.max(0, s - totalSuppliesLost));
                setCurrentMapLayout(layoutToUpdate);
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [bombTimers, isComplete, currentMapLayout]);

    const showUnlockNotification = (message: string) => {
        setPageUnlockNotification(message);
        setTimeout(() => setPageUnlockNotification(null), 3000);
    };

    const getRiskLevelText = (risk: number): string => {
        if (risk < 30) return 'Thấp';
        if (risk < 70) return 'Trung bình';
        return 'Cao';
    };

    const triggerRandomEvents = useCallback(() => {
        if (currentTurn <= 0 || isComplete) return;

        // Supply Event
        if (Math.random() < 0.15) {
            playSound('sfx_unlock');
            const bonusSupplies = 25;
            alert(`Một đồng chí giao liên vừa đi qua và để lại cho bạn một ít vật tư! Bạn nhận được ${bonusSupplies} Vật tư.`);
            setSupplies(s => s + bonusSupplies);
        }

        // Flash Flood Event (for Se Bang Hieng mission)
        if (missionData.id === MISSION_SEBANGHIENG_PATH_ID && Math.random() < 0.1) { // 10% chance
            playSound('sfx_flood');
            alert("Lũ quét bất ngờ! Toàn bộ cầu phao đã bị cuốn trôi!");
            setShowFlashFlood(true);
            setTimeout(() => setShowFlashFlood(false), 1500);

            const newLayout = currentMapLayout.map(row => row.map(cell => cell === 14 ? 12 : cell));
            setCurrentMapLayout(newLayout);
        }

    }, [currentTurn, isComplete, missionData.id, currentMapLayout]);

    const checkForLandslide = useCallback(() => {
        if (!missionData.unstableMountains || missionData.unstableMountains.length === 0) return;

        let layoutChanged = false;
        const newLayout = currentMapLayout.map(r => [...r]);

        for (const um of missionData.unstableMountains) {
            if (Math.random() < 0.10) { // 10% chance
                const adjacentCells = [ { x: um.x, y: um.y - 1 }, { x: um.x, y: um.y + 1 }, { x: um.x - 1, y: um.y }, { x: um.x + 1, y: um.y }, ];
                const validTargets = adjacentCells.filter(p => p.y >= 0 && p.y < newLayout.length && p.x >= 0 && p.x < newLayout[0].length && (newLayout[p.y][p.x] === 0 || newLayout[p.y][p.x] === 8));
                if (validTargets.length > 0) {
                    const targetCell = validTargets[Math.floor(Math.random() * validTargets.length)];
                    newLayout[targetCell.y][targetCell.x] = 10; // Rockslide
                    layoutChanged = true;
                    playSound('sfx_explosion');
                    break;
                }
            }
        }

        if (layoutChanged) {
            alert('Sạt lở! Một con đường đã bị đá chặn!');
            setCurrentMapLayout(newLayout);
        }
    }, [currentMapLayout, missionData.unstableMountains]);

    const checkForEnemyAttack = useCallback(() => {
        const attackChance = Math.random() * 100;
        if (attackChance < riskLevel) {
            alert('Báo động! Máy bay địch tấn công! Mất 20 Vật tư!');
            playSound('sfx_fail');
            setSupplies(s => Math.max(0, s - 20));
            setRiskLevel(r => Math.max(0, r - 30));
            if (!unlockedNotebookPages.includes(5)) {
                onUnlockNotebookPage(5);
                showUnlockNotification("Bạn vừa tìm thấy một trang nhật ký mới!");
            }
        }
    }, [riskLevel, onUnlockNotebookPage, unlockedNotebookPages]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (riskLevel > 0) {
            checkForEnemyAttack();
        }
    }, [riskLevel, checkForEnemyAttack]);


    const endPlayerTurn = useCallback((actionPoint: Point) => {
        const newTurn = currentTurn + 1;
        setCurrentTurn(newTurn);
        if (newTurn > 0 && newTurn % 5 === 0) {
            setTimeOfDay(t => (t === 'day' ? 'night' : 'day'));
        }

        const terrainType = currentMapLayout[actionPoint.y][actionPoint.x];
        let riskIncrease = 5;
        if (timeOfDay === 'night') riskIncrease += 10;
        if (terrainType === 8) riskIncrease += 15;
        
        setRiskLevel(prev => Math.min(100, prev + riskIncrease));

        if (newTurn === 10 && !unlockedNotebookPages.includes(4)) {
            onUnlockNotebookPage(4);
            showUnlockNotification("Bạn vừa tìm thấy một trang nhật ký mới!");
        }
        
        checkForLandslide();
        triggerRandomEvents();
        
        // Convoy Movement Logic
        if (missionData.id === MISSION_SEBANGHIENG_PATH_ID && missionData.convoyPath) {
            const currentConvoyIndex = convoyProgress;
            if(currentConvoyIndex + 1 < missionData.convoyPath.length) {
                const nextConvoyPoint = missionData.convoyPath[currentConvoyIndex + 1];
                const nextCellType = currentMapLayout[nextConvoyPoint.y][nextConvoyPoint.x];
                
                // Can move on path, open path, or pontoon bridge
                if (nextCellType === 8 || nextCellType === 14) {
                    setConvoyProgress(p => p + 1);
                    setConvoyPosition(nextConvoyPoint);
                    
                    // Check for win condition
                    if (currentConvoyIndex + 1 === missionData.convoyPath.length - 1) {
                         setIsComplete(true);
                         playSound('sfx_unlock');
                         setTimeout(() => onComplete(missionData.reward), 2000);
                    }
                }
            }
        }

    }, [currentTurn, timeOfDay, currentMapLayout, onUnlockNotebookPage, unlockedNotebookPages, checkForLandslide, triggerRandomEvents, missionData, convoyProgress, onComplete]);
    
    const handleSkillClick = (skill: ActiveSkill) => {
        playSound('sfx_click');
        setActiveSkill(prev => prev === skill ? null : skill);
    };
    
    const handleCellClick = useCallback((x: number, y: number) => {
        if (isComplete) return;
        const terrainType = currentMapLayout[y][x];
        const actionPoint = { x, y };

        // Check for starting a new side quest at a friendly camp
        if (terrainType === 15 && !activeSideQuest) { 
            onTriggerDialogue('start_gianh_giat_su_song');
            return;
        }

        // Check for completing a side quest stage
        if (activeSideQuest && missionData.id === SIDE_QUESTS[activeSideQuest.questId].stages[activeSideQuest.currentStage].targetMap) {
            const currentStage = SIDE_QUESTS[activeSideQuest.questId].stages[activeSideQuest.currentStage];
            if (currentStage.target.x === x && currentStage.target.y === y) {
                if (activeSideQuest.questId === 'gianh_giat_su_song' && terrainType === 16) {
                    playSound('sfx_success');
                    alert('Bạn đã tìm thấy một loại thảo dược quý!');
                    const newLayout = currentMapLayout.map(row => [...row]);
                    newLayout[y][x] = 0; // Turn herb into jungle
                    setCurrentMapLayout(newLayout);
                    onCompleteSideQuestStage(activeSideQuest.questId);
                    return; 
                }
            }
        }

        if (activeSkill) {
            const handleActionWithSkill = (cost: number, newTerrain: number, sfx: string, pageToUnlock?: number) => {
                const finalCost = Math.ceil(cost * bridgeCostModifier);
                if (supplies >= finalCost) {
                    playSound(sfx);
                    setSupplies(s => s - finalCost);
                    setBridgeCostModifier(1.0); // Reset buff after use
                    const newLayout = currentMapLayout.map(row => [...row]);
                    newLayout[y][x] = newTerrain;
                    setCurrentMapLayout(newLayout);
                    if (pageToUnlock !== undefined && !unlockedNotebookPages.includes(pageToUnlock)) {
                        onUnlockNotebookPage(pageToUnlock);
                        showUnlockNotification("Bạn vừa tìm thấy một trang nhật ký mới!");
                    }
                    endPlayerTurn(actionPoint);
                } else {
                    playSound('sfx_fail');
                    alert('Không đủ vật tư!');
                }
                setActiveSkill(null);
            };

            switch (activeSkill) {
                case 'sanlap': if (terrainType === 3) handleActionWithSkill(10, 0, 'sfx_dig', 2); else setActiveSkill(null); return;
                case 'xaycau': if (terrainType === 4) handleActionWithSkill(30, 0, 'sfx_build', 3); else setActiveSkill(null); return;
                case 'luacambien': if (terrainType === 6) handleActionWithSkill(15, 7, 'sfx_success'); else setActiveSkill(null); return;
                case 'phada': if (terrainType === 10) handleActionWithSkill(30, 0, 'sfx_explosion'); else setActiveSkill(null); return;
                case 'xaycauphao': if (terrainType === 12) handleActionWithSkill(40, 14, 'sfx_build'); else setActiveSkill(null); return;
                case 'gobo':
                     if (terrainType === 9) {
                        if (supplies >= 25) {
                            playSound('sfx_success');
                            setSupplies(s => s - 25);
                            const newLayout = currentMapLayout.map(row => [...row]);
                            newLayout[y][x] = 0;
                            setCurrentMapLayout(newLayout);
                            setBombTimers(prev => {
                                const newTimers = {...prev};
                                delete newTimers[`${y}-${x}`];
                                return newTimers;
                            });
                            endPlayerTurn({ x, y });
                        } else { playSound('sfx_fail'); alert('Không đủ vật tư!'); }
                        setActiveSkill(null);
                    } else { setActiveSkill(null); }
                    return;
            }
            return;
        }
        
        if (activeSkill === null) {
            if (terrainType === 5) {
                playSound('sfx_success');
                setSupplies(s => s + 20);
                const newLayout = currentMapLayout.map(row => [...row]); newLayout[y][x] = 0; setCurrentMapLayout(newLayout);
                endPlayerTurn(actionPoint);
                return;
            }
            if (terrainType === 11) {
                playSound('sfx_unlock');
                const bonusSupplies = 50; alert(`Bạn đã tìm thấy một kho vật tư! Nhận ${bonusSupplies} Vật tư.`); setSupplies(s => s + bonusSupplies);
                const newLayout = currentMapLayout.map(row => [...row]); newLayout[y][x] = 0; setCurrentMapLayout(newLayout);
                endPlayerTurn(actionPoint);
                return;
            }
            if (terrainType === 13) { // Lao Village
                const villageId = `${y}-${x}`;
                if (!visitedAllies.has(villageId)) {
                    playSound('sfx_unlock');
                    alert("Bạn nhận được sự giúp đỡ của nhân dân Lào anh em! Nhận 50 Vật tư và giảm 50% chi phí xây cầu tiếp theo.");
                    setSupplies(s => s + 50);
                    setBridgeCostModifier(0.5);
                    setVisitedAllies(prev => new Set(prev).add(villageId));
                    endPlayerTurn(actionPoint);
                }
                return;
            }
        }

        const isPassable = terrainType === 0 || terrainType === 8 || terrainType === 14;
        if (!isPassable) return;

        const lastPoint = playerPath[playerPath.length - 1];
        if (!lastPoint) return;
        const isAdjacent = Math.abs(lastPoint.x - x) + Math.abs(lastPoint.y - y) === 1;
        const isInPath = playerPath.some(p => p.x === x && p.y === y);

        if (isAdjacent && !isInPath) {
            playSound('sfx_click');
            const newPath = [...playerPath, actionPoint]; setPlayerPath(newPath);
            if (newPath.length > 7 && !unlockedNotebookPages.includes(6)) {
                 onUnlockNotebookPage(6); showUnlockNotification("Bạn vừa tìm thấy một trang nhật ký mới!");
            }
            endPlayerTurn(actionPoint);
            if (missionData.id !== MISSION_SEBANGHIENG_PATH_ID && x === end.x && y === end.y) {
                 if (missionData.id === MISSION_DONG_LOC_PATH_ID && Object.keys(bombTimers).length > 0) {
                    alert('Bạn phải gỡ hết bom nổ chậm trước khi hoàn thành nhiệm vụ!'); return;
                }
                setIsComplete(true); playSound('sfx_unlock');
                setTimeout(() => onComplete(missionData.reward), 2000);
            }
        }
    }, [isComplete, activeSkill, supplies, currentMapLayout, playerPath, end, onComplete, missionData, endPlayerTurn, onUnlockNotebookPage, unlockedNotebookPages, bombTimers, visitedAllies, bridgeCostModifier, convoyProgress, activeSideQuest, onTriggerDialogue, onCompleteSideQuestStage]);
    
    const getCellClass = (x: number, y: number) => {
        const terrainType = currentMapLayout[y][x];
        let classes = 'strategic-path-cell ';

        switch(terrainType) {
            case 0: classes += 'cell-jungle cursor-pointer'; break;
            case 1: classes += 'cell-mountain'; break;
            case 2: classes += 'cell-river'; break;
            case 3: classes += `cell-crater ${activeSkill === 'sanlap' ? 'cursor-pointer' : ''}`; break;
            case 4: classes += `cell-broken-bridge ${activeSkill === 'xaycau' ? 'cursor-pointer' : ''}`; break;
            case 5: classes += 'cell-resource-wood cursor-pointer'; break;
            case 6: classes += `cell-sensor ${activeSkill === 'luacambien' ? 'cursor-pointer' : ''}`; break;
            case 7: classes += 'cell-sensor-disabled'; break;
            case 8: classes += 'cell-open-path'; break;
            case 9: classes += `cell-timed-bomb ${activeSkill === 'gobo' ? 'cursor-pointer' : ''}`; break;
            case 10: classes += `cell-rockslide ${activeSkill === 'phada' ? 'cursor-pointer' : ''}`; break;
            case 11: classes += 'cell-supply-cache cursor-pointer'; break;
            case 12: classes += `cell-sebanghieng-river ${activeSkill === 'xaycauphao' ? 'cursor-pointer' : ''}`; break;
            case 13: classes += `cell-lao-village ${visitedAllies.has(`${y}-${x}`) ? 'visited' : ''}`; break;
            case 14: classes += 'cell-pontoon-bridge cursor-pointer'; break;
            case 15: classes += 'cell-friendly-camp'; break;
            case 16: classes += 'cell-herb'; break;
            default: classes += 'cell-jungle';
        }
        
        if (activeSideQuest && missionData.id === SIDE_QUESTS[activeSideQuest.questId].stages[activeSideQuest.currentStage].targetMap) {
            const currentStage = SIDE_QUESTS[activeSideQuest.questId].stages[activeSideQuest.currentStage];
            if (currentStage.target.x === x && currentStage.target.y === y) {
                classes += ' cell-quest-location';
            }
        }

        if (missionData.unstableMountains?.some(p => p.x === x && p.y === y)) classes += ' cell-unstable-mountain';
        if (playerPath.some(p => p.x === x && p.y === y)) classes += ' cell-player-path';
        if (x === start.x && y === start.y) classes += ' cell-start';
        if (x === end.x && y === end.y) classes += ' cell-end';

        return classes;
    }

    return (
        <div className="screen-container w-full max-w-2xl p-6 bg-stone-800 rounded-lg shadow-xl text-center flex flex-col items-center">
            <button onClick={onReturnToMuseum} className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md z-30">Quay về</button>
            <h2 className="text-3xl font-bold text-amber-300 mb-2 font-serif">{missionData.title}</h2>
            <p className="text-stone-300 mb-4">{missionData.id === MISSION_SEBANGHIENG_PATH_ID ? 'Hộ tống đoàn xe an toàn qua sông.' : 'Vạch đường từ điểm Vàng (Bắt đầu) đến điểm Đỏ (Kết thúc).'}</p>
            
            <div id="player-hud" className="flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-lg">Vật tư: <span id="resource-count" className="font-bold text-amber-300">{supplies}</span></div>
                    <div id="time-of-day-indicator" className="text-2xl" title={timeOfDay === 'day' ? 'Ban ngày' : 'Ban đêm'}>{timeOfDay === 'day' ? '☀️' : '🌙'}</div>
                    <div>Rủi ro: <span id="risk-level" className="font-bold text-red-400">{getRiskLevelText(riskLevel)}</span></div>
                    <button id="open-notebook-button" onClick={() => setIsNotebookOpen(true)} title="Mở Sổ tay" className="bg-transparent border-none p-0 w-8 h-8 hover:opacity-80 transition-opacity">
                        <img src={NOTEBOOK_ICON_URL} alt="Sổ tay" className="w-full h-full"/>
                    </button>
                </div>
                <div id="skill-bar">
                    <button id="skill-sanlap" onClick={() => handleSkillClick('sanlap')} className={activeSkill === 'sanlap' ? 'skill-active' : ''} disabled={supplies < 10} title="San lấp hố bom">San lấp (10)</button>
                    <button id="skill-xaycau" onClick={() => handleSkillClick('xaycau')} className={activeSkill === 'xaycau' ? 'skill-active' : ''} disabled={supplies < 30} title="Xây cầu qua sông">Xây cầu (30)</button>
                    <button id="skill-luacambien" onClick={() => handleSkillClick('luacambien')} className={activeSkill === 'luacambien' ? 'skill-active' : ''} disabled={supplies < 15} title="Vô hiệu hóa cảm biến địch">Vô hiệu hóa (15)</button>
                    {missionData.id === MISSION_DONG_LOC_PATH_ID && (<button id="skill-gobo" onClick={() => handleSkillClick('gobo')} className={activeSkill === 'gobo' ? 'skill-active' : ''} disabled={supplies < 25} title="Gỡ bom nổ chậm (25 Vật tư)">Gỡ bom (25)</button>)}
                    {missionData.id === MISSION_CUA_CHUA_PATH_ID && (<button id="skill-phada" onClick={() => handleSkillClick('phada')} className={activeSkill === 'phada' ? 'skill-active' : ''} disabled={supplies < 30} title="Phá đá mở đường (30 Vật tư)">Phá đá (30)</button>)}
                    {missionData.id === MISSION_SEBANGHIENG_PATH_ID && (<button id="skill-xaycauphao" onClick={() => handleSkillClick('xaycauphao')} className={activeSkill === 'xaycauphao' ? 'skill-active' : ''} disabled={supplies < 40 * bridgeCostModifier} title={`Xây cầu phao (${Math.ceil(40 * bridgeCostModifier)} Vật tư)`}>Xây cầu phao ({Math.ceil(40 * bridgeCostModifier)})</button>)}
                </div>
            </div>

            <div id="strategic-path-grid" className="w-full aspect-[10/15] relative">
                <div id="night-overlay" className={timeOfDay === 'night' ? 'active' : ''}></div>
                <div id="flash-flood-overlay" className={showFlashFlood ? 'active' : ''}></div>
                {currentMapLayout.map((row, y) => row.map((_, x) => (
                    <div key={`${y}-${x}`} className={getCellClass(x, y)} onClick={() => handleCellClick(x, y)}>
                       {missionData.id !== MISSION_SEBANGHIENG_PATH_ID && x === start.x && y === start.y && 'BĐ'}
                       {missionData.id !== MISSION_SEBANGHIENG_PATH_ID && x === end.x && y === end.y && 'KT'}
                       {currentMapLayout[y][x] === 9 && bombTimers[`${y}-${x}`] !== undefined && (<div className="bomb-timer">{bombTimers[`${y}-${x}`]}</div>)}
                    </div>
                )))}
                {convoyPosition && (
                    <div className="convoy-icon" style={{ top: `${convoyPosition.y * (100 / 15)}%`, left: `${convoyPosition.x * 10}%` }}></div>
                )}
                 {isComplete && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white z-20 animate-fadeInScaleUp rounded-md">
                        <h3 className="text-4xl font-bold text-green-400">Nhiệm vụ hoàn thành!</h3>
                        <p className="text-xl mt-2">{missionData.id === MISSION_SEBANGHIENG_PATH_ID ? 'Đoàn xe đã qua sông an toàn!' : 'Con đường tiếp tế đã được khai thông.'}</p>
                        {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-32 h-32 object-contain my-4" />}
                    </div>
                )}
            </div>
            
            <NotebookModal isOpen={isNotebookOpen} onClose={() => setIsNotebookOpen(false)} pagesData={notebookPagesForModal} unlockedPageIndices={unlockedNotebookPages} />
            {pageUnlockNotification && (<div id="page-unlock-notification">{pageUnlockNotification}</div>)}
        </div>
    );
};

export default StrategicPathScreen;