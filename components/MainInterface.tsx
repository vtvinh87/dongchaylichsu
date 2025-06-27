import React, { useMemo } from 'react';
import { Hoi, MissionInfo, Artifact, HeroCard, Decoration, AvatarCustomization } from '../types';
import MissionCard from './SagaCard';
import ArtifactCard from './ArtifactCard';
import HeroCardDisplay from './HeroCardDisplay'; 
import DecorationCard from './DecorationCard';
import AvatarDisplay from './AvatarDisplay';
import { ALL_MISSIONS } from '../constants';

interface MainInterfaceProps {
  userName: string;
  avatarCustomization: AvatarCustomization;
  hois: Hoi[];
  collectedArtifacts: Artifact[];
  collectedHeroCards: HeroCard[]; 
  collectedDecorations: Decoration[];
  onStartMission: (missionInfo: MissionInfo) => void;
  onShowLeaderboard: () => void;
  onToggleChatbot: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isPremium: boolean;
  onShowPremium: () => void;
  onShowItemDetails: (item: Artifact | HeroCard | Decoration) => void;
  onShowSandbox: () => void;
  onShowCustomization: () => void;
  onShowCrafting: () => void;
}

const MainInterface: React.FC<MainInterfaceProps> = ({
  userName,
  avatarCustomization,
  hois,
  collectedArtifacts,
  collectedHeroCards, 
  collectedDecorations,
  onStartMission,
  onShowLeaderboard,
  onToggleChatbot,
  theme,
  onToggleTheme,
  isPremium,
  onShowPremium,
  onShowItemDetails,
  onShowSandbox,
  onShowCustomization,
  onShowCrafting,
}) => {

    // Memoize sets of collected IDs for efficient O(1) lookups.
    const collectedArtifactIds = useMemo(() => new Set(collectedArtifacts.map(a => a.id)), [collectedArtifacts]);
    const collectedHeroCardIds = useMemo(() => new Set(collectedHeroCards.map(h => h.id)), [collectedHeroCards]);
    const collectedDecorationIds = useMemo(() => new Set(collectedDecorations.map(d => d.id)), [collectedDecorations]);

    const hoiUnlockStatus = useMemo(() => {
        const status: boolean[] = [];
        for (let i = 0; i < hois.length; i++) {
            if (i === 0) {
                status.push(true); // First chapter is always unlocked
                continue;
            }
            
            const previousHoi = hois[i - 1];
            let isPreviousHoiComplete = true;

            const requiredMissions = previousHoi.missions.filter(
                mission => !mission.isOptionalForProgression
            );

            for (const missionInfo of requiredMissions) {
                const missionData = ALL_MISSIONS[missionInfo.missionId];
                if (!missionData) continue;
                
                const reward = missionData.reward;
                if (!reward) continue;

                let isRewardCollected = false;
                 // Chapter progression only depends on collecting the final artifact/herocard, not fragments.
                if (reward.type === 'artifact') {
                    isRewardCollected = collectedArtifactIds.has(reward.id);
                } else if (reward.type === 'heroCard') {
                    isRewardCollected = collectedHeroCardIds.has(reward.id);
                } else {
                    isRewardCollected = true; // Fragments and decorations don't block progression
                }

                if (!isRewardCollected) {
                    isPreviousHoiComplete = false;
                    break;
                }
            }
            status.push(isPreviousHoiComplete);
        }
        return status;
    }, [hois, collectedArtifactIds, collectedHeroCardIds]);


  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-amber-100/30 dark:bg-stone-800/30 rounded-lg shadow-xl space-y-8 main-screen-container backdrop-blur-sm">
      <header id="main-header" className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b-2 border-amber-300 dark:border-stone-700 gap-4">
        <div className="flex items-center gap-3">
          <AvatarDisplay avatar={avatarCustomization} className="w-16 h-16 flex-shrink-0" />
          <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-300 text-center sm:text-left">
            Chào mừng, {userName}!
          </h1>
        </div>
        <div id="main-header-controls" className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={onToggleTheme}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg shadow-md"
              aria-label={theme === 'light' ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
             {!isPremium && (
                <button
                    onClick={onShowPremium}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center"
                    aria-label="Nâng cấp Premium"
                >
                    <span role="img" aria-label="star icon" className="mr-2 text-xl">⭐</span>
                    Nâng cấp Premium
                </button>
            )}
            <button
              onClick={onShowCrafting}
              className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
              aria-label="Mở Xưởng Chế tác"
            >
              <span role="img" aria-label="hammer icon" className="mr-2 text-xl">🔨</span>
              Chế tác
            </button>
            <button
              id="main-chatbot-button"
              onClick={onToggleChatbot}
              className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
              aria-label="Mở chatbot Hỏi Đáp Lịch Sử"
            >
              <span role="img" aria-label="chat icon" className="mr-2 text-xl">💬</span>
              Hỏi Đáp
            </button>
            <button
              onClick={onShowSandbox}
              className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
              aria-label="Mở Chế độ Sáng tạo Sandbox"
            >
              <span role="img" aria-label="palette icon" className="mr-2 text-xl">🎨</span>
              Sáng tạo
            </button>
            <button
              id="main-leaderboard-button"
              onClick={onShowLeaderboard}
              className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
            >
              <span role="img" aria-label="trophy icon" className="mr-2 text-xl">🏆</span>
              Xếp Hạng
            </button>
             <button
              onClick={onShowCustomization}
              className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
              aria-label="Mở màn hình Tùy chỉnh Nhân vật"
            >
              <span role="img" aria-label="shirt icon" className="mr-2 text-xl">👕</span>
              Tùy chỉnh
            </button>
        </div>
      </header>
      
      <section id="main-journey-section">
        <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-4">Hành Trình Xuyên Thời Gian</h2>
        <div className="space-y-8">
          {hois.map((hoi, index) => {
            const isHoiUnlocked = hoiUnlockStatus[index];
            const isPremiumLocked = hoi.isPremiumChapter && !isPremium;

            return (
              <div key={hoi.id} className={`hoi-container ${(!isHoiUnlocked || isPremiumLocked) ? 'locked' : ''}`}>
                <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-2">{hoi.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-6">{hoi.description}</p>
                <div className="mission-list">
                  {hoi.missions.map((mission) => (
                    <MissionCard 
                      key={mission.id} 
                      mission={mission} 
                      onClick={() => onStartMission(mission)}
                      isLocked={mission.isPremium && !isPremium}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {isPremium && (
          <section>
            <h2 className="text-2xl font-semibold text-yellow-500 dark:text-yellow-400 mb-4 flex items-center">
                <span role="img" aria-label="star" className="mr-2">⭐</span> Vật Phẩm Trang Trí Premium
            </h2>
            {collectedDecorations.length > 0 ? (
              <div id="premium-decorations-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {collectedDecorations.map((decoration) => (
                  <div key={decoration.id} onClick={() => onShowItemDetails(decoration)} className="cursor-pointer" title={`Xem chi tiết ${decoration.name}`}>
                    <DecorationCard decoration={decoration} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-600 dark:text-stone-400 italic bg-white/30 dark:bg-stone-700/30 p-4 rounded-md">Hoàn thành nhiệm vụ Premium để nhận vật phẩm trang trí độc quyền!</p>
            )}
          </section>
      )}

      <section id="main-collection-section">
        <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-4">Cổ Vật Đã Thu Thập</h2>
        {collectedArtifacts.length > 0 ? (
          <div id="collection-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collectedArtifacts.map((artifact) => (
              <div key={artifact.id} onClick={() => onShowItemDetails(artifact)} className="cursor-pointer" title={`Xem chi tiết ${artifact.name}`}>
                  <ArtifactCard artifact={artifact} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-600 dark:text-stone-400 italic bg-white/30 dark:bg-stone-700/30 p-4 rounded-md">Hãy hoàn thành nhiệm vụ để thu thập cổ vật nhé!</p>
        )}
      </section>

      
      <section>
        <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-400 mb-4">Thẻ Anh Hùng</h2>
        {collectedHeroCards.length > 0 ? (
          <div id="hero-card-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collectedHeroCards.map((heroCard) => (
              <div key={heroCard.id} onClick={() => onShowItemDetails(heroCard)} className="cursor-pointer" title={`Xem chi tiết ${heroCard.name}`}>
                <HeroCardDisplay heroCard={heroCard} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-600 dark:text-stone-400 italic bg-white/30 dark:bg-stone-700/30 p-4 rounded-md">Hoàn thành các Hồi đặc biệt để nhận thẻ Anh Hùng!</p>
        )}
      </section>
    </div>
  );
};

export default MainInterface;