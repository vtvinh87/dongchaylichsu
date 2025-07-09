// components/MainInterface.tsx

import React, { useMemo, useCallback } from 'react';
import { Hoi, MissionInfo, Artifact, HeroCard, Decoration, AvatarCustomization, Reward, MissionData } from '../types';
import MissionCard from './SagaCard';
import ArtifactCard from './ArtifactCard';
import HeroCardDisplay from './HeroCardDisplay'; 
import DecorationCard from './DecorationCard';
import AvatarDisplay from './AvatarDisplay';
import { ALL_QUEST_CHAINS } from '../constants';

interface MainInterfaceProps {
  userName: string;
  gender: 'male' | 'female';
  avatarCustomization: AvatarCustomization;
  hois: Hoi[];
  missions: Record<string, MissionData>;
  collectedArtifacts: Artifact[];
  collectedHeroCards: HeroCard[]; 
  collectedDecorations: Decoration[];
  inventory: Record<string, number>;
  onStartMission: (missionInfo: MissionInfo) => void;
  onShowLeaderboard: () => void;
  onToggleChatbot: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isPremium: boolean;
  isAdmin: boolean;
  onShowPremium: () => void;
  onShowAdminPanel: () => void;
  onShowItemDetails: (item: Artifact | HeroCard | Decoration) => void;
  onShowSandbox: () => void;
  onShowCustomization: () => void;
  onShowCrafting: () => void;
  onShowAchievements: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  questProgress: Record<string, number>;
  isTaySonCampaignComplete: boolean;
}

const MainInterface: React.FC<MainInterfaceProps> = ({
  userName,
  gender,
  avatarCustomization,
  hois,
  missions,
  collectedArtifacts,
  collectedHeroCards, 
  collectedDecorations,
  inventory,
  onStartMission,
  onShowLeaderboard,
  onToggleChatbot,
  theme,
  onToggleTheme,
  isPremium,
  isAdmin,
  onShowPremium,
  onShowAdminPanel,
  onShowItemDetails,
  onShowSandbox,
  onShowCustomization,
  onShowCrafting,
  onShowAchievements,
  isSoundEnabled,
  onToggleSound,
  questProgress,
  isTaySonCampaignComplete,
}) => {

    // Memoize sets of collected IDs for efficient O(1) lookups.
    const collectedArtifactIds = useMemo(() => new Set(collectedArtifacts.map(a => a.id)), [collectedArtifacts]);
    const collectedHeroCardIds = useMemo(() => new Set(collectedHeroCards.map(h => h.id)), [collectedHeroCards]);

    const isMissionCompleted = useCallback((missionId: string): boolean => {
        const missionData = missions[missionId];
        // If a mission doesn't exist or has no reward, we don't block based on it.
        // This is important for steps in a quest chain that grant no intermediate reward.
        if (!missionData || !missionData.reward) {
            return true;
        }

        const reward = missionData.reward;
        switch(reward.type) {
            case 'artifact':
                return collectedArtifactIds.has(reward.id);
            case 'heroCard':
                return collectedHeroCardIds.has(reward.id);
            case 'fragment':
                return (inventory[reward.id] || 0) > 0;
            // Decorations and other types don't block progression
            case 'decoration':
            default:
                return true;
        }
    }, [collectedArtifactIds, collectedHeroCardIds, inventory, missions]);

    const hoiUnlockStatus = useMemo(() => {
        if (isPremium || isAdmin) {
            return hois.map(() => true);
        }
        
        const status: boolean[] = [];
        for (let i = 0; i < hois.length; i++) {
            if (i === 0) {
                status.push(true); // First chapter is always unlocked
                continue;
            }
            
            const previousHoi = hois[i - 1];
            // An unlocked chapter is considered "complete" for unlocking the next one if all its required missions are done.
            if (!status[i-1]) {
                status.push(false);
                continue;
            }

            let isPreviousHoiComplete = true;
            const requiredMissions = previousHoi.missions.filter(
                mission => !mission.isOptionalForProgression
            );
            
            // If a chapter has no required missions, it's complete.
            if (requiredMissions.length === 0) {
                status.push(true);
                continue;
            }
    
            for (const missionInfo of requiredMissions) {
                let reward: Reward | undefined;
                
                if (missionInfo.questChainId) {
                    const chain = ALL_QUEST_CHAINS[missionInfo.questChainId];
                    if (!chain) { isPreviousHoiComplete = false; break; }
                    const lastStep = chain.steps[chain.steps.length - 1];
                    const finalMissionData = missions[lastStep.missionId];
                    reward = finalMissionData?.reward;
                } else {
                    const missionData = missions[missionInfo.missionId];
                    reward = missionData?.reward;
                }
    
                if (!reward) { 
                    // A required mission without reward doesn't block progression.
                    continue; 
                }
    
                let isRewardCollected = false;
                switch(reward.type) {
                    case 'artifact':
                        isRewardCollected = collectedArtifactIds.has(reward.id);
                        break;
                    case 'heroCard':
                        isRewardCollected = collectedHeroCardIds.has(reward.id);
                        break;
                    case 'fragment':
                        // Fragments MUST block progression if they are the reward of a required mission.
                        isRewardCollected = (inventory[reward.id] || 0) > 0;
                        break;
                    default:
                        // Decorations, etc., don't block progression
                        isRewardCollected = true;
                }
    
                if (!isRewardCollected) {
                    isPreviousHoiComplete = false;
                    break;
                }
            }
            status.push(isPreviousHoiComplete);
        }
        return status;
    }, [hois, missions, collectedArtifactIds, collectedHeroCardIds, inventory, isPremium, isAdmin]);


  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-amber-100/30 dark:bg-stone-800/30 rounded-lg shadow-xl space-y-8 main-screen-container backdrop-blur-sm">
      <header id="main-header" className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b-2 border-amber-300 dark:border-stone-700 gap-4">
        <div className="flex items-center gap-3">
          <AvatarDisplay avatar={avatarCustomization} gender={gender} className="w-16 h-16 flex-shrink-0" />
          <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-300 text-center sm:text-left">
            Chào mừng, {userName}!
          </h1>
        </div>
        <div id="main-header-controls" className="flex items-center gap-2 flex-wrap justify-center">
            {isAdmin && (
                <button
                    onClick={onShowAdminPanel}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center"
                    aria-label="Mở Bảng điều khiển Quản trị"
                >
                    <span role="img" aria-label="gear icon" className="mr-2 text-xl">⚙️</span>
                    Admin Panel
                </button>
            )}
            <button
              onClick={onToggleSound}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg shadow-md"
              aria-label={isSoundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              id="toggle-sound-button"
            >
              {isSoundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={onToggleTheme}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-3 rounded-lg shadow-md"
              aria-label={theme === 'light' ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
             {!isPremium && !isAdmin && (
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
              <span role="img" aria-label="hammer and pick icon" className="mr-2">🛠️</span>
              Chế tác
            </button>
             <button
              onClick={onShowCustomization}
              className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
              aria-label="Mở màn hình Tùy chỉnh Nhân vật"
            >
                <span role="img" aria-label="artist palette icon" className="mr-2">🎨</span>
                Tùy chỉnh
            </button>
            <button
              id="main-leaderboard-button"
              onClick={onShowLeaderboard}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
              aria-label="Mở Bảng Xếp Hạng"
            >
              <span role="img" aria-label="trophy icon" className="mr-2">🏆</span>
              Xếp Hạng
            </button>
             <button
              id="main-chatbot-button"
              onClick={onToggleChatbot}
              className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
              aria-label="Mở chatbot Hỏi Đáp Lịch Sử"
            >
              <span role="img" aria-label="speech bubble icon" className="mr-2">💬</span>
              Hỏi Đáp
            </button>
            <button
                onClick={onShowSandbox}
                className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
                aria-label="Mở chế độ Sáng tạo"
            >
                <span role="img" aria-label="sparkles icon" className="mr-2">✨</span>
                Sáng tạo
            </button>
            <button
                onClick={onShowAchievements}
                className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
                aria-label="Mở Bảng Thành Tựu"
            >
                 <span role="img" aria-label="medal icon" className="mr-2">🎖️</span>
                Thành tựu
            </button>
        </div>
      </header>

      {/* Main Content: Chapters (Hồi) */}
      <main id="main-journey-section" className="space-y-12">
        {hois.map((hoi, index) => {
          const isChapterUnlocked = hoiUnlockStatus[index];
          return (
            <section key={hoi.id} className={`p-6 rounded-lg shadow-lg ${isChapterUnlocked ? 'bg-amber-50/50 dark:bg-stone-700/50' : 'bg-gray-200/50 dark:bg-stone-800/50 grayscale'}`}>
              <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-2 border-b-2 border-amber-200 dark:border-stone-600 pb-2">{hoi.title}</h2>
              <p className="text-stone-600 dark:text-stone-400 mb-6">{hoi.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hoi.missions.map(missionInfo => {
                    if (isPremium || isAdmin) {
                        return (
                            <MissionCard 
                              key={missionInfo.id} 
                              mission={missionInfo} 
                              onClick={() => onStartMission(missionInfo)} 
                              isLocked={false}
                            />
                          );
                    }

                    const isDependencyLocked = missionInfo.dependsOnMissionId 
                      ? !isMissionCompleted(missionInfo.dependsOnMissionId)
                      : false;
                    
                    let finalIsLocked = !isChapterUnlocked || isDependencyLocked || (missionInfo.isPremium && !isPremium);
                    
                    // Override lock status if Tay Son campaign is complete and mission is part of it
                    if (missionInfo.questChainId === 'tay_son_campaign' && isTaySonCampaignComplete) {
                        finalIsLocked = false;
                    }

                    return (
                        <MissionCard 
                          key={missionInfo.id} 
                          mission={missionInfo} 
                          onClick={() => onStartMission(missionInfo)} 
                          isLocked={finalIsLocked}
                        />
                    );
                })}
              </div>
            </section>
          )
        })}
      </main>

      {/* Collection Section */}
      <footer id="main-collection-section" className="mt-8 pt-6 border-t-2 border-amber-300 dark:border-stone-700">
        <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-4 text-center">Bộ Sưu Tập Của Bạn</h2>
        
        {/* Artifacts */}
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-3">Cổ vật</h3>
            <div className="flex flex-wrap gap-4 p-4 bg-white/30 dark:bg-stone-900/30 rounded-lg justify-center">
            {collectedArtifacts.length > 0 ? collectedArtifacts.map(artifact => (
                <div key={artifact.id} onClick={() => onShowItemDetails(artifact)} className="cursor-pointer">
                    <ArtifactCard artifact={artifact} />
                </div>
            )) : <p className="text-stone-500 dark:text-stone-400 italic">Chưa có cổ vật nào.</p>}
            </div>
        </div>

        {/* Hero Cards */}
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-3">Nhân vật Lịch sử</h3>
            <div className="flex flex-wrap gap-4 p-4 bg-white/30 dark:bg-stone-900/30 rounded-lg justify-center">
            {collectedHeroCards.length > 0 ? collectedHeroCards.map(heroCard => (
                <div key={heroCard.id} onClick={() => onShowItemDetails(heroCard)} className="cursor-pointer">
                    <HeroCardDisplay heroCard={heroCard} />
                </div>
            )) : <p className="text-stone-500 dark:text-stone-400 italic">Chưa chiêu mộ được nhân vật nào.</p>}
            </div>
        </div>
        
        {/* Decorations */}
        <div>
            <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-3">Vật phẩm Trang trí</h3>
            <div className="flex flex-wrap gap-4 p-4 bg-white/30 dark:bg-stone-900/30 rounded-lg justify-center">
            {collectedDecorations.length > 0 ? collectedDecorations.map(decoration => (
                <div key={decoration.id} onClick={() => onShowItemDetails(decoration)} className="cursor-pointer">
                    <DecorationCard decoration={decoration} />
                </div>
            )) : <p className="text-stone-500 dark:text-stone-400 italic">Chưa có vật phẩm trang trí nào.</p>}
            </div>
        </div>

      </footer>
    </div>
  );
};

export default MainInterface;
