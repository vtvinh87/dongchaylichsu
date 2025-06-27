


export enum Screen {
  LOGIN,
  MAIN_INTERFACE,
  MISSION_SCREEN,
  NARRATIVE_MISSION_SCREEN,
  TIMELINE_MISSION_SCREEN, 
  LEADERBOARD,
  AR_MISSION_SCREEN,
  PREMIUM_SCREEN,
  SANDBOX,
  HIDDEN_OBJECT_SCREEN,
  QUIZ_MISSION_SCREEN,
  CONSTRUCTION_MISSION_SCREEN,
  DIPLOMACY_MISSION_SCREEN,
  CUSTOMIZATION,
  LANDING_PAGE,
  CRAFTING_SCREEN,
  TRADING_SCREEN, // New screen for the trading game
}

export interface Artifact {
  id: string;
  name: string;
  imageUrl: string;
  description?: string; 
  detailedDescription: string; 
  craftingRequirements?: string[]; // Array of fragment IDs
}

export interface MemoryFragment {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    belongsToArtifactId: string; // ID of the artifact this fragment is for
}

export interface Decoration {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface HeroCard {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

// Represents the data for a single clickable mission card on the main interface
export interface MissionInfo {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  missionId: string; 
  isPremium?: boolean;
  isOptionalForProgression?: boolean; 
}

// Represents a "Chapter" or "Act" that groups multiple missions
export interface Hoi {
  id: string;
  title: string;
  description: string;
  missions: MissionInfo[];
  isPremiumChapter?: boolean;
}

export interface PuzzlePieceItem {
  id: number; 
  imageUrl: string;
}

export type RewardType = 'artifact' | 'heroCard' | 'decoration' | 'fragment';
export interface Reward {
    id: string;
    type: RewardType;
}

// --- Narrative Mission Types ---
export interface NarrativeChoice {
  text: string;
  targetNodeId: string;
}

export interface NarrativeNode {
  id: string;
  title?: string;
  text: string;
  choices: NarrativeChoice[];
  grantsMissionReward?: boolean; 
  isTerminal?: boolean; 
  isSuccessOutcome?: boolean; 
}

// --- Mission Data Base and Specific Types ---
export interface PuzzleMissionData {
  type: 'puzzle';
  id: string;
  title: string;
  reward: Reward;
}

export interface NarrativeMissionData {
  type: 'narrative';
  id: string;
  title: string;
  startNodeId: string;
  nodes: Record<string, NarrativeNode>; 
  reward: Reward;
}

export interface TimelineEventItem {
  id: string; 
  text: string; 
  correctOrder: number; 
}

export interface TimelineMissionData {
  type: 'timeline';
  id: string;
  title: string;
  instructionText: string;
  events: TimelineEventItem[];
  reward: Reward;
}

export interface ARMissionData {
  type: 'ar';
  id: string;
  title: string;
  markerPatternUrl: string;
  modelUrl: string;
  reward: Reward;
}

export interface HiddenObjectItem {
  id: string;
  name: string;
  iconUrl: string;
  coords: { 
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface HiddenObjectMissionData {
  type: 'hiddenObject';
  id: string;
  title: string;
  backgroundImageUrl: string;
  objectsToFind: HiddenObjectItem[];
  reward: Reward;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizMissionData {
  type: 'quiz';
  id: string;
  title: string;
  questions: QuizQuestion[];
  reward: Reward;
}

export interface Resources {
  wood: number;
  stone: number;
}

export interface ConstructionMissionData {
    type: 'construction';
    id: string;
    title: string;
    resourceGoal: Resources;
    buildingCost: Resources;
    winCondition: number;
    reward: Reward;
}

export interface DiplomacyChoice {
    text: string;
    points: number;
}

export interface DiplomacyRound {
    npc_dialogue: string;
    player_choices: DiplomacyChoice[];
}

export interface DiplomacyMissionData {
    type: 'diplomacy';
    id: string;
    title: string;
    characterName: string;
    characterImageUrl: string;
    initialGoodwill: number;
    targetGoodwill: number;
    rounds: DiplomacyRound[];
    reward: Reward;
}

// --- Trading Game Types ---
export interface TradingGood {
  id: string;
  name: string;
  basePrice: number;
  iconUrl: string;
}

export interface TradingEvent {
  description: string;
  priceModifier: {
    goodId: string;
    multiplier: number; // e.g., 1.5 for +50%, 0.8 for -20%
  };
}

export interface TradingMissionData {
    type: 'trading';
    id: string;
    title: string;
    initialCapital: number;
    targetCapital: number;
    daysLimit: number;
    goods: TradingGood[];
    events: TradingEvent[];
    reward: Reward;
}


export type MissionData = PuzzleMissionData | NarrativeMissionData | TimelineMissionData | ARMissionData | HiddenObjectMissionData | QuizMissionData | ConstructionMissionData | DiplomacyMissionData | TradingMissionData;

// --- Leaderboard Type ---
export interface LeaderboardEntry {
  userName: string;
  score: number;
}

// --- Chatbot Type ---
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: Date;
}

export interface AiCharacter {
  id:string;
  name: string;
  systemInstruction: string;
  avatarUrl: string;
  unlockCondition?: (collectedArtifacts: Artifact[], collectedHeroCards: HeroCard[]) => boolean;
}

// --- Tutorial System Types ---
export interface TutorialStep {
    elementSelector?: string;
    title: string;
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface Tutorial {
    id: string;
    steps: TutorialStep[];
}

// --- Avatar Customization Types ---
export type CustomizationItemType = 'outfit' | 'hat';

export interface CustomizationItem {
  id: string;
  name: string;
  type: CustomizationItemType;
  imageUrl: string;
  unlockCondition?: {
    type: 'complete_hoi';
    hoi_id: string;
  };
}

export interface AvatarCustomization {
  outfit: string;
  hat: string | null;
}


// --- Game State Type ---
export interface SavedGameState {
  userName:string;
  collectedArtifactIds: string[];
  collectedHeroCardIds: string[];
  collectedDecorationIds?: string[];
  inventory: Record<string, number>; // For fragments and trading goods
  isPremium?: boolean;
  dailyChatCount?: number;
  lastChatDate?: string;
  tutorialsSeen?: string[];
  seenInstructions?: string[]; 
  avatarCustomization?: AvatarCustomization;
  unlockedCustomizationItemIds?: string[];
}
