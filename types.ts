

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
  TRADING_SCREEN,
  RHYTHM_MISSION_SCREEN,
  COLORING_MISSION_SCREEN,
  ACHIEVEMENTS,
  RALLY_CALL_MISSION_SCREEN,
  FORGING_MISSION_SCREEN,
  QUEST_CHAIN_SCREEN, // New screen for quest chains
  TACTICAL_MAP_MISSION_SCREEN, // New screen for the stake-placing game
  DEFENSE_MISSION_SCREEN, // New screen for the defense game
  STRATEGY_MAP_MISSION_SCREEN, // New screen for the strategy map game
  COIN_MINTING_MISSION_SCREEN, // New screen for the coin minting game
  CITY_PLANNING_MISSION_SCREEN, // New screen for the city planning game
  TYPESETTING_MISSION_SCREEN, // New screen for the typesetting game
  ADVENTURE_PUZZLE_SCREEN,
  STRATEGIC_PATH_MISSION_SCREEN,
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
  questChainId?: string; // ID for quest chains
  isPremium?: boolean;
  isOptionalForProgression?: boolean; 
  dependsOnMissionId?: string; // New field for sequential unlocking
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
  reward?: Reward; // Final step of a quest might not have an inline reward
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
  reward?: Reward;
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

// --- Rhythm Game Types ---
export interface RhythmNote {
  time: number; // in milliseconds from song start
  lane: number; // e.g., 1, 2, 3
}

export interface RhythmMissionData {
  type: 'rhythm';
  id: string;
  title: string;
  songUrl: string;
  noteMap: RhythmNote[];
  targetScore: number;
  reward: Reward;
}

// --- Coloring Game Types ---
export interface ColoringMissionData {
  type: 'coloring';
  id: string;
  title: string;
  lineArtSVG: string;
  colorPalette: string[];
  solution: Record<string, string>; // Maps path ID to correct color hex
  reward: Reward;
}

// --- Rally Call Game Types ---
export interface RallyCallRound {
    prefix: string;
    options: string[];
}

export interface RallyCallMissionData {
    type: 'rallyCall';
    id: string;
    title: string;
    rounds: RallyCallRound[];
    reward: Reward;
}

// --- Forging Game Types ---
export interface ForgingMissionData {
    type: 'forging';
    id: string;
    title: string;
    targetProgress: number;
    reward: Reward;
}

// --- Tactical Map Game Types ---
export interface TacticalMapMissionData {
    type: 'tacticalMap';
    id: string;
    title: string;
    backgroundUrl: string;
    stakeImageUrl: string;
    targetStakes: number;
    reward?: Reward;
}

// --- Defense Game Types ---
export type MapCellType = 'village' | 'forest' | 'road' | 'empty';

export interface DefenseMissionData {
    type: 'defense';
    id:string;
    title: string;
    mapLayout: MapCellType[][];
    initialItems: {
        type: 'person' | 'food';
        gridIndex: number; 
    }[];
    timeLimit: number; // in seconds
    reward: Reward;
}

// --- Strategy Map Game Types ---
export interface DangerZone {
    x: number; // percent
    y: number; // percent
    radius: number; // percent of canvas width
}

export interface StrategyMapMissionData {
    type: 'strategyMap';
    id: string;
    title: string;
    mapImageUrl: string;
    startPoint: { x: number; y: number }; // percent
    endPoint: { x: number; y: number }; // percent
    dangerZones: DangerZone[];
    reward: Reward;
}

// --- Coin Minting Game Types ---
export interface CoinMintingOption {
    id: string;
    name: string;
    imageUrl: string;
}

export interface CoinMintingTask {
    id: string;
    name: string;
    coinImageUrl: string;
    requiredMetalId: string;
    requiredMoldId: string;
}

export interface CoinMintingMissionData {
    type: 'coinMinting';
    id: string;
    title: string;
    tasks: CoinMintingTask[];
    metalOptions: CoinMintingOption[];
    moldOptions: CoinMintingOption[];
    reward: Reward;
}

// --- City Planning Game Types ---
export interface BuildingPlacement {
    id: string; // e.g., 'ngo-mon'
    name: string;
    iconUrl: string;
    // Position of the top-left corner of the drop zone, in percentage
    correctPosition: {
        x: number;
        y: number;
    };
}

export interface CityPlanningMissionData {
    type: 'cityPlanning';
    id: string;
    title: string;
    mapImageUrl: string;
    buildings: BuildingPlacement[];
    reward: Reward;
}

// --- Typesetting Game Types ---
export interface TypesettingMissionData {
  type: 'typesetting';
  id: string;
  title: string;
  targetText: string;
  availableLetters: string[]; // An array of single characters
  reward: Reward;
}

// --- Adventure Puzzle Game Types ---
export interface AdventurePuzzleRiddle {
  riddleText: string;
  correctAnswer: string;
  hint?: string;
}

export interface AdventurePuzzleMissionData {
  type: 'adventurePuzzle';
  id: string;
  title: string;
  riddles: AdventurePuzzleRiddle[];
  reward: Reward;
}

// --- Strategic Path Mission Types ---
export interface StrategicPathMissionData {
  type: 'strategicPath';
  id: string;
  title: string;
  mapLayout: number[][]; // 0: jungle, 1: mountain, 2: river
  start: { x: number; y: number };
  end: { x: number; y: number };
  reward: Reward;
}


export type MissionData = PuzzleMissionData | NarrativeMissionData | TimelineMissionData | ARMissionData | HiddenObjectMissionData | QuizMissionData | ConstructionMissionData | DiplomacyMissionData | TradingMissionData | RhythmMissionData | ColoringMissionData | RallyCallMissionData | ForgingMissionData | TacticalMapMissionData | DefenseMissionData | StrategyMapMissionData | CoinMintingMissionData | CityPlanningMissionData | TypesettingMissionData | AdventurePuzzleMissionData | StrategicPathMissionData;

// --- Quest Chain Types ---
export interface QuestChainStep {
  id: string;
  title: string;
  description: string;
  missionId: string;
  iconUrl: string;
}

export interface QuestChain {
  id: string;
  title: string;
  description: string;
  steps: QuestChainStep[];
}


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
  unlockHoiId: string | null; // null means unlocked by default
  unlockMessage: string;
}

// --- Gemini Chat History Types ---
export interface Part {
  text: string;
}

export interface Content {
  role: 'user' | 'model';
  parts: Part[];
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

// --- Sandbox 2.0 Types ---
export type SandboxItem = (Artifact | Decoration) & { type: 'artifact' | 'decoration' };

export type PlacedItem = SandboxItem & {
  instanceId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
};

export interface SpeechBubble {
    id: string;
    text: string;
    x: number;
    y: number;
    zIndex: number;
    attachedToInstanceId: string;
}

export interface SandboxBackground {
    id: string;
    name: string;
    imageUrl: string;
    unlockCondition: {
        type: 'complete_hoi';
        hoi_id: string;
    } | null;
}

export interface SandboxState {
    activeBackgroundId: string;
    placedItems: PlacedItem[];
    speechBubbles: SpeechBubble[];
}

// --- Achievement Types ---
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  condition: (gameState: SavedGameState) => boolean;
}


// --- Game State Type ---
export interface SavedGameState {
  userName:string;
  collectedArtifactIds: string[];
  collectedHeroCardIds: string[];
  collectedDecorationIds?: string[];
  inventory: Record<string, number>; // For fragments and trading goods
  questProgress?: Record<string, number>; // For quest chains, e.g. { 'bach-dang-chien': 1 }
  isPremium?: boolean;
  dailyChatCount?: number;
  lastChatDate?: string;
  tutorialsSeen?: string[];
  seenInstructions?: string[]; 
  avatarCustomization?: AvatarCustomization;
  unlockedCustomizationItemIds?: string[];
  unlockedCharacterIds?: string[];
  unlockedBackgroundIds?: string[];
  sandboxState?: SandboxState;
  unlockedAchievementIds?: string[]; // New property for achievements
}