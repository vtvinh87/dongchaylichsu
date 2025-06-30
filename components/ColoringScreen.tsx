import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ColoringMissionData, Reward } from '../types';
import { ALL_ARTIFACTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface ColoringScreenProps {
  missionData: ColoringMissionData;
  onReturnToMuseum: () => void;
  onComplete: (reward: Reward) => void;
}

const ColoringScreen: React.FC<ColoringScreenProps> = ({ missionData, onReturnToMuseum, onComplete }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [filledPaths, setFilledPaths] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [rewardImageUrl, setRewardImageUrl] = useState('');

  const solutionKeys = useMemo(() => Object.keys(missionData.solution), [missionData.solution]);

  useEffect(() => {
    setSelectedColor(missionData.colorPalette[0]);
    setFilledPaths({});
    setIsComplete(false);

    if (missionData.reward.type === 'artifact') {
      const artifact = ALL_ARTIFACTS_MAP[missionData.reward.id];
      if (artifact) setRewardImageUrl(artifact.imageUrl);
    }
  }, [missionData]);

  const handlePathClick = useCallback((e: React.MouseEvent) => {
    if (!selectedColor || isComplete) return;

    const target = e.target as SVGElement; // Use general SVGElement
    if (target && target.id && solutionKeys.includes(target.id)) {
        playSound('sfx-click');
        setFilledPaths(prev => ({ ...prev, [target.id]: selectedColor }));
    }
  }, [selectedColor, isComplete, solutionKeys]);

  useEffect(() => {
    if (solutionKeys.length === 0 || Object.keys(filledPaths).length < solutionKeys.length) {
      return;
    }

    const allCorrect = solutionKeys.every(pathId => filledPaths[pathId] === missionData.solution[pathId]);

    if (allCorrect) {
      setIsComplete(true);
      playSound('sfx-unlock');
      setTimeout(() => {
        onComplete(missionData.reward);
      }, 1500);
    }
  }, [filledPaths, solutionKeys, missionData.solution, missionData.reward, onComplete]);

  // Create a version of the SVG with React-style fill attributes using a robust DOM parser
  const renderedSVG = useMemo(() => {
    try {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(missionData.lineArtSVG, "image/svg+xml");
    
        // Check for parser errors, which can happen with malformed SVGs
        const parserError = svgDoc.querySelector('parsererror');
        if (parserError) {
          console.error("SVG parsing error:", parserError.textContent);
          return missionData.lineArtSVG; // Fallback to original string on error
        }

        Object.entries(filledPaths).forEach(([pathId, color]) => {
            const element = svgDoc.getElementById(pathId);
            if (element) {
                element.setAttribute('fill', color);
            }
        });
    
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svgDoc.documentElement);
    } catch (e) {
        console.error("Error processing SVG:", e);
        return missionData.lineArtSVG; // Fallback on any error
    }
  }, [missionData.lineArtSVG, filledPaths]);


  return (
    <div className="screen-container w-full max-w-2xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl text-center flex flex-col">
      <button
        onClick={onReturnToMuseum}
        className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 z-10"
        aria-label="Quay về Bảo tàng"
      >
        Quay về Bảo tàng
      </button>

      <h2 className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-4 font-serif">{missionData.title}</h2>
      
      <div className="relative flex-grow flex items-center justify-center">
        <div 
          id="coloring-canvas" 
          onClick={handlePathClick}
          dangerouslySetInnerHTML={{ __html: renderedSVG }}
        />
        {isComplete && (
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white animate-fadeInScaleUp rounded-lg">
                <h3 className="text-4xl font-bold">Hoàn Thành!</h3>
                <p className="text-xl mt-2">Bạn đã hoàn thành tác phẩm nghệ thuật!</p>
                {rewardImageUrl && <img src={rewardImageUrl} alt="Phần thưởng" className="w-24 h-24 object-contain my-4 rounded-lg" />}
            </div>
        )}
      </div>

      <div id="color-palette">
        {missionData.colorPalette.map(color => (
          <div
            key={color}
            className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => {
                playSound('sfx-click');
                setSelectedColor(color);
            }}
            aria-label={`Chọn màu ${color}`}
            role="button"
          />
        ))}
      </div>
    </div>
  );
};

export default ColoringScreen;