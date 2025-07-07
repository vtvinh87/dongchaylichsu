import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StrategyMapMissionData, Reward } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface StrategyMapScreenProps {
  missionData: StrategyMapMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
  onFail?: () => void;
}

interface Point { x: number; y: number; }

const StrategyMapScreen: React.FC<StrategyMapScreenProps> = ({ missionData, onReturnToMuseum, onComplete }) => {
  const [path, setPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isMissionOver, setIsMissionOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);
  const rewardImageUrl = useRef('');

  useEffect(() => {
    if (missionData.reward.type === 'artifact') {
      const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
      if (artifact) rewardImageUrl.current = artifact.imageUrl;
    }
  }, [missionData]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path
    if (path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = '#ef4444'; // Red-500
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw start and end points
    const { startPoint, endPoint } = missionData;
    const w = canvas.width;
    const h = canvas.height;

    // Start
    ctx.beginPath();
    ctx.arc(startPoint.x * w / 100, startPoint.y * h / 100, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#22c55e'; // Green-500
    ctx.fill();

    // End
    ctx.beginPath();
    ctx.arc(endPoint.x * w / 100, endPoint.y * h / 100, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#f97316'; // Orange-500
    ctx.fill();
  }, [path, missionData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = mapImageRef.current;
    if (canvas && image) {
      // Ensure canvas has the same size as the displayed image
      const setCanvasSize = () => {
        canvas.width = image.clientWidth;
        canvas.height = image.clientHeight;
        draw();
      };
      
      if (image.complete) {
        setCanvasSize();
      } else {
        image.onload = setCanvasSize;
      }
      window.addEventListener('resize', setCanvasSize);
      return () => window.removeEventListener('resize', setCanvasSize);
    }
  }, [draw]);
  
  const getMousePos = (e: React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMissionOver) return;
    setIsDrawing(true);
    setFeedback(null);
    const pos = getMousePos(e);
    setPath([pos]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || isMissionOver) return;
    const pos = getMousePos(e);
    setPath(prevPath => [...prevPath, pos]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const checkPathSafety = () => {
    if (isMissionOver || path.length < 2) {
      setFeedback({ message: 'Bạn chưa vẽ đường đi!', type: 'error' });
      return;
    }
    
    const canvas = canvasRef.current!;
    const w = canvas.width;

    for (const zone of missionData.dangerZones) {
      const zoneCenter = { x: zone.x * w / 100, y: zone.y * w / 100 };
      const zoneRadius = zone.radius * w / 100;
      
      for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i+1];

        // Line-circle intersection check
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const lenSq = dx * dx + dy * dy;
        
        let t = ((zoneCenter.x - p1.x) * dx + (zoneCenter.y - p1.y) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t)); // Clamp to segment

        const closestX = p1.x + t * dx;
        const closestY = p1.y + t * dy;
        
        const distSq = (closestX - zoneCenter.x)**2 + (closestY - zoneCenter.y)**2;

        if (distSq < zoneRadius**2) {
          playSound('sfx-click'); // Use a different sound for error?
          setFeedback({ message: 'Lộ trình không an toàn! Quân ta bị phục kích.', type: 'error' });
          return;
        }
      }
    }
    
    playSound('sfx-unlock');
    setFeedback({ message: 'Hành quân thành công! Đã đến được Thăng Long!', type: 'success' });
    setIsMissionOver(true);
    setTimeout(() => {
        onComplete(missionData.reward);
    }, 2000);
  };
  

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-stone-900 text-white rounded-lg shadow-xl flex flex-col items-center">
      <h2 className="text-3xl font-bold text-amber-300 mb-2 font-serif">{missionData.title}</h2>
      <p className="text-stone-300 mb-4">Vẽ đường hành quân từ điểm xanh lá tới điểm màu cam, tránh các chốt địch.</p>
      
      <div id="map-container" className="w-full flex-grow-0 aspect-[4/3]">
        <img ref={mapImageRef} src={missionData.mapImageUrl} alt="Bản đồ chiến thuật" />
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
        <button
          onClick={checkPathSafety}
          disabled={isMissionOver}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Bắt đầu Hành quân
        </button>
        <button onClick={onReturnToMuseum} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 font-semibold py-3 px-6 rounded-lg shadow-md">
          Quay về
        </button>
      </div>
      
      {feedback && (
        <div className={`mt-4 p-3 rounded-lg font-semibold text-lg animate-fadeInScaleUp ${
            feedback.type === 'success' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
        }`}>
          {feedback.message}
        </div>
      )}
       {isMissionOver && feedback?.type === 'success' && (
           <div className="mt-4 flex flex-col items-center animate-fadeInScaleUp">
                {rewardImageUrl.current && <img src={rewardImageUrl.current} alt="Phần thưởng" className="w-24 h-24 object-contain my-2 rounded-lg" />}
                <p>Đang nhận phần thưởng...</p>
           </div>
       )}
    </div>
  );
};

export default StrategyMapScreen;
