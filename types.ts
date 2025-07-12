// types.ts

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
  DETECTIVE_SCREEN,
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
  HUE_CONSTRUCTION_MISSION_SCREEN, // New screen for the Hue city construction game
  NEWSPAPER_PUBLISHER_SCREEN, // New screen for the new newspaper game
  ADVENTURE_PUZZLE_SCREEN,
  STRATEGIC_PATH_MISSION_SCREEN,
  CONSTRUCTION_PUZZLE_SCREEN, // New screen for the block puzzle game
  NAVAL_BATTLE_TIMING_SCREEN, // New screen for the naval battle timing game
  LANE_BATTLE_MISSION_SCREEN, // New screen for the lane battle game
  ADMIN_DASHBOARD, // New screen for the admin panel
  STRATEGIC_MARCH_MISSION_SCREEN, // New screen for the march game
  TACTICAL_BATTLE_SCREEN, // New screen for the final battle of Tay Son campaign
  TYPESETTING_SCREEN,
}

export interface Point {
  x: number;
  y: number;
}

// --- Base Item & Mission Types ---

export interface UnlockCondition {
  type: 'complete_hoi';
  hoi_id: string;
}

export type Reward =
  | { type: 'artifact'; id: string }
  | { type: 'heroCard'; id: string }
  | { type: 'fragment'; id: string }
  | { type: 'decoration'; id: string };

export interface BaseMissionData {
  id: string;
  title: string;
  reward?: Reward;
}

// --- Collectible Items ---

export interface Artifact {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  detailedDescription: string;
  craftingRequirements?: string[]; // IDs of memory fragments
}

export interface MemoryFragment {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  belongsToArtifactId: string;
}

export interface HeroCard {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface Decoration {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

// --- Mission Info & Sagas ---

export interface MissionInfo {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  missionId: string; // The key in ALL_MISSIONS
  isPremium?: boolean;
  dependsOnMissionId?: string;
  isOptionalForProgression?: boolean;
  questChainId?: string;
}

export interface Hoi {
  id: string;
  title: string;
  description: string;
  missions: MissionInfo[];
  isPremiumChapter?: boolean;
}

// --- Specific Mission Data Types ---

export interface PuzzlePieceItem {
  id: number;
  imageUrl: string;
  funFact?: string;
}

export interface PuzzleMissionData extends BaseMissionData {
  type: 'puzzle';
  puzzleImage: string;
  pieces: PuzzlePieceItem[];
  timeLimit?: number;
}

export interface NarrativeChoice {
    text: string;
    targetNodeId: string;
}

export interface NarrativeNode {
    id: string;
    title?: string;
    text: string;
    choices: NarrativeChoice[];
    isTerminal?: boolean;
    isSuccessOutcome?: boolean;
    grantsMissionReward?: boolean;
}

export interface NarrativeMissionData extends BaseMissionData {
    type: 'narrative';
    startNodeId: string;
    nodes: Record<string, NarrativeNode>;
}

export interface TimelineEventItem {
  id: string;
  text: string;
  details: string;
  imageUrl: string;
  correctOrder: number;
}

export interface TimelineMissionData extends BaseMissionData {
  type: 'timeline';
  instructionText: string;
  events: TimelineEventItem[];
  timeLimit?: number;
}

export interface ARMissionData extends BaseMissionData {
  type: 'ar';
  markerPatternUrl: string;
  modelUrl: string;
}

export interface HiddenObjectItem {
  id: string;
  name: string;
  iconUrl: string;
  details: string;
  coords: { x: number; y: number; width: number; height: number; };
}

export interface HiddenObjectMissionData extends BaseMissionData {
  type: 'hiddenObject';
  backgroundImageUrl: string;
  objectsToFind: HiddenObjectItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizMissionData extends BaseMissionData {
  type: 'quiz';
  questions: QuizQuestion[];
}

export interface Resources {
  wood: number;
  stone: number;
}

export interface ConstructionMissionData extends BaseMissionData {
  type: 'construction';
  resourceGoal: Resources;
  buildingCost: Resources;
  winCondition: number;
}

export interface DiplomacyChoice {
  text: string;
  points: number;
}

export interface DiplomacyRound {
  npc_dialogue: string;
  player_choices: DiplomacyChoice[];
}

export interface DiplomacyMissionData extends BaseMissionData {
  type: 'diplomacy';
  characterName: string;
  characterImageUrl: string;
  initialGoodwill: number;
  targetGoodwill: number;
  rounds: DiplomacyRound[];
}

// --- New Trading Mission Types ---
export interface TradingGood {
  id: string;
  name: string;
  iconUrl: string;
  basePrice: number;
}

export interface TradingEvent {
  description: string;
  priceModifier: {
    goodId: string;
    multiplier: number;
  };
}

export interface TradingMissionData extends BaseMissionData {
  type: 'trading';
  initialCapital: number;
  targetCapital: number;
  daysLimit: number;
  goods: TradingGood[];
  events: TradingEvent[];
}

// --- New Detective Mission Types ---
export interface ProfessionInfo {
    title: string;
    description: string;
}

export interface DetectiveClue {
  id: string;
  text: string;
  isTrue: boolean;
  iconUrl: string;
  revealedByContradiction?: boolean;
}

export interface DetectiveNPC {
  id: string;
  name: string;
  avatarUrl: string;
  dialogueAvatarUrl?: string;
  position: { top: string; left: string; };
  initialDialogue: string;
  clue: DetectiveClue;
  turnCost?: number;
  professionInfo?: ProfessionInfo;
}

export interface DetectiveSuspect {
  id: string;
  name: string;
  portraitUrl: string;
}

export interface DetectiveMissionData extends BaseMissionData {
  type: 'detective';
  backgroundUrl: string;
  turnLimit: number;
  npcs: DetectiveNPC[];
  suspects: DetectiveSuspect[];
  solution: {
    culpritId: string;
    evidenceIds: string[];
  };
  contradictions: Record<string, string[]>; // { clueId1: [clueId2, newClueId] }
  deductionClues: Record<string, DetectiveClue>; // Stores the new clues revealed by contradiction
}

export interface ColoringMissionData extends BaseMissionData {
  type: 'coloring';
  lineArtSVG: string;
  colorPalette: string[];
  solution: Record<string, string>;
}

export interface RhythmNote {
  time: number;
  lane: number;
}

export interface RhythmMissionData extends BaseMissionData {
  type: 'rhythm';
  songUrl: string;
  noteMap: RhythmNote[];
  targetScore: number;
}

export interface RallyCallChoice {
  id: string;
  text: string;
  iconUrl: string;
  moralePoints: number;
  historicalNote?: string;
}

export interface RallyCallRound {
  prompt: string;
  choices: RallyCallChoice[];
}

export type RallyCallMissionData = (
  | {
      type: 'rallyCall';
      rounds: RallyCallRound[];
      fullText?: undefined;
    }
  | {
      type: 'rallyCall';
      fullText: string;
      rounds?: undefined;
    }
) & BaseMissionData;

export interface ForgingMissionData extends BaseMissionData {
  type: 'forging';
  targetProgress: number;
}

export interface TacticalMapDropZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TacticalMapMissionData extends BaseMissionData {
  type: 'tacticalMap';
  backgroundUrl: string;
  stakeImageUrl: string;
  dropZones: TacticalMapDropZone[];
}

export type MapCellType = 'road' | 'forest' | 'village' | 'empty';
export type ExtendedMapCellType = MapCellType | 'mountain' | 'river' | 'crater' | 'broken-bridge' | 'resource-wood' | 'sensor' | 'sensor-disabled' | 'open-path' | 'timed-bomb' | 'rockslide' | 'supply-cache' | 'sebanghieng-river' | 'lao-village' | 'pontoon-bridge' | 'friendly-camp' | 'herb';


export type EvacuationUnitType = 'civilian' | 'supplies' | 'wounded';

export interface EvacuationUnit {
  id: string;
  type: EvacuationUnitType;
  gridIndex: number;
  evacuationCost: number;
}

export interface DefenseMissionData extends BaseMissionData {
  type: 'defense';
  mapLayout: MapCellType[][];
  units: EvacuationUnit[];
  turnLimit: number;
  enemyProgressBarSegments: number;
}

export interface DangerZone {
  x: number;
  y: number;
  radius: number;
}

export interface StrategyMapMissionData extends BaseMissionData {
  type: 'strategyMap';
  mapImageUrl: string;
  startPoint: Point;
  endPoint: Point;
  dangerZones: DangerZone[];
}

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

export interface CoinMintingMissionData extends BaseMissionData {
  type: 'coinMinting';
  tasks: CoinMintingTask[];
  metalOptions: CoinMintingOption[];
  moldOptions: CoinMintingOption[];
}

export interface HueBuilding {
  id: string;
  name: string;
  cost: number;
  phase: number;
  iconUrl: string;
  width: number; // in grid cells
  height: number; // in grid cells
}

export interface HueDropZone {
    id: string; // matches building id
    x: number;
    y: number;
    width: number;
    height: number;
    phase: number;
    phongThuyBonus?: number;
    thanDaoBonus?: number;
}

export interface HueConstructionMissionData extends BaseMissionData {
  type: 'hueConstruction';
  mapImageUrl: string;
  buildings: HueBuilding[];
  dropZones: HueDropZone[];
  initialVatTu: number;
  phaseGoals: { phase: number; uyNghiRequired: number }[];
  advisorTips: Record<number, { title: string; text: string }>;
}

export interface ArticleChoice {
    headline: string;
    description: string;
    effects: {
        uyTin: number;
        nganSach: number;
        nguyCo: number;
    };
    isSpecial?: boolean;
    requiredUpgrade?: string; // ID of upgrade
}

export interface UpgradeDefinition {
    id: string;
    name: string;
    description: string;
    cost: number;
}

export interface SpecialEventChoice {
    text: string;
    effects: {
        uyTin?: number;
        nganSach?: number;
        nguyCo?: number;
    };
    historicalNote?: string;
}

export interface SpecialEventStage {
    prompt: string;
    choices: SpecialEventChoice[];
    isTerminal?: boolean;
}

export interface SpecialEvent {
    id: string;
    triggerAfterWeek: number;
    title: string;
    stages: SpecialEventStage[];
}

export interface NewspaperPublisherMissionData extends BaseMissionData {
    type: 'newspaperPublisher';
    durationInWeeks: number;
    initialStats: {
        uyTin: number;
        nganSach: number;
        nguyCo: number;
    };
    maxStats: {
        uyTin: number;
        nganSach: number;
        nguyCo: number;
    };
    typesettingTimeLimit: number;
    weeklyArticleChoices: ArticleChoice[][]; // Array of weeks, each week is an array of choices
    upgrades: UpgradeDefinition[];
    specialArticleChoices: ArticleChoice[];
    specialEvents: SpecialEvent[];
}

export interface AdventurePuzzleRiddle {
  riddleText: string;
  correctAnswer: string;
  hint?: string;
}

export interface AdventurePuzzleMissionData extends BaseMissionData {
  type: 'adventurePuzzle';
  riddles: AdventurePuzzleRiddle[];
}

export interface StrategicPathMissionData extends BaseMissionData {
  type: 'strategicPath';
  start: Point;
  end: Point;
  initialSupplies: number;
  mapLayout: number[][];
  unstableMountains?: Point[];
  convoyPath?: Point[];
}

export interface ConstructionPuzzlePiece {
  id: string;
  name: string;
  shape: number[][];
  imageUrl: string;
}

export interface ConstructionPuzzleMissionData extends BaseMissionData {
  type: 'constructionPuzzle';
  gridSize: { rows: number; cols: number };
  pieces: ConstructionPuzzlePiece[];
  solution: Record<string, { x: number; y: number; rotationIndex: number; }>;
}

export interface NavalBattleMissionData extends BaseMissionData {
  type: 'navalBattle';
  backgroundUrl: string;
  enemyShipIconUrl: string;
  trapZone: { start: number; end: number };
  shipSpeed: number;
  tideDuration: number;
}

export interface LaneBattleMissionData extends BaseMissionData {
  type: 'laneBattle';
  duration: number;
  defensePoints: number;
}

export interface TypesettingMissionData extends BaseMissionData {
    type: 'typesetting';
    targetText: string;
    availableLetters: string[];
}

// --- New Strategic March Types ---
export interface StrategicMarchEventChoice {
  text: string;
  effects: {
    time: number;
    morale: number;
    manpower: number;
  };
  historicalNote?: string;
}

export interface StrategicMarchEvent {
  id: string;
  triggerAtStep: number;
  prompt: string;
  choices: StrategicMarchEventChoice[];
  imageUrl?: string;
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  position: Point;
  iconUrl: string;
}

export interface StrategicMarchMissionData extends BaseMissionData {
  type: 'strategicMarch';
  mapImageUrl: string;
  armyIconUrl: string;
  initialTime: number;
  initialMorale: number;
  initialManpower: number;
  path: Point[];
  events: StrategicMarchEvent[];
  landmarks?: Landmark[];
}

// --- New Tactical Battle Types ---
export interface UnitDefinition {
  id: string;
  name: string;
  iconUrl: string;
  maxHp: number;
  attack: number;
  attackRange: number;
  moveRange: number;
  specialAbility?: 'destroy_fortification' | 'charge';
  description?: string;
}

export interface PlacedUnit {
  unitId: string;
  x: number;
  y: number;
  isEnemy: boolean;
  isFort?: boolean;
}

export interface TacticalBattleMissionData extends BaseMissionData {
  type: 'tacticalBattle';
  mapLayout: MapCellType[][];
  unitDefinitions: Record<string, UnitDefinition>;
  playerUnitPool: string[];
  playerUnits?: PlacedUnit[];
  enemyUnits: PlacedUnit[];
  deploymentZone: { x_min: number; x_max: number; y_min: number; y_max: number };
  winCondition: { type: 'defeat_all' } | { type: 'destroy_fort'; position: Point };
}

export type MissionData =
  | PuzzleMissionData
  | NarrativeMissionData
  | TimelineMissionData
  | ARMissionData
  | HiddenObjectMissionData
  | QuizMissionData
  | ConstructionMissionData
  | DiplomacyMissionData
  | TradingMissionData
  | DetectiveMissionData
  | ColoringMissionData
  | RhythmMissionData
  | RallyCallMissionData
  | ForgingMissionData
  | TacticalMapMissionData
  | DefenseMissionData
  | StrategyMapMissionData
  | CoinMintingMissionData
  | HueConstructionMissionData
  | NewspaperPublisherMissionData
  | AdventurePuzzleMissionData
  | StrategicPathMissionData
  | ConstructionPuzzleMissionData
  | NavalBattleMissionData
  | LaneBattleMissionData
  | StrategicMarchMissionData
  | TacticalBattleMissionData
  | TypesettingMissionData;

// --- Player & Game State Types ---

export interface LeaderboardEntry {
  userName: string;
  score: number;
}

export interface AiCharacter {
  id: string;
  name: string;
  systemInstruction: string;
  avatarUrl: string;
  unlockHoiId: string;
  unlockMessage: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot' | 'system';
    text: string;
    timestamp: Date;
}

export interface TutorialStep {
  elementSelector?: string;
  title: string;
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface Tutorial {
  id: string;
  steps: TutorialStep[];
}

export interface AvatarCustomization {
  outfit: string;
  hat: string | null;
}

export interface CustomizationItem {
  id: string;
  name: string;
  type: 'outfit' | 'hat';
  imageUrl: string;
  unlockCondition?: UnlockCondition;
}

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

export interface SandboxState {
  activeBackgroundId: string;
  placedItems: PlacedItem[];
  speechBubbles: SpeechBubble[];
}

export interface SandboxBackground {
  id: string;
  name: string;
  imageUrl: string;
  unlockCondition: UnlockCondition | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  condition: (gameState: SavedGameState) => boolean;
}

export interface HichPuzzleData {
  modifiedText: string;
  answers: string[];
  definitions: Record<string, string>;
}

export interface NotebookPage {
  type: 'text';
  content: string;
}

export interface BachDangCampaignState {
  scoutedLocations: string[];
  unlockedStage: number;
  stakesPlacedCorrectly: number;
}

export interface TaySonCampaignState {
  manpower: number;
  morale: number;
  unlockedStage: number;
}

export interface SavedGameState {
  userName: string;
  gender: 'male' | 'female';
  isPremium: boolean;
  isAdmin: boolean;
  dailyChatCount: number;
  lastChatDate: string;
  collectedArtifactIds: string[];
  collectedHeroCardIds: string[];
  collectedDecorationIds: string[];
  inventory: Record<string, number>;
  questProgress: Record<string, number>;
  tutorialsSeen: string[];
  seenInstructions: string[];
  avatarCustomization: AvatarCustomization;
  unlockedCustomizationItemIds: string[];
  unlockedCharacterIds: string[];
  unlockedBackgroundIds: string[];
  sandboxState: SandboxState;
  unlockedAchievementIds: string[];
  unlockedNotebookPages: number[];
  activeSideQuest: ActiveSideQuestState | null;
  bachDangCampaign: BachDangCampaignState;
  taySonCampaign: TaySonCampaignState;
}

// --- Admin & Analytics Types ---
export interface PlayEvent {
  missionId: string;
  missionTitle: string;
  userName: string;
  timestamp: number;
  outcome: 'win' | 'loss' | 'quit';
}

export type ConfigOverrides = Record<string, Partial<MissionData>>;


// --- Quest & Dialogue Types ---

export type SpeakerKey = 'nhan_vat_chinh' | 'chi_huy' | 'cong_binh' | 'giao_lien' | 'system' | 'co_y_ta' | 'anh_trinh_sat';

export interface Speaker {
  name: string;
  avatarUrl: string;
}

export interface DialogueOption {
  text: string;
  action: 'accept_quest' | 'continue';
  questId?: string;
}

export interface DialogueLine {
  type: 'dialogue';
  speaker: SpeakerKey;
  text: string;
  options?: DialogueOption[];
}

export interface NotebookUnlockEvent {
  type: 'notebook_unlock';
  pageIndex: number;
  message: string;
}

export type DialogueEntry = DialogueLine | NotebookUnlockEvent;


export interface QuestStepInfo {
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
  steps: QuestStepInfo[];
}

export interface ActiveSideQuestState {
  questId: string;
  currentStage: number;
}

export interface SideQuestStage {
  description: string;
  targetMap: string;
  target: Point;
}

export interface SideQuest {
    id: string;
    title: string;
    giver: SpeakerKey;
    startDialogueKey: string;
    endDialogueKey: string;
    stages: SideQuestStage[];
    reward: Reward | NotebookUnlockEvent;
}