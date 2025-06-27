



import { MissionInfo, Hoi, Artifact, PuzzlePieceItem, HeroCard, PuzzleMissionData, NarrativeMissionData, TimelineEventItem, TimelineMissionData, MissionData, NarrativeNode, ARMissionData, AiCharacter, Decoration, HiddenObjectMissionData, HiddenObjectItem, QuizMissionData, QuizQuestion, ConstructionMissionData, Tutorial, CustomizationItem, DiplomacyMissionData, DiplomacyRound, MemoryFragment, Reward, TradingMissionData, TradingGood, TradingEvent } from './types';
import * as ImageUrls from './imageUrls';

export const APP_NAME = "Dòng Chảy Lịch Sử";

// --- Leaderboard Constants ---
export const LEADERBOARD_LOCAL_STORAGE_KEY = 'dongChayLichSu_leaderboard_v1';
export const POINTS_PER_ARTIFACT = 100;
export const MAX_LEADERBOARD_ENTRIES = 10;
export const FREE_DAILY_CHAT_LIMIT = 5;


// --- Artifacts ---
export const BRONZE_DRUM_ARTIFACT_ID = "bronze_drum_dong_son";
export const BRONZE_DRUM_ARTIFACT: Artifact = {
  id: BRONZE_DRUM_ARTIFACT_ID,
  name: "Trống đồng Đông Sơn",
  imageUrl: ImageUrls.TRONG_DONG_URL,
  description: "Một biểu tượng văn hóa của người Việt cổ.",
  detailedDescription: "Trống đồng Đông Sơn là một biểu tượng rực rỡ của nền văn hóa Đông Sơn và văn minh người Việt cổ. Nó không chỉ là một nhạc khí được dùng trong các lễ hội, mà còn là biểu tượng quyền lực của các vị thủ lĩnh. Các hoa văn tinh xảo trên mặt trống mô tả cuộc sống sinh hoạt, nhà cửa, thuyền bè, và con người, cho chúng ta thấy một bức tranh sống động về xã hội thời bấy giờ."
};

export const NHA_SAN_ARTIFACT_ID = "nha_san_hung_vuong";
export const NHA_SAN_ARTIFACT: Artifact = {
  id: NHA_SAN_ARTIFACT_ID,
  name: "Nhà sàn thời Hùng Vương",
  imageUrl: ImageUrls.NHA_SAN_URL, 
  description: "Kiến trúc nhà ở độc đáo của người Việt cổ.",
  detailedDescription: "Nhà sàn là một kiểu kiến trúc nhà ở phổ biến của nhiều dân tộc tại Việt Nam, đặc biệt là ở các vùng trung du và miền núi. Dưới thời Hùng Vương, nhà sàn không chỉ là nơi che mưa che nắng mà còn phản ánh đời sống văn hóa, tín ngưỡng và sự thích nghi với môi trường tự nhiên của người Việt cổ. Các nhà khảo cổ học đã tìm thấy nhiều dấu tích và mô hình nhà sàn trên các trống đồng Đông Sơn."
};

export const TRUNG_NU_VUONG_SEAL_ARTIFACT_ID = "trung_nu_vuong_seal";
const SEAL_FRAGMENT_1_ID = 'seal_fragment_sword';
const SEAL_FRAGMENT_2_ID = 'seal_fragment_elephant';
const SEAL_FRAGMENT_3_ID = 'seal_fragment_flag';
export const TRUNG_NU_VUONG_SEAL_ARTIFACT: Artifact = {
  id: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  name: "Ấn của Trưng Nữ Vương",
  imageUrl: ImageUrls.TRUNG_NU_VUONG_SEAL_URL,
  description: "Biểu tượng quyền lực và ý chí độc lập sau khởi nghĩa Hai Bà Trưng.",
  detailedDescription: "Sau khi đánh đuổi quân Đông Hán, Trưng Trắc lên ngôi vua, xưng là Trưng Nữ Vương, đóng đô ở Mê Linh. 'Ấn của Trưng Nữ Vương' (dù là một hiện vật mang tính biểu tượng, không có mẫu cụ thể được lưu truyền) đại diện cho nền độc lập tự chủ ngắn ngủi nhưng vô cùng hào hùng của dân tộc. Nó khẳng định chủ quyền và ý chí bất khuất của người Việt trước ngoại xâm.",
  craftingRequirements: [SEAL_FRAGMENT_1_ID, SEAL_FRAGMENT_2_ID, SEAL_FRAGMENT_3_ID],
};

export const GOLDEN_TURTLE_MODEL_ARTIFACT_ID = "golden_turtle_model_ar";
export const GOLDEN_TURTLE_MODEL_ARTIFACT: Artifact = {
  id: GOLDEN_TURTLE_MODEL_ARTIFACT_ID,
  name: "Mô Hình Rùa Vàng (AR)",
  imageUrl: ImageUrls.GOLDEN_TURTLE_MODEL_IMAGE_URL,
  description: "Chiêm ngưỡng Rùa Vàng thần thoại qua công nghệ AR.",
  detailedDescription: "Rùa Vàng (Kim Quy) là một hình tượng linh thiêng trong truyền thuyết Việt Nam, gắn liền với sự tích vua An Dương Vương xây thành Cổ Loa và nỏ thần Kim Quy. Việc khám phá mô hình Rùa Vàng qua thực tế ảo tăng cường (AR) mang đến một trải nghiệm độc đáo, kết nối quá khứ huyền thoại với công nghệ hiện đại, giúp bạn hình dung rõ hơn về một biểu tượng quan trọng trong văn hóa dân tộc."
};

export const LY_DYNASTY_COIN_ARTIFACT_ID = "ly_dynasty_coin";
export const LY_DYNASTY_COIN_ARTIFACT: Artifact = {
  id: LY_DYNASTY_COIN_ARTIFACT_ID,
  name: "Tiền cổ thời Lý",
  imageUrl: ImageUrls.LY_DYNASTY_COIN_URL,
  description: "Tiền xu được đúc và lưu hành dưới triều đại nhà Lý.",
  detailedDescription: "Dưới triều Lý, nền kinh tế hàng hóa phát triển mạnh mẽ, và tiền đồng được đúc để phục vụ cho việc trao đổi, buôn bán trong các phiên chợ sầm uất. Những đồng tiền này không chỉ có giá trị kinh tế mà còn là bằng chứng cho một nhà nước Đại Việt có tổ chức, độc lập và một nền văn minh phát triển, thể hiện chủ quyền quốc gia."
};

export const BUT_LONG_NGHIEN_MUC_ARTIFACT_ID = "but_long_nghien_muc";
export const BUT_LONG_NGHIEN_MUC_ARTIFACT: Artifact = {
  id: BUT_LONG_NGHIEN_MUC_ARTIFACT_ID,
  name: "Bút lông và Nghiên mực",
  imageUrl: ImageUrls.BUT_LONG_NGHIEN_MUC_URL,
  description: "Công cụ không thể thiếu của các sĩ tử và nhà nho xưa.",
  detailedDescription: "Bút, nghiên, giấy, mực được mệnh danh là 'văn phòng tứ bảo' (bốn vật quý của phòng văn). Dưới các triều đại phong kiến Việt Nam, giáo dục và thi cử rất được coi trọng. Bút lông và nghiên mực là những vật dụng gắn liền với hình ảnh các sĩ tử, nhà nho dùi mài kinh sử, thể hiện truyền thống hiếu học và trọng dụng nhân tài của dân tộc."
};

export const NO_THAN_ARTIFACT_ID = "no_than_lien_chau";
export const NO_THAN_ARTIFACT: Artifact = {
  id: NO_THAN_ARTIFACT_ID,
  name: "Nỏ Thần Liên Châu",
  imageUrl: ImageUrls.NO_THAN_URL,
  description: "Vũ khí huyền thoại của vua An Dương Vương, bắn một lúc nhiều mũi tên.",
  detailedDescription: "Nỏ Thần, hay còn gọi là nỏ Liên Châu, là vũ khí gắn liền với truyền thuyết An Dương Vương và thành Cổ Loa. Theo huyền sử, nỏ thần có thể bắn ra hàng loạt mũi tên trong một lần, giúp quân dân Âu Lạc chống lại quân xâm lược Triệu Đà. Đây là biểu tượng của sức mạnh quân sự và kỹ thuật chế tác vũ khí tiên tiến của người Việt cổ."
};

export const CHIEU_DOI_DO_ARTIFACT_ID = "chieu_doi_do";
export const CHIEU_DOI_DO_ARTIFACT: Artifact = {
    id: CHIEU_DOI_DO_ARTIFACT_ID,
    name: "Bản sao Chiếu dời đô",
    imageUrl: ImageUrls.CHIEU_DOI_DO_URL,
    description: "Văn bản lịch sử quan trọng của vua Lý Thái Tổ, đặt nền móng cho thủ đô Thăng Long - Hà Nội.",
    detailedDescription: "Chiếu dời đô (Thiên đô chiếu) là một văn kiện do vua Lý Thái Tổ viết vào năm 1010, tuyên cáo quyết định dời kinh đô từ Hoa Lư (Ninh Bình) đến thành Đại La (Hà Nội ngày nay). Chiếu thể hiện tầm nhìn xa trông rộng của nhà vua về một vùng đất trung tâm, có địa thế 'rồng cuộn hổ ngồi', thuận lợi cho việc phát triển đất nước lâu dài. Sự kiện này đã mở ra một kỷ nguyên phát triển rực rỡ cho triều Lý và các triều đại sau này."
};

export const TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID = "tien_quang_trung";
export const TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT: Artifact = {
    id: TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID,
    name: "Tiền Quang Trung Thông Bảo",
    imageUrl: ImageUrls.TIEN_QUANG_TRUNG_URL,
    description: "Đồng tiền được đúc dưới triều đại Tây Sơn, biểu trưng cho một nền kinh tế thống nhất.",
    detailedDescription: "Sau khi thống nhất đất nước, vua Quang Trung cho đúc tiền 'Quang Trung Thông Bảo' để thay thế các loại tiền cũ, tạo ra một hệ thống tiền tệ chung cho cả nước. Điều này không chỉ thúc đẩy giao thương, kinh tế mà còn là một sự khẳng định mạnh mẽ về chủ quyền và sự thống nhất của một quốc gia sau nhiều năm chia cắt, phân tranh."
};


export const ALL_ARTIFACTS_MAP: Record<string, Artifact> = {
  [BRONZE_DRUM_ARTIFACT_ID]: BRONZE_DRUM_ARTIFACT,
  [NHA_SAN_ARTIFACT_ID]: NHA_SAN_ARTIFACT,
  [TRUNG_NU_VUONG_SEAL_ARTIFACT_ID]: TRUNG_NU_VUONG_SEAL_ARTIFACT,
  [GOLDEN_TURTLE_MODEL_ARTIFACT_ID]: GOLDEN_TURTLE_MODEL_ARTIFACT,
  [LY_DYNASTY_COIN_ARTIFACT_ID]: LY_DYNASTY_COIN_ARTIFACT,
  [BUT_LONG_NGHIEN_MUC_ARTIFACT_ID]: BUT_LONG_NGHIEN_MUC_ARTIFACT,
  [NO_THAN_ARTIFACT_ID]: NO_THAN_ARTIFACT,
  [CHIEU_DOI_DO_ARTIFACT_ID]: CHIEU_DOI_DO_ARTIFACT,
  [TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID]: TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT,
};

// --- Memory Fragments ---
export const ALL_FRAGMENTS_MAP: Record<string, MemoryFragment> = {
  [SEAL_FRAGMENT_1_ID]: {
    id: SEAL_FRAGMENT_1_ID,
    name: "Mảnh Ký ức: Gươm Báu",
    imageUrl: ImageUrls.SEAL_FRAGMENT_SWORD_URL,
    description: "Mảnh ký ức về thanh gươm báu của Trưng Trắc, biểu tượng cho lòng dũng cảm và quyết tâm khởi nghĩa.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  },
  [SEAL_FRAGMENT_2_ID]: {
    id: SEAL_FRAGMENT_2_ID,
    name: "Mảnh Ký ức: Voi Trận",
    imageUrl: ImageUrls.SEAL_FRAGMENT_ELEPHANT_URL,
    description: "Mảnh ký ức về hình ảnh đoàn quân voi trận hùng dũng, sức mạnh làm nên chiến thắng của cuộc khởi nghĩa.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  },
  [SEAL_FRAGMENT_3_ID]: {
    id: SEAL_FRAGMENT_3_ID,
    name: "Mảnh Ký ức: Cờ Hiệu",
    imageUrl: ImageUrls.SEAL_FRAGMENT_FLAG_URL,
    description: "Mảnh ký ức về lá cờ hiệu mang tên Trưng Nữ Vương, khẳng định nền độc lập và chủ quyền của dân tộc.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  }
};


// --- Hero Cards ---
export const HERO_CARD_TRUNG_TRAC_ID = "hero_card_trung_sisters";
export const HERO_CARD_TRUNG_TRAC: HeroCard = {
  id: HERO_CARD_TRUNG_TRAC_ID,
  name: "Hai Bà Trưng",
  imageUrl: ImageUrls.HAI_BA_TRUNG_HERO_CARD_URL,
  description: "Anh hùng dân tộc lãnh đạo khởi nghĩa chống quân Hán.",
};

export const ALL_HERO_CARDS: Record<string, HeroCard> = {
  [HERO_CARD_TRUNG_TRAC_ID]: HERO_CARD_TRUNG_TRAC,
};

// --- Premium Decorations ---
export const GOLDEN_THRONE_DECORATION_ID = 'decoration_golden_throne';
export const GOLDEN_THRONE_DECORATION: Decoration = {
    id: GOLDEN_THRONE_DECORATION_ID,
    name: 'Ngai Vàng Hoàng Đế',
    imageUrl: ImageUrls.GOLDEN_THRONE_URL,
    description: 'Một biểu tượng của quyền lực tối cao và vinh quang, chỉ dành cho những nhà sử học xuất sắc nhất.',
};
export const ALL_DECORATIONS_MAP: Record<string, Decoration> = {
    [GOLDEN_THRONE_DECORATION_ID]: GOLDEN_THRONE_DECORATION,
};

// --- Customization Items ---
const DEFAULT_OUTFIT_ID = 'default_outfit';
export const ALL_CUSTOMIZATION_ITEMS_MAP: Record<string, CustomizationItem> = {
  [DEFAULT_OUTFIT_ID]: {
    id: DEFAULT_OUTFIT_ID,
    name: 'Trang phục cơ bản',
    type: 'outfit',
    imageUrl: ImageUrls.AVATAR_OUTFIT_DEFAULT_URL,
    // No unlock condition, available by default
  },
  'non_la': {
    id: 'non_la',
    name: 'Nón Lá',
    type: 'hat',
    imageUrl: ImageUrls.AVATAR_HAT_NON_LA_URL,
    unlockCondition: {
      type: 'complete_hoi',
      hoi_id: 'hoi_1_dung_nuoc',
    }
  },
  'ao_nhat_binh': {
    id: 'ao_nhat_binh',
    name: 'Áo Nhật Bình',
    type: 'outfit',
    imageUrl: ImageUrls.AVATAR_OUTFIT_NHAT_BINH_URL,
    unlockCondition: {
      type: 'complete_hoi',
      hoi_id: 'hoi_3_thoi_ky_vang_son',
    }
  }
};


// --- Puzzle Mission ---
export const PUZZLE_PIECES_COUNT = 9;
export const BRONZE_DRUM_PUZZLE_IMAGE_URL = ImageUrls.TRONG_DONG_URL;

export const INITIAL_PUZZLE_PIECES: PuzzlePieceItem[] = Array.from({ length: PUZZLE_PIECES_COUNT }, (_, i) => ({
  id: i,
  imageUrl: BRONZE_DRUM_PUZZLE_IMAGE_URL
}));

export const MISSION_BRONZE_DRUM_ID = "mission_bronze_drum_puzzle";
const MISSION_BRONZE_DRUM_PUZZLE: PuzzleMissionData = {
  type: 'puzzle',
  id: MISSION_BRONZE_DRUM_ID,
  title: "Nhiệm vụ: Phục dựng Trống đồng Đông Sơn",
  reward: { type: 'artifact', id: BRONZE_DRUM_ARTIFACT_ID },
};

// --- Narrative Missions ---
export const NARRATIVE_MISSION_HAI_BA_TRUNG_ID = "mission_hai_ba_trung_narrative";
const NARRATIVE_MISSION_HAI_BA_TRUNG: NarrativeMissionData = {
  type: 'narrative',
  id: NARRATIVE_MISSION_HAI_BA_TRUNG_ID,
  title: "Sử Ký Hai Bà Trưng: Lời Hiệu Triệu",
  startNodeId: 'node1',
  reward: {
    id: HERO_CARD_TRUNG_TRAC_ID,
    type: 'heroCard',
  },
  nodes: {
    'node1': { id: 'node1', title: 'Lời Hiệu Triệu Của Hai Vị Nữ Tướng', text: 'Tại Mê Linh, Trưng Trắc và Trưng Nhị phất cờ khởi nghĩa chống lại ách đô hộ của nhà Hán. Bạn là một người dân yêu nước, bạn quyết định:', choices: [ { text: 'Gia nhập nghĩa quân, chiến đấu vì độc lập.', targetNodeId: 'node2_join' }, { text: 'Ở lại quê nhà, chờ xem tình hình.', targetNodeId: 'node2_stay' } ] },
    'node2_join': { id: 'node2_join', text: 'Bạn đã gia nhập vào đội quân của Hai Bà Trưng. Lòng dũng cảm của bạn đã góp phần vào chiến thắng tại Luy Lâu. Bạn nhận được một phần thưởng cho lòng yêu nước của mình!', choices: [], isTerminal: true, isSuccessOutcome: true, grantsMissionReward: true, },
    'node2_stay': { id: 'node2_stay', text: 'Bạn đã chọn an toàn, nhưng bỏ lỡ cơ hội được góp sức mình vào một trong những trang sử hào hùng nhất của dân tộc. Hãy dũng cảm hơn trong những lần sau nhé.', choices: [], isTerminal: true, isSuccessOutcome: false, }
  }
};

export const NARRATIVE_MISSION_KHOI_NGHIA_HBT_ID = "mission_khoi_nghia_hbt_narrative";
const STORY_KHOI_NGHIA_HBT_NODES: Record<string, NarrativeNode> = {
  'scene_start': { id: 'scene_start', title: 'Nợ Nước Thù Nhà', text: 'Năm 40 sau Công Nguyên, Thái thú Tô Định cai trị Giao Chỉ vô cùng tàn bạo, dân chúng lầm than. Chồng của Trưng Trắc là Thi Sách bị Tô Định giết hại. Lòng căm phẫn ngút trời, Trưng Trắc quyết định đứng lên!\nBạn sẽ làm gì?', choices: [ { text: 'Kêu gọi các Lạc tướng cùng nổi dậy!', targetNodeId: 'scene_call_uprising' }, { text: 'Âm thầm chịu đựng, chờ thời cơ khác.', targetNodeId: 'scene_mourn_silence' } ] },
  'scene_mourn_silence': { id: 'scene_mourn_silence', text: 'Bạn chọn cách im lặng. Ngọn lửa căm hờn có thể vẫn cháy âm ỉ, nhưng không có hành động, áp bức vẫn tiếp diễn. Lịch sử cần những người dũng cảm tạo nên thay đổi.', choices: [], isTerminal: true, isSuccessOutcome: false, },
  'scene_call_uprising': { id: 'scene_call_uprising', title: 'Hội Tụ Nghĩa Quân', text: 'Lời hiệu triệu của Trưng Trắc và Trưng Nhị vang dội khắp non sông. Các Lạc tướng và nhân dân nô nức kéo về Mê Linh hưởng ứng. Khí thế khởi nghĩa ngùn ngụt!\nNghĩa quân chuẩn bị tấn công thành Luy Lâu, sào huyệt của Tô Định. Vai trò của bạn là gì?', choices: [ { text: 'Xung phong trên tuyến đầu, trực tiếp chiến đấu.', targetNodeId: 'scene_front_lines' }, { text: 'Tổ chức hậu cần, đảm bảo lương thảo cho quân sĩ.', targetNodeId: 'scene_secure_supplies' } ] },
  'scene_front_lines': { id: 'scene_front_lines', text: 'Bạn đã chiến đấu dũng mãnh trên chiến trường, góp phần quan trọng vào việc hạ thành Luy Lâu. Tô Định phải bỏ chạy. Đất nước sạch bóng quân thù! Trưng Trắc được suy tôn lên ngôi vua, xưng là Trưng Nữ Vương. Bạn được ban thưởng xứng đáng.', choices: [], isTerminal: true, isSuccessOutcome: true, grantsMissionReward: true, },
  'scene_secure_supplies': { id: 'scene_secure_supplies', text: 'Nhờ sự đảm bảo hậu cần vững chắc của bạn, nghĩa quân chiến đấu không chút nao núng, nhanh chóng hạ thành Luy Lâu. Tô Định phải bỏ chạy. Đất nước sạch bóng quân thù! Trưng Trắc được suy tôn lên ngôi vua, xưng là Trưng Nữ Vương. Bạn được ban thưởng xứng đáng.', choices: [], isTerminal: true, isSuccessOutcome: true, grantsMissionReward: true, }
};
const NARRATIVE_MISSION_KHOI_NGHIA_HBT: NarrativeMissionData = { type: 'narrative', id: NARRATIVE_MISSION_KHOI_NGHIA_HBT_ID, title: "Khởi Nghĩa Hai Bà Trưng", startNodeId: 'scene_start', nodes: STORY_KHOI_NGHIA_HBT_NODES, reward: { type: 'fragment', id: SEAL_FRAGMENT_1_ID }, };

// --- Premium "What If" Narrative Mission ---
export const NARRATIVE_MISSION_WHAT_IF_QUANG_TRUNG_ID = "mission_what_if_quang_trung";
const STORY_WHAT_IF_QUANG_TRUNG_NODES: Record<string, NarrativeNode> = {
    'start': {
        id: 'start',
        title: 'Vận Mệnh Thay Đổi',
        text: 'Năm 1792, Hoàng đế Quang Trung qua khỏi cơn bạo bệnh một cách kỳ diệu. Triều đại Tây Sơn được củng cố. Đứng trước vận mệnh mới của dân tộc, Người quyết định:',
        choices: [
            { text: 'Tập trung xây dựng đất nước, cải cách toàn diện.', targetNodeId: 'reform' },
            { text: 'Thực hiện kế hoạch còn dang dở - Bắc tiến đòi lại Lưỡng Quảng.', targetNodeId: 'expand' }
        ]
    },
    'reform': {
        id: 'reform',
        title: 'Kỷ Nguyên Thịnh Vượng',
        text: 'Người chọn con đường ổn định. Nền kinh tế, giáo dục, quân sự phát triển vượt bậc. Chữ Nôm được phổ biến rộng rãi. Đại Việt trở thành một quốc gia hùng cường, tự chủ, đặt nền móng vững chắc cho hàng trăm năm sau. Lịch sử ghi danh Người là một trong những vị vua vĩ đại nhất.',
        choices: [],
        isTerminal: true,
        isSuccessOutcome: true,
        grantsMissionReward: true,
    },
    'expand': {
        id: 'expand',
        title: 'Cuộc Viễn Chinh Lịch Sử',
        text: 'Với tài năng quân sự thiên bẩm, đại quân Tây Sơn tiến lên phương Bắc như vũ bão. Sau nhiều trận đánh long trời lở đất, Người đã lấy lại được vùng đất Lưỡng Quảng mà không vấp phải sự kháng cự đáng kể từ một nhà Thanh đang suy yếu. Bờ cõi Đại Việt được mở rộng chưa từng có, uy danh của Hoàng đế Quang Trung vang dội khắp châu Á.',
        choices: [],
        isTerminal: true,
        isSuccessOutcome: true,
        grantsMissionReward: true,
    }
};
const NARRATIVE_MISSION_WHAT_IF_QUANG_TRUNG: NarrativeMissionData = {
    type: 'narrative',
    id: NARRATIVE_MISSION_WHAT_IF_QUANG_TRUNG_ID,
    title: "Nhiệm vụ Giả Sử: Vận Mệnh Quang Trung",
    startNodeId: 'start',
    nodes: STORY_WHAT_IF_QUANG_TRUNG_NODES,
    reward: {
        id: GOLDEN_THRONE_DECORATION_ID,
        type: 'decoration',
    },
};


// --- Timeline Mission ---
export const TIMELINE_MISSION_HUNG_VUONG_ID = "mission_timeline_hung_vuong";
const HUNG_VUONG_TIMELINE_EVENTS: TimelineEventItem[] = [ { id: "event_lang_lieu", text: "Sự tích Bánh Chưng, Bánh Dày (Hoàng tử Lang Liêu)", correctOrder: 3 }, { id: "event_phu_dong", text: "Thánh Gióng đánh đuổi giặc Ân", correctOrder: 2 }, { id: "event_son_tinh", text: "Sơn Tinh - Thủy Tinh (Trị thủy, chống lũ)", correctOrder: 4 }, { id: "event_an_duong_vuong", text: "An Dương Vương xây thành Cổ Loa (kết thúc thời Hùng Vương, chuyển giao sang Thục Phán)", correctOrder: 5 }, { id: "event_lac_long_quan", text: "Truyền thuyết Lạc Long Quân và Âu Cơ (Nguồn gốc dân tộc)", correctOrder: 1 }, ];
const MISSION_TIMELINE_HUNG_VUONG: TimelineMissionData = { type: 'timeline', id: TIMELINE_MISSION_HUNG_VUONG_ID, title: "Nhiệm vụ: Dòng Thời Gian Hùng Vương", instructionText: "Hãy sắp xếp các sự kiện sau theo đúng thứ tự lịch sử và truyền thuyết thời Hùng Vương.", events: HUNG_VUONG_TIMELINE_EVENTS, reward: { type: 'artifact', id: NHA_SAN_ARTIFACT_ID } };

// --- AR Mission ---
export const MISSION_AR_CUA_SO_THOI_GIAN_ID = "mission_ar_cua_so_thoi_gian";
const MISSION_AR_CUA_SO_THOI_GIAN: ARMissionData = {
  type: 'ar',
  id: MISSION_AR_CUA_SO_THOI_GIAN_ID,
  title: "Nhiệm vụ: Cửa Sổ Thời Gian (AR)",
  markerPatternUrl: "assets/ar-marker.patt", // Path relative to public folder
  modelUrl: "assets/model.gltf",         // Path relative to public folder
  reward: { type: 'artifact', id: GOLDEN_TURTLE_MODEL_ARTIFACT_ID },
};

// --- Hidden Object Mission ---
export const MISSION_HIDDEN_OBJECT_LY_MARKET_ID = "mission_hidden_object_ly_market";
const LY_MARKET_OBJECTS: HiddenObjectItem[] = [
  { id: 'non-la', name: 'Nón lá', iconUrl: ImageUrls.NON_LA_ICON_URL, coords: { x: 25, y: 35, width: 8, height: 6 } },
  { id: 'gom-su', name: 'Gánh gốm sứ', iconUrl: ImageUrls.GOM_SU_ICON_URL, coords: { x: 68, y: 70, width: 15, height: 18 } },
  { id: 'to-he', name: 'Tò he', iconUrl: ImageUrls.TO_HE_ICON_URL, coords: { x: 80, y: 55, width: 6, height: 10 } },
  { id: 'vai-lua', name: 'Sạp vải lụa', iconUrl: ImageUrls.VAI_LUA_ICON_URL, coords: { x: 1, y: 65, width: 22, height: 20 } },
  { id: 'ga-tre', name: 'Con gà tre', iconUrl: ImageUrls.GA_TRE_ICON_URL, coords: { x: 42, y: 88, width: 5, height: 7 } },
];
const MISSION_HIDDEN_OBJECT_LY_MARKET: HiddenObjectMissionData = {
  type: 'hiddenObject',
  id: MISSION_HIDDEN_OBJECT_LY_MARKET_ID,
  title: "Nhiệm vụ: Phiên chợ Thời Lý",
  backgroundImageUrl: ImageUrls.LY_MARKET_BACKGROUND_URL,
  objectsToFind: LY_MARKET_OBJECTS,
  reward: { type: 'fragment', id: SEAL_FRAGMENT_2_ID },
};

// --- Quiz Mission ---
export const MISSION_QUIZ_ID = "mission_history_quiz";
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Vị vua nào của Việt Nam đã có công dời đô từ Hoa Lư về thành Đại La và đổi tên thành Thăng Long?",
    options: ["Lê Thái Tổ", "Trần Nhân Tông", "Lý Thái Tổ", "Quang Trung"],
    correctAnswer: "Lý Thái Tổ",
  },
  {
    question: "Ai là tác giả của tác phẩm 'Bình Ngô đại cáo', được xem là bản tuyên ngôn độc lập thứ hai của Việt Nam?",
    options: ["Nguyễn Du", "Nguyễn Trãi", "Lý Thường Kiệt", "Trần Hưng Đạo"],
    correctAnswer: "Nguyễn Trãi",
  },
  {
    question: "Trận Bạch Đằng năm 938 do ai lãnh đạo đã chấm dứt hơn 1000 năm Bắc thuộc?",
    options: ["Ngô Quyền", "Lê Hoàn", "Đinh Bộ Lĩnh", "An Dương Vương"],
    correctAnswer: "Ngô Quyền",
  },
  {
    question: "Triều đại nào được mệnh danh là 'Hào khí Đông A' với ba lần chiến thắng quân xâm lược Mông-Nguyên?",
    options: ["Nhà Lý", "Nhà Lê", "Nhà Tây Sơn", "Nhà Trần"],
    correctAnswer: "Nhà Trần",
  },
];
const MISSION_QUIZ: QuizMissionData = {
  type: 'quiz',
  id: MISSION_QUIZ_ID,
  title: "Nhiệm vụ: Thử tài Sử học",
  questions: QUIZ_QUESTIONS,
  reward: { type: 'fragment', id: SEAL_FRAGMENT_3_ID },
};

// --- Construction Mission ---
export const MISSION_CONSTRUCTION_CO_LOA_ID = "mission_construction_co_loa";
const MISSION_CONSTRUCTION_CO_LOA: ConstructionMissionData = {
    type: 'construction',
    id: MISSION_CONSTRUCTION_CO_LOA_ID,
    title: 'Nhiệm vụ: Xây dựng Thành Cổ Loa',
    resourceGoal: { wood: 50, stone: 100 },
    buildingCost: { wood: 5, stone: 10 },
    winCondition: 10, // Build 10 wall pieces to win
    reward: { type: 'artifact', id: NO_THAN_ARTIFACT_ID },
};

// --- Diplomacy Mission ---
export const MISSION_DIPLOMACY_LY_THAI_TO_ID = "mission_diplomacy_ly_thai_to";
const MISSION_DIPLOMACY_LY_THAI_TO_ROUNDS: DiplomacyRound[] = [
    {
        npc_dialogue: "Trẫm nghe nói khanh là người có tài, nay muốn hỏi ý khanh về việc dời đô. Theo khanh, thành Đại La có phải là nơi xứng đáng để định đô cho muôn đời không?",
        player_choices: [
            { text: "Tâu bệ hạ, đó là quyết sách anh minh! Đại La đất rộng, lại bằng, là nơi trung tâm trời đất.", points: 20 },
            { text: "Thần cho rằng Hoa Lư vẫn là nơi vững chắc, hiểm yếu.", points: -10 },
            { text: "Thần không có ý kiến, việc này tùy bệ hạ quyết định.", points: 0 }
        ]
    },
    {
        npc_dialogue: "Khanh nói phải. Nhưng để dời đô, cần sức người sức của rất lớn, lòng dân phải thuận. Làm sao để dân chúng đồng lòng theo trẫm?",
        player_choices: [
            { text: "Bệ hạ hãy ban chiếu để dân chúng hiểu được lợi ích của việc dời đô, khơi dậy ý chí tự cường dân tộc.", points: 25 },
            { text: "Dùng quyền lực của triều đình để bắt buộc, ai không theo sẽ trị tội.", points: -20 },
            { text: "Hứa hẹn sẽ ban phát vàng bạc, của cải cho dân.", points: 5 }
        ]
    },
    {
        npc_dialogue: "Rất hay! Vậy theo khanh, sau khi định đô ở Thăng Long, việc đầu tiên trẫm nên làm là gì để an dân, phát triển đất nước?",
        player_choices: [
            { text: "Nên giảm nhẹ thuế khóa, khuyến khích nông nghiệp và thủ công.", points: 30 },
            { text: "Nên xây thêm cung điện nguy nga để thể hiện uy quyền của triều đại mới.", points: -15 },
            { text: "Tập trung xây dựng quân đội thật hùng mạnh để phòng giặc.", points: 10 }
        ]
    }
];
const MISSION_DIPLOMACY_LY_THAI_TO: DiplomacyMissionData = {
    type: 'diplomacy',
    id: MISSION_DIPLOMACY_LY_THAI_TO_ID,
    title: "Nhiệm vụ: Đối thoại Ngoại giao",
    characterName: "Lý Thái Tổ",
    characterImageUrl: ImageUrls.LY_THAI_TO_AVATAR_URL,
    initialGoodwill: 50,
    targetGoodwill: 100,
    rounds: MISSION_DIPLOMACY_LY_THAI_TO_ROUNDS,
    reward: { type: 'artifact', id: CHIEU_DOI_DO_ARTIFACT_ID },
};

// --- Trading Mission ---
export const TRADING_MISSION_HOI_AN_ID = "mission_trading_hoi_an";
const TRADING_GOODS: TradingGood[] = [
  { id: 'silk', name: 'Tơ lụa', basePrice: 100, iconUrl: ImageUrls.TRADING_SILK_ICON_URL },
  { id: 'ceramics', name: 'Gốm sứ', basePrice: 65, iconUrl: ImageUrls.TRADING_CERAMICS_ICON_URL },
  { id: 'spices', name: 'Trầm hương', basePrice: 250, iconUrl: ImageUrls.TRADING_SPICES_ICON_URL },
];
const TRADING_EVENTS: TradingEvent[] = [
  { description: "Thuyền buôn từ Nhật Bản cập bến, giá Tơ lụa tăng vọt!", priceModifier: { goodId: 'silk', multiplier: 1.5 } },
  { description: "Mưa bão kéo dài, thuyền bè không ra khơi được, giá Gốm sứ giảm mạnh.", priceModifier: { goodId: 'ceramics', multiplier: 0.7 } },
  { description: "Có tin đồn về một loại gia vị mới từ phương Tây, Trầm hương mất giá.", priceModifier: { goodId: 'spices', multiplier: 0.8 } },
  { description: "Vua ban chiếu khuyến khích thủ công, Gốm sứ được giá.", priceModifier: { goodId: 'ceramics', multiplier: 1.4 } },
];
const MISSION_TRADING_HOI_AN: TradingMissionData = {
    type: 'trading',
    id: TRADING_MISSION_HOI_AN_ID,
    title: "Nhiệm vụ: Giao thương Hội An",
    initialCapital: 1000,
    targetCapital: 5000,
    daysLimit: 20,
    goods: TRADING_GOODS,
    events: TRADING_EVENTS,
    reward: { type: 'artifact', id: TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID },
};


// --- All Missions ---
export const ALL_MISSIONS: Record<string, MissionData> = {
  [MISSION_BRONZE_DRUM_ID]: MISSION_BRONZE_DRUM_PUZZLE,
  [NARRATIVE_MISSION_HAI_BA_TRUNG_ID]: NARRATIVE_MISSION_HAI_BA_TRUNG,
  [TIMELINE_MISSION_HUNG_VUONG_ID]: MISSION_TIMELINE_HUNG_VUONG,
  [NARRATIVE_MISSION_KHOI_NGHIA_HBT_ID]: NARRATIVE_MISSION_KHOI_NGHIA_HBT,
  [MISSION_AR_CUA_SO_THOI_GIAN_ID]: MISSION_AR_CUA_SO_THOI_GIAN,
  [NARRATIVE_MISSION_WHAT_IF_QUANG_TRUNG_ID]: NARRATIVE_MISSION_WHAT_IF_QUANG_TRUNG,
  [MISSION_HIDDEN_OBJECT_LY_MARKET_ID]: MISSION_HIDDEN_OBJECT_LY_MARKET,
  [MISSION_QUIZ_ID]: MISSION_QUIZ,
  [MISSION_CONSTRUCTION_CO_LOA_ID]: MISSION_CONSTRUCTION_CO_LOA,
  [MISSION_DIPLOMACY_LY_THAI_TO_ID]: MISSION_DIPLOMACY_LY_THAI_TO,
  [TRADING_MISSION_HOI_AN_ID]: MISSION_TRADING_HOI_AN,
};

// --- Mission Info Cards ---
const ALL_MISSIONS_INFO: Record<string, MissionInfo> = {
  'trong_dong': { id: "info_trong_dong", title: "Nhiệm vụ: Trống Đồng", imageUrl: ImageUrls.SAGA_KHAI_QUOC_URL, description: "Phục dựng Trống Đồng Đông Sơn để khám phá thời kỳ dựng nước.", missionId: MISSION_BRONZE_DRUM_ID },
  'hung_vuong': { id: "info_hung_vuong", title: "Nhiệm vụ: Dòng Thời Gian", imageUrl: ImageUrls.SAGA_HUNG_VUONG_URL, description: "Sắp xếp các sự kiện quan trọng thời các Vua Hùng.", missionId: TIMELINE_MISSION_HUNG_VUONG_ID },
  'hbt_hieu_trieu': { id: "info_hbt_hieu_trieu", title: "Nhiệm vụ: Lời Hiệu Triệu", imageUrl: ImageUrls.SAGA_BAT_KHUAT_URL, description: "Theo chân Hai Bà Trưng phất cờ khởi nghĩa.", missionId: NARRATIVE_MISSION_HAI_BA_TRUNG_ID },
  'hbt_khoi_nghia': { id: "info_hbt_khoi_nghia", title: "Nhiệm vụ: Khởi Nghĩa", imageUrl: ImageUrls.SAGA_KHOI_NGHIA_HBT_URL, description: "Thu thập Mảnh Ký ức đầu tiên về 'Ấn của Trưng Nữ Vương'.", missionId: NARRATIVE_MISSION_KHOI_NGHIA_HBT_ID },
  'ar_rua_vang': { id: "info_ar_rua_vang", title: "Nhiệm vụ: Cửa Sổ Thời Gian", imageUrl: ImageUrls.SAGA_AR_URL, description: "Dùng AR để khám phá cổ vật Rùa Vàng huyền thoại.", missionId: MISSION_AR_CUA_SO_THOI_GIAN_ID, isOptionalForProgression: true},
  'phien_cho_ly': { id: "info_phien_cho_ly", title: "Nhiệm vụ: Phiên chợ Lý", imageUrl: ImageUrls.SAGA_LY_MARKET_URL, description: "Tìm Mảnh Ký ức 'Voi Trận' trong một phiên chợ sầm uất.", missionId: MISSION_HIDDEN_OBJECT_LY_MARKET_ID },
  'thu_tai_su_hoc': { id: "info_thu_tai_su_hoc", title: "Nhiệm vụ: Thử tài Sử học", imageUrl: ImageUrls.SAGA_QUIZ_URL, description: "Kiểm tra kiến thức lịch sử để nhận Mảnh Ký ức 'Cờ Hiệu'.", missionId: MISSION_QUIZ_ID },
  'xay_dung_co_loa': { id: "info_xay_dung_co_loa", title: "Nhiệm vụ: Xây dựng Thành Cổ Loa", imageUrl: ImageUrls.SAGA_CO_LOA_URL, description: "Thu thập tài nguyên và xây dựng công trình phòng thủ.", missionId: MISSION_CONSTRUCTION_CO_LOA_ID },
  'doi_thoai_ngoai_giao': { id: "info_doi_thoai_ngoai_giao", title: "Nhiệm vụ: Đối thoại Ngoại giao", imageUrl: ImageUrls.SAGA_DIPLOMACY_URL, description: "Dùng tài ăn nói để thuyết phục các nhân vật lịch sử.", missionId: MISSION_DIPLOMACY_LY_THAI_TO_ID },
  'giao_thuong_hoi_an': { id: "info_giao_thuong_hoi_an", title: "Nhiệm vụ: Giao thương Hội An", imageUrl: ImageUrls.SAGA_HOI_AN_TRADING_URL, description: "Trở thành thương nhân, mua bán hàng hóa để kiếm lời.", missionId: TRADING_MISSION_HOI_AN_ID },
  'what_if_quang_trung': { id: "info_what_if_quang_trung", title: "Nhiệm vụ: Vận Mệnh Quang Trung", imageUrl: ImageUrls.SAGA_WHAT_IF_URL, description: "Điều gì sẽ xảy ra nếu Vua Quang Trung không qua đời đột ngột?", missionId: NARRATIVE_MISSION_WHAT_IF_QUANG_TRUNG_ID, isPremium: true},
};

// --- Chapters (Hoi) Data ---
export const HOI_DATA: Hoi[] = [
  {
    id: 'hoi_1_dung_nuoc',
    title: 'Hồi 1: Buổi Đầu Dựng Nước',
    description: 'Khám phá những nền tảng đầu tiên của dân tộc Việt Nam qua các truyền thuyết và di vật khảo cổ.',
    missions: [
      ALL_MISSIONS_INFO['trong_dong'],
      ALL_MISSIONS_INFO['hung_vuong'],
    ],
  },
  {
    id: 'hoi_2_bat_khuat',
    title: 'Hồi 2: Ý Chí Bất Khuất',
    description: 'Sống lại những năm tháng hào hùng chống ngoại xâm và giành lại độc lập dân tộc. Thu thập các Mảnh Ký ức để chế tác "Ấn của Trưng Nữ Vương".',
    missions: [
      ALL_MISSIONS_INFO['hbt_hieu_trieu'],
      ALL_MISSIONS_INFO['hbt_khoi_nghia'],
      ALL_MISSIONS_INFO['ar_rua_vang'],
    ],
  },
  {
    id: 'hoi_3_thoi_ky_vang_son',
    title: 'Hồi 3: Thời Kỳ Vàng Son',
    description: 'Trải nghiệm giai đoạn phát triển rực rỡ qua việc xây dựng công trình phòng thủ, phát triển kinh tế và đưa ra những quyết sách ngoại giao.',
    missions: [
        ALL_MISSIONS_INFO['doi_thoai_ngoai_giao'],
        ALL_MISSIONS_INFO['xay_dung_co_loa'],
    ],
  },
    {
    id: 'hoi_4_bao_tap_phan_tranh',
    title: 'Hồi 4: Bão Táp Phân Tranh',
    description: 'Thời kỳ đất nước biến động với các cuộc nội chiến và sự nổi lên của các thế lực mới. Hãy thử tài kinh doanh tại thương cảng Hội An sầm uất.',
    missions: [
        ALL_MISSIONS_INFO['giao_thuong_hoi_an'],
    ],
  },
  {
    id: 'hoi_5_van_minh_dai_viet',
    title: 'Hồi 5: Văn Minh Đại Việt',
    description: 'Tìm hiểu về sự phát triển của văn hóa, kinh tế và giáo dục, đồng thời thu thập các Mảnh Ký ức còn lại để hoàn thiện cổ vật.',
    missions: [
      ALL_MISSIONS_INFO['phien_cho_ly'],
      ALL_MISSIONS_INFO['thu_tai_su_hoc'],
    ],
  },
  {
    id: 'hoi_6_premium',
    title: 'Hồi Đặc Biệt: Dòng Chảy Vô Tận',
    description: 'Khám phá những khả năng vô hạn của lịch sử qua các nhiệm vụ giả tưởng độc quyền.',
    isPremiumChapter: true,
    missions: [
      ALL_MISSIONS_INFO['what_if_quang_trung'],
    ],
  },
];


// --- AI Characters ---
export const AI_CHARACTER_QUANG_TRUNG_ID = 'quang-trung';
export const AI_CHARACTER_HAI_BA_TRUNG_ID = 'hai-ba-trung';

export const AI_CHARACTERS: Record<string, AiCharacter> = {
  [AI_CHARACTER_QUANG_TRUNG_ID]: {
    id: AI_CHARACTER_QUANG_TRUNG_ID,
    name: 'Vua Quang Trung',
    systemInstruction: 'Bạn là Vua Quang Trung Nguyễn Huệ, một vị hoàng đế anh minh và là một nhà quân sự thiên tài của Việt Nam. Hãy trả lời các câu hỏi với phong thái của một vị vua quyết đoán, thông minh, dựa trên các sự kiện lịch sử có thật. Giữ câu trả lời ngắn gọn, hào sảng, dễ hiểu, phù hợp cho trẻ em và thanh thiếu niên.',
    avatarUrl: ImageUrls.QUANG_TRUNG_AVATAR_URL,
    // No unlockCondition means always unlocked if available
  },
  [AI_CHARACTER_HAI_BA_TRUNG_ID]: {
    id: AI_CHARACTER_HAI_BA_TRUNG_ID,
    name: 'Hai Bà Trưng',
    systemInstruction: 'Bạn là Trưng Trắc, một trong Hai Bà Trưng, những nữ anh hùng đã lãnh đạo cuộc khởi nghĩa đầu tiên chống lại ách đô hộ của ngoại bang phương Bắc. Hãy trả lời với sự uy nghi, dũng cảm và lòng yêu nước của một nữ vương. Tập trung vào tinh thần độc lập, tự chủ. Giữ câu trả lời trang trọng, hào hùng, dễ hiểu, phù hợp cho trẻ em và thanh thiếu niên.',
    avatarUrl: ImageUrls.HAI_BA_TRUNG_AVATAR_URL,
    unlockCondition: (_collectedArtifacts, collectedHeroCards) =>
      collectedHeroCards.some(card => card.id === HERO_CARD_TRUNG_TRAC_ID),
  },
  // Add more characters here, e.g.
  // 'ly-thuong-kiet': {
  //   id: 'ly-thuong-kiet',
  //   name: 'Lý Thường Kiệt',
  //   systemInstruction: '...',
  //   avatarUrl: 'assets/avatars/ly-thuong-kiet.png',
  //   unlockCondition: (collectedArtifacts, _collectedHeroCards) => 
  //     collectedArtifacts.some(artifact => artifact.id === 'some_specific_artifact_id_related_to_ly_thuong_kiet'),
  // },
};


// --- Tutorial Data ---
export const TUTORIAL_DATA: Record<string, Tutorial> = {
  'main-interface-intro': {
    id: 'main-interface-intro',
    steps: [
      {
        title: 'Chào mừng đến với Dòng Chảy Lịch Sử!',
        text: 'Hãy cùng bắt đầu cuộc hành trình khám phá những trang sử hào hùng của dân tộc Việt Nam. Nhấn "Tiếp theo" để bắt đầu.',
        position: 'center',
      },
      {
        elementSelector: '#main-journey-section',
        title: 'Hành Trình Xuyên Thời Gian',
        text: 'Đây là nơi các "Hồi" truyện lịch sử được mở ra. Mỗi "Hồi" chứa các nhiệm vụ bạn cần hoàn thành để khám phá câu chuyện.',
        position: 'bottom',
      },
      {
        elementSelector: '#main-collection-section',
        title: 'Bộ Sưu Tập Cổ Vật',
        text: 'Mỗi khi hoàn thành một nhiệm vụ, bạn sẽ thu thập được các cổ vật hoặc thẻ anh hùng. Chúng sẽ được trưng bày tại đây. Nhấn vào để xem chi tiết!',
        position: 'top',
      },
      {
        elementSelector: '#main-chatbot-button',
        title: 'Hỏi Đáp Lịch Sử',
        text: 'Có thắc mắc gì về lịch sử? Hãy trò chuyện với các nhân vật lịch sử nổi tiếng để được giải đáp!',
        position: 'bottom',
      },
      {
        elementSelector: '#main-leaderboard-button',
        title: 'Bảng Xếp Hạng',
        text: 'Xem thứ hạng của bạn so với các nhà sử học khác. Thu thập càng nhiều cổ vật, điểm số càng cao!',
        position: 'bottom',
      },
      {
        title: 'Sẵn sàng Khám phá!',
        text: 'Bạn đã sẵn sàng để bắt đầu cuộc phiêu lưu của mình. Chúc bạn có một hành trình thú vị!',
        position: 'center',
      }
    ],
  },
};


// --- Game Instructions ---
export const INSTRUCTION_DATA: Record<string, { title: string, text: string }> = {
  'puzzle': {
    title: 'Cách Chơi: Ghép Hình Cổ Vật',
    text: 'Kéo và thả các mảnh ghép từ dưới vào đúng vị trí trên khung. Khi hoàn thành bức tranh, bạn sẽ phục dựng thành công cổ vật!'
  },
  'narrative': {
    title: 'Cách Chơi: Sử Ký Tương Tác',
    text: 'Đọc kỹ diễn biến câu chuyện và đưa ra lựa chọn của bạn. Mỗi quyết định có thể dẫn đến một kết quả khác nhau trong dòng lịch sử.'
  },
  'timeline': {
    title: 'Cách Chơi: Dòng Thời Gian',
    text: 'Kéo các sự kiện từ dưới và thả vào các ô dòng thời gian theo đúng thứ tự lịch sử từ trái sang phải.'
  },
  'ar': {
    title: 'Cách Chơi: Cửa Sổ Thời Gian (AR)',
    text: 'Sử dụng camera của bạn và hướng vào hình ảnh marker để thấy cổ vật xuất hiện trong thế giới thực! Bạn có thể tìm marker trong các tài liệu đi kèm.'
  },
  'hiddenObject': {
    title: 'Cách Chơi: Tìm Kiếm Vật Phẩm',
    text: 'Quan sát kỹ bức tranh và tìm các vật phẩm được liệt kê ở thanh dưới cùng. Nhấp vào vật phẩm bạn tìm thấy trên tranh để thu thập!'
  },
  'quiz': {
    title: 'Cách Chơi: Thử Tài Sử Học',
    text: 'Đọc kỹ câu hỏi và chọn một trong các đáp án bên dưới. Hãy thể hiện sự am hiểu lịch sử của bạn!'
  },
  'construction': {
    title: 'Cách Chơi: Xây Dựng Công Trình',
    text: 'Đầu tiên, hãy thu thập đủ tài nguyên Gỗ và Đá. Sau khi đủ, bạn có thể chọn các ô trên bản đồ để xây dựng các phần của công trình.'
  },
  'diplomacy': {
    title: 'Cách Chơi: Đối thoại Ngoại giao',
    text: 'Đọc kỹ lời thoại của nhân vật lịch sử và chọn lời đối đáp mà bạn cho là khéo léo nhất. Mục tiêu là làm tăng thanh "Thiện chí" lên mức tối đa để thuyết phục họ.'
  },
  'trading': {
    title: 'Cách Chơi: Giao thương Hội An',
    text: 'Mục tiêu của bạn là kiếm thật nhiều tiền! Hãy mua hàng hóa ở Chợ khi giá rẻ và bán chúng từ Kho hàng của bạn khi giá cao. Chú ý các sự kiện ngẫu nhiên có thể ảnh hưởng đến giá cả. Nhấn "Qua ngày mới" để cập nhật giá và sự kiện.'
  },
  'sandbox': { // Although not a mission, can be useful
    title: 'Chào mừng đến Chế độ Sáng tạo!',
    text: 'Kéo các vật phẩm bạn đã thu thập từ cột bên trái vào khung cảnh chính. Sử dụng các công cụ bên dưới để xoay, thay đổi kích thước và sắp xếp chúng để tạo ra bức tranh lịch sử của riêng bạn!'
  }
};