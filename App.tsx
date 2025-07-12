

import React, { useState, useCallback, useEffect, useMemo, useLayoutEffect, useRef } from 'react';
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
import DetectiveScreen from './components/DetectiveScreen'; // Import Detective Screen
import RhythmScreen from './components/RhythmScreen'; // Import Rhythm Screen
import ColoringScreen from './components/ColoringScreen'; // Import Coloring Screen
import AchievementsScreen from './components/AchievementsScreen'; // Import Achievements Screen
import AchievementToast from './components/AchievementToast'; // Import Achievement Toast
import RallyCallScreen from './components/RallyCallScreen'; // Import Rally Call Screen
import ForgingScreen from './components/ForgingScreen'; // Import Forging Screen
import QuestChainScreen from './components/QuestChainScreen'; // Import Quest Chain Screen
import TacticalMapScreen from './components/TacticalMapScreen'; // Import Tactical Map Screen
import TacticalBattleScreen from './components/TacticalBattleScreen'; // Import Tactical Battle Screen
import DefenseScreen from './components/DefenseScreen'; // Import Defense Screen
import StrategyMapScreen from './components/StrategyMapScreen'; // Import StrategyMap Screen
import StrategicMarchScreen from './components/StrategicMarchScreen'; // Import Strategic March Screen
import CoinMintingScreen from './components/CoinMintingScreen'; // Import CoinMinting Screen
import HueConstructionScreen from './components/HueConstructionScreen'; // Import Hue Construction Screen
import NewspaperPublisherScreen from './components/NewspaperPublisherScreen'; // Import new screen
import AdventurePuzzleScreen from './components/AdventurePuzzleScreen';
import StrategicPathScreen from './components/StrategicPathScreen';
import ConstructionPuzzleScreen from './components/ConstructionPuzzleScreen';
import NavalBattleScreen from './components/NavalBattleScreen';
import LaneBattleScreen from './components/LaneBattleScreen';
import DialogueModal from './components/DialogueModal';
import AdminDashboard from './components/AdminDashboard'; // Import Admin Dashboard
import { GoogleGenAI } from "@google/genai";
import { Screen, Artifact, MissionInfo, HeroCard, MissionData, PuzzleMissionData, NarrativeMissionData, TimelineMissionData, ARMissionData, HiddenObjectMissionData, LeaderboardEntry, AiCharacter, Decoration, QuizMissionData, ConstructionMissionData, Tutorial, SavedGameState, AvatarCustomization, CustomizationItem, DiplomacyMissionData, Reward, MemoryFragment, DetectiveMissionData, ColoringMissionData, RhythmMissionData, SandboxState, SandboxBackground, Achievement, RallyCallMissionData, ForgingMissionData, QuestChain, TacticalMapMissionData, DefenseMissionData, StrategyMapMissionData, CoinMintingMissionData, HueConstructionMissionData, NewspaperPublisherMissionData, AdventurePuzzleMissionData, StrategicPathMissionData, DialogueEntry, ActiveSideQuestState, DialogueOption, NotebookUnlockEvent, ConstructionPuzzleMissionData, NavalBattleMissionData, HichPuzzleData, LaneBattleMissionData, NotebookPage, QuizQuestion, BachDangCampaignState, PlayEvent, ConfigOverrides, StrategicMarchMissionData, TacticalBattleMissionData, TaySonCampaignState } from './types';
import { 
  HOI_DATA, ALL_MISSIONS, APP_NAME, ALL_HERO_CARDS,
  LEADERBOARD_LOCAL_STORAGE_KEY,
  AI_CHARACTERS, ALL_DECORATIONS_MAP, TUTORIAL_DATA, ALL_CUSTOMIZATION_ITEMS_MAP, ALL_ARTIFACTS_MAP, ALL_FRAGMENTS_MAP, ALL_SANDBOX_BACKGROUNDS_MAP, ALL_ACHIEVEMENTS_MAP, ALL_QUEST_CHAINS, NOTEBOOK_PAGES, SPEAKER_DATA, SIDE_QUESTS, MISSION_HICH_TUONG_SI_ID
} from './constants';
import { BACKGROUND_IMAGE_URL } from './imageUrls';
import { initializeAudio, playSound, playMusic, stopMusic, toggleAudio, getIsSoundEnabled } from './utils/audio';

// --- CSS Imports ---
import './index.css';
import './components/LandingScreen.css';
import './components/MainInterface.css';
import './components/AdminDashboard.css';
import './components/ArScreenComponent.css';
import './components/SagaCard.css';
import './components/TutorialOverlay.css';
import './components/AdventurePuzzleScreen.css';
import './components/StrategicPathScreen.css';
import './components/NotebookModal.css';
import './components/DialogueModal.css';
import './components/MissionScreen.css';
import './components/TimelineMissionScreen.css';
import './components/EventDetailModal.css';
import './components/RallyCallScreen.css';
import './components/NavalBattleScreen.css';
import './components/DefenseScreen.css';
import './components/Chatbot.css';
import './components/ForgingScreen.css';
import './components/QuestChainScreen.css';
import './components/TacticalBattleScreen.css';
import './components/NewspaperPublisherScreen.css'; // Import new CSS
import './components/QuizScreen.css';
import './components/DiplomacyScreen.css';
import './components/DetectiveScreen.css';
import './components/AchievementToast.css';
import './components/CoinMintingScreen.css';
import './components/HueConstructionScreen.css';
import './components/TradingScreen.css'; // Assume this will be created
import './components/RhythmScreen.css'; // Assume this will be created
import './components/LaneBattleScreen.css'; // Assume this will be created
import './components/StrategyMapScreen.css'; // Assume this will be created
import './components/ColoringScreen.css'; // Assume this will be created
import './components/ConstructionPuzzleScreen.css'; // Assume this will be created
import './components/ConstructionScreen.css'; // Assume this will be created
import './components/HiddenObjectScreen.css'; // Assume this will be created
import './components/TacticalMapScreen.css'; // Assume this will be created
import './components/StrategicMarchScreen.css'; // Assume this will be created

const LOCAL_STORAGE_KEY = 'dongChayLichSu_gameState_v1';
const THEME_STORAGE_KEY = 'dongChayLichSu_theme_v1';
const ANALYTICS_STORAGE_KEY = 'dongChayLichSu_analytics_v1';
const CONFIG_OVERRIDE_STORAGE_KEY = 'dongChayLichSu_config_overrides_v1';
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
  const [pendingPostMissionAction, setPendingPostMissionAction] = useState<(() => void) | null>(null);

  // Freemium & Admin State
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [dailyChatCount, setDailyChatCount] = useState<number>(0);
  const [lastChatDate, setLastChatDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [effectiveMissions, setEffectiveMissions] = useState<Record<string, MissionData>>(ALL_MISSIONS);

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
  
  // Pre-fetching State
  const [prefetchedHichPuzzle, setPrefetchedHichPuzzle] = useState<Promise<HichPuzzleData> | null>(null);

  // Campaign State
  const [bachDangCampaign, setBachDangCampaign] = useState<BachDangCampaignState>({
    scoutedLocations: [],
    unlockedStage: 1,
    stakesPlacedCorrectly: 0,
  });
  const [taySonCampaign, setTaySonCampaign] = useState<TaySonCampaignState>({
    manpower: 0,
    morale: 0,
    unlockedStage: 1,
  });


  // Scroll Position Ref
  const scrollPositionRef = useRef(0);


  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) return storedTheme;
    return 'dark'; 
  });

  const notebookPagesForModal = useMemo(() => {
    const pages: NotebookPage[] = [];
    Object.entries(NOTEBOOK_PAGES).forEach(([key, value]) => {
        const index = parseInt(key, 10);
        // Check if key is a number and value is a NotebookPage object
        if (!isNaN(index) && value && typeof value === 'object' && !Array.isArray(value) && 'content' in value) {
            pages[index] = value as NotebookPage;
        }
    });
    return pages.filter(Boolean); // Filter out empty/undefined slots
  }, []);

  const scriptForModal = activeScriptKey ? NOTEBOOK_PAGES[activeScriptKey] : null;


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
        case Screen.STRATEGIC_PATH_MISSION_SCREEN:
            playMusic('bgm_truong_son');
            break;
        case Screen.LANDING_PAGE:
        case Screen.LOGIN:
            stopMusic();
            break;
        default:
            playMusic('bgm_museum'); // Default music for main interface and most mini-games
            break;
    }
  }, [currentScreen, isSoundEnabled]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    playSound('sfx_click'); 
  }, []);
  
  const handleToggleSound = useCallback(() => {
    setIsSoundEnabled(toggleAudio());
  }, []);
  
  const logPlayEvent = useCallback((outcome: 'win' | 'loss' | 'quit') => {
    if (!isAdmin && activeMission) { // Don't log admin's plays
        const event: PlayEvent = {
            missionId: activeMission.id,
            missionTitle: activeMission.title,
            userName: userName,
            timestamp: Date.now(),
            outcome: outcome
        };
        try {
            const existingAnalytics = localStorage.getItem(ANALYTICS_STORAGE_KEY);
            const analyticsData: PlayEvent[] = existingAnalytics ? JSON.parse(existingAnalytics) : [];
            analyticsData.push(event);
            localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analyticsData));
        } catch (error) {
            console.error("Failed to log analytics event:", error);
        }
    }
  }, [isAdmin, activeMission, userName]);


  const navigateTo = useCallback((screen: Screen, mission: MissionData | null = null) => {
    if (currentScreen === Screen.MAIN_INTERFACE) {
      scrollPositionRef.current = window.scrollY;
    }
    
    if (activeMission && currentScreen !== screen) {
        // If navigating away from an active mission without finishing, log as 'quit'
        if (screen === Screen.MAIN_INTERFACE || screen === Screen.ADMIN_DASHBOARD) {
            logPlayEvent('quit');
        }
    }

    const nonStandardNavScreens = [Screen.AR_MISSION_SCREEN, Screen.PREMIUM_SCREEN, Screen.SANDBOX, Screen.HIDDEN_OBJECT_SCREEN, Screen.QUIZ_MISSION_SCREEN, Screen.CONSTRUCTION_MISSION_SCREEN, Screen.DIPLOMACY_MISSION_SCREEN, Screen.CUSTOMIZATION, Screen.CRAFTING_SCREEN, Screen.DETECTIVE_SCREEN, Screen.COLORING_MISSION_SCREEN, Screen.RHYTHM_MISSION_SCREEN, Screen.ACHIEVEMENTS, Screen.RALLY_CALL_MISSION_SCREEN, Screen.FORGING_MISSION_SCREEN, Screen.QUEST_CHAIN_SCREEN, Screen.TACTICAL_MAP_MISSION_SCREEN, Screen.DEFENSE_MISSION_SCREEN, Screen.STRATEGY_MAP_MISSION_SCREEN, Screen.COIN_MINTING_MISSION_SCREEN, Screen.HUE_CONSTRUCTION_MISSION_SCREEN, Screen.NEWSPAPER_PUBLISHER_SCREEN, Screen.ADVENTURE_PUZZLE_SCREEN, Screen.STRATEGIC_PATH_MISSION_SCREEN, Screen.CONSTRUCTION_PUZZLE_SCREEN, Screen.NAVAL_BATTLE_TIMING_SCREEN, Screen.LANE_BATTLE_MISSION_SCREEN, Screen.ADMIN_DASHBOARD, Screen.STRATEGIC_MARCH_MISSION_SCREEN, Screen.TACTICAL_BATTLE_SCREEN];
    if (currentScreen !== screen || activeMission?.id !== mission?.id || nonStandardNavScreens.includes(screen)) {
      setTransitionClass('screen-fade-out');
      setTimeout(() => {
        setCurrentScreen(screen);
        setActiveMission(mission);
        setTransitionClass('screen-fade-in');
      }, ANIMATION_DURATION);
    }
  }, [currentScreen, activeMission, logPlayEvent]);

  // Restore scroll position when returning to main interface
  useLayoutEffect(() => {
    if (currentScreen === Screen.MAIN_INTERFACE) {
        window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
    }
  }, [currentScreen]);

  const collectedArtifactIds = useMemo(() => new Set(collectedArtifacts.map(a => a.id)), [collectedArtifacts]);
  const collectedHeroCardIds = useMemo(() => new Set(collectedHeroCards.map(h => h.id)), [collectedHeroCards]);
  
  const checkAchievements = useCallback(() => {
    const newlyUnlocked: Achievement[] = [];
    for (const achievement of Object.values(ALL_ACHIEVEMENTS_MAP) as Achievement[]) {
      if (!unlockedAchievementIds.includes(achievement.id)) {
        const fullGameState = {
            userName, gender, collectedArtifactIds: collectedArtifacts.map(a => a.id), collectedHeroCardIds: collectedHeroCards.map(h => h.id),
            collectedDecorationIds: collectedDecorations.map(d => d.id), inventory, questProgress, isPremium, isAdmin,
            dailyChatCount, lastChatDate, tutorialsSeen, seenInstructions, avatarCustomization,
            unlockedCustomizationItemIds, unlockedCharacterIds, unlockedBackgroundIds, sandboxState,
            unlockedAchievementIds, unlockedNotebookPages, activeSideQuest, bachDangCampaign, taySonCampaign,
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
  }, [unlockedAchievementIds, userName, gender, collectedArtifacts, collectedHeroCards, collectedDecorations, inventory, questProgress, isPremium, isAdmin, dailyChatCount, lastChatDate, tutorialsSeen, seenInstructions, avatarCustomization, unlockedCustomizationItemIds, unlockedCharacterIds, unlockedBackgroundIds, sandboxState, unlockedNotebookPages, activeSideQuest, bachDangCampaign, taySonCampaign]);
  
  useEffect(() => {
    // Check achievements whenever relevant state changes
    checkAchievements();
  }, [collectedArtifacts, unlockedCharacterIds, checkAchievements]);

  const loadConfigOverrides = useCallback(() => {
    try {
        const overridesJSON = localStorage.getItem(CONFIG_OVERRIDE_STORAGE_KEY);
        if (overridesJSON) {
            const overrides: ConfigOverrides = JSON.parse(overridesJSON);
            const newEffectiveMissions: Record<string, MissionData> = { ...ALL_MISSIONS };
            for (const missionId in overrides) {
                if (newEffectiveMissions[missionId]) {
                    newEffectiveMissions[missionId] = {
                        ...newEffectiveMissions[missionId],
                        ...overrides[missionId],
                    } as MissionData;
                }
            }
            setEffectiveMissions(newEffectiveMissions);
        } else {
            setEffectiveMissions(ALL_MISSIONS);
        }
    } catch (error) {
        console.error("Failed to load config overrides:", error);
        setEffectiveMissions(ALL_MISSIONS);
    }
  }, []);

  const loadGameState = useCallback(() => {
    const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    loadConfigOverrides(); // Load config overrides every time

    if (savedStateJSON) {
      const savedState: SavedGameState = JSON.parse(savedStateJSON);
      setUserName(savedState.userName || '');
      setGender(savedState.gender || 'male');
      setIsAdmin(savedState.isAdmin || false);
      setCollectedArtifacts((savedState.collectedArtifactIds || []).map(id => ALL_ARTIFACTS_MAP[id]).filter(Boolean));
      setCollectedHeroCards((savedState.collectedHeroCardIds || []).map(id => ALL_HERO_CARDS[id]).filter(Boolean));
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
      setBachDangCampaign(savedState.bachDangCampaign || { scoutedLocations: [], unlockedStage: 1, stakesPlacedCorrectly: 0 });
      setTaySonCampaign(savedState.taySonCampaign || { manpower: 0, morale: 0, unlockedStage: 1 });

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
  }, [loadConfigOverrides]);

  const saveGameState = useCallback(() => {
    const gameState: SavedGameState = {
      userName, gender, isPremium, isAdmin, dailyChatCount, lastChatDate,
      collectedArtifactIds: collectedArtifacts.map(a => a.id),
      collectedHeroCardIds: collectedHeroCards.map(h => h.id),
      collectedDecorationIds: collectedDecorations.map(d => d.id),
      inventory, questProgress, tutorialsSeen, seenInstructions,
      avatarCustomization, unlockedCustomizationItemIds,
      unlockedCharacterIds, unlockedBackgroundIds, sandboxState,
      unlockedAchievementIds, unlockedNotebookPages, activeSideQuest, bachDangCampaign, taySonCampaign,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [userName, gender, isPremium, isAdmin, dailyChatCount, lastChatDate, collectedArtifacts, collectedHeroCards,
      collectedDecorations, inventory, questProgress, tutorialsSeen, seenInstructions, avatarCustomization,
      unlockedCustomizationItemIds, unlockedCharacterIds, unlockedBackgroundIds, sandboxState,
      unlockedAchievementIds, unlockedNotebookPages, activeSideQuest, bachDangCampaign, taySonCampaign]);

  useEffect(() => { loadGameState(); }, [loadGameState]);
  useEffect(() => { if (currentScreen !== Screen.LANDING_PAGE) saveGameState(); }, [saveGameState, currentScreen]);

  const handleReturnToMuseum = useCallback(() => {
    playSound('sfx_click');
    navigateTo(Screen.MAIN_INTERFACE);
    setActiveQuestChainId(null);
  }, [navigateTo]);

  const handleGrantBonusSupplies = (amount: number) => {
    setInventory(prev => ({
        'vat-tu': (prev['vat-tu'] || 0) + amount
    }));
    alert(`Thử thách hoàn thành! Bạn nhận được thêm ${amount} Vật tư!`);
  };

  const handleArtifactModalClose = () => {
    setShowSharedArtifactInfoModal(false);
    setRewardItemForModal(null);
    if(pendingPostMissionAction) {
        pendingPostMissionAction();
        setPendingPostMissionAction(null);
    }
  };

  const completeMissionLogic = useCallback((reward?: Reward, data?: { [key: string]: any }) => {
    logPlayEvent('win');
    playSound('sfx_unlock');
    let newItemToShow: Artifact | MemoryFragment | Decoration | null = null;
    let newCharacterUnlocked = false;
    let newBackgroundUnlocked = false;

    // --- Campaign-specific logic ---
    if (activeQuestChainId === 'tay_son_campaign') {
      if (activeMission?.id === 'tay_son_march' && data) {
          setTaySonCampaign({ manpower: data.manpower, morale: data.morale, unlockedStage: 2 });
      }
      if (activeMission?.id === 'tay_son_oath' && data) {
          setTaySonCampaign(prev => ({ ...prev, morale: prev.morale + data.morale, unlockedStage: 3 }));
      }
      if (activeMission?.id === 'tay_son_battle') {
          setPendingPostMissionAction(() => () => {
              alert("Chiến công của bạn đã vang dội! Hoàng đế Quang Trung đã sẵn sàng 'Đối thoại' cùng bạn.");
              setUnlockedCharacterIds(prev => [...prev, 'vua-quang-trung']);
          });
      }
    }
    if (activeQuestChainId === 'bach-dang-chien') {
      if (activeMission?.id === 'find-bach-dang-ambush-spot') {
          setBachDangCampaign({
              scoutedLocations: data?.foundItemIds || [],
              unlockedStage: 2,
              stakesPlacedCorrectly: 0,
          });
      }
      if (activeMission?.id === 'bach-dang-tactical-map') {
          setBachDangCampaign(prev => ({
              ...prev,
              stakesPlacedCorrectly: data?.stakesPlacedCorrectly ?? 0,
              unlockedStage: 3,
          }));
      }
    }

    // --- Standard Reward Logic ---
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
        const newlyUnlockedChars = (Object.values(AI_CHARACTERS) as AiCharacter[]).filter(c => c.unlockHoiId === completedHoi.id && !unlockedCharacterIds.includes(c.id));
        if (newlyUnlockedChars.length > 0) {
            setUnlockedCharacterIds(prev => [...prev, ...newlyUnlockedChars.map(c => c.id)]);
            newCharacterUnlocked = true;
        }
        const newlyUnlockedBgs = (Object.values(ALL_SANDBOX_BACKGROUNDS_MAP) as SandboxBackground[]).filter(bg => bg.unlockCondition?.type === 'complete_hoi' && bg.unlockCondition.hoi_id === completedHoi.id && !unlockedBackgroundIds.includes(bg.id));
        if (newlyUnlockedBgs.length > 0) {
            setUnlockedBackgroundIds(prev => [...prev, ...newlyUnlockedBgs.map(bg => bg.id)]);
            newBackgroundUnlocked = true;
        }
        const newlyUnlockedItems = (Object.values(ALL_CUSTOMIZATION_ITEMS_MAP) as CustomizationItem[]).filter(item => item.unlockCondition?.type === 'complete_hoi' && item.unlockCondition.hoi_id === completedHoi.id && !unlockedCustomizationItemIds.includes(item.id));
        if (newlyUnlockedItems.length > 0) {
            setUnlockedCustomizationItemIds(prev => [...prev, ...newlyUnlockedItems.map(i => i.id)]);
        }
    }

    if (activeQuestChainId) {
        setQuestProgress(prev => ({ ...prev, [activeQuestChainId]: (prev[activeQuestChainId] || 0) + 1 }));
        const chain = ALL_QUEST_CHAINS[activeQuestChainId];
        const currentStepIndex = questProgress[activeQuestChainId] || 0;
        if (currentStepIndex + 1 >= chain.steps.length) {
            // Reset campaign state after completion
            if (activeQuestChainId === 'bach-dang-chien') {
              setBachDangCampaign({ scoutedLocations: [], unlockedStage: 1, stakesPlacedCorrectly: 0 });
            }
            if (activeQuestChainId === 'tay_son_campaign') {
              setTaySonCampaign({ manpower: 0, morale: 0, unlockedStage: 1 });
            }
            setActiveQuestChainId(null);
            navigateTo(Screen.MAIN_INTERFACE);
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
  }, [logPlayEvent, collectedArtifacts, collectedHeroCards, collectedDecorations, unlockedCharacterIds, unlockedBackgroundIds, unlockedCustomizationItemIds, activeMission, activeQuestChainId, questProgress, navigateTo]);
  
  
  const prefetchHichPuzzle = async (): Promise<HichPuzzleData> => {
    const missionData = ALL_MISSIONS[MISSION_HICH_TUONG_SI_ID] as RallyCallMissionData;
    if (!('fullText' in missionData)) throw new Error("Dữ liệu nhiệm vụ không phải là trò chơi điền từ");

    const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
    const puzzlePrompt = `Phân tích đoạn văn sau: "${missionData.fullText}".
Nhiệm vụ: Tạo một câu đố điền từ cho trò chơi lịch sử.
Yêu cầu:
- Chọn 10 từ hoặc cụm từ có ý nghĩa (danh từ, động từ, tính từ).
- Thay thế chúng bằng "_BLANK_" trong văn bản gốc.
- Cung cấp định nghĩa ngắn gọn, dễ hiểu cho mỗi từ/cụm từ đã chọn.
- Trả về một đối tượng JSON duy nhất, không có markdown hay giải thích.
Format JSON: { "modifiedText": string, "answers": string[], "definitions": Record<string, string> }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: puzzlePrompt,
        config: { responseMimeType: "application/json" },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const data = JSON.parse(jsonStr);
    if (!data.modifiedText || !Array.isArray(data.answers) || typeof data.definitions !== 'object') {
        throw new Error("Dữ liệu nhận về từ AI không hợp lệ.");
    }

    return data as HichPuzzleData;
  };

  const actuallyStartMission = (missionInfo: MissionInfo) => {
    if (missionInfo.isPremium && !isPremium) {
      navigateTo(Screen.PREMIUM_SCREEN);
      return;
    }
    if (missionInfo.questChainId) {
      setActiveQuestChainId(missionInfo.questChainId);
      // Reset campaign state if starting a new campaign
      if(missionInfo.questChainId === 'tay_son_campaign' && (questProgress[missionInfo.questChainId] || 0) === 0) {
        setTaySonCampaign({ manpower: 0, morale: 0, unlockedStage: 1 });
      }
      navigateTo(Screen.QUEST_CHAIN_SCREEN);
      return;
    }
    const missionData = effectiveMissions[missionInfo.missionId];
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
          'detective': Screen.DETECTIVE_SCREEN,
          'rhythm': Screen.RHYTHM_MISSION_SCREEN,
          'coloring': Screen.COLORING_MISSION_SCREEN,
          'rallyCall': Screen.RALLY_CALL_MISSION_SCREEN,
          'forging': Screen.FORGING_MISSION_SCREEN,
          'tacticalMap': Screen.TACTICAL_MAP_MISSION_SCREEN,
          'tacticalBattle': Screen.TACTICAL_BATTLE_SCREEN,
          'defense': Screen.DEFENSE_MISSION_SCREEN,
          'strategyMap': Screen.STRATEGY_MAP_MISSION_SCREEN,
          'coinMinting': Screen.COIN_MINTING_MISSION_SCREEN,
          'hueConstruction': Screen.HUE_CONSTRUCTION_MISSION_SCREEN,
          'newspaperPublisher': Screen.NEWSPAPER_PUBLISHER_SCREEN,
          'adventurePuzzle': Screen.ADVENTURE_PUZZLE_SCREEN,
          'strategicPath': Screen.STRATEGIC_PATH_MISSION_SCREEN,
          'constructionPuzzle': Screen.CONSTRUCTION_PUZZLE_SCREEN,
          'navalBattle': Screen.NAVAL_BATTLE_TIMING_SCREEN,
          'laneBattle': Screen.LANE_BATTLE_MISSION_SCREEN,
          'strategicMarch': Screen.STRATEGIC_MARCH_MISSION_SCREEN,
        };
        const targetScreen = screenMap[missionData.type] || Screen.MAIN_INTERFACE;
        navigateTo(targetScreen, missionData);
      };

      const instructionGameType = missionData.type === 'rallyCall' && 'fullText' in missionData 
        ? 'rallyCallFillBlank' 
        : missionData.type;

      if (!seenInstructions.includes(instructionGameType) && !isAdmin) { // Admins can skip instructions
        setInstructionModalState({
          isOpen: true,
          gameType: instructionGameType,
          onConfirm: startMission
        });
      } else {
        startMission();
      }
    }
  };

  const handleStartMission = (missionInfo: MissionInfo) => {
    playSound('sfx_click');
    setPendingMissionInfo(missionInfo);
    
    // Reset all prefetch states first
    setPrefetchedHichPuzzle(null);

    // Prefetching logic for Hich Tuong Si mission
    if (missionInfo.missionId === MISSION_HICH_TUONG_SI_ID) {
        setPrefetchedHichPuzzle(prefetchHichPuzzle());
    }
    
    // Logic for pre-mission dialogue
    const scriptKey = `before_mission_${missionInfo.missionId}`;
    if (NOTEBOOK_PAGES[scriptKey]) { // Re-using NOTEBOOK_PAGES as script container
        setActiveScriptKey(scriptKey);
        setIsDialogueOpen(true);
        return; // Wait for dialogue to finish
    }

    // If no dialogue, proceed to start
    actuallyStartMission(missionInfo);
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
    if (name.toLowerCase() === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    navigateTo(Screen.MAIN_INTERFACE);
    if (name.toLowerCase() !== 'admin') {
      setActiveTutorial({ id: 'main-interface-intro', stepIndex: 0 });
    }
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
    if (item.id === 'no_hat' && item.type === 'hat') {
        setAvatarCustomization(prev => ({ ...prev, hat: null }));
        return;
    }
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
        playSound('sfx_fail');
        alert("Bạn chưa thu thập đủ Mảnh Ký ức để chế tác cổ vật này.");
    }
  };

  const handleDialogueEvent = (event: DialogueEntry) => {
      if (event.type === 'notebook_unlock') {
          if (!unlockedNotebookPages.includes(event.pageIndex)) {
              onUnlockNotebookPage(event.pageIndex);
              setPageUnlockNotification(event.message);
          }
      }
  };

  const onUnlockNotebookPage = (pageIndex: number) => {
      setUnlockedNotebookPages(prev => {
          if (prev.includes(pageIndex)) return prev;
          return [...prev, pageIndex].sort((a, b) => a - b);
      });
  };

  const onCompleteSideQuestStage = (questId: string) => {
      if (!activeSideQuest || activeSideQuest.questId !== questId) return;
      const questData = SIDE_QUESTS[questId];
      const nextStageIndex = activeSideQuest.currentStage + 1;
      if (nextStageIndex >= questData.stages.length) {
          // Quest complete
          setActiveSideQuest(null);
          // Trigger end dialogue
          setActiveScriptKey(questData.endDialogueKey);
          setIsDialogueOpen(true);
          // Grant reward from dialogue event
          if (questData.reward.type === 'notebook_unlock') {
            handleDialogueEvent(questData.reward);
          } else {
            setPendingReward(questData.reward);
          }

      } else {
          setActiveSideQuest({ ...activeSideQuest, currentStage: nextStageIndex });
          alert(`Nhiệm vụ phụ cập nhật: ${questData.stages[nextStageIndex].description}`);
      }
  };


  const handleDialogueClose = () => {
    setIsDialogueOpen(false);
    setActiveScriptKey(null);
    
    if (pendingMissionInfo) {
      // Logic to run after dialogue finishes
      actuallyStartMission(pendingMissionInfo);
      setPendingMissionInfo(null);
    }
    if (pendingReward) {
        completeMissionLogic(pendingReward);
        setPendingReward(undefined);
    }
  };
  
  const handleDialogueOptionClick = (option: DialogueOption) => {
      if (option.action === 'accept_quest') {
          const questData = SIDE_QUESTS[option.questId];
          if (questData) {
              setActiveSideQuest({ questId: option.questId, currentStage: 0 });
              alert(`Nhiệm vụ phụ mới: ${questData.title}\n${questData.stages[0].description}`);
          }
      }
      handleDialogueClose();
  };

  const handleMissionFail = useCallback(() => {
    logPlayEvent('loss');
  }, [logPlayEvent]);

  const renderScreen = () => {
    const isTaySonCampaignComplete = (questProgress['tay_son_campaign'] || 0) >= (ALL_QUEST_CHAINS['tay_son_campaign']?.steps.length || 3);
    
    switch (currentScreen) {
      case Screen.LANDING_PAGE:
        return <LandingScreen onStartAdventure={handleStartAdventure} />;
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} appName={APP_NAME} />;
      case Screen.MAIN_INTERFACE:
        return (
          <>
            <MainInterface
              userName={userName}
              gender={gender}
              avatarCustomization={avatarCustomization}
              hois={HOI_DATA}
              missions={effectiveMissions}
              collectedArtifacts={collectedArtifacts}
              collectedHeroCards={collectedHeroCards}
              collectedDecorations={collectedDecorations}
              inventory={inventory}
              onStartMission={handleStartMission}
              onShowLeaderboard={() => navigateTo(Screen.LEADERBOARD)}
              onToggleChatbot={() => setShowChatbot(!showChatbot)}
              theme={theme}
              onToggleTheme={toggleTheme}
              isPremium={isPremium}
              isAdmin={isAdmin}
              onShowPremium={() => navigateTo(Screen.PREMIUM_SCREEN)}
              onShowAdminPanel={() => navigateTo(Screen.ADMIN_DASHBOARD)}
              onShowItemDetails={(item) => setItemForDetailModal(item)}
              onShowSandbox={() => navigateTo(Screen.SANDBOX)}
              onShowCustomization={() => navigateTo(Screen.CUSTOMIZATION)}
              onShowCrafting={() => navigateTo(Screen.CRAFTING_SCREEN)}
              onShowAchievements={() => navigateTo(Screen.ACHIEVEMENTS)}
              isSoundEnabled={isSoundEnabled}
              onToggleSound={handleToggleSound}
              questProgress={questProgress}
              isTaySonCampaignComplete={isTaySonCampaignComplete}
            />
            {activeTutorial && (
              <TutorialOverlay 
                tutorialData={TUTORIAL_DATA[activeTutorial.id]} 
                stepIndex={activeTutorial.stepIndex} 
                onNext={() => {
                  const tutorial = TUTORIAL_DATA[activeTutorial.id];
                  if(activeTutorial.stepIndex < tutorial.steps.length - 1){
                    setActiveTutorial(prev => prev ? {...prev, stepIndex: prev.stepIndex + 1} : null);
                  } else {
                    setTutorialsSeen(prev => [...prev, activeTutorial.id]);
                    setActiveTutorial(null);
                  }
                }}
                onSkip={() => {
                    setTutorialsSeen(prev => [...prev, activeTutorial.id]);
                    setActiveTutorial(null);
                }}
              />
            )}
            <Chatbot 
                isOpen={showChatbot} 
                onClose={() => setShowChatbot(false)} 
                unlockedCharacterIds={unlockedCharacterIds}
                isPremium={isPremium}
                dailyChatCount={dailyChatCount}
                onIncrementChatCount={() => setDailyChatCount(prev => prev + 1)}
                onUpgradePrompt={() => navigateTo(Screen.PREMIUM_SCREEN)}
            />
            <AchievementToast 
              notification={achievementNotification} 
              onDismiss={() => setAchievementNotification(null)} 
            />
          </>
        );
      case Screen.ADMIN_DASHBOARD:
        return <AdminDashboard onReturnToMuseum={handleReturnToMuseum} missions={effectiveMissions} onConfigChange={loadConfigOverrides} />;
      case Screen.MISSION_SCREEN:
        if (activeMission && activeMission.type === 'puzzle') {
          return <MissionScreen mission={activeMission as PuzzleMissionData} onReturnToMuseum={handleReturnToMuseum} onMissionComplete={completeMissionLogic} onGrantBonusSupplies={handleGrantBonusSupplies} />;
        }
        break;
      case Screen.NARRATIVE_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'narrative') {
          return <NarrativeMissionScreen missionData={activeMission as NarrativeMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail}/>;
        }
        break;
      case Screen.TIMELINE_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'timeline') {
          return <TimelineMissionScreen missionData={activeMission as TimelineMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
        }
        break;
      case Screen.LEADERBOARD:
        return <LeaderboardScreen currentUserName={userName} onReturnToMuseum={handleReturnToMuseum} />;
      case Screen.AR_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'ar'){
            return <ArScreenComponent missionData={activeMission as ARMissionData} onReturnAndClaimReward={() => completeMissionLogic(activeMission.reward)} onMarkerActuallyFound={handleMarkerFound} arRewardMessage={arRewardMessage} />;
        }
        break;
      case Screen.PREMIUM_SCREEN:
        return <PremiumScreen onClose={handleReturnToMuseum} onUpgrade={handleUpgradeToPremium} />;
      case Screen.SANDBOX:
        return <SandboxScreen collectedArtifacts={collectedArtifacts} collectedDecorations={collectedDecorations} unlockedBackgroundIds={unlockedBackgroundIds} sandboxState={sandboxState} onUpdateSandboxState={setSandboxState} onReturnToMuseum={handleReturnToMuseum} />;
      case Screen.HIDDEN_OBJECT_SCREEN:
        if (activeMission && activeMission.type === 'hiddenObject') {
            return <HiddenObjectScreen missionData={activeMission as HiddenObjectMissionData} onReturnToMuseum={handleReturnToMuseum} onMissionComplete={completeMissionLogic} />;
        }
        break;
      case Screen.QUIZ_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'quiz') {
            return <QuizScreen 
                      missionData={activeMission as QuizMissionData} 
                      onReturnToMuseum={handleReturnToMuseum} 
                      onComplete={completeMissionLogic}
                      onFail={handleMissionFail}
                    />;
        }
        break;
      case Screen.CONSTRUCTION_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'construction') {
            return <ConstructionScreen missionData={activeMission as ConstructionMissionData} onReturnToMuseum={handleReturnToMuseum} onMissionComplete={completeMissionLogic} />;
        }
        break;
      case Screen.DIPLOMACY_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'diplomacy') {
            return <DiplomacyScreen missionData={activeMission as DiplomacyMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.CUSTOMIZATION:
        return <CustomizationScreen onReturnToMuseum={handleReturnToMuseum} currentAvatar={avatarCustomization} unlockedItemIds={unlockedCustomizationItemIds} onAvatarChange={handleAvatarChange} gender={gender} />;
      case Screen.CRAFTING_SCREEN:
        return <CraftingScreen onReturnToMuseum={handleReturnToMuseum} inventory={inventory} collectedArtifactIds={collectedArtifacts.map(a => a.id)} onCraftItem={handleCraftItem} />;
      case Screen.DETECTIVE_SCREEN:
        if(activeMission && activeMission.type === 'detective') {
            return <DetectiveScreen 
                      missionData={activeMission as DetectiveMissionData} 
                      onReturnToMuseum={handleReturnToMuseum} 
                      onComplete={completeMissionLogic}
                      onFail={handleMissionFail} 
                      inventory={inventory}
                      setInventory={setInventory}
                    />;
        }
        break;
      case Screen.COLORING_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'coloring') {
            return <ColoringScreen missionData={activeMission as ColoringMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
        }
        break;
      case Screen.RHYTHM_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'rhythm') {
            return <RhythmScreen missionData={activeMission as RhythmMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.ACHIEVEMENTS:
        return <AchievementsScreen onReturnToMuseum={handleReturnToMuseum} unlockedAchievementIds={unlockedAchievementIds} />;
      case Screen.RALLY_CALL_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'rallyCall') {
            return <RallyCallScreen 
                missionData={activeMission as RallyCallMissionData} 
                onReturnToMuseum={handleReturnToMuseum} 
                onComplete={completeMissionLogic}
                onFail={handleMissionFail}
                inventory={inventory}
                setInventory={setInventory}
                prefetchedPuzzlePromise={prefetchedHichPuzzle}
            />;
        }
        break;
      case Screen.FORGING_MISSION_SCREEN:
        if(activeMission && activeMission.type === 'forging') {
            return <ForgingScreen missionData={activeMission as ForgingMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.QUEST_CHAIN_SCREEN:
        if (activeQuestChainId && ALL_QUEST_CHAINS[activeQuestChainId]) {
          const chain = ALL_QUEST_CHAINS[activeQuestChainId];
          const progress = questProgress[activeQuestChainId] || 0;
          return <QuestChainScreen questChain={chain} progress={progress} onStartStep={(missionId) => {
              const missionInfo = chain.steps.find(s => s.missionId === missionId);
              if (missionInfo) handleStartMission({
                  id: `chain_${chain.id}_${missionId}`,
                  title: missionInfo.title,
                  imageUrl: missionInfo.iconUrl,
                  description: missionInfo.description,
                  missionId: missionId
              })
          }} onReturnToMuseum={handleReturnToMuseum} />;
        }
        break;
      case Screen.TACTICAL_MAP_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'tacticalMap') {
            return <TacticalMapScreen 
                      missionData={activeMission as TacticalMapMissionData} 
                      onReturnToMuseum={handleReturnToMuseum} 
                      onComplete={completeMissionLogic} 
                      bachDangCampaign={bachDangCampaign}
                    />;
        }
        break;
      case Screen.TACTICAL_BATTLE_SCREEN:
        if (activeMission && activeMission.type === 'tacticalBattle') {
            return <TacticalBattleScreen 
                      missionData={activeMission as TacticalBattleMissionData} 
                      onReturnToMuseum={handleReturnToMuseum} 
                      onComplete={completeMissionLogic} 
                      onFail={handleMissionFail}
                      campaignState={taySonCampaign}
                    />;
        }
        break;
      case Screen.DEFENSE_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'defense') {
            return <DefenseScreen missionData={activeMission as DefenseMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.STRATEGY_MAP_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'strategyMap') {
            return <StrategyMapScreen missionData={activeMission as StrategyMapMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
       case Screen.STRATEGIC_MARCH_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'strategicMarch') {
            return <StrategicMarchScreen missionData={activeMission as StrategicMarchMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.COIN_MINTING_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'coinMinting') {
            return <CoinMintingScreen missionData={activeMission as CoinMintingMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} />;
        }
        break;
      case Screen.HUE_CONSTRUCTION_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'hueConstruction') {
            return <HueConstructionScreen 
              missionData={activeMission as HueConstructionMissionData} 
              onReturnToMuseum={handleReturnToMuseum} 
              onComplete={completeMissionLogic} 
              inventory={inventory}
              setInventory={setInventory}
            />;
        }
        break;
      case Screen.NEWSPAPER_PUBLISHER_SCREEN:
        if (activeMission && activeMission.type === 'newspaperPublisher') {
            return <NewspaperPublisherScreen missionData={activeMission as NewspaperPublisherMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.ADVENTURE_PUZZLE_SCREEN:
        if (activeMission && activeMission.type === 'adventurePuzzle') {
            return <AdventurePuzzleScreen missionData={activeMission as AdventurePuzzleMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.STRATEGIC_PATH_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'strategicPath') {
            return <StrategicPathScreen 
                missionData={activeMission as StrategicPathMissionData} 
                onReturnToMuseum={handleReturnToMuseum} 
                onComplete={completeMissionLogic} 
                unlockedNotebookPages={unlockedNotebookPages}
                onUnlockNotebookPage={onUnlockNotebookPage}
                onTriggerDialogue={(key) => { setActiveScriptKey(key); setIsDialogueOpen(true); }}
                activeSideQuest={activeSideQuest}
                onCompleteSideQuestStage={onCompleteSideQuestStage}
            />;
        }
        break;
      case Screen.CONSTRUCTION_PUZZLE_SCREEN:
        if (activeMission && activeMission.type === 'constructionPuzzle') {
            return <ConstructionPuzzleScreen missionData={activeMission as ConstructionPuzzleMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      case Screen.NAVAL_BATTLE_TIMING_SCREEN:
        if (activeMission && activeMission.type === 'navalBattle') {
            return <NavalBattleScreen 
                        missionData={activeMission as NavalBattleMissionData} 
                        onReturnToMuseum={handleReturnToMuseum} 
                        onComplete={completeMissionLogic}
                        onFail={handleMissionFail} 
                        bachDangCampaign={bachDangCampaign}
                    />;
        }
        break;
      case Screen.LANE_BATTLE_MISSION_SCREEN:
        if (activeMission && activeMission.type === 'laneBattle') {
            return <LaneBattleScreen missionData={activeMission as LaneBattleMissionData} onReturnToMuseum={handleReturnToMuseum} onComplete={completeMissionLogic} onFail={handleMissionFail} />;
        }
        break;
      default:
        // Fallback to main interface if no screen matches
        return <MainInterface
              userName={userName}
              gender={gender}
              avatarCustomization={avatarCustomization}
              hois={HOI_DATA}
              missions={effectiveMissions}
              collectedArtifacts={collectedArtifacts}
              collectedHeroCards={collectedHeroCards}
              collectedDecorations={collectedDecorations}
              inventory={inventory}
              onStartMission={handleStartMission}
              onShowLeaderboard={() => navigateTo(Screen.LEADERBOARD)}
              onToggleChatbot={() => setShowChatbot(!showChatbot)}
              theme={theme}
              onToggleTheme={toggleTheme}
              isPremium={isPremium}
              isAdmin={isAdmin}
              onShowPremium={() => navigateTo(Screen.PREMIUM_SCREEN)}
              onShowAdminPanel={() => navigateTo(Screen.ADMIN_DASHBOARD)}
              onShowItemDetails={(item) => setItemForDetailModal(item)}
              onShowSandbox={() => navigateTo(Screen.SANDBOX)}
              onShowCustomization={() => navigateTo(Screen.CUSTOMIZATION)}
              onShowCrafting={() => navigateTo(Screen.CRAFTING_SCREEN)}
              onShowAchievements={() => navigateTo(Screen.ACHIEVEMENTS)}
              isSoundEnabled={isSoundEnabled}
              onToggleSound={handleToggleSound}
              questProgress={questProgress}
              isTaySonCampaignComplete={isTaySonCampaignComplete}
            />;
    }
    // Default break handler for cases that fall through due to invalid state
    console.error(`Invalid state in renderScreen for screen ${currentScreen}. Returning to MainInterface.`);
    return <MainInterface
        userName={userName}
        gender={gender}
        avatarCustomization={avatarCustomization}
        hois={HOI_DATA}
        missions={effectiveMissions}
        collectedArtifacts={collectedArtifacts}
        collectedHeroCards={collectedHeroCards}
        collectedDecorations={collectedDecorations}
        inventory={inventory}
        onStartMission={handleStartMission}
        onShowLeaderboard={() => navigateTo(Screen.LEADERBOARD)}
        onToggleChatbot={() => setShowChatbot(!showChatbot)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isPremium={isPremium}
        isAdmin={isAdmin}
        onShowPremium={() => navigateTo(Screen.PREMIUM_SCREEN)}
        onShowAdminPanel={() => navigateTo(Screen.ADMIN_DASHBOARD)}
        onShowItemDetails={(item) => setItemForDetailModal(item)}
        onShowSandbox={() => navigateTo(Screen.SANDBOX)}
        onShowCustomization={() => navigateTo(Screen.CUSTOMIZATION)}
        onShowCrafting={() => navigateTo(Screen.CRAFTING_SCREEN)}
        onShowAchievements={() => navigateTo(Screen.ACHIEVEMENTS)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        questProgress={questProgress}
        isTaySonCampaignComplete={isTaySonCampaignComplete}
    />;
  };

  return (
    <>
      <div className={`screen-transition-container ${transitionClass}`}>
        {renderScreen()}
      </div>
      {showSharedArtifactInfoModal && rewardItemForModal && (
        <ArtifactInfoModal 
          item={rewardItemForModal} 
          isOpen={showSharedArtifactInfoModal} 
          onClose={handleArtifactModalClose} 
        />
      )}
      {showPremiumWelcomeModal && (
        <PremiumWelcomeModal
          isOpen={showPremiumWelcomeModal}
          onClose={() => setShowPremiumWelcomeModal(false)}
        />
      )}
      {itemForDetailModal && (
          <ItemDetailModal 
            item={itemForDetailModal} 
            isOpen={!!itemForDetailModal} 
            onClose={() => setItemForDetailModal(null)} 
          />
      )}
      {instructionModalState.isOpen && instructionModalState.gameType && (
        <InstructionModal
          isOpen={instructionModalState.isOpen}
          gameType={instructionModalState.gameType}
          onClose={(gameType, shouldRemember) => {
            if (shouldRemember) {
              setSeenInstructions(prev => [...prev, gameType]);
            }
            if (instructionModalState.onConfirm) {
              instructionModalState.onConfirm();
            }
            setInstructionModalState({ isOpen: false, gameType: null, onConfirm: null });
          }}
        />
      )}
      {isDialogueOpen && scriptForModal && Array.isArray(scriptForModal) && (
        <DialogueModal
          isOpen={isDialogueOpen}
          script={scriptForModal}
          speakers={SPEAKER_DATA}
          playerAvatar={avatarCustomization}
          gender={gender}
          onClose={handleDialogueClose}
          onEvent={handleDialogueEvent}
          onOptionClick={handleDialogueOptionClick}
        />
      )}
    </>
  );
};
