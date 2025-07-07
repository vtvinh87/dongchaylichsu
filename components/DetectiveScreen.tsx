// components/DetectiveScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { DetectiveMissionData, Reward, DetectiveClue, DetectiveNPC } from '../types';
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
  }, [missionData]);

  const spendTurn = useCallback(() => {
      setTurnsLeft(prev => prev - 1);
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
      playSound('sfx_success');
      const { npc, clue } = pendingClue;
      setCollectedClues(prev => ({ ...prev, [clue.id]: clue }));
      setQuestionedNpcIds(prev => [...prev, npc.id]);
      spendTurn();
      setPendingClue(null);
  }

  const handleClueSelection = (clueId: string) => {
    if (selectedClueId === clueId) {
        setSelectedClueId(null); // Deselect
        return;
    }

    if (selectedClueId) {
      const contradictionPair = missionData.contradictions[selectedClueId];
      if (contradictionPair && contradictionPair[0] === clueId) {
        const newClueId = contradictionPair[1];
        const newClue = missionData.deductionClues[newClueId];
        if (newClue && !collectedClues[newClueId]) {
          playSound('sfx_unlock');
          alert(`Mâu thuẫn! Bạn đã phát hiện ra một manh mối mới: ${newClue.text}`);
          setCollectedClues(prev => ({...prev, [newClueId]: newClue}));
          spendTurn();
        }
      } else {
         playSound('sfx_fail');
         alert("Hai manh mối này không mâu thuẫn.");
      }
      setSelectedClueId(null);
    } else {
      setSelectedClueId(clueId);
    }
  };

  const handleHint = () => {
    if ((inventory['vat-tu'] || 0) < 20) {
      alert("Không đủ Vật tư! Cần 20 Vật tư để dùng gợi ý.");
      return;
    }
    
    const hintNpc = missionData.npcs.find(npc => !questionedNpcIds.includes(npc.id) && npc.clue.isTrue);
    if (hintNpc) {
      setInventory(prev => ({...prev, 'vat-tu': (prev['vat-tu'] || 0) - 20}));
      alert(`Gợi ý: Hãy thử hỏi chuyện ${hintNpc.name}.`);
      playSound('sfx_unlock');
    } else {
      alert("Không còn gợi ý nào hữu ích lúc này.");
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
    setSelectedClueForPlacement(null); // Also clear tap selection
  };
  
  const handleAccuse = () => {
    let accusedSuspectId: string | null = null;
    
    for (const suspectId in deductionSlots) {
      const clues = deductionSlots[suspectId].filter(c => c !== null);
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
    
    // If a clue is selected for placement, place it
    if (selectedClueForPlacement) {
      // Remove from other slots if it exists
      Object.keys(newSlots).forEach(sid => {
          newSlots[sid] = newSlots[sid].map(c => c === selectedClueForPlacement.id ? null : c);
      });
      // Place it in the new slot
      newSlots[suspectId][slotIndex] = selectedClueForPlacement.id;
      setDeductionSlots(newSlots);
      setSelectedClueForPlacement(null);
      playSound('sfx_click');
    } 
    // If no clue is selected, and the slot is not empty, remove the clue
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
      <div id="detective-screen" style={{ backgroundImage: `url(${missionData.backgroundUrl})`}}>
        {renderResultOverlay()}
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
        {activeDialogue && (
            <div className="npc-dialogue-box" >
                <div className="dialogue-header">
                    <img src={activeDialogue.dialogueAvatarUrl || activeDialogue.avatarUrl} alt={activeDialogue.name} className="dialogue-avatar" />
                    <h4>{activeDialogue.name}</h4>
                </div>
                <p className="dialogue-text">"{activeDialogue.initialDialogue}"</p>
                <div className="dialogue-actions">
                    <button onClick={() => setActiveDialogue(null)}>Thôi</button>
                    <button onClick={handleQuestionNpc}>Hỏi chuyện</button>
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
                        <button onClick={handleCollectClue} style={{backgroundColor: '#16a34a', color: 'white'}}>Thu thập (-1 Lượt)</button>
                    </div>
                </div>
            </div>
        )}
      </div>
      <div id="detective-hud">
        <div className="hud-info">Lượt: {turnsLeft}</div>
        <div className="hud-buttons">
          <button onClick={() => setShowNotebook(true)} disabled={isGameOver}>Sổ tay</button>
          <button onClick={() => setShowDeductionBoard(true)} disabled={isGameOver}>Bảng Suy luận</button>
          <button id="hint-button" onClick={handleHint} disabled={isGameOver || (inventory['vat-tu'] || 0) < 20}>Gợi ý (20 Vật tư)</button>
          <button onClick={onReturnToMuseum} disabled={isGameOver}>Rời đi</button>
        </div>
      </div>
      
      {showNotebook && (
        <div className="detective-modal-overlay" onClick={() => setShowNotebook(false)}>
            <div id="notebook-modal" className="detective-modal-content" onClick={e => e.stopPropagation()}>
                <h3 id="notebook-title">Sổ Tay Mật Thám</h3>
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
                <button className="modal-close-button" onClick={() => setShowNotebook(false)}>&times;</button>
            </div>
        </div>
      )}

      {showDeductionBoard && (
        <div className="detective-modal-overlay" onClick={() => setShowDeductionBoard(false)}>
            <div id="deduction-board-modal" className="detective-modal-content" onClick={e => e.stopPropagation()}>
              <h3 id="deduction-board-title">Bảng Suy Luận</h3>
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
              <div id="deduction-controls">
                <button onClick={handleAccuse}>Buộc tội</button>
              </div>
              <button className="modal-close-button" onClick={() => setShowDeductionBoard(false)}>&times;</button>

              {inspectedClue && (
                <div className="clue-inspector-modal" >
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
              )}
            </div>
        </div>
      )}
    </div>
  );
};

export default DetectiveScreen;