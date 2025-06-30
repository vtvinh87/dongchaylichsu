

import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import StrategyMapScreen from './components/StrategyMapScreen'; // Import StrategyMap Screen
import CoinMintingScreen from './components/CoinMintingScreen'; // Import CoinMinting Screen
import CityPlanningScreen from './components/CityPlanningScreen'; // Import CityPlanning Screen
import TypesettingScreen from './components/TypesettingScreen'; // Import Typesetting Screen
import AdventurePuzzleScreen from './components/AdventurePuzzleScreen';
import StrategicPathScreen from './components/StrategicPathScreen';
import DialogueModal from './components/DialogueModal';
import { Screen, Artifact, MissionInfo, HeroCard, MissionData, PuzzleMissionData, NarrativeMissionData, TimelineMissionData, ARMissionData, HiddenObjectMissionData, LeaderboardEntry, AiCharacter, Decoration, QuizMissionData, ConstructionMissionData, Tutorial, SavedGameState, AvatarCustomization, CustomizationItem, DiplomacyMissionData, Reward, MemoryFragment, TradingMissionData, ColoringMissionData, RhythmMissionData, SandboxState, Achievement, RallyCallMissionData, ForgingMissionData, QuestChain, TacticalMapMissionData, DefenseMissionData, StrategyMapMissionData, CoinMintingMissionData, CityPlanningMissionData, TypesettingMissionData, AdventurePuzzleMissionData, StrategicPathMissionData, DialogueEntry, ActiveSideQuestState, DialogueOption, NotebookUnlockEvent } from './types';
import { 
  HOI_DATA, ALL_MISSIONS, APP_NAME, ALL_HERO_CARDS,
  LEADERBOARD_LOCAL_STORAGE_KEY, POINTS_PER_ARTIFACT, MAX_LEADERBOARD_ENTRIES,
  AI_CHARACTERS, ALL_DECORATIONS_MAP, TUTORIAL_DATA, ALL_CUSTOMIZATION_ITEMS_MAP, ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP, ALL_SANDBOX_BACKGROUNDS_MAP, ALL_ACHIEVEMENTS_MAP, ALL_QUEST_CHAINS, HOI_6_SCRIPT, SPEAKER_DATA, SIDE_QUESTS
} from './constants';
import { BACKGROUND_IMAGE_URL } from './imageUrls';
import { initializeAudio, playSound, playMusic, stopMusic, toggleAudio, getIsSoundEnabled } from './utils/audio';

const LOCAL_STORAGE_KEY = 'dongChayLichSu_gameState_v1';
const THEME_STORAGE_KEY = 'dongChayLichSu_theme_v1';
const ANIMATION_DURATION = 500; // ms, should match CSS animation

type Theme = 'light' | 'dark';
type Gender = 'male' | 'female';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LANDING_PAGE); 
  const [userName, setUserName] = useState<string>('');
  const [gender, setGender] = useState<Gender>('male');
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

  // Notebook State
  const [unlockedNotebookPages, setUnlockedNotebookPages] = useState<number[]>([0, 1]);
  const [pageUnlockNotification, setPageUnlockNotification] = useState<string | null>(null);
  
  // Sound state
  const [isSoundEnabled, setIsSoundEnabled] = useState(getIsSoundEnabled());

  // Instruction Modal State
  const [instructionModalState, setInstructionModalState] = useState<{
    isOpen: boolean;
    gameType: string | null;
    onConfirm: (() => void) | null;
  }>({ isOpen: false, gameType: null, onConfirm: null });

  // Dialogue & Quest State
  const [activeScriptKey, setActiveScriptKey] = useState<string | null>(null);
  const [pendingMissionInfo, setPendingMissionInfo] = useState<MissionInfo | null>(null);
  const [pendingReward, setPendingReward] = useState<Reward | undefined>(undefined);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [activeSideQuest, setActiveSideQuest] = useState<ActiveSideQuestState | null>(null);


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
  
  // Initialize Audio System
  useEffect(() => {
    initializeAudio();
  }, []); // Runs only once on component mount

  // BGM Management
  useEffect(() => {
    if (!isSoundEnabled) {
        stopMusic();
        return;
    }
    
    switch (currentScreen) {
        case Screen.MAIN_INTERFACE:
        case Screen.LEADERBOARD:
        case Screen.CUSTOMIZATION:
        case Screen.ACHIEVEMENTS:
        case Screen.CRAFTING_SCREEN:
        case Screen.SANDBOX:
            playMusic('bgm_museum');
            break;
        case Screen.STRATEGIC_PATH_MISSION_SCREEN:
            playMusic('bgm_truong_son');
            break;
        default:
            stopMusic(); // Stop music for most other mission screens
    }
  }, [currentScreen, isSoundEnabled]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    playSound('sfx_click'); 
  }, []);
  
  const handleToggleSound = useCallback(() => {
    setIsSoundEnabled(toggleAudio());
  }, []);


  const navigateTo = useCallback((screen: Screen, mission: MissionData | null = null) => {
    const nonStandardNavScreens = [Screen.AR_MISSION_SCREEN, Screen.PREMIUM_SCREEN, Screen.SANDBOX, Screen.HIDDEN_OBJECT_SCREEN, Screen.QUIZ_MISSION_SCREEN, Screen.CONSTRUCTION_MISSION_SCREEN, Screen.DIPLOMACY_MISSION_SCREEN, Screen.CUSTOMIZATION, Screen.CRAFTING_SCREEN, Screen.TRADING_SCREEN, Screen.COLORING_MISSION_SCREEN, Screen.RHYTHM_MISSION_SCREEN, Screen.ACHIEVEMENTS, Screen.RALLY_CALL_MISSION_SCREEN, Screen.FORGING_MISSION_SCREEN, Screen.QUEST_CHAIN_SCREEN, Screen.TACTICAL_MAP_MISSION_SCREEN, Screen.DEFENSE_MISSION_SCREEN, Screen.STRATEGY_MAP_MISSION_SCREEN, Screen.COIN_MINTING_MISSION_SCREEN, Screen.CITY_PLANNING_MISSION_SCREEN, Screen.TYPESETTING_MISSION_SCREEN, Screen.ADVENTURE_PUZZLE_SCREEN, Screen.STRATEGIC_PATH_MISSION_SCREEN];
    if (currentScreen !== screen || activeMission?.id !== mission?.id || nonStandardNavScreens.includes(screen)) {
      setTransitionClass('screen-fade-out');
      setTimeout(() => {
        setCurrentScreen(screen);
        setActiveMission(mission);
        setTransitionClass('screen-fade-in');
      }, ANIMATION_DURATION);
    }
  }, [currentScreen, activeMission]);

  const collectedArtifactIds = useMemo(() => new Set(collectedArtifacts.map(a => a.id)), [collectedArtifacts]);
  const collectedHeroCardIds = useMemo(() => new Set(collectedHeroCards.map(h => h.id)), [collectedHeroCards]);
  
  const checkAchievements = useCallback(() => {
    const newlyUnlocked: Achievement[] = [];
    for (const achievement of Object.values(ALL_ACHIEVEMENTS_MAP)) {
      if (!unlockedAchievementIds.includes(achievement.id)) {
        const fullGameState = {
            userName, gender, collectedArtifactIds: Array.from(collectedArtifactIds), collectedHeroCardIds: Array.from(collectedHeroCardIds),
            collectedDecorationIds: collectedDecorations.map(d => d.id), inventory, questProgress, isPremium,
            dailyChatCount, lastChatDate, tutorialsSeen, seenInstructions, avatarCustomization,
            unlockedCustomizationItemIds, unlockedCharacterIds, unlockedBackgroundIds, sandboxState,
            unlockedAchievementIds, unlockedNotebookPages, activeSideQuest
        };
        if (achievement.condition(fullGameState as SavedGameState)) {
          newlyUnlocked.push(achievement);
        }
      }
    }
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievementIds(prev => [...prev, ...newlyUnlocked.map(a => a.id)]);
      // Show toast for the first new achievement
      setAchievementNotification(newlyUnlocked[0]);
    }
  }, [unlockedAchievementIds, userName, gender, collectedArtifactIds, collectedHeroCardIds, collectedDecorations, inventory, questProgress, isPremium, dailyChatCount, lastChatDate, tutorialsSeen, seenInstructions, avatarCustomization, unlockedCustomizationItemIds, unlockedCharacterIds, unlockedBackgroundIds, sandboxState, unlockedNotebookPages, activeSideQuest]);
  
  useEffect(() => {
    // Check achievements whenever relevant state changes
    checkAchievements();
  }, [collectedArtifacts, unlockedCharacterIds, checkAchievements]);


  const loadGameState = useCallback(() => {
    const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStateJSON) {
      const savedState: SavedGameState = JSON.parse(savedStateJSON);
      setUserName(savedState.userName || '');
      setGender(savedState.gender || 'male');
      setCollectedArtifacts(savedState.collectedArtifactIds.map(id => ALL_ARTIFACTS_MAP[id]).filter(Boolean));
      setCollectedHeroCards(savedState.collectedHeroCardIds.map(id => ALL_HERO_CARDS[id]).filter(Boolean));
      setCollectedDecorations((savedState.collectedDecorationIds || []).map(id => ALL_DECORATIONS_MAP[id]).filter(Boolean));
      setInventory(savedState.inventory || {});
      setQuestProgress(savedState.questProgress || {});
      setTutorialsSeen(savedState.tutorialsSeen || []);
      setSeenInstructions(savedState.seenInstructions || []);
      setAvatarCustomization(savedState.avatarCustomization || { outfit: 'default_outfit', hat: null });
      setUnlockedCustomizationItemIds(savedState.unlockedCustomizationItemIds || ['default_outfit']);
      setUnlockedCharacterIds(savedState.unlockedCharacterIds || []);
      setUnlockedBackgroundIds(savedState.unlockedBackgroundIds || ['lang-que']);
      setSandboxState(savedState.sandboxState || { activeBackgroundId: 'lang-que', placedItems: [], speechBubbles: [] });
      setUnlockedAchievementIds(savedState.unlockedAchievementIds || []);
      setUnlockedNotebookPages(savedState.unlockedNotebookPages || [0, 1]);
      setActiveSideQuest(savedState.activeSideQuest || null);

      const isPremiumUser = savedState.isPremium || false;
      setIsPremium(isPremiumUser);
      const today = new Date().toISOString().split('T')[0];
      if (savedState.lastChatDate === today) {
        setDailyChatCount(savedState.dailyChatCount || 0);
        setLastChatDate(savedState.lastChatDate);
      } else {
        setDailyChatCount(0);
        setLastChatDate(today);
      }
    }
  }, []);

  const saveGameState = useCallback(() => {
    const gameState: SavedGameState = {
      userName, gender, isPremium, dailyChatCount, lastChatDate,
      collectedArtifactIds: collectedArtifacts.map(a => a.id),
      collectedHeroCardIds: collectedHeroCards.map(h => h.id),
      collectedDecorationIds: collectedDecorations.map(d => d.id),
      inventory, questProgress, tutorialsSeen, seenInstructions,
      avatarCustomization, unlockedCustomizationItemIds,
      unlockedCharacterIds, unlockedBackgroundIds, sandboxState,
      unlockedAchievementIds, unlockedNotebookPages, activeSideQuest
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [userName, gender, isPremium, dailyChatCount, lastChatDate, collectedArtifacts, collectedHeroCards,
      collectedDecorations, inventory, questProgress, tutorialsSeen, seenInstructions, avatarCustomization,
      unlockedCustomizationItemIds, unlockedCharacterIds, unlockedBackgroundIds, sandboxState,
      unlockedAchievementIds, unlockedNotebookPages, activeSideQuest]);

  useEffect(() => { loadGameState(); }, [loadGameState]);
  useEffect(() => { if (currentScreen !== Screen.LANDING_PAGE) saveGameState(); }, [saveGameState, currentScreen]);

  const handleReturnToMuseum = useCallback(() => {
    playSound('sfx_click');
    navigateTo(Screen.MAIN_INTERFACE);
    setActiveQuestChainId(null);
  }, [navigateTo]);

  const handleGrantBonusSupplies = (amount: number) => {
    setInventory(prev => ({
        ...prev,
        'vat-tu': (prev['vat-tu'] || 0) + amount
    }));
    alert(`Thử thách hoàn thành! Bạn nhận được thêm ${amount} Vật tư!`);
  };

  const completeMissionLogic = useCallback((reward?: Reward) => {
    playSound('sfx_unlock');
    let newItemToShow: Artifact | MemoryFragment | Decoration | null = null;
    let newCharacterUnlocked = false;
    let newBackgroundUnlocked = false;

    if (reward) {
        switch (reward.type) {
            case 'artifact':
                if (!collectedArtifacts.some(a => a.id === reward.id)) {
                    const newArtifact = ALL_ARTIFACTS_MAP[reward.id];
                    if (newArtifact) {
                        setCollectedArtifacts(prev => [...prev, newArtifact]);
                        newItemToShow = newArtifact;
                    }
                }
                break;
            case 'heroCard':
                if (!collectedHeroCards.some(h => h.id === reward.id)) {
                    const newHeroCard = ALL_HERO_CARDS[reward.id];
                    if (newHeroCard) setCollectedHeroCards(prev => [...prev, newHeroCard]);
                }
                break;
            case 'fragment':
                const fragment = ALL_FRAGMENTS_MAP[reward.id];
                if(fragment) {
                  setInventory(prev => ({ ...prev, [reward.id]: (prev[reward.id] || 0) + 1 }));
                  newItemToShow = fragment;
                }
                break;
            case 'decoration':
                 if(!collectedDecorations.some(d => d.id === reward.id)) {
                    const newDecoration = ALL_DECORATIONS_MAP[reward.id];
                    if (newDecoration) {
                        setCollectedDecorations(prev => [...prev, newDecoration]);
                        newItemToShow = newDecoration;
                    }
                }
                break;
        }
    }

    const completedHoi = HOI_DATA.find(hoi => hoi.missions.some(m => m.missionId === activeMission?.id));
    if (completedHoi) {
        const newlyUnlockedChars = Object.values(AI_CHARACTERS).filter(c => c.unlockHoiId === completedHoi.id && !unlockedCharacterIds.includes(c.id));
        if (newlyUnlockedChars.length > 0) {
            setUnlockedCharacterIds(prev => [...prev, ...newlyUnlockedChars.map(c => c.id)]);
            newCharacterUnlocked = true;
        }
        const newlyUnlockedBgs = Object.values(ALL_SANDBOX_BACKGROUNDS_MAP).filter(bg => bg.unlockCondition?.type === 'complete_hoi' && bg.unlockCondition.hoi_id === completedHoi.id && !unlockedBackgroundIds.includes(bg.id));
        if (newlyUnlockedBgs.length > 0) {
            setUnlockedBackgroundIds(prev => [...prev, ...newlyUnlockedBgs.map(bg => bg.id)]);
            newBackgroundUnlocked = true;
        }
        const newlyUnlockedItems = Object.values(ALL_CUSTOMIZATION_ITEMS_MAP).filter(item => item.unlockCondition?.type === 'complete_hoi' && item.unlockCondition.hoi_id === completedHoi.id && !unlockedCustomizationItemIds.includes(item.id));
        if (newlyUnlockedItems.length > 0) {
            setUnlockedCustomizationItemIds(prev => [...prev, ...newlyUnlockedItems.map(i => i.id)]);
        }
    }

    if (activeQuestChainId) {
        setQuestProgress(prev => ({ ...prev, [activeQuestChainId]: (prev[activeQuestChainId] || 0) + 1 }));
        const chain = ALL_QUEST_CHAINS[activeQuestChainId];
        const currentStepIndex = questProgress[activeQuestChainId] || 0;
        if (currentStepIndex + 1 >= chain.steps.length) {
            setActiveQuestChainId(null); navigateTo(Screen.MAIN_INTERFACE);
        } else {
            navigateTo(Screen.QUEST_CHAIN_SCREEN);
        }
    } else {
        navigateTo(Screen.MAIN_INTERFACE);
    }
    
    if (newItemToShow) {
        setRewardItemForModal(newItemToShow as (Artifact | MemoryFragment));
        setShowSharedArtifactInfoModal(true);
    }
  }, [collectedArtifacts, collectedHeroCards, collectedDecorations, unlockedCharacterIds, unlockedBackgroundIds, unlockedCustomizationItemIds, activeMission, activeQuestChainId, questProgress, navigateTo]);
  
  const handleStartMission = (missionInfo: MissionInfo) => {
    playSound('sfx_click');
    setPendingMissionInfo(missionInfo);
    
    // Logic for pre-mission dialogue
    const scriptKey = `before_mission_${missionInfo.missionId}`;
    if (HOI_6_SCRIPT[scriptKey]) {
        setActiveScriptKey(scriptKey);
        setIsDialogueOpen(true);
        return; // Wait for dialogue to finish
    }

    // If no dialogue, proceed to start
    actuallyStartMission(missionInfo);
  };
  
  const actuallyStartMission = (missionInfo: MissionInfo) => {
    if (missionInfo.isPremium && !isPremium) {
      navigateTo(Screen.PREMIUM_SCREEN);
      return;
    }
    if (missionInfo.questChainId) {
      setActiveQuestChainId(missionInfo.questChainId);
      navigateTo(Screen.QUEST_CHAIN_SCREEN);
      return;
    }
    const missionData = ALL_MISSIONS[missionInfo.missionId];
    if (missionData) {
      const startMission = () => {
        const screenMap: Record<string, Screen> = {
          'puzzle': Screen.MISSION_SCREEN,
          'narrative': Screen.NARRATIVE_MISSION_SCREEN,
          'timeline': Screen.TIMELINE_MISSION_SCREEN,
          'ar': Screen.AR_MISSION_SCREEN,
          'hiddenObject': Screen.HIDDEN_OBJECT_SCREEN,
          'quiz': Screen.QUIZ_MISSION_SCREEN,
          'construction': Screen.CONSTRUCTION_MISSION_SCREEN,
          'diplomacy': Screen.DIPLOMACY_MISSION_SCREEN,
          'trading': Screen.TRADING_SCREEN,
          'rhythm': Screen.RHYTHM_MISSION_SCREEN,
          'coloring': Screen.COLORING_MISSION_SCREEN,
          'rallyCall': Screen.RALLY_CALL_MISSION_SCREEN,
          'forging': Screen.FORGING_MISSION_SCREEN,
          'tacticalMap': Screen.TACTICAL_MAP_MISSION_SCREEN,
          'defense': Screen.DEFENSE_MISSION_SCREEN,
          'strategyMap': Screen.STRATEGY_MAP_MISSION_SCREEN,
          'coinMinting': Screen.COIN_MINTING_MISSION_SCREEN,
          'cityPlanning': Screen.CITY_PLANNING_MISSION_SCREEN,
          'typesetting': Screen.TYPESETTING_MISSION_SCREEN,
          'adventurePuzzle': Screen.ADVENTURE_PUZZLE_SCREEN,
          'strategicPath': Screen.STRATEGIC_PATH_MISSION_SCREEN,
        };
        const targetScreen = screenMap[missionData.type] || Screen.MAIN_INTERFACE;
        navigateTo(targetScreen, missionData);
      };

      if (!seenInstructions.includes(missionData.type)) {
        setInstructionModalState({
          isOpen: true,
          gameType: missionData.type,
          onConfirm: startMission
        });
      } else {
        startMission();
      }
    }
  };

  const handleStartAdventure = () => {
    playSound('sfx_click');
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
        navigateTo(Screen.MAIN_INTERFACE);
    } else {
        navigateTo(Screen.LOGIN);
    }
  };

  const handleLogin = (name: string, gender: Gender) => {
    playSound('sfx_click');
    setUserName(name);
    setGender(gender);
    navigateTo(Screen.MAIN_INTERFACE);
    setActiveTutorial({ id: 'main-interface-intro', stepIndex: 0 });
  };

  const handleUpgradeToPremium = () => {
    playSound('sfx_unlock');
    setIsPremium(true);
    setShowPremiumWelcomeModal(true);
    navigateTo(Screen.MAIN_INTERFACE);
  };
  
  const handleMarkerFound = useCallback((reward: Reward) => {
    const item = reward.type === 'artifact' ? ALL_ARTIFACTS_MAP[reward.id] : null;
    if (item && !collectedArtifacts.some(a => a.id === item.id)) {
      setArRewardMessage(`Bạn đã tìm thấy: ${item.name}!`);
      setTimeout(() => setArRewardMessage(null), 3000);
    }
  }, [collectedArtifacts]);
  
  const handleAvatarChange = (item: CustomizationItem) => {
    playSound('sfx_click');
    setAvatarCustomization(prev => ({
      ...prev,
      [item.type]: item.id,
    }));
  };
  
  const handleCraftItem = (artifactId: string) => {
    const artifact = ALL_ARTIFACTS_MAP[artifactId];
    if (!artifact || !artifact.craftingRequirements) return;

    const canCraft = artifact.craftingRequirements.every(fragId => (inventory[fragId] || 0) >= 1);
    
    if (canCraft) {
        playSound('sfx_unlock');
        const newInventory = {...inventory};
        artifact.craftingRequirements.forEach(fragId => {
            newInventory[fragId] -= 1;
            if(newInventory[fragId] <= 0) delete newInventory[fragId];
        });
        setInventory(newInventory);
        
        setCollectedArtifacts(prev => [...prev, artifact]);
        
        setRewardItemForModal(artifact);
        setShowSharedArtifactInfoModal(true);
    } else {
        alert("Bạn chưa đủ nguyên liệu để chế tác!");
    }
  };
  
  const handleNextTutorialStep = () => {
    playSound('sfx_click');
    if (!activeTutorial) return;
    const tutorial = TUTORIAL_DATA[activeTutorial.id];
    if (activeTutorial.stepIndex < tutorial.steps.length - 1) {
      setActiveTutorial(prev => ({ ...prev!, stepIndex: prev!.stepIndex + 1 }));
    } else {
      setTutorialsSeen(prev => [...prev, activeTutorial.id]);
      setActiveTutorial(null);
    }
  };

  const handleSkipTutorial = () => {
    playSound('sfx_click');
    if (activeTutorial) {
        setTutorialsSeen(prev => [...prev, activeTutorial.id]);
        setActiveTutorial(null);
    }
  };
  
  const handleCloseInstructionModal = (gameType: string, shouldRemember: boolean) => {
    if (shouldRemember) {
      setSeenInstructions(prev => [...prev, gameType]);
    }
    const onConfirm = instructionModalState.onConfirm;
    setInstructionModalState({ isOpen: false, gameType: null, onConfirm: null });
    if(onConfirm) {
        onConfirm();
    }
  };

  const handleUnlockNotebookPage = (pageIndex: number) => {
    if (!unlockedNotebookPages.includes(pageIndex)) {
        playSound('sfx_page_turn');
        setUnlockedNotebookPages(prev => [...prev, pageIndex].sort((a, b) => a - b));
    }
  };

  const handleTriggerDialogue = (scriptKey: string) => {
    setActiveScriptKey(scriptKey);
    setIsDialogueOpen(true);
  };

  const handleDialogueClose = () => {
    if (pendingMissionInfo) {
      actuallyStartMission(pendingMissionInfo);
    }
    if (pendingReward) {
      completeMissionLogic(pendingReward);
    }
    setPendingMissionInfo(null);
    setPendingReward(undefined);
    setActiveScriptKey(null);
    setIsDialogueOpen(false);
  };

  const handleDialogueEvent = (event: DialogueEntry) => {
    if (event.type === 'notebook_unlock') {
      handleUnlockNotebookPage(event.pageIndex);
      setPageUnlockNotification(event.message);
      setTimeout(() => setPageUnlockNotification(null), 3000);
    }
  };
  
  const handleDialogueOptionClick = (option: DialogueOption) => {
      if (option.action === 'accept_quest') {
          setActiveSideQuest({ questId: option.questId, currentStage: 0 });
      }
      handleDialogueClose();
  };
  
  const handleCompleteSideQuestStage = (questId: string) => {
      const quest = SIDE_QUESTS[questId];
      if (!activeSideQuest || activeSideQuest.questId !== questId) return;
      
      const newStage = activeSideQuest.currentStage + 1;
      if (newStage >= quest.stages.length) {
          setActiveSideQuest(null);
          handleTriggerDialogue(quest.endDialogueKey);
          
          if (quest.reward.type !== 'notebook_unlock') {
             completeMissionLogic(quest.reward as Reward);
          }
      } else {
          setActiveSideQuest({ questId, currentStage: newStage });
      }
  };
  
  const handleIncrementChatCount = () => {
    setDailyChatCount(c => c + 1);
  };

  const renderCurrentScreen = () => {
      switch (currentScreen) {
          case Screen.LANDING_PAGE:
              return <LandingScreen onStartAdventure={handleStartAdventure} />;
          case Screen.LOGIN:
              return <LoginScreen onLogin={handleLogin} appName={APP_NAME} />;
          case Screen.MAIN_INTERFACE:
              return <MainInterface
                  userName={userName} gender={gender} avatarCustomization={avatarCustomization}
                  hois={HOI_DATA} collectedArtifacts={collectedArtifacts} collectedHeroCards={collectedHeroCards}
                  collectedDecorations={collectedDecorations} inventory={inventory} onStartMission={handleStartMission}
                  onShowLeaderboard={() => navigateTo(Screen.LEADERBOARD)} onToggleChatbot={() => setShowChatbot(!showChatbot)}
                  theme={theme} onToggleTheme={toggleTheme} isPremium={isPremium} onShowPremium={() => navigateTo(Screen.PREMIUM_SCREEN)}
                  onShowItemDetails={(item) => setItemForDetailModal(item)} onShowSandbox={() => navigateTo(Screen.SANDBOX)}
                  onShowCustomization={() => navigateTo(Screen.CUSTOMIZATION)} onShowCrafting={() => navigateTo(Screen.CRAFTING_SCREEN)}
                  onShowAchievements={() => navigateTo(Screen.ACHIEVEMENTS)} isSoundEnabled={isSoundEnabled} onToggleSound={handleToggleSound}
              />;
          case Screen.MISSION_SCREEN:
              if (activeMission?.type === 'puzzle') return <MissionScreen mission={activeMission as PuzzleMissionData} onReturnToMuseum={handleReturnToMuseum} onMissionComplete={completeMissionLogic} onGrantBonusSupplies={handleGrantBonusSupplies} />;
              return null;
          case Screen.NARRATIVE_MISSION_SCREEN:
              if (activeMission?.type === 'narrative') return <NarrativeMissionScreen missionData={activeMission as NarrativeMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.TIMELINE_MISSION_SCREEN:
              if (activeMission?.type === 'timeline') return <TimelineMissionScreen missionData={activeMission as TimelineMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.LEADERBOARD:
              return <LeaderboardScreen currentUserName={userName} onReturnToMuseum={handleReturnToMuseum} />;
          case Screen.AR_MISSION_SCREEN:
              if (activeMission?.type === 'ar') return <ArScreenComponent missionData={activeMission as ARMissionData} onReturnAndClaimReward={() => completeMissionLogic(activeMission.reward)} onMarkerActuallyFound={handleMarkerFound} arRewardMessage={arRewardMessage}/>;
              return null;
          case Screen.PREMIUM_SCREEN:
              return <PremiumScreen onClose={handleReturnToMuseum} onUpgrade={handleUpgradeToPremium} />;
          case Screen.SANDBOX:
              return <SandboxScreen collectedArtifacts={collectedArtifacts} collectedDecorations={collectedDecorations} unlockedBackgroundIds={unlockedBackgroundIds} sandboxState={sandboxState} onUpdateSandboxState={setSandboxState} onReturnToMuseum={handleReturnToMuseum}/>;
          case Screen.HIDDEN_OBJECT_SCREEN:
              if (activeMission?.type === 'hiddenObject') return <HiddenObjectScreen missionData={activeMission as HiddenObjectMissionData} onReturnToMuseum={handleReturnToMuseum} onMissionComplete={completeMissionLogic} />;
              return null;
          case Screen.QUIZ_MISSION_SCREEN:
              if (activeMission?.type === 'quiz') return <QuizScreen missionData={activeMission as QuizMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.CONSTRUCTION_MISSION_SCREEN:
              if (activeMission?.type === 'construction') return <ConstructionScreen missionData={activeMission as ConstructionMissionData} onReturnToMuseum={handleReturnToMuseum} onMissionComplete={completeMissionLogic} />;
              return null;
          case Screen.DIPLOMACY_MISSION_SCREEN:
              if (activeMission?.type === 'diplomacy') return <DiplomacyScreen missionData={activeMission as DiplomacyMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.CUSTOMIZATION:
              return <CustomizationScreen onReturnToMuseum={handleReturnToMuseum} currentAvatar={avatarCustomization} unlockedItemIds={unlockedCustomizationItemIds} onAvatarChange={handleAvatarChange} gender={gender} />;
          case Screen.CRAFTING_SCREEN:
              return <CraftingScreen inventory={inventory} collectedArtifactIds={new Set(collectedArtifacts.map(a => a.id))} onCraftItem={handleCraftItem} onReturnToMuseum={handleReturnToMuseum} />;
          case Screen.TRADING_SCREEN:
              if (activeMission?.type === 'trading') return <TradingScreen missionData={activeMission as TradingMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.RHYTHM_MISSION_SCREEN:
              if (activeMission?.type === 'rhythm') return <RhythmScreen missionData={activeMission as RhythmMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.COLORING_MISSION_SCREEN:
              if (activeMission?.type === 'coloring') return <ColoringScreen missionData={activeMission as ColoringMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.ACHIEVEMENTS:
              return <AchievementsScreen unlockedAchievementIds={unlockedAchievementIds} onReturnToMuseum={handleReturnToMuseum} />;
          case Screen.RALLY_CALL_MISSION_SCREEN:
              if (activeMission?.type === 'rallyCall') return <RallyCallScreen missionData={activeMission as RallyCallMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.FORGING_MISSION_SCREEN:
              if (activeMission?.type === 'forging') return <ForgingScreen missionData={activeMission as ForgingMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.QUEST_CHAIN_SCREEN:
              if (activeQuestChainId) {
                  const questChain = ALL_QUEST_CHAINS[activeQuestChainId];
                  if (questChain) {
                      return <QuestChainScreen questChain={questChain} progress={questProgress[activeQuestChainId] || 0} onStartStep={(missionId) => {
                          const missionInfo = HOI_DATA.flatMap(h => h.missions).find(m => m.missionId === missionId);
                          if (missionInfo) handleStartMission(missionInfo);
                      }} onReturnToMuseum={handleReturnToMuseum} />;
                  }
              }
              return null;
          case Screen.TACTICAL_MAP_MISSION_SCREEN:
              if (activeMission?.type === 'tacticalMap') return <TacticalMapScreen missionData={activeMission as TacticalMapMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.DEFENSE_MISSION_SCREEN:
              if (activeMission?.type === 'defense') return <DefenseScreen missionData={activeMission as DefenseMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.STRATEGY_MAP_MISSION_SCREEN:
              if (activeMission?.type === 'strategyMap') return <StrategyMapScreen missionData={activeMission as StrategyMapMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.COIN_MINTING_MISSION_SCREEN:
              if (activeMission?.type === 'coinMinting') return <CoinMintingScreen missionData={activeMission as CoinMintingMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.CITY_PLANNING_MISSION_SCREEN:
              if (activeMission?.type === 'cityPlanning') return <CityPlanningScreen missionData={activeMission as CityPlanningMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.TYPESETTING_MISSION_SCREEN:
              if (activeMission?.type === 'typesetting') return <TypesettingScreen missionData={activeMission as TypesettingMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.ADVENTURE_PUZZLE_SCREEN:
              if (activeMission?.type === 'adventurePuzzle') return <AdventurePuzzleScreen missionData={activeMission as AdventurePuzzleMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
              return null;
          case Screen.STRATEGIC_PATH_MISSION_SCREEN:
              if (activeMission?.type === 'strategicPath') return <StrategicPathScreen missionData={activeMission as StrategicPathMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} unlockedNotebookPages={unlockedNotebookPages} onUnlockNotebookPage={handleUnlockNotebookPage} onTriggerDialogue={handleTriggerDialogue} activeSideQuest={activeSideQuest} onCompleteSideQuestStage={handleCompleteSideQuestStage} />;
              return null;
          default:
              return <p>Lỗi: Không tìm thấy màn hình!</p>;
      }
  };

  return (
    <div className={`app-container ${theme} font-sans`}>
      <div className={`screen-transition-container ${transitionClass}`}>
        {renderCurrentScreen()}
      </div>
      
      {/* Modals and Overlays */}
      <ArtifactInfoModal 
        isOpen={showSharedArtifactInfoModal}
        item={rewardItemForModal as (Artifact | MemoryFragment)}
        onClose={() => setShowSharedArtifactInfoModal(false)}
      />
      <ItemDetailModal 
        item={itemForDetailModal as (Artifact | HeroCard | Decoration)}
        isOpen={itemForDetailModal !== null}
        onClose={() => setItemForDetailModal(null)}
      />
      <Chatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        unlockedCharacterIds={unlockedCharacterIds}
        isPremium={isPremium}
        dailyChatCount={dailyChatCount}
        onIncrementChatCount={handleIncrementChatCount}
        onUpgradePrompt={() => navigateTo(Screen.PREMIUM_SCREEN)}
      />
      <PremiumWelcomeModal
        isOpen={showPremiumWelcomeModal}
        onClose={() => setShowPremiumWelcomeModal(false)}
      />
      {activeTutorial && (
        <TutorialOverlay
          tutorialData={TUTORIAL_DATA[activeTutorial.id]}
          stepIndex={activeTutorial.stepIndex}
          onNext={handleNextTutorialStep}
          onSkip={handleSkipTutorial}
        />
      )}
      <InstructionModal
          isOpen={instructionModalState.isOpen}
          gameType={instructionModalState.gameType || ''}
          onClose={handleCloseInstructionModal}
      />
       <AchievementToast
          notification={achievementNotification}
          onDismiss={() => setAchievementNotification(null)}
       />
       {pageUnlockNotification && (
          <div id="page-unlock-notification" className="animate-fadeInOut">{pageUnlockNotification}</div>
       )}
       <DialogueModal
        isOpen={isDialogueOpen}
        script={activeScriptKey ? HOI_6_SCRIPT[activeScriptKey] : []}
        speakers={SPEAKER_DATA}
        playerAvatar={avatarCustomization}
        gender={gender}
        onClose={handleDialogueClose}
        onEvent={handleDialogueEvent}
        onOptionClick={handleDialogueOptionClick}
      />
    </div>
  );
};
