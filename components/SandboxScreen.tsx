import React, { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { Artifact, Decoration, SandboxState, PlacedItem, SandboxItem, SpeechBubble, SandboxBackground } from '../types';
import { playSound } from '../utils/audio';
import { TRANSPARENT_GIF_URL } from '../imageUrls';
import { ALL_SANDBOX_BACKGROUNDS_MAP } from '../constants';

type DraggedInfo =
  | { type: 'item'; item: PlacedItem; offsetX: number; offsetY: number }
  | { type: 'bubble'; item: SpeechBubble; offsetX: number; offsetY: number };

interface SandboxScreenProps {
  collectedArtifacts: Artifact[];
  collectedDecorations: Decoration[];
  unlockedBackgroundIds: string[];
  sandboxState: SandboxState;
  onUpdateSandboxState: (newState: React.SetStateAction<SandboxState>) => void;
  onReturnToMuseum: () => void;
}

const SandboxScreen: React.FC<SandboxScreenProps> = ({
  collectedArtifacts,
  collectedDecorations,
  unlockedBackgroundIds,
  sandboxState,
  onUpdateSandboxState,
  onReturnToMuseum,
}) => {
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [isAddingDialogue, setIsAddingDialogue] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const draggedItemRef = useRef<DraggedInfo | null>(null);
  const nextZIndex = useRef(1);

  // Initialize nextZIndex based on existing items
  useMemo(() => {
    const maxZ = Math.max(
      ...sandboxState.placedItems.map(i => i.zIndex), 
      ...sandboxState.speechBubbles.map(b => b.zIndex), 
      0
    );
    nextZIndex.current = maxZ + 1;
  }, [sandboxState]);


  const availableItems: SandboxItem[] = [
    ...collectedArtifacts.map(a => ({ ...a, type: 'artifact' as const })),
    ...collectedDecorations.map(d => ({ ...d, type: 'decoration' as const })),
  ];
  
  const activeBackgroundUrl = ALL_SANDBOX_BACKGROUNDS_MAP[sandboxState.activeBackgroundId]?.imageUrl || '';

  const handleDragStartPalette = (e: React.DragEvent<HTMLImageElement>, item: SandboxItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();

    if (draggedItemRef.current) { // Moving an existing item or bubble
      const { type, item, offsetX, offsetY } = draggedItemRef.current;
      const x = e.clientX - canvasRect.left - offsetX;
      const y = e.clientY - canvasRect.top - offsetY;

      if(type === 'item') {
        const newPlacedItems = sandboxState.placedItems.map(p => p.instanceId === (item as PlacedItem).instanceId ? { ...p, x, y } : p);
        onUpdateSandboxState({...sandboxState, placedItems: newPlacedItems});
      } else if (type === 'bubble') {
        const newSpeechBubbles = sandboxState.speechBubbles.map(b => b.id === (item as SpeechBubble).id ? { ...b, x, y } : b);
        onUpdateSandboxState({...sandboxState, speechBubbles: newSpeechBubbles});
      }
      draggedItemRef.current = null;
      return;
    }

    try { // Dropping a new item from palette
      const itemData = JSON.parse(e.dataTransfer.getData('application/json')) as SandboxItem;
      const x = e.clientX - canvasRect.left - 60; 
      const y = e.clientY - canvasRect.top - 60;

      const newItem: PlacedItem = {
        ...itemData,
        instanceId: `item-${Date.now()}-${Math.random()}`,
        x: x, y: y, rotation: 0, scale: 1, zIndex: nextZIndex.current++,
      };
      onUpdateSandboxState({ ...sandboxState, placedItems: [...sandboxState.placedItems, newItem]});
    } catch (error) {
      console.error("Failed to handle drop:", error);
    }
  };
  
  const handleDragStartCanvas = (e: React.DragEvent<HTMLDivElement>, item: PlacedItem | SpeechBubble, type: 'item' | 'bubble') => {
      const img = new Image();
      img.src = TRANSPARENT_GIF_URL;
      e.dataTransfer.setDragImage(img, 0, 0);
      
      const targetRect = (e.target as HTMLElement).getBoundingClientRect();
      // The `item` is correctly typed here based on the `type` parameter, so we can cast.
      if (type === 'item') {
        draggedItemRef.current = { type, item: item as PlacedItem, offsetX: e.clientX - targetRect.left, offsetY: e.clientY - targetRect.top };
      } else {
        draggedItemRef.current = { type, item: item as SpeechBubble, offsetX: e.clientX - targetRect.left, offsetY: e.clientY - targetRect.top };
      }
      e.dataTransfer.effectAllowed = 'move';
  };

  const selectItem = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation();
    if(isAddingDialogue) {
        const item = sandboxState.placedItems.find(p => p.instanceId === instanceId);
        if(item) handleAddSpeechBubble(item);
        return;
    }
    
    setSelectedInstanceId(instanceId);
    const newPlacedItems = sandboxState.placedItems.map(item => item.instanceId === instanceId ? {...item, zIndex: nextZIndex.current++} : item);
    onUpdateSandboxState({ ...sandboxState, placedItems: newPlacedItems });
  };
  
  const deselectItem = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      setSelectedInstanceId(null);
      setIsAddingDialogue(false);
    }
  };

  const generateAndSetBubbleText = async (bubbleId: string, itemName: string) => {
    try {
      const prompt = `Bạn là một trợ lý sáng tạo cho game lịch sử. Hãy tạo một câu thoại ngắn gọn (1-2 câu), thú vị, dưới dạng suy nghĩ hoặc một sự thật vui về vật phẩm sau. Viết bằng tiếng Việt, văn phong phù hợp cho trẻ em. Vật phẩm: "${itemName}"`;
      
      const apiResponse = await fetch('/.netlify/functions/gemini-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'generate',
            prompt: prompt,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("API call failed");
      }
      
      const data = await apiResponse.json();

      onUpdateSandboxState(s => {
          const newBubbles = s.speechBubbles.map(b => b.id === bubbleId ? { ...b, text: data.text.trim() } : b);
          return {...s, speechBubbles: newBubbles};
      });
    } catch (e) {
      console.error("Error generating bubble text:", e);
      onUpdateSandboxState(s => {
          const newBubbles = s.speechBubbles.map(b => b.id === bubbleId ? { ...b, text: "Oops, có lỗi xảy ra!" } : b);
          return {...s, speechBubbles: newBubbles};
      });
    }
  };

  const handleAddSpeechBubble = (item: PlacedItem) => {
    playSound('sfx-click');
    setIsAddingDialogue(false);
    
    const newBubble: SpeechBubble = {
      id: `bubble-${Date.now()}`,
      text: '', // Empty initially, will show loading via CSS
      x: item.x + 100,
      y: item.y - 30,
      zIndex: nextZIndex.current++,
      attachedToInstanceId: item.instanceId,
    };

    onUpdateSandboxState({ ...sandboxState, speechBubbles: [...sandboxState.speechBubbles, newBubble]});
    generateAndSetBubbleText(newBubble.id, item.name);
  };
  
  const handleBackgroundSelect = (bgId: string) => {
    if (unlockedBackgroundIds.includes(bgId)) {
        playSound('sfx-click');
        onUpdateSandboxState({ ...sandboxState, activeBackgroundId: bgId });
    }
  };

  const handleSaveImage = () => {
    playSound('sfx-click');
    setSelectedInstanceId(null);
    setTimeout(() => {
        if (canvasRef.current) {
          html2canvas(canvasRef.current, { backgroundColor: null, useCORS: true, logging: false })
            .then(canvas => {
              const link = document.createElement('a');
              link.download = 'dong-chay-lich-su-sang-tao.png';
              link.href = canvas.toDataURL('image/png');
              link.click();
            });
        }
    }, 100);
  };
  
  const handleDeleteSelected = () => {
      if (!selectedInstanceId) return;
      playSound('sfx-click');
      const newItems = sandboxState.placedItems.filter(item => item.instanceId !== selectedInstanceId);
      const newBubbles = sandboxState.speechBubbles.filter(b => b.attachedToInstanceId !== selectedInstanceId);
      onUpdateSandboxState({ ...sandboxState, placedItems: newItems, speechBubbles: newBubbles });
      setSelectedInstanceId(null);
  };

  const handleRotateSelected = (direction: 'left' | 'right') => {
      if (!selectedInstanceId) return;
      const amount = direction === 'left' ? -15 : 15;
      const newItems = sandboxState.placedItems.map(item => item.instanceId === selectedInstanceId ? {...item, rotation: item.rotation + amount} : item);
      onUpdateSandboxState({ ...sandboxState, placedItems: newItems });
  };
  
  const handleScaleSelected = (direction: 'up' | 'down') => {
      if (!selectedInstanceId) return;
      const amount = direction === 'up' ? 0.1 : -0.1;
      const newItems = sandboxState.placedItems.map(item => item.instanceId === selectedInstanceId ? {...item, scale: Math.max(0.2, item.scale + amount)} : item);
      onUpdateSandboxState({ ...sandboxState, placedItems: newItems });
  };
  

  return (
    <div className="sandbox-container screen-container w-full h-full max-w-7xl max-h-[95vh] mx-auto p-4 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col sm:flex-row gap-4">
      {/* Background & Item Palettes */}
      <aside id="palette-sidebar" className="w-full sm:w-52 flex-shrink-0 flex sm:flex-col gap-4">
        {/* Background Palette */}
        <div id="background-palette" className="bg-white dark:bg-stone-700 p-3 rounded-lg shadow-inner flex-1">
            <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3 text-center border-b pb-2 border-amber-200 dark:border-stone-600">Bối Cảnh</h3>
            <div className="overflow-y-auto space-y-3 pr-2 sm:max-h-48">
              {(Object.values(ALL_SANDBOX_BACKGROUNDS_MAP) as SandboxBackground[]).map(bg => {
                  const isLocked = !unlockedBackgroundIds.includes(bg.id);
                  const isSelected = sandboxState.activeBackgroundId === bg.id;
                  return (
                    <div key={bg.id} title={bg.name} onClick={() => handleBackgroundSelect(bg.id)} className={`relative p-1 rounded-md border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500' : 'border-transparent'} ${isLocked ? 'item-locked' : 'hover:bg-amber-100 dark:hover:bg-stone-600'}`}>
                      <img src={bg.imageUrl} alt={bg.name} className="w-full h-auto object-cover rounded-sm" />
                      {isLocked && <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-sm"><span className="text-white text-3xl">🔒</span></div>}
                    </div>
                  );
              })}
            </div>
        </div>
        {/* Item Palette */}
        <div id="item-palette" className="bg-white dark:bg-stone-700 p-3 rounded-lg shadow-inner flex-1">
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3 text-center border-b pb-2 border-amber-200 dark:border-stone-600">Vật Phẩm</h3>
          <div className="overflow-y-auto space-y-3 pr-2 flex-grow">
              {availableItems.length > 0 ? availableItems.map(item => (
                  <div key={item.id} className="text-center p-2 rounded-md bg-amber-50 dark:bg-stone-600/50 cursor-grab active:cursor-grabbing hover:bg-amber-100 dark:hover:bg-stone-600 transition-colors">
                      <img src={item.imageUrl} alt={item.name} title={item.name} className="w-16 h-16 object-contain mx-auto" draggable="true" onDragStart={e => handleDragStartPalette(e, item)} />
                      <p className="text-xs mt-1 text-stone-600 dark:text-stone-300">{item.name}</p>
                  </div>
              )) : ( <p className="text-sm text-stone-500 dark:text-stone-400 italic text-center p-4">Thu thập cổ vật và vật phẩm trang trí để sử dụng tại đây!</p> )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow flex flex-col gap-4">
        <div id="sandbox-canvas" ref={canvasRef} className={`relative w-full aspect-square bg-contain bg-no-repeat bg-center rounded-lg shadow-lg overflow-hidden border-2 border-amber-300 dark:border-stone-600 ${isAddingDialogue ? 'dialogue-mode' : ''}`}
          style={{ backgroundImage: `url('${activeBackgroundUrl}')` }} onDragOver={handleDragOver} onDrop={handleDrop} onClick={deselectItem}>
          
          {sandboxState.placedItems.sort((a,b) => a.zIndex - b.zIndex).map(item => (
              <div key={item.instanceId} draggable="true" onDragStart={e => handleDragStartCanvas(e, item, 'item')} onClick={(e) => selectItem(e, item.instanceId)}
                  style={{ position: 'absolute', left: `${item.x}px`, top: `${item.y}px`, transform: `rotate(${item.rotation}deg) scale(${item.scale})`, zIndex: item.zIndex, cursor: isAddingDialogue ? 'copy' : 'move' }}
                  className={`placed-item transition-transform duration-100 ${selectedInstanceId === item.instanceId ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent rounded-md' : ''}`}>
                  <img src={item.imageUrl} alt={item.name} className="w-32 h-32 object-contain pointer-events-none" />
              </div>
          ))}
          {sandboxState.speechBubbles.sort((a,b) => a.zIndex - b.zIndex).map(bubble => (
              <div key={bubble.id} draggable="true" onDragStart={e => handleDragStartCanvas(e, bubble, 'bubble')}
                  style={{ position: 'absolute', left: `${bubble.x}px`, top: `${bubble.y}px`, zIndex: bubble.zIndex }}
                  className={`speech-bubble ${!bubble.text ? 'loading' : ''}`} >
                  {bubble.text}
              </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-stone-700 p-3 rounded-lg shadow-md">
            <div id="item-controls" className="flex items-center gap-2">
              <span className="text-sm font-semibold text-stone-600 dark:text-stone-300 mr-2">Công cụ:</span>
              <button onClick={() => handleRotateSelected('left')} disabled={!selectedInstanceId} className="control-button" title="Xoay trái">↩️</button>
              <button onClick={() => handleRotateSelected('right')} disabled={!selectedInstanceId} className="control-button" title="Xoay phải">↪️</button>
              <button onClick={() => handleScaleSelected('up')} disabled={!selectedInstanceId} className="control-button" title="Phóng to">➕</button>
              <button onClick={() => handleScaleSelected('down')} disabled={!selectedInstanceId} className="control-button" title="Thu nhỏ">➖</button>
              <button onClick={handleDeleteSelected} disabled={!selectedInstanceId} className="control-button text-red-500 disabled:text-gray-400" title="Xóa">🗑️</button>
              <button onClick={() => setIsAddingDialogue(true)} className="control-button" title="Thêm Hội thoại">💬</button>
              <style>{`.control-button { font-size: 1.5rem; padding: 0.25rem; border-radius: 0.25rem; transition: background-color 0.2s; } .control-button:not(:disabled):hover { background-color: rgba(0,0,0,0.1); } .control-button:disabled { opacity: 0.5; cursor: not-allowed; }`}</style>
            </div>
            <div id="main-controls" className="flex items-center gap-2">
                <button onClick={onReturnToMuseum} className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">Quay về Bảo tàng</button>
                <button onClick={handleSaveImage} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">Lưu ảnh Sáng tạo</button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default SandboxScreen;