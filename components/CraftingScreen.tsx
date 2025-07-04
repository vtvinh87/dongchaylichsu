import React from 'react';
import { Artifact, MemoryFragment } from '../types';
import { ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP } from '../constants';
import { playSound } from '../utils/audio';

interface CraftingScreenProps {
  inventory: Record<string, number>;
  collectedArtifactIds: string[];
  onCraftItem: (artifactId: string) => void;
  onReturnToMuseum: () => void;
}

const CraftingScreen: React.FC<CraftingScreenProps> = ({
  inventory,
  collectedArtifactIds,
  onCraftItem,
  onReturnToMuseum,
}) => {
  const craftableArtifacts = (Object.values(ALL_ARTIFACTS_MAP) as Artifact[]).filter(
    (artifact) =>
      artifact.craftingRequirements && !collectedArtifactIds.includes(artifact.id)
  );

  const handleCraftClick = (artifactId: string) => {
    playSound('sfx_click');
    onCraftItem(artifactId);
  };

  return (
    <div className="screen-container w-full max-w-4xl p-6 bg-amber-100 dark:bg-stone-800 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300 font-serif">
          Xưởng Chế Tác
        </h2>
        <button
          onClick={onReturnToMuseum}
          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-900 font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Quay về Bảo tàng
        </button>
      </div>

      {/* Crafting List */}
      <div id="crafting-list" className="flex-grow overflow-y-auto space-y-6 pr-2">
        {craftableArtifacts.length > 0 ? (
          craftableArtifacts.map((artifact) => {
            const requirements = artifact.craftingRequirements || [];
            const collectedCount = requirements.reduce(
              (acc, fragId) => acc + (inventory[fragId] || 0),
              0
            );
            const canCraft = collectedCount >= requirements.length;

            return (
              <div
                key={artifact.id}
                className="crafting-item-card flex flex-col md:flex-row items-center gap-6 bg-white/80 dark:bg-stone-700/70 p-4 rounded-lg shadow-md"
              >
                {/* Artifact Image */}
                <div className="flex-shrink-0 w-32 h-32 bg-amber-50 dark:bg-stone-600 rounded-lg p-2 flex items-center justify-center">
                  <img
                    src={artifact.imageUrl}
                    alt={artifact.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Crafting Info */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                    {artifact.name}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 italic mb-3">
                    Thu thập đủ các Mảnh Ký ức để phục dựng cổ vật này.
                  </p>

                  {/* Fragments Required */}
                  <div className="flex justify-center md:justify-start gap-3 mb-3">
                    {requirements.map((fragId) => {
                      const fragment = ALL_FRAGMENTS_MAP[fragId];
                      const hasFragment = (inventory[fragId] || 0) > 0;
                      return (
                        <div
                          key={fragId}
                          title={fragment.name}
                          className={`w-12 h-12 bg-white dark:bg-stone-800 rounded-full p-1 border-2 ${
                            hasFragment
                              ? 'border-green-500'
                              : 'border-stone-400 dark:border-stone-500'
                          }`}
                        >
                          <img
                            src={fragment.imageUrl}
                            alt={fragment.name}
                            className={`w-full h-full object-contain transition-opacity duration-300 ${
                              hasFragment ? 'opacity-100' : 'opacity-30 grayscale'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                   {/* Progress Bar */}
                   <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-600 mb-1">
                      <div 
                        className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                        style={{ width: `${(collectedCount / requirements.length) * 100}%` }}
                      ></div>
                  </div>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                    Tiến độ: {collectedCount} / {requirements.length}
                  </p>
                </div>

                {/* Crafting Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleCraftClick(artifact.id)}
                    disabled={!canCraft}
                    className="crafting-button bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    Chế tác
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 bg-white/50 dark:bg-stone-700/50 rounded-lg">
            <p className="text-stone-600 dark:text-stone-400 text-lg italic">
              Bạn chưa có cổ vật nào có thể chế tác. <br/> Hãy hoàn thành các nhiệm vụ để thu thập Mảnh Ký ức!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CraftingScreen;