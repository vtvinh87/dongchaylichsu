import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Artifact, Decoration } from '../types';
import { playSound } from '../utils/audio';
import { SANDBOX_BACKGROUND_URL, TRANSPARENT_GIF_URL } from '../imageUrls';

type SandboxItem = (Artifact | Decoration) & { type: 'artifact' | 'decoration' };

type PlacedItem = SandboxItem & {
  instanceId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
};

interface SandboxScreenProps {
  collectedArtifacts: Artifact[];
  collectedDecorations: Decoration[];
  onReturnToMuseum: () => void;
}

const SandboxScreen: React.FC<SandboxScreenProps> = ({
  collectedArtifacts,
  collectedDecorations,
  onReturnToMuseum,
}) => {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggedItemRef = useRef<{ item: PlacedItem; offsetX: number; offsetY: number } | null>(null);
  const nextZIndex = useRef(1);

  const availableItems: SandboxItem[] = [
    ...collectedArtifacts.map(a => ({ ...a, type: 'artifact' as const })),
    ...collectedDecorations.map(d => ({ ...d, type: 'decoration' as const })),
  ];

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
    
    // Check if moving an existing item
    if (draggedItemRef.current) {
      const { item, offsetX, offsetY } = draggedItemRef.current;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - offsetX;
      const y = e.clientY - canvasRect.top - offsetY;

      setPlacedItems(prev =>
        prev.map(p =>
          p.instanceId === item.instanceId ? { ...p, x: x, y: y } : p
        )
      );
      draggedItemRef.current = null;
      return;
    }

    // Dropping a new item from the palette
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('application/json')) as SandboxItem;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      // Drop at center of cursor
      const x = e.clientX - canvasRect.left - 60; // Approximate half-width of a new item
      const y = e.clientY - canvasRect.top - 60; // Approximate half-height

      const newItem: PlacedItem = {
        ...itemData,
        instanceId: `item-${Date.now()}-${Math.random()}`,
        x: x,
        y: y,
        rotation: 0,
        scale: 1,
        zIndex: nextZIndex.current++,
      };
      setPlacedItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error("Failed to handle drop:", error);
    }
  };
  
  const handleDragStartCanvas = (e: React.DragEvent<HTMLDivElement>, item: PlacedItem) => {
      // Create a transparent drag image
      const img = new Image();
      img.src = TRANSPARENT_GIF_URL;
      e.dataTransfer.setDragImage(img, 0, 0);

      const targetRect = (e.target as HTMLElement).getBoundingClientRect();
      draggedItemRef.current = {
          item,
          offsetX: e.clientX - targetRect.left,
          offsetY: e.clientY - targetRect.top,
      };
      e.dataTransfer.effectAllowed = 'move';
  };

  const selectItem = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation();
    setSelectedInstanceId(instanceId);
    // Bring to front
    setPlacedItems(items => items.map(item => item.instanceId === instanceId ? {...item, zIndex: nextZIndex.current++} : item));
  };
  
  const deselectItem = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      setSelectedInstanceId(null);
    }
  };

  const handleSaveImage = () => {
    playSound('sfx-click');
    setSelectedInstanceId(null); // Deselect item to remove controls from saved image
    setTimeout(() => { // Allow time for UI to update
        if (canvasRef.current) {
          html2canvas(canvasRef.current, {
            backgroundColor: null, // Use the element's background
            useCORS: true, // For images from other domains
            logging: false,
          }).then(canvas => {
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
      setPlacedItems(items => items.filter(item => item.instanceId !== selectedInstanceId));
      setSelectedInstanceId(null);
  };

  const handleRotateSelected = (direction: 'left' | 'right') => {
      if (!selectedInstanceId) return;
      const amount = direction === 'left' ? -15 : 15;
      setPlacedItems(items => items.map(item => item.instanceId === selectedInstanceId ? {...item, rotation: item.rotation + amount} : item));
  };
  
  const handleScaleSelected = (direction: 'up' | 'down') => {
      if (!selectedInstanceId) return;
      const amount = direction === 'up' ? 0.1 : -0.1;
      setPlacedItems(items => items.map(item => item.instanceId === selectedInstanceId ? {...item, scale: Math.max(0.2, item.scale + amount)} : item));
  };
  

  return (
    <div className="sandbox-container screen-container w-full h-full max-w-7xl max-h-[95vh] mx-auto p-4 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col sm:flex-row gap-4">
      {/* Item Palette */}
      <aside id="item-palette" className="w-full sm:w-48 flex-shrink-0 bg-white dark:bg-stone-700 p-3 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3 text-center border-b pb-2 border-amber-200 dark:border-stone-600">Vật Phẩm</h3>
        <div className="h-40 sm:h-full overflow-y-auto space-y-3 pr-2">
            {availableItems.length > 0 ? availableItems.map(item => (
                <div key={item.id} className="text-center p-2 rounded-md bg-amber-50 dark:bg-stone-600/50 cursor-grab active:cursor-grabbing hover:bg-amber-100 dark:hover:bg-stone-600 transition-colors">
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        title={item.name}
                        className="w-16 h-16 object-contain mx-auto"
                        draggable="true"
                        onDragStart={e => handleDragStartPalette(e, item)}
                    />
                    <p className="text-xs mt-1 text-stone-600 dark:text-stone-300">{item.name}</p>
                </div>
            )) : (
                 <p className="text-sm text-stone-500 dark:text-stone-400 italic text-center p-4">Thu thập cổ vật và vật phẩm trang trí để sử dụng tại đây!</p>
            )}
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow flex flex-col gap-4">
        {/* Canvas Area */}
        <div 
          id="sandbox-canvas" 
          ref={canvasRef}
          className="relative flex-grow bg-cover bg-center rounded-lg shadow-lg overflow-hidden border-2 border-amber-300 dark:border-stone-600"
          style={{ backgroundImage: `url('${SANDBOX_BACKGROUND_URL}')` }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={deselectItem}
        >
          {placedItems.sort((a,b) => a.zIndex - b.zIndex).map(item => (
              <div
                  key={item.instanceId}
                  draggable="true"
                  onDragStart={e => handleDragStartCanvas(e, item)}
                  onClick={(e) => selectItem(e, item.instanceId)}
                  style={{
                      position: 'absolute',
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                      zIndex: item.zIndex,
                      cursor: 'move',
                  }}
                  className={`transition-transform duration-100 ${selectedInstanceId === item.instanceId ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent rounded-md' : ''}`}
              >
                  <img src={item.imageUrl} alt={item.name} className="w-32 h-32 object-contain pointer-events-none" />
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