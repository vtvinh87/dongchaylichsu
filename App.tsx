import React, { useState, useCallback, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MainInterface from './components/MainInterface';
import MissionScreen from './components/MissionScreen';
import NarrativeMissionScreen from './components/NarrativeMissionScreen';
import TimelineMissionScreen from './components/TimelineMissionScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import ArScreenComponent from './components/ArScreenComponent'; // Import AR Screen
import ArtifactInfoModal from './components/ArtifactInfoModal';
import Chatbot from './components/Chatbot'; // Import Chatbot
import PremiumScreen from './components/PremiumScreen'; // Import Premium Screen
import PremiumWelcomeModal from './components/PremiumWelcomeModal'; // Import Premium Welcome Modal
import ItemDetailModal from './components/ItemDetailModal'; // Import new ItemDetailModal
import SandboxScreen from './components/SandboxScreen'; // Import Sandbox Screen
import HiddenObjectScreen from './components/HiddenObjectScreen'; // Import Hidden Object Screen
import QuizScreen from './components/QuizScreen'; // Import Quiz Screen
import ConstructionScreen from './components/ConstructionScreen'; // Import Construction Screen
import DiplomacyScreen from './components/DiplomacyScreen'; // Import Diplomacy Screen
import TutorialOverlay from './components/TutorialOverlay'; // Import Tutorial Overlay
import InstructionModal from './components/InstructionModal'; // Import Instruction Modal
import CustomizationScreen from './components/CustomizationScreen'; // Import Customization Screen
import LandingScreen from './components/LandingScreen'; // Import Landing Screen
import CraftingScreen from './components/CraftingScreen'; // Import Crafting Screen
import TradingScreen from './components/TradingScreen'; // Import Trading Screen
import RhythmScreen from './components/RhythmScreen'; // Import Rhythm Screen
import ColoringScreen from './components/ColoringScreen'; // Import Coloring Screen
import AchievementsScreen from './components/AchievementsScreen'; // Import Achievements Screen
import AchievementToast from './components/AchievementToast'; // Import Achievement Toast
import RallyCallScreen from './components/RallyCallScreen'; // Import Rally Call Screen
import ForgingScreen from './components/ForgingScreen'; // Import Forging Screen
import QuestChainScreen from './components/QuestChainScreen'; // Import Quest Chain Screen
import TacticalMapScreen from './components/TacticalMapScreen'; // Import Tactical Map Screen
import DefenseScreen from './components/DefenseScreen'; // Import Defense Screen
import StrategyMapScreen from './components/StrategyMapScreen'; // Import Strategy Map Screen
import CoinMintingScreen from './components/CoinMintingScreen'; // Import Coin Minting Screen
import { Screen, Artifact, MissionInfo, HeroCard, MissionData, PuzzleMissionData, NarrativeMissionData, TimelineMissionData, ARMissionData, HiddenObjectMissionData, LeaderboardEntry, AiCharacter, Decoration, QuizMissionData, ConstructionMissionData, Tutorial, SavedGameState, AvatarCustomization, CustomizationItem, DiplomacyMissionData, Reward, MemoryFragment, TradingMissionData, ColoringMissionData, RhythmMissionData, SandboxState, Achievement, RallyCallMissionData, ForgingMissionData, QuestChain, TacticalMapMissionData, DefenseMissionData, StrategyMapMissionData, CoinMintingMissionData } from './types';
import { 
  HOI_DATA, ALL_MISSIONS, APP_NAME, ALL_HERO_CARDS,
  LEADERBOARD_LOCAL_STORAGE_KEY, POINTS_PER_ARTIFACT, MAX_LEADERBOARD_ENTRIES,
  AI_CHARACTERS, ALL_DECORATIONS_MAP, TUTORIAL_DATA, ALL_CUSTOMIZATION_ITEMS_MAP, ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP, ALL_SANDBOX_BACKGROUNDS_MAP, ALL_ACHIEVEMENTS_MAP, ALL_QUEST_CHAINS
} from './constants';
import { BACKGROUND_IMAGE_URL } from './imageUrls';
import { playSound } from './utils/audio';

const LOCAL_STORAGE_KEY = 'dongChayLichSu_gameState_v1';
const THEME_STORAGE_KEY = 'dongChayLichSu_theme_v1';
const ANIMATION_DURATION = 500; // ms, should match CSS animation

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LANDING_PAGE); 
  const [userName, setUserName] = useState<string>('');
  const [collectedArtifacts, setCollectedArtifacts] = useState<Artifact[]>([]);
  const [collectedHeroCards, setCollectedHeroCards] = useState<HeroCard[]>([]);
  const [collectedDecorations, setCollectedDecorations] = useState<Decoration[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [activeQuestChainId, setActiveQuestChainId] = useState<string | null>(null);
  const [questProgress, setQuestProgress] = useState<Record<string, number>>({});
  const [transitionClass, setTransitionClass] = useState<string>('screen-fade-in');
  
  const [rewardItemForModal, setRewardItemForModal] = useState<Artifact | MemoryFragment | null>(null);
  const [showSharedArtifactInfoModal, setShowSharedArtifactInfoModal] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false); 
  const [arRewardMessage, setArRewardMessage] = useState<string | null>(null);
  const [showPremiumWelcomeModal, setShowPremiumWelcomeModal] = useState<boolean>(false);
  const [itemForDetailModal, setItemForDetailModal] = useState<Artifact | HeroCard | Decoration | null>(null);

  // Freemium State
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [dailyChatCount, setDailyChatCount] = useState<number>(0);
  const [lastChatDate, setLastChatDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Tutorial State
  const [tutorialsSeen, setTutorialsSeen] = useState<string[]>([]);
  const [activeTutorial, setActiveTutorial] = useState<{ id: string, stepIndex: number } | null>(null);
  const [seenInstructions, setSeenInstructions] = useState<string[]>([]);
  
  // Customization & Unlocks State
  const [avatarCustomization, setAvatarCustomization] = useState<AvatarCustomization>({ outfit: 'default_outfit', hat: null });
  const [unlockedCustomizationItemIds, setUnlockedCustomizationItemIds] = useState<string[]>(['default_outfit']);
  const [unlockedCharacterIds, setUnlockedCharacterIds] = useState<string[]>([]);
  
  // Sandbox 2.0 State
  const [unlockedBackgroundIds, setUnlockedBackgroundIds] = useState<string[]>(['lang-que']);
  const [sandboxState, setSandboxState] = useState<SandboxState>({
    activeBackgroundId: 'lang-que',
    placedItems: [],
    speechBubbles: [],
  });
  
  // Achievements State
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [achievementNotification, setAchievementNotification] = useState<Achievement | null>(null);

  // Instruction Modal State
  const [instructionModalState, setInstructionModalState] = useState<{
    isOpen: boolean;
    gameType: string | null;
    onConfirm: (() => void) | null;
  }>({ isOpen: false, gameType: null, onConfirm: null });


  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) return storedTheme;
    return 'dark'; 
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);
  
  // Set global background image for main app screens
  useEffect(() => {
    if (currentScreen !== Screen.LANDING_PAGE) {
        document.body.style.backgroundImage = `url('${BACKGROUND_IMAGE_URL}')`;
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    } else {
        document.body.style.backgroundImage = ''; // Clear for landing page
    }

    // Cleanup on component unmount or screen change
    return () => {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundAttachment = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
    };
  }, [currentScreen]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    playSound('sfx-click'); 
  }, []);


  const navigateTo = useCallback((screen: Screen, mission: MissionData | null = null) => {
    const nonStandardNavScreens = [Screen.AR_MISSION_SCREEN, Screen.PREMIUM_SCREEN, Screen.SANDBOX, Screen.HIDDEN_OBJECT_SCREEN, Screen.QUIZ_MISSION_SCREEN, Screen.CONSTRUCTION_MISSION_SCREEN, Screen.DIPLOMACY_MISSION_SCREEN, Screen.CUSTOMIZATION, Screen.CRAFTING_SCREEN, Screen.TRADING_SCREEN, Screen.COLORING_MISSION_SCREEN, Screen.RHYTHM_MISSION_SCREEN, Screen.ACHIEVEMENTS, Screen.RALLY_CALL_MISSION_SCREEN, Screen.FORGING_MISSION_SCREEN, Screen.QUEST_CHAIN_SCREEN, Screen.TACTICAL_MAP_MISSION_SCREEN, Screen.DEFENSE_MISSION_SCREEN, Screen.STRATEGY_MAP_MISSION_SCREEN, Screen.COIN_MINTING_MISSION_SCREEN];
    if (currentScreen !== screen || activeMission?.id !== mission?.id || nonStandardNavScreens.includes(screen)) {
      setTransitionClass('screen-fade-out');
      setTimeout(() => {
        setCurrentScreen(screen);
        setActiveMission(mission);
        setTransitionClass('screen-fade-in');
      }, ANIMATION_DURATION);
    }
  }, [currentScreen, activeMission]);

  
  const handleStartAdventure = useCallback(() => {
    playSound('sfx-click');

    const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    let nextScreen = Screen.LOGIN;
    let loadedTutorialsSeen: string[] = [];

    if (savedStateJSON) {
        try {
            const loadedState = JSON.parse(savedStateJSON) as SavedGameState;
            
            if (loadedState.userName) {
                setUserName(loadedState.userName);
                nextScreen = Screen.MAIN_INTERFACE;
            }

            if (loadedState.collectedArtifactIds && Array.isArray(loadedState.collectedArtifactIds)) {
              const artifacts: Artifact[] = loadedState.collectedArtifactIds
                .map((id: string) => ALL_ARTIFACTS_MAP[id])
                .filter((artifact): artifact is Artifact => artifact !== undefined);
              setCollectedArtifacts(artifacts);
            }

            if (loadedState.collectedHeroCardIds && Array.isArray(loadedState.collectedHeroCardIds)) {
              const heroCards: HeroCard[] = loadedState.collectedHeroCardIds
                .map((id: string) => ALL_HERO_CARDS[id])
                .filter((card): card is HeroCard => card !== undefined);
              setCollectedHeroCards(heroCards);
            }
            
            if (loadedState.collectedDecorationIds && Array.isArray(loadedState.collectedDecorationIds)) {
              const decorations: Decoration[] = loadedState.collectedDecorationIds
                .map((id: string) => ALL_DECORATIONS_MAP[id])
                .filter((decoration): decoration is Decoration => decoration !== undefined);
              setCollectedDecorations(decorations);
            }
            
            setInventory(loadedState.inventory ?? {});
            setQuestProgress(loadedState.questProgress ?? {});

            setIsPremium(loadedState.isPremium ?? false);
            const today = new Date().toISOString().split('T')[0];
            if (loadedState.lastChatDate === today) {
                setDailyChatCount(loadedState.dailyChatCount ?? 0);
                setLastChatDate(today);
            } else {
                setDailyChatCount(0);
                setLastChatDate(today);
            }

            loadedTutorialsSeen = loadedState.tutorialsSeen ?? [];
            setTutorialsSeen(loadedTutorialsSeen);
            setSeenInstructions(loadedState.seenInstructions ?? []);

            setAvatarCustomization(loadedState.avatarCustomization ?? { outfit: 'default_outfit', hat: null });
            setUnlockedCustomizationItemIds(loadedState.unlockedCustomizationItemIds ?? ['default_outfit']);
            
            const defaultUnlockedChars = Object.values(AI_CHARACTERS).filter(c => c.unlockHoiId === null).map(c => c.id);
            setUnlockedCharacterIds(loadedState.unlockedCharacterIds ?? defaultUnlockedChars);

            setSandboxState(loadedState.sandboxState ?? { activeBackgroundId: 'lang-que', placedItems: [], speechBubbles: [] });
            setUnlockedBackgroundIds(loadedState.unlockedBackgroundIds ?? ['lang-que']);

            setUnlockedAchievementIds(loadedState.unlockedAchievementIds ?? []);

        } catch (error) {
            console.error("Failed to parse game state from localStorage:", error);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            nextScreen = Screen.LOGIN;
        }
    } else {
         // First time playing, grant default unlocks
         const defaultUnlockedChars = Object.values(AI_CHARACTERS).filter(c => c.unlockHoiId === null).map(c => c.id);
         setUnlockedCharacterIds(defaultUnlockedChars);
         setUnlockedBackgroundIds(['lang-que']);
         setSandboxState({ activeBackgroundId: 'lang-que', placedItems: [], speechBubbles: [] });
         setUnlockedAchievementIds([]);
         setQuestProgress({});
    }
    
    navigateTo(nextScreen);

    if (nextScreen === Screen.MAIN_INTERFACE && !loadedTutorialsSeen.includes('main-interface-intro')) {
        setTimeout(() => {
            setActiveTutorial({ id: 'main-interface-intro', stepIndex: 0 });
        }, ANIMATION_DURATION + 500);
    }

  }, [navigateTo]);

  const checkAndAwardAchievements = useCallback((gameState: SavedGameState) => {
    Object.values(ALL_ACHIEVEMENTS_MAP).forEach(achievement => {
        if (!gameState.unlockedAchievementIds?.includes(achievement.id)) {
            if (achievement.condition(gameState)) {
                setUnlockedAchievementIds(prev => [...prev, achievement.id]);
                setAchievementNotification(achievement);
                playSound('sfx-unlock');
            }
        }
    });
  }, []);

  useEffect(() => {
    if (userName) { 
      const gameState: SavedGameState = {
        userName,
        collectedArtifactIds: collectedArtifacts.map(a => a.id),
        collectedHeroCardIds: collectedHeroCards.map(hc => hc.id),
        collectedDecorationIds: collectedDecorations.map(d => d.id),
        inventory,
        isPremium,
        questProgress,
        dailyChatCount,
        lastChatDate,
        tutorialsSeen,
        seenInstructions,
        avatarCustomization,
        unlockedCustomizationItemIds,
        unlockedCharacterIds,
        unlockedBackgroundIds,
        sandboxState,
        unlockedAchievementIds,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
      checkAndAwardAchievements(gameState);
    }
  }, [userName, collectedArtifacts, collectedHeroCards, collectedDecorations, inventory, isPremium, dailyChatCount, lastChatDate, tutorialsSeen, seenInstructions, avatarCustomization, unlockedCustomizationItemIds, unlockedCharacterIds, unlockedBackgroundIds, sandboxState, unlockedAchievementIds, questProgress, checkAndAwardAchievements]);

  // Effect to unlock customization items & characters based on completed chapters
  useEffect(() => {
    const completedHoiIds = new Set<string>();
    for (let i = 0; i < HOI_DATA.length; i++) {
        const hoi = HOI_DATA[i];
        let isHoiComplete = true;
        const requiredMissions = hoi.missions.filter(m => !m.isOptionalForProgression);
        if (requiredMissions.length === 0 && i < HOI_DATA.length -1) {
             // If a chapter has no required missions, consider it complete if the previous one is
             const previousHoi = HOI_DATA[i-1];
             if (previousHoi && completedHoiIds.has(previousHoi.id)) {
                completedHoiIds.add(hoi.id);
             }
             continue;
        };

        for (const missionInfo of requiredMissions) {
            const missionData = ALL_MISSIONS[missionInfo.missionId];
            if (!missionData) continue;
            
            const reward = missionData.reward;
            if (!reward) continue;

            let isRewardCollected = false;
            // For progression, we only check for artifacts and hero cards, not fragments.
            if (reward.type === 'artifact') {
                isRewardCollected = collectedArtifacts.some(a => a.id === reward.id);
            } else if (reward.type === 'heroCard') {
                isRewardCollected = collectedHeroCards.some(hc => hc.id === reward.id);
            } else {
                // Fragments and decorations don't block progression by default
                isRewardCollected = true;
            }

            if (!isRewardCollected) {
                isHoiComplete = false;
                break;
            }
        }
        if (isHoiComplete) {
            completedHoiIds.add(hoi.id);
        }
    }
    
    // Unlock Characters
    const newlyUnlockedChars: string[] = [];
    Object.values(AI_CHARACTERS).forEach(char => {
        if (char.unlockHoiId && completedHoiIds.has(char.unlockHoiId) && !unlockedCharacterIds.includes(char.id)) {
            newlyUnlockedChars.push(char.id);
        }
    });

    if (newlyUnlockedChars.length > 0) {
        setUnlockedCharacterIds(prev => [...new Set([...prev, ...newlyUnlockedChars])]);
        playSound('sfx-unlock');
    }

    // Unlock Customization Items
    const newlyUnlockedItems: string[] = [];
    Object.values(ALL_CUSTOMIZATION_ITEMS_MAP).forEach(item => {
        if (item.unlockCondition && item.unlockCondition.type === 'complete_hoi') {
            if (completedHoiIds.has(item.unlockCondition.hoi_id) && !unlockedCustomizationItemIds.includes(item.id)) {
                newlyUnlockedItems.push(item.id);
            }
        }
    });
    
    // Unlock Sandbox Backgrounds
    const newlyUnlockedBgs: string[] = [];
    Object.values(ALL_SANDBOX_BACKGROUNDS_MAP).forEach(bg => {
        if(bg.unlockCondition && bg.unlockCondition.type === 'complete_hoi') {
            if (completedHoiIds.has(bg.unlockCondition.hoi_id) && !unlockedBackgroundIds.includes(bg.id)) {
                newlyUnlockedBgs.push(bg.id);
            }
        }
    });


    if (newlyUnlockedItems.length > 0 || newlyUnlockedBgs.length > 0) {
        setUnlockedCustomizationItemIds(prev => [...new Set([...prev, ...newlyUnlockedItems])]);
        setUnlockedBackgroundIds(prev => [...new Set([...prev, ...newlyUnlockedBgs])]);
        playSound('sfx-unlock');
    }

  }, [collectedArtifacts, collectedHeroCards, unlockedCharacterIds, unlockedCustomizationItemIds, unlockedBackgroundIds]);

  const updateAndSaveLeaderboard = useCallback((currentPlayerName: string, newPlayerScore: number) => {
    if (!currentPlayerName) return;

    let leaderboard: LeaderboardEntry[] = [];
    const savedLeaderboard = localStorage.getItem(LEADERBOARD_LOCAL_STORAGE_KEY);
    if (savedLeaderboard) {
      try {
        leaderboard = JSON.parse(savedLeaderboard);
        if (!Array.isArray(leaderboard)) leaderboard = [];
      } catch {
        leaderboard = [];
      }
    }

    const playerIndex = leaderboard.findIndex(entry => entry.userName === currentPlayerName);

    if (playerIndex > -1) {
      if (newPlayerScore > leaderboard[playerIndex].score) {
        leaderboard[playerIndex].score = newPlayerScore;
      }
    } else {
      leaderboard.push({ userName: currentPlayerName, score: newPlayerScore });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    const trimmedLeaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_LOCAL_STORAGE_KEY, JSON.stringify(trimmedLeaderboard));
  }, []);

  const handleReward = useCallback((reward: Reward) => {
    let wasNewlyCollected = false;
    let itemForModal: Artifact | MemoryFragment | null = null;
    
    switch (reward.type) {
        case 'artifact': {
            const artifact = ALL_ARTIFACTS_MAP[reward.id];
            if (artifact && !collectedArtifacts.some(a => a.id === artifact.id)) {
                wasNewlyCollected = true;
                itemForModal = artifact;
                const newCollected = [...collectedArtifacts, artifact];
                setCollectedArtifacts(newCollected);
                updateAndSaveLeaderboard(userName, newCollected.length * POINTS_PER_ARTIFACT);
            }
            break;
        }
        case 'heroCard': {
            const heroCard = ALL_HERO_CARDS[reward.id];
            if (heroCard && !collectedHeroCards.some(hc => hc.id === heroCard.id)) {
                wasNewlyCollected = true;
                setCollectedHeroCards(prev => [...prev, heroCard]);
            }
            break;
        }
        case 'decoration': {
            const decoration = ALL_DECORATIONS_MAP[reward.id];
            if (decoration && !collectedDecorations.some(d => d.id === decoration.id)) {
                wasNewlyCollected = true;
                setCollectedDecorations(prev => [...prev, decoration]);
            }
            break;
        }
        case 'fragment': {
            const fragment = ALL_FRAGMENTS_MAP[reward.id];
            if (fragment) {
                wasNewlyCollected = true;
                itemForModal = fragment;
                setInventory(prev => ({ ...prev, [fragment.id]: (prev[fragment.id] || 0) + 1 }));
            }
            break;
        }
    }

    if (wasNewlyCollected) {
        playSound('sfx-success');
        if (reward.type === 'heroCard' || reward.type === 'decoration' || reward.type === 'artifact') {
            playSound('sfx-unlock');
        }

        if (itemForModal) {
            setRewardItemForModal(itemForModal);
            setShowSharedArtifactInfoModal(true);
        } else {
            navigateTo(Screen.MAIN_INTERFACE);
        }
    } else {
        navigateTo(Screen.MAIN_INTERFACE);
    }
  }, [collectedArtifacts, collectedHeroCards, collectedDecorations, userName, inventory, updateAndSaveLeaderboard, navigateTo]);
  
  const handleCraftItem = useCallback((artifactId: string) => {
    const artifact = ALL_ARTIFACTS_MAP[artifactId];
    if (!artifact || !artifact.craftingRequirements) return;

    // Verify requirements
    const canCraft = artifact.craftingRequirements.every(fragId => (inventory[fragId] || 0) >= 1);
    
    if (canCraft) {
      playSound('sfx-unlock');

      // Deduct fragments from inventory
      const newInventory = { ...inventory };
      artifact.craftingRequirements.forEach(fragId => {
        newInventory[fragId] -= 1;
        if (newInventory[fragId] === 0) {
          delete newInventory[fragId];
        }
      });
      setInventory(newInventory);

      // Add artifact to collection
      const newCollected = [...collectedArtifacts, artifact];
      setCollectedArtifacts(newCollected);
      updateAndSaveLeaderboard(userName, newCollected.length * POINTS_PER_ARTIFACT);

      // Show success modal
      setRewardItemForModal(artifact);
      setShowSharedArtifactInfoModal(true);
    }
  }, [inventory, collectedArtifacts, userName, updateAndSaveLeaderboard]);


  const handleLogin = useCallback((name: string) => {
    playSound('sfx-click');
    setUserName(name);
    navigateTo(Screen.MAIN_INTERFACE);
  }, [navigateTo]);

  const handleReturnToMuseum = useCallback(() => {
    playSound('sfx-click');
    setActiveQuestChainId(null);
    navigateTo(Screen.MAIN_INTERFACE);
  }, [navigateTo]);
  
  const handleShowLeaderboard = useCallback(() => {
    playSound('sfx-click');
    navigateTo(Screen.LEADERBOARD);
  }, [navigateTo]);

  const handleShowAchievements = useCallback(() => {
    playSound('sfx-click');
    navigateTo(Screen.ACHIEVEMENTS);
  }, [navigateTo]);
  
  const handleShowPremium = useCallback(() => {
    playSound('sfx-click');
    navigateTo(Screen.PREMIUM_SCREEN);
  }, [navigateTo]);

  const handleShowSandbox = useCallback(() => {
    playSound('sfx-click');
    navigateTo(Screen.SANDBOX);
  }, [navigateTo]);
  
  const handleShowCustomization = useCallback(() => {
    playSound('sfx-click');
    navigateTo(Screen.CUSTOMIZATION);
  }, [navigateTo]);

  const handleShowCrafting = useCallback(() => {
    playSound('sfx-click');
    navigateTo(Screen.CRAFTING_SCREEN);
  }, [navigateTo]);
  
  const handleAvatarChange = useCallback((item: CustomizationItem) => {
    playSound('sfx-click');
    setAvatarCustomization(prev => {
        const newAvatar = {...prev};
        if (item.type === 'outfit') {
            newAvatar.outfit = item.id;
        } else if (item.type === 'hat') {
            // Toggle hat on/off if the same one is clicked
            newAvatar.hat = prev.hat === item.id ? null : item.id;
        }
        return newAvatar;
    });
  }, []);

  const handleShowItemDetails = useCallback((item: Artifact | HeroCard | Decoration) => {
    playSound('sfx-click');
    setItemForDetailModal(item);
  }, []);

  const handleCloseItemDetails = useCallback(() => {
    setItemForDetailModal(null);
  }, []);

  const handleUpdateSandboxState = useCallback((newStateOrFn: React.SetStateAction<SandboxState>) => {
    setSandboxState(newStateOrFn);
  }, []);

  const startGame = useCallback((missionToStart: MissionData) => {
    const screenMap: Partial<Record<MissionData['type'], Screen>> = {
        puzzle: Screen.MISSION_SCREEN,
        narrative: Screen.NARRATIVE_MISSION_SCREEN,
        timeline: Screen.TIMELINE_MISSION_SCREEN,
        ar: Screen.AR_MISSION_SCREEN,
        hiddenObject: Screen.HIDDEN_OBJECT_SCREEN,
        quiz: Screen.QUIZ_MISSION_SCREEN,
        construction: Screen.CONSTRUCTION_MISSION_SCREEN,
        diplomacy: Screen.DIPLOMACY_MISSION_SCREEN,
        trading: Screen.TRADING_SCREEN,
        coloring: Screen.COLORING_MISSION_SCREEN,
        rhythm: Screen.RHYTHM_MISSION_SCREEN,
        rallyCall: Screen.RALLY_CALL_MISSION_SCREEN,
        forging: Screen.FORGING_MISSION_SCREEN,
        tacticalMap: Screen.TACTICAL_MAP_MISSION_SCREEN,
        defense: Screen.DEFENSE_MISSION_SCREEN,
        strategyMap: Screen.STRATEGY_MAP_MISSION_SCREEN,
        coinMinting: Screen.COIN_MINTING_MISSION_SCREEN,
    };
    const targetScreen = screenMap[missionToStart.type];
    if (targetScreen) {
        if (targetScreen === Screen.AR_MISSION_SCREEN) setArRewardMessage(null);
        navigateTo(targetScreen, missionToStart);
    }
  }, [navigateTo]);

  const openInstructionModal = useCallback((missionToStart: MissionData) => {
    if (seenInstructions.includes(missionToStart.type)) {
      startGame(missionToStart);
    } else {
      setInstructionModalState({
        isOpen: true,
        gameType: missionToStart.type,
        onConfirm: () => startGame(missionToStart),
      });
    }
  }, [seenInstructions, startGame]);

  const handleStartMission = useCallback((missionInfo: MissionInfo) => {
    if (!missionInfo) return;
    playSound('sfx-click');

    if (missionInfo.isPremium && !isPremium) {
      handleShowPremium();
      return;
    }
    
    if (missionInfo.questChainId) {
      setActiveQuestChainId(missionInfo.questChainId);
      navigateTo(Screen.QUEST_CHAIN_SCREEN);
      return;
    }

    const missionToStart = ALL_MISSIONS[missionInfo.missionId];
    if (missionToStart) {
      openInstructionModal(missionToStart);
    }

  }, [navigateTo, isPremium, handleShowPremium, openInstructionModal]);
  
  const handleStartQuestStep = useCallback((missionId: string) => {
    const missionData = ALL_MISSIONS[missionId];
    if (missionData) {
        openInstructionModal(missionData);
    }
  }, [openInstructionModal]);

  const handleCloseInstructionModal = useCallback((gameType: string, shouldRemember: boolean) => {
    const callback = instructionModalState.onConfirm;
    setInstructionModalState({ isOpen: false, gameType: null, onConfirm: null });

    if (shouldRemember && !seenInstructions.includes(gameType)) {
      setSeenInstructions(prev => [...prev, gameType]);
    }
    
    if (callback) {
      callback();
    }
  }, [instructionModalState.onConfirm, seenInstructions]);

  const handleUpgradeToPremium = useCallback(() => {
    playSound('sfx-unlock');
    setIsPremium(true);
    setShowPremiumWelcomeModal(true);
  }, []);

  const handleClosePremiumWelcomeModal = useCallback(() => {
    setShowPremiumWelcomeModal(false);
    navigateTo(Screen.MAIN_INTERFACE);
  }, [navigateTo]);

  const handleIncrementChatCount = useCallback(() => {
    if (!isPremium) {
      setDailyChatCount(prev => prev + 1);
    }
  }, [isPremium]);

  const handleToggleChatbot = useCallback(() => {
    playSound('sfx-click');
    setShowChatbot(prev => !prev);
  }, []);

  const closeSharedArtifactModalAndNavigate = useCallback(() => {
    setShowSharedArtifactInfoModal(false);
    setRewardItemForModal(null);
    if(currentScreen !== Screen.CRAFTING_SCREEN) {
      navigateTo(Screen.MAIN_INTERFACE);
    }
  }, [navigateTo, currentScreen]);


  const handleMissionCompletion = useCallback((reward?: Reward) => {
    const completedMissionId = activeMission?.id;
    if (activeQuestChainId && completedMissionId) {
        const chain = ALL_QUEST_CHAINS[activeQuestChainId];
        const currentStepIndex = questProgress[activeQuestChainId] || 0;
        const currentStep = chain.steps[currentStepIndex];

        if (currentStep.missionId === completedMissionId) {
            const nextStepIndex = currentStepIndex + 1;
            setQuestProgress(prev => ({ ...prev, [activeQuestChainId]: nextStepIndex }));

            if (nextStepIndex >= chain.steps.length) { // Chain complete
                if (reward) handleReward(reward);
                setActiveQuestChainId(null);
            } else {
                // More steps remain, navigate back to chain screen
                navigateTo(Screen.QUEST_CHAIN_SCREEN);
            }
        } else {
            // Should not happen, but as a fallback
            if (reward) handleReward(reward);
        }
    } else {
        // Not part of a quest chain
        if (reward) handleReward(reward);
    }
  }, [activeMission, activeQuestChainId, questProgress, handleReward, navigateTo]);
  

  const grantArtifactReward = useCallback((reward: Reward): boolean => {
      if (reward.type !== 'artifact') return false; // AR missions only grant artifacts directly for now
      const artifact = ALL_ARTIFACTS_MAP[reward.id];
      if (artifact && !collectedArtifacts.some(a => a.id === artifact.id)) {
          const newCollected = [...collectedArtifacts, artifact];
          setCollectedArtifacts(newCollected);
          updateAndSaveLeaderboard(userName, newCollected.length * POINTS_PER_ARTIFACT);
          playSound('sfx-unlock');
          return true;
      }
      return false;
  }, [collectedArtifacts, userName, updateAndSaveLeaderboard]);
  
  const handleMarkerActuallyFound = useCallback((reward: Reward) => {
    const wasNewlyCollected = grantArtifactReward(reward);
    if (wasNewlyCollected && reward.type === 'artifact') {
        const artifactToCollect = ALL_ARTIFACTS_MAP[reward.id];
        setArRewardMessage(`Đã thu thập: ${artifactToCollect.name}!`);
        setTimeout(() => setArRewardMessage(null), 3000);
    }
  }, [grantArtifactReward]);

  const handleArMissionReturnAndClaim = useCallback(() => {
    const arMission = activeMission as ARMissionData | undefined;
    if (!arMission || arMission.type !== 'ar') {
      navigateTo(Screen.MAIN_INTERFACE);
      return;
    }
    const rewardToClaim = arMission.reward;
    grantArtifactReward(rewardToClaim);

    if(rewardToClaim.type === 'artifact') {
      const artifactToCollect = ALL_ARTIFACTS_MAP[rewardToClaim.id];
      playSound('sfx-success');
      setRewardItemForModal(artifactToCollect);
      setShowSharedArtifactInfoModal(true); 
    } else {
        navigateTo(Screen.MAIN_INTERFACE);
    }
    
  }, [activeMission, navigateTo, grantArtifactReward]);

  const handleNextTutorialStep = useCallback(() => {
    if (!activeTutorial) return;
    playSound('sfx-click');
    const tutorial = TUTORIAL_DATA[activeTutorial.id];
    if (activeTutorial.stepIndex < tutorial.steps.length - 1) {
      setActiveTutorial(prev => prev ? { ...prev, stepIndex: prev.stepIndex + 1 } : null);
    } else {
      if (!tutorialsSeen.includes(activeTutorial.id)) {
        setTutorialsSeen(prev => [...prev, activeTutorial.id]);
      }
      setActiveTutorial(null);
    }
  }, [activeTutorial, tutorialsSeen]);

  const handleSkipTutorial = useCallback(() => {
    if (!activeTutorial) return;
    playSound('sfx-click');
    if (!tutorialsSeen.includes(activeTutorial.id)) {
      setTutorialsSeen(prev => [...prev, activeTutorial.id]);
    }
    setActiveTutorial(null);
  }, [activeTutorial, tutorialsSeen]);


  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LANDING_PAGE:
        return <LandingScreen onStartAdventure={handleStartAdventure} />;
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} appName={APP_NAME} />;
      case Screen.MAIN_INTERFACE:
        if (!userName) return <LoginScreen onLogin={handleLogin} appName={APP_NAME} />;
        return (
          <MainInterface
            userName={userName}
            avatarCustomization={avatarCustomization}
            hois={HOI_DATA}
            collectedArtifacts={collectedArtifacts}
            collectedHeroCards={collectedHeroCards}
            collectedDecorations={collectedDecorations}
            inventory={inventory}
            onStartMission={handleStartMission}
            onShowLeaderboard={handleShowLeaderboard}
            onToggleChatbot={handleToggleChatbot}
            theme={theme}
            onToggleTheme={toggleTheme}
            isPremium={isPremium}
            onShowPremium={handleShowPremium}
            onShowItemDetails={handleShowItemDetails}
            onShowSandbox={handleShowSandbox}
            onShowCustomization={handleShowCustomization}
            onShowCrafting={handleShowCrafting}
            onShowAchievements={handleShowAchievements}
          />
        );
      case Screen.QUEST_CHAIN_SCREEN:
        if(activeQuestChainId) {
            const chain = ALL_QUEST_CHAINS[activeQuestChainId];
            const progress = questProgress[activeQuestChainId] || 0;
            return <QuestChainScreen questChain={chain} progress={progress} onStartStep={handleStartQuestStep} onReturnToMuseum={handleReturnToMuseum} />;
        }
        break;
      case Screen.MISSION_SCREEN:
        if (activeMission?.type === 'puzzle') {
          return (
            <MissionScreen
              mission={activeMission as PuzzleMissionData}
              onReturnToMuseum={handleReturnToMuseum}
              onMissionComplete={handleMissionCompletion}
            />
          );
        }
        break;
      case Screen.NARRATIVE_MISSION_SCREEN:
        if (activeMission?.type === 'narrative') {
          return (
            <NarrativeMissionScreen
              missionData={activeMission as NarrativeMissionData}
              onReturnToMuseum={handleReturnToMuseum}
              onComplete={handleMissionCompletion}
            />
          );
        }
        break;
      case Screen.TIMELINE_MISSION_SCREEN:
        if (activeMission?.type === 'timeline') {
          return (
            <TimelineMissionScreen
              missionData={activeMission as TimelineMissionData}
              onReturnToMuseum={handleReturnToMuseum}
              onComplete={handleMissionCompletion}
            />
          );
        }
        break;
      case Screen.HIDDEN_OBJECT_SCREEN:
        if (activeMission?.type === 'hiddenObject') {
          return (
            <HiddenObjectScreen
              missionData={activeMission as HiddenObjectMissionData}
              onReturnToMuseum={handleReturnToMuseum}
              onMissionComplete={handleMissionCompletion}
            />
          );
        }
        break;
      case Screen.QUIZ_MISSION_SCREEN:
        if (activeMission?.type === 'quiz') {
          return (
            <QuizScreen
              missionData={activeMission as QuizMissionData}
              onReturnToMuseum={handleReturnToMuseum}
              onComplete={handleMissionCompletion}
            />
          );
        }
        break;
      case Screen.CONSTRUCTION_MISSION_SCREEN:
        if (activeMission?.type === 'construction') {
            return (
                <ConstructionScreen
                    missionData={activeMission as ConstructionMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onMissionComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.DIPLOMACY_MISSION_SCREEN:
        if (activeMission?.type === 'diplomacy') {
            return (
                <DiplomacyScreen
                    missionData={activeMission as DiplomacyMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.TRADING_SCREEN:
        if (activeMission?.type === 'trading') {
            return (
                <TradingScreen
                    missionData={activeMission as TradingMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.COLORING_MISSION_SCREEN:
        if (activeMission?.type === 'coloring') {
            return (
                <ColoringScreen
                    missionData={activeMission as ColoringMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onMissionComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.RHYTHM_MISSION_SCREEN:
        if (activeMission?.type === 'rhythm') {
            return (
                <RhythmScreen
                    missionData={activeMission as RhythmMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.RALLY_CALL_MISSION_SCREEN:
        if (activeMission?.type === 'rallyCall') {
            return (
                <RallyCallScreen
                    missionData={activeMission as RallyCallMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.FORGING_MISSION_SCREEN:
        if (activeMission?.type === 'forging') {
            return (
                <ForgingScreen
                    missionData={activeMission as ForgingMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.TACTICAL_MAP_MISSION_SCREEN:
        if (activeMission?.type === 'tacticalMap') {
            return (
                <TacticalMapScreen
                    missionData={activeMission as TacticalMapMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.DEFENSE_MISSION_SCREEN:
        if (activeMission?.type === 'defense') {
            return (
                <DefenseScreen
                    missionData={activeMission as DefenseMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.STRATEGY_MAP_MISSION_SCREEN:
        if (activeMission?.type === 'strategyMap') {
            return (
                <StrategyMapScreen
                    missionData={activeMission as StrategyMapMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.COIN_MINTING_MISSION_SCREEN:
        if (activeMission?.type === 'coinMinting') {
            return (
                <CoinMintingScreen
                    missionData={activeMission as CoinMintingMissionData}
                    onReturnToMuseum={handleReturnToMuseum}
                    onComplete={handleMissionCompletion}
                />
            );
        }
        break;
      case Screen.AR_MISSION_SCREEN:
         if (activeMission?.type === 'ar') {
          return (
            <ArScreenComponent
              missionData={activeMission as ARMissionData}
              onReturnAndClaimReward={handleArMissionReturnAndClaim}
              onMarkerActuallyFound={handleMarkerActuallyFound}
              arRewardMessage={arRewardMessage}
            />
          );
        }
        break;
      case Screen.LEADERBOARD:
        return (
          <LeaderboardScreen
            currentUserName={userName}
            onReturnToMuseum={handleReturnToMuseum}
          />
        );
       case Screen.ACHIEVEMENTS:
        return (
          <AchievementsScreen
            unlockedAchievementIds={unlockedAchievementIds}
            onReturnToMuseum={handleReturnToMuseum}
          />
        );
      case Screen.PREMIUM_SCREEN:
        return (
            <PremiumScreen
                onClose={handleReturnToMuseum}
                onUpgrade={handleUpgradeToPremium}
            />
        );
      case Screen.SANDBOX:
        return (
            <SandboxScreen
                collectedArtifacts={collectedArtifacts}
                collectedDecorations={collectedDecorations}
                unlockedBackgroundIds={unlockedBackgroundIds}
                sandboxState={sandboxState}
                onUpdateSandboxState={handleUpdateSandboxState}
                onReturnToMuseum={handleReturnToMuseum}
            />
        );
      case Screen.CRAFTING_SCREEN:
        return (
          <CraftingScreen
              inventory={inventory}
              collectedArtifactIds={new Set(collectedArtifacts.map(a => a.id))}
              onCraftItem={handleCraftItem}
              onReturnToMuseum={handleReturnToMuseum}
          />
        );
      case Screen.CUSTOMIZATION:
        return (
          <CustomizationScreen
            onReturnToMuseum={handleReturnToMuseum}
            currentAvatar={avatarCustomization}
            unlockedItemIds={unlockedCustomizationItemIds}
            onAvatarChange={handleAvatarChange}
          />
        );
      default:
        // Fallback to landing page if something goes wrong
        return <LandingScreen onStartAdventure={handleStartAdventure} />;
    }

    const missionScreenTypes: Screen[] = [
        Screen.MISSION_SCREEN,
        Screen.NARRATIVE_MISSION_SCREEN,
        Screen.TIMELINE_MISSION_SCREEN,
        Screen.AR_MISSION_SCREEN,
        Screen.HIDDEN_OBJECT_SCREEN,
        Screen.QUIZ_MISSION_SCREEN,
        Screen.CONSTRUCTION_MISSION_SCREEN,
        Screen.DIPLOMACY_MISSION_SCREEN,
        Screen.TRADING_SCREEN,
        Screen.COLORING_MISSION_SCREEN,
        Screen.RHYTHM_MISSION_SCREEN,
        Screen.RALLY_CALL_MISSION_SCREEN,
        Screen.FORGING_MISSION_SCREEN,
        Screen.QUEST_CHAIN_SCREEN,
        Screen.TACTICAL_MAP_MISSION_SCREEN,
        Screen.DEFENSE_MISSION_SCREEN,
        Screen.STRATEGY_MAP_MISSION_SCREEN,
        Screen.COIN_MINTING_MISSION_SCREEN,
    ];
    if (missionScreenTypes.includes(currentScreen)) {
        console.warn(`Invalid mission data for screen: ${Screen[currentScreen]}. Navigating to main interface.`);
        navigateTo(Screen.MAIN_INTERFACE, null); 
    }
    return null; 
  };
  
  const arScreenContentVisible = !(currentScreen === Screen.AR_MISSION_SCREEN && transitionClass === 'screen-fade-out');
  const tutorialForOverlay = activeTutorial ? TUTORIAL_DATA[activeTutorial.id] : null;

  return (
    <div className={`flex items-center justify-center min-h-screen bg-transparent text-stone-800 dark:text-amber-100 ${currentScreen !== Screen.LANDING_PAGE ? 'p-0 sm:p-4' : ''} ${transitionClass}`}>
      {arScreenContentVisible && renderScreen()}
      {rewardItemForModal && (
        <ArtifactInfoModal
          isOpen={showSharedArtifactInfoModal}
          item={rewardItemForModal}
          onClose={closeSharedArtifactModalAndNavigate}
        />
      )}
      {itemForDetailModal && (
        <ItemDetailModal
            isOpen={!!itemForDetailModal}
            item={itemForDetailModal}
            onClose={handleCloseItemDetails}
        />
      )}
      {instructionModalState.isOpen && instructionModalState.gameType && (
        <InstructionModal
            isOpen={instructionModalState.isOpen}
            gameType={instructionModalState.gameType}
            onClose={handleCloseInstructionModal}
        />
      )}
      {showChatbot && userName && ( 
        <Chatbot 
          isOpen={showChatbot} 
          onClose={handleToggleChatbot}
          unlockedCharacterIds={unlockedCharacterIds}
          isPremium={isPremium}
          dailyChatCount={dailyChatCount}
          onIncrementChatCount={handleIncrementChatCount}
          onUpgradePrompt={handleShowPremium}
        />
      )}
      <PremiumWelcomeModal 
        isOpen={showPremiumWelcomeModal}
        onClose={handleClosePremiumWelcomeModal}
      />
      {activeTutorial && tutorialForOverlay && (
        <TutorialOverlay
          tutorialData={tutorialForOverlay}
          stepIndex={activeTutorial.stepIndex}
          onNext={handleNextTutorialStep}
          onSkip={handleSkipTutorial}
        />
      )}
       <AchievementToast
        notification={achievementNotification}
        onDismiss={() => setAchievementNotification(null)}
      />
    </div>
  );
};

export default App;
