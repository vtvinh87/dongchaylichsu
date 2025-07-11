// components/DetectiveScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { DetectiveMissionData, Reward, DetectiveClue, DetectiveNPC } from '../types';
import type { ProfessionInfo } from '../types';
import { playSound } from '../utils/audio';

interface DetectiveScreenProps {
  missionData: DetectiveMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward?: Reward) => void;
  onFail: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const getFlavorTextForNpc = (npcId: string): string => {
    switch(npcId) {
        case 'ba_ban_tra': return "Trà của ta thơm nức Thăng Long thành đó, quan nhân. Uống một chén là thấy tỉnh cả người, nghe được bao nhiêu là chuyện lạ...";
        case 'nguoi_ban_lua': return "Lụa Hà Đông của ta mềm như mây, nhẹ như khói. Mặc vào là sang cả người. Ta cũng thấy nhiều người ăn mặc sang trọng, nhưng hành tung thì mờ ám lắm...";
        case 'bac_tho_ren': return "Tiếng búa của ta vang rền cả góc chợ. Đôi khi nó còn không át nổi tiếng xì xầm của mấy kẻ khả nghi...";
        case 'linh_gac_thanh': return "Đứng gác ở đây, ta thấy đủ hạng người qua lại. Có người vội vã, có kẻ lấm lét. Trông mặt mà bắt hình dong cũng khó lắm...";
        case 'nguoi_ban_hoa_qua': return "Hoa quả của ta tươi ngon nhất chợ này. Ấy thế mà có người mua nhiều mà mặt cứ lo lắng, chẳng nói chẳng rằng...";
        case 'nguoi_dan_thuong': return "Dân đen chúng tôi thì biết gì đâu, chỉ mong sống yên ổn qua ngày. Nhưng dạo này thấy nhiều kẻ lạ mặt quá, không biết có điềm gì không...";
        default: return "Quan nhân có điều gì muốn hỏi à?";
    }
};


const DetectiveScreen: React.FC<DetectiveScreenProps> = ({ missionData, onReturnToMuseum, onComplete, onFail, inventory, setInventory }) => {
  const [turnsLeft, setTurnsLeft] = useState(missionData.turnLimit);
  const [collectedClues, setCollectedClues] = useState<Record<string, DetectiveClue>>({});
  const [questionedNpcIds, setQuestionedNpcIds] = useState<string[]>([]);
  const [activeDialogue, setActiveDialogue] = useState<DetectiveNPC | null>(null);
  
  const [showNotebook, setShowNotebook] = useState(false);
  const [showDeductionBoard, setShowDeductionBoard] = useState(false);
  
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [draggedClue, setDraggedClue] = useState<DetectiveClue | null>(null);
  
  const [deductionSlots, setDeductionSlots] = useState<Record<string, (string | null)[]>>({});

  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
  const [score, setScore] = useState(0);

  // New state for enhanced flow
  const [pendingClue, setPendingClue] = useState<{ npc: DetectiveNPC; clue: DetectiveClue } | null>(null);
  const [inspectedClue, setInspectedClue] = useState<DetectiveClue | null>(null);
  const [selectedClueForPlacement, setSelectedClueForPlacement] = useState<DetectiveClue | null>(null);

  // New state for hints and historical info
  const [hintsUsed, setHintsUsed] = useState(0);
  const [infoModalContent, setInfoModalContent] = useState<ProfessionInfo | null>(null);
  const [showIntroModal, setShowIntroModal] = useState(true);


  // Reset state when mission changes
  useEffect(() => {
    setTurnsLeft(missionData.turnLimit);
    setCollectedClues({});
    setQuestionedNpcIds([]);
    setActiveDialogue(null);
    setShowNotebook(false);
    setShowDeductionBoard(false);
    setSelectedClueId(null);
    setDeductionSlots(missionData.suspects.reduce((acc, s) => ({ ...acc, [s.id]: [null, null, null] }), {}));
    setIsGameOver(false);
    setGameResult(null);
    setScore(0);
    setPendingClue(null);
    setInspectedClue(null);
    setSelectedClueForPlacement(null);
    setHintsUsed(0);
    setInfoModalContent(null);
    setShowIntroModal(true);
  }, [missionData]);

  const spendTurn = useCallback((amount = 1) => {
      setTurnsLeft(prev => prev - amount);
  }, []);

  useEffect(() => {
      if(turnsLeft <= 0 && !isGameOver) {
          setIsGameOver(true);
          setGameResult('loss');
          onFail();
          playSound('sfx_fail');
      }
  }, [turnsLeft, isGameOver, onFail]);

  const handleNpcClick = (npc: DetectiveNPC) => {
    if (questionedNpcIds.includes(npc.id) || isGameOver || activeDialogue || pendingClue) return;
    playSound('sfx_click');
    setActiveDialogue(npc);
  };
  
  const handleQuestionNpc = () => {
    if (!activeDialogue || isGameOver) return;
    setPendingClue({ npc: activeDialogue, clue: activeDialogue.clue });
    setActiveDialogue(null);
  };
  
  const handleCollectClue = () => {
      if (!pendingClue) return;
      const { npc, clue } = pendingClue;

      if (turnsLeft < (npc.turnCost || 1)) {
        alert("Không đủ lượt đi để hỏi chuyện người này!");
        playSound('sfx_fail');
        return;
      }
      
      playSound('sfx_success');
      setCollectedClues(prev => ({ ...prev, [clue.id]: clue }));
      setQuestionedNpcIds(prev => [...prev, npc.id]);
      spendTurn(npc.turnCost || 1);
      setPendingClue(null);
  }

  const handleClueSelection = (clueId: string) => {
    if (selectedClueId === clueId) {
        setSelectedClueId(null); // Deselect if clicking the same clue again
        return;
    }

    // If a clue is already selected, check for contradiction with the newly clicked clue.
    if (selectedClueId) {
        let newClueId: string | undefined;

        // Check direction 1: selectedClueId -> clueId
        const contradictionPair1 = missionData.contradictions[selectedClueId];
        if (contradictionPair1 && contradictionPair1[0] === clueId) {
            newClueId = contradictionPair1[1];
        }

        // Check direction 2: clueId -> selectedClueId (only if not found in direction 1)
        if (!newClueId) {
            const contradictionPair2 = missionData.contradictions[clueId];
            if (contradictionPair2 && contradictionPair2[0] === selectedClueId) {
                newClueId = contradictionPair2[1];
            }
        }

        if (newClueId) {
            const newClue = missionData.deductionClues[newClueId];
            if (newClue && !collectedClues[newClueId]) {
                playSound('sfx_unlock');
                alert(`Mâu thuẫn! Bạn đã phát hiện ra một manh mối mới: ${newClue.text}`);
                setCollectedClues(prev => ({ ...prev, [newClueId]: newClue }));
                spendTurn();
            } else if (collectedClues[newClueId]) {
                // The contradiction was already found, just inform the user.
                playSound('sfx_click');
                alert("Bạn đã sử dụng cặp manh mối này để suy luận rồi.");
            }
        } else {
            playSound('sfx_fail');
            alert("Hai manh mối này không mâu thuẫn.");
        }

        setSelectedClueId(null); // Reset selection after checking
    } else {
        // No clue was selected, so select the current one.
        setSelectedClueId(clueId);
    }
  };

  const handleHint = () => {
    if (hintsUsed >= 3) {
      alert("Bạn đã dùng hết 3 lượt gợi ý.");
      return;
    }
    if (turnsLeft < 2) {
      alert("Không đủ lượt đi để dùng gợi ý (cần 2 lượt).");
      return;
    }

    spendTurn(2);
    setHintsUsed(prev => prev + 1);
    
    // Hint logic: Reveal a random correct clue that hasn't been used as evidence.
    const correctClueIds = missionData.solution.evidenceIds;
    const placedClues = new Set(Object.values(deductionSlots).flat());
    const unplacedCorrectClues = correctClueIds.filter(id => !placedClues.has(id));

    if (unplacedCorrectClues.length > 0) {
      const hintClue = collectedClues[unplacedCorrectClues[0]];
      if (hintClue) {
        alert(`Gợi ý: Manh mối "${hintClue.text}" là một bằng chứng quan trọng.`);
      } else {
        alert("Gợi ý: Hãy hỏi chuyện thêm để tìm các bằng chứng quan trọng.");
      }
    } else {
      alert("Gợi ý: Bạn đã có đủ bằng chứng, hãy sắp xếp chúng cho đúng nghi phạm.");
    }
  };

  const handleNotebookHint = () => {
    if (turnsLeft < 1) {
        alert("Không đủ lượt đi để dùng gợi ý (cần 1 lượt).");
        return;
    }
    playSound('sfx_unlock');
    spendTurn(1);

    // 1. Check for collected contradictory pairs that haven't been used to reveal a new clue
    for (const clueId1 in missionData.contradictions) {
        const [clueId2, newClueId] = missionData.contradictions[clueId1];
        if (collectedClues[clueId1] && collectedClues[clueId2] && !collectedClues[newClueId]) {
            alert("Gợi ý: Dường như có hai manh mối trong sổ tay của bạn mâu thuẫn với nhau. Hãy thử chọn chúng để xem có khám phá được gì mới không.");
            return;
        }
    }

    // 2. Check for one half of a contradictory pair and hint at the other half's source
    for (const clueId1 in missionData.contradictions) {
        const [clueId2] = missionData.contradictions[clueId1];
        const checkAndHint = (id1: string, id2: string) => {
            if (collectedClues[id1] && !collectedClues[id2]) {
                const npcForClue = missionData.npcs.find(npc => npc.clue.id === id2);
                if (npcForClue && !questionedNpcIds.includes(npcForClue.id)) {
                    alert(`Gợi ý: Manh mối bạn có vẻ chưa đầy đủ. Thử nói chuyện với ${npcForClue.name} xem sao.`);
                    return true;
                }
            }
            return false;
        };

        if (checkAndHint(clueId1, clueId2) || checkAndHint(clueId2, clueId1)) {
            return;
        }
    }

    // 3. Fallback to original hint if no contradiction-related hints are possible
    const unQuestionedNpcs = missionData.npcs.filter(npc => !questionedNpcIds.includes(npc.id));
    if (unQuestionedNpcs.length > 0) {
        const hintNpc = unQuestionedNpcs[0];
        alert(`Gợi ý: Có vẻ như ${hintNpc.name} biết điều gì đó...`);
    } else {
        alert("Bạn đã hỏi chuyện tất cả mọi người. Hãy tập trung vào Bảng Suy Luận.");
    }
  };

  const handleDragStart = (e: React.DragEvent, clue: DetectiveClue) => {
    setDraggedClue(clue);
    setInspectedClue(null); // Close inspector on drag
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent, suspectId: string, slotIndex: number) => {
    e.preventDefault();
    if (!draggedClue) return;
    
    const newSlots = {...deductionSlots};
    // Remove the clue from any other slot it might be in
    Object.keys(newSlots).forEach(sid => {
        newSlots[sid] = newSlots[sid].map(c => c === draggedClue!.id ? null : c);
    });
    newSlots[suspectId][slotIndex] = draggedClue.id;
    setDeductionSlots(newSlots);
    setDraggedClue(null);
    setSelectedClueForPlacement(null); // Clear tap selection on drag/drop
  };
  
  const handleAccuse = () => {
    let accusedSuspectId: string | null = null;
    let placedCount = 0;
    
    for (const suspectId in deductionSlots) {
      const clues = deductionSlots[suspectId].filter(c => c !== null);
      placedCount += clues.length;
      if (clues.length > 0) {
        if (accusedSuspectId) {
          alert("Chỉ có thể buộc tội một nghi phạm tại một thời điểm!");
          return;
        }
        accusedSuspectId = suspectId;
      }
    }

    if (!accusedSuspectId) {
      alert("Bạn phải đặt bằng chứng để buộc tội một nghi phạm!");
      return;
    }

    if(placedCount < missionData.solution.evidenceIds.length) {
      alert("Bạn chưa đủ bằng chứng để buộc tội nghi phạm!");
      return;
    }
    
    setShowDeductionBoard(false);
    const { culpritId, evidenceIds } = missionData.solution;
    const submittedEvidence = deductionSlots[accusedSuspectId].filter(c => c !== null) as string[];

    const isCorrectCulprit = accusedSuspectId === culpritId;
    const isCorrectEvidence = evidenceIds.length === submittedEvidence.length && evidenceIds.every(id => submittedEvidence.includes(id));
    
    setIsGameOver(true);
    if(isCorrectCulprit && isCorrectEvidence) {
      playSound('sfx_unlock');
      const finalScore = 1000 + (turnsLeft * 50);
      setScore(finalScore);
      setGameResult('win');
      setTimeout(() => onComplete(missionData.reward), 3000);
    } else {
      playSound('sfx_fail');
      onFail();
      setGameResult('loss');
      setTimeout(() => onReturnToMuseum(), 3000);
    }
  };

  const handleSelectForPlacement = (clue: DetectiveClue) => {
    setSelectedClueForPlacement(clue);
    setInspectedClue(null);
  };

  const handleSlotClick = (suspectId: string, slotIndex: number) => {
    const newSlots = {...deductionSlots};
    const clueIdInSlot = newSlots[suspectId][slotIndex];
    
    if (selectedClueForPlacement) {
      Object.keys(newSlots).forEach(sid => {
          newSlots[sid] = newSlots[sid].map(c => c === selectedClueForPlacement.id ? null : c);
      });
      newSlots[suspectId][slotIndex] = selectedClueForPlacement.id;
      setDeductionSlots(newSlots);
      setSelectedClueForPlacement(null);
      playSound('sfx_click');
    } 
    else if (clueIdInSlot) {
      newSlots[suspectId][slotIndex] = null;
      setDeductionSlots(newSlots);
      playSound('sfx_click');
    }
  };

  const renderResultOverlay = () => {
    if (!isGameOver) return null;

    if (gameResult === 'win') {
      return (
        <div className="detective-result-overlay result-win">
          <h2>Phá Án Thành Công!</h2>
          <p>Điểm của bạn:</p>
          <p id="final-score">{score}</p>
          <p>Phần thưởng sẽ được trao...</p>
        </div>
      );
    }

    const lossReason = turnsLeft <= 0 
      ? "Đã hết lượt đi! Kẻ gian đã trốn thoát."
      : "Buộc tội sai! Kẻ gian đã trốn thoát.";

    return (
      <div className="detective-result-overlay result-loss">
        <h2>Nhiệm vụ thất bại!</h2>
        <p>{lossReason}</p>
        <p>Hãy thử lại nhé.</p>
        <button onClick={onReturnToMuseum}>Quay về</button>
      </div>
    );
  };


  return (
    <div className="detective-screen-container">
      <div id="detective-screen">
          {renderResultOverlay()}
          
          {/* ---- DESKTOP VIEW ---- */}
          <div 
              className="hidden md:block w-full h-full" 
              style={{ backgroundImage: `url(${missionData.backgroundUrl})`}}
          >
              {missionData.npcs.map(npc => (
                <div
                  key={npc.id}
                  className={`npc-on-screen ${questionedNpcIds.includes(npc.id) ? 'questioned' : ''}`}
                  style={{ top: npc.position.top, left: npc.position.left }}
                  onClick={() => handleNpcClick(npc)}
                >
                  <img src={npc.avatarUrl} alt={npc.name} />
                </div>
              ))}
          </div>
          
           {/* ---- MOBILE VIEW ---- */}
          <div
            className="block md:hidden detective-mobile-view"
            style={{ backgroundImage: `url(${missionData.backgroundUrl})` }}
          >
             <h3 className="text-xl font-bold text-center text-amber-200 mb-4">Các nhân vật trong thành</h3>
             <div className="detective-mobile-list">
                {missionData.npcs.map(npc => (
                    <div 
                        key={npc.id} 
                        className={`detective-mobile-npc-card ${questionedNpcIds.includes(npc.id) ? 'questioned' : ''}`}
                        onClick={() => handleNpcClick(npc)}
                    >
                        <img src={npc.dialogueAvatarUrl || npc.avatarUrl} alt={npc.name} className="dialogue-avatar" />
                        <div className="flex-grow">
                            <p className="font-bold text-stone-800">{npc.name}</p>
                            <p className="text-sm italic text-stone-600">{npc.professionInfo?.title}</p>
                        </div>
                        {!questionedNpcIds.includes(npc.id) && (
                            <button className="ask-button">Hỏi</button>
                        )}
                    </div>
                ))}
             </div>
          </div>


          {activeDialogue && (
            <div className="detective-modal-overlay" onClick={() => setActiveDialogue(null)}>
                <div className="detective-modal-content clue-collection-modal" onClick={e => e.stopPropagation()}>
                    {activeDialogue.professionInfo && <button className="profession-info-button" onClick={(e) => { e.stopPropagation(); setInfoModalContent(activeDialogue.professionInfo!);}}>i</button>}
                    <div className="dialogue-header">
                        <img src={activeDialogue.dialogueAvatarUrl || activeDialogue.avatarUrl} alt={activeDialogue.name} className="dialogue-avatar" />
                        <h4>{activeDialogue.name}</h4>
                    </div>
                    <p className="dialogue-text">"{activeDialogue.initialDialogue}"</p>
                    <div className="dialogue-actions">
                        <button onClick={() => setActiveDialogue(null)}>Thôi</button>
                        <button onClick={handleQuestionNpc}>Hỏi chuyện (-{activeDialogue.turnCost || 1} lượt)</button>
                    </div>
                </div>
            </div>
        )}
        {pendingClue && (
            <div className="detective-modal-overlay" onClick={() => setPendingClue(null)}>
                <div className="detective-modal-content clue-collection-modal" onClick={e => e.stopPropagation()}>
                    <h4>{pendingClue.npc.name} nói...</h4>
                    <p className="flavor-text">"{getFlavorTextForNpc(pendingClue.npc.id)}"</p>
                    <hr/>
                    <h4>Thông tin nghe được:</h4>
                    <div className="clue-item">
                        <img src={pendingClue.clue.iconUrl} alt="clue icon" className="clue-icon"/>
                        <p>{pendingClue.clue.text}</p>
                    </div>
                    <div className="dialogue-actions">
                        <button onClick={() => setPendingClue(null)}>Bỏ qua</button>
                        <button onClick={handleCollectClue} style={{backgroundColor: '#16a34a', color: 'white'}}>Thu thập (-{pendingClue.npc.turnCost || 1} Lượt)</button>
                    </div>
                </div>
            </div>
        )}
        {infoModalContent && (
             <div className="detective-modal-overlay" onClick={() => setInfoModalContent(null)}>
                <div className="detective-modal-content profession-info-modal" onClick={e => e.stopPropagation()}>
                    <h3>{infoModalContent.title}</h3>
                    <p>{infoModalContent.description}</p>
                    <button className="dialogue-actions button" onClick={() => setInfoModalContent(null)}>Đóng</button>
                </div>
            </div>
        )}
      </div>
      <div id="detective-hud">
        <div className="hud-info">Lượt: {turnsLeft}</div>
        <div className="hud-buttons">
          <button onClick={() => setShowNotebook(true)} disabled={isGameOver}>Sổ tay</button>
          <button onClick={() => setShowDeductionBoard(true)} disabled={isGameOver}>Bảng Suy luận</button>
          <button onClick={onReturnToMuseum} disabled={isGameOver}>Rời đi</button>
        </div>
      </div>
      
      {showNotebook && (
        <div className="detective-modal-overlay" onClick={() => setShowNotebook(false)}>
            <div id="notebook-modal" className="detective-modal-content" onClick={e => e.stopPropagation()}>
                <h3 id="notebook-title">Sổ Tay Mật Thám</h3>
                <p className="text-center text-sm text-stone-600 mb-2">Chọn 2 manh mối để tìm mâu thuẫn, hoặc dùng gợi ý.</p>
                <div id="clues-list">
                  {Object.keys(collectedClues).length > 0 ? Object.values(collectedClues).map(clue => (
                    <div 
                      key={clue.id} 
                      className={`clue-item ${selectedClueId === clue.id ? 'selected-clue' : ''} ${selectedClueId && missionData.contradictions[selectedClueId]?.[0] === clue.id ? 'contradiction-source' : ''}`}
                      onClick={() => handleClueSelection(clue.id)}
                    >
                      <img src={clue.iconUrl} alt="clue icon" className="clue-icon"/>
                      <p>{clue.text}</p>
                    </div>
                  )) : <p style={{textAlign: 'center', color: '#44403c'}}>Chưa có manh mối nào.</p>}
                </div>
                <div className="mt-4 p-2 border-t border-dashed border-stone-400 text-center">
                    <button 
                        onClick={handleNotebookHint}
                        disabled={isGameOver || turnsLeft < 1}
                        className="hud-buttons button bg-blue-600 text-white border-blue-700 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-2"
                    >
                       Lấy Gợi Ý (-1 Lượt)
                    </button>
                </div>
                <button className="modal-close-button" onClick={() => setShowNotebook(false)}>&times;</button>
            </div>
        </div>
      )}

      {showDeductionBoard && (
        <div className="detective-modal-overlay" onClick={() => setShowDeductionBoard(false)}>
            <div id="deduction-board-modal" className="detective-modal-content" onClick={e => e.stopPropagation()}>
              <h3 id="deduction-board-title">Bảng Suy Luận</h3>
              <button className="modal-close-button" onClick={() => setShowDeductionBoard(false)}>&times;</button>
              
              <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                <div id="suspects-container">
                    {missionData.suspects.map(suspect => (
                        <div key={suspect.id} className="suspect-area">
                            <img src={suspect.portraitUrl} alt={suspect.name} className="suspect-portrait" />
                            <h4>{suspect.name}</h4>
                            <div className="evidence-slots">
                                {[0, 1, 2].map(i => (
                                  <div 
                                    key={i} 
                                    className={`evidence-slot ${draggedClue ? 'drag-over' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, suspect.id, i)}
                                    onClick={() => handleSlotClick(suspect.id, i)}
                                  >
                                    {deductionSlots[suspect.id][i] && (
                                      <div className="clue-item" draggable onDragStart={(e) => handleDragStart(e, collectedClues[deductionSlots[suspect.id][i]!])}>
                                        <img src={collectedClues[deductionSlots[suspect.id][i]!].iconUrl} alt="clue" className="clue-icon"/>
                                        <span>{collectedClues[deductionSlots[suspect.id][i]!].text}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div id="evidence-pool-container">
                  <h4>Manh mối có thể dùng</h4>
                  <div id="evidence-pool" onDragOver={handleDragOver} onDrop={(e) => { /* Handle drop back to pool if needed */ }}>
                    {Object.values(collectedClues)
                      .filter(clue => !Object.values(deductionSlots).flat().includes(clue.id))
                      .map(clue => (
                      <div 
                        key={clue.id} 
                        className={`clue-icon-in-pool ${selectedClueForPlacement?.id === clue.id ? 'selected-for-placement' : ''}`} 
                        title={clue.text}
                        onClick={() => setInspectedClue(clue)}>
                          <img src={clue.iconUrl} alt="clue"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div id="deduction-controls" className="flex-shrink-0">
                <button className="hint-button" onClick={handleHint} disabled={isGameOver || hintsUsed >= 3 || turnsLeft < 2}>Gợi ý ({3 - hintsUsed}/3)</button>
                <button className="accuse-button" onClick={handleAccuse}>Buộc tội</button>
              </div>
            </div>
        </div>
      )}

      {inspectedClue && (
          <div className="detective-modal-overlay" onClick={() => setInspectedClue(null)}>
              <div className="clue-inspector-modal" onClick={e => e.stopPropagation()}>
                  <p className="mb-2 text-sm font-bold">Kéo manh mối hoặc Chọn để đặt:</p>
                  <div className="clue-item" draggable onDragStart={(e) => handleDragStart(e, inspectedClue)}>
                      <img src={inspectedClue.iconUrl} alt="clue" className="clue-icon"/>
                      <span>{inspectedClue.text}</span>
                  </div>
                  <div className="actions">
                      <button className="btn-close" onClick={() => setInspectedClue(null)}>Đóng</button>
                      <button className="btn-select" onClick={() => handleSelectForPlacement(inspectedClue)}>Chọn để đặt</button>
                  </div>
              </div>
          </div>
      )}
      {showIntroModal && (
            <div className="detective-modal-overlay" style={{ zIndex: 30 }} onClick={() => setShowIntroModal(false)}>
                <div className="detective-modal-content" style={{ maxWidth: '600px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ fontFamily: "'Special Elite', cursive", fontSize: '2rem', color: '#5d4a36', marginBottom: '1rem', flexShrink: 0 }}>Vụ Án Mật Thám</h3>
                    <div className="overflow-y-auto pr-2" style={{ flexGrow: 1, minHeight: 0 }}>
                        <p style={{ fontFamily: "'Nunito', sans-serif", color: '#333', textAlign: 'left', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {"Khẩn cấp, mật thám!\n\nMột tài liệu tối quan trọng - bản đồ phòng thủ mới của thành Thăng Long - đã bị đánh cắp khỏi hoàng cung.\n\nChúng tôi tin rằng một gián điệp ngoại quốc, với sự trợ giúp của một kẻ phản bội trong thành, đang âm mưu tuồn bản đồ này ra ngoài. Manh mối rất mong manh, và thời gian không còn nhiều.\n\nNhiệm vụ của bạn là:\n- Thẩm vấn các nhân vật trong thành để thu thập manh mối.\n- Tìm ra những mâu thuẫn trong lời khai của họ.\n- Xác định chính xác kẻ gián điệp và bằng chứng chống lại chúng.\n\nVận mệnh của Thăng Long đang nằm trong tay bạn. Hãy hành động cẩn trọng và sáng suốt!"}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            playSound('sfx_click');
                            setShowIntroModal(false);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg text-lg mt-4 flex-shrink-0"
                    >
                        Bắt đầu Điều tra
                    </button>
                </div>
            </div>
      )}
    </div>
  );
};

export default DetectiveScreen;