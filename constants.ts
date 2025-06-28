

import { MissionInfo, Hoi, Artifact, PuzzlePieceItem, HeroCard, PuzzleMissionData, NarrativeMissionData, TimelineEventItem, TimelineMissionData, MissionData, NarrativeNode, ARMissionData, AiCharacter, Decoration, HiddenObjectMissionData, HiddenObjectItem, QuizMissionData, ConstructionMissionData, Tutorial, CustomizationItem, DiplomacyMissionData, DiplomacyRound, MemoryFragment, Reward, TradingMissionData, TradingGood, TradingEvent, RhythmMissionData, RhythmNote, ColoringMissionData, SandboxBackground, Achievement, SavedGameState, RallyCallMissionData, ForgingMissionData, QuestChain, TacticalMapMissionData, DefenseMissionData, MapCellType, StrategyMapMissionData, CoinMintingMissionData } from './types';
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
const SEAL_FRAGMENT_HICH_ID = 'seal_fragment_hich'; 
export const TRUNG_NU_VUONG_SEAL_ARTIFACT: Artifact = {
  id: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  name: "Ấn của Trưng Nữ Vương",
  imageUrl: ImageUrls.TRUNG_NU_VUONG_SEAL_URL,
  description: "Biểu tượng quyền lực và ý chí độc lập sau khởi nghĩa Hai Bà Trưng.",
  detailedDescription: "Sau khi đánh đuổi quân Đông Hán, Trưng Trắc lên ngôi vua, xưng là Trưng Nữ Vương, đóng đô ở Mê Linh. 'Ấn của Trưng Nữ Vương' (dù là một hiện vật mang tính biểu tượng, không có mẫu cụ thể được lưu truyền) đại diện cho nền độc lập tự chủ ngắn ngủi nhưng vô cùng hào hùng của dân tộc. Nó khẳng định chủ quyền và ý chí bất khuất của người Việt trước ngoại xâm.",
  craftingRequirements: [SEAL_FRAGMENT_1_ID, SEAL_FRAGMENT_2_ID, SEAL_FRAGMENT_3_ID, SEAL_FRAGMENT_HICH_ID],
};

export const GIAO_DONG_DONG_SON_ARTIFACT_ID = "giao_dong_dong_son";
const SPEARHEAD_FRAGMENT_ID = 'spearhead_fragment_dong_son';
export const GIAO_DONG_DONG_SON_ARTIFACT: Artifact = {
  id: GIAO_DONG_DONG_SON_ARTIFACT_ID,
  name: "Giáo đồng Đông Sơn",
  imageUrl: ImageUrls.BRONZE_SPEAR_URL,
  description: "Vũ khí phổ biến và hiệu quả của quân lính thời Âu Lạc.",
  detailedDescription: "Giáo đồng là một trong những vũ khí chủ lực của quân đội thời An Dương Vương. Với mũi giáo được đúc bằng đồng sắc bén, nó thể hiện trình độ luyện kim và kỹ thuật quân sự phát triển của người Việt cổ, góp phần quan trọng trong việc bảo vệ thành Cổ Loa và chống lại các cuộc xâm lược.",
  craftingRequirements: [SPEARHEAD_FRAGMENT_ID], // Example requirement
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

export const DAN_NGUYET_ARTIFACT_ID = "dan_nguyet";
export const DAN_NGUYET_ARTIFACT: Artifact = {
    id: DAN_NGUYET_ARTIFACT_ID,
    name: "Đàn Nguyệt",
    imageUrl: ImageUrls.DAN_NGUYET_URL,
    description: "Nhạc cụ dây gảy, một phần quan trọng của Nhã nhạc cung đình Huế.",
    detailedDescription: "Đàn Nguyệt, hay còn gọi là đàn kìm, là một nhạc cụ truyền thống có vai trò quan trọng trong nhiều thể loại âm nhạc dân tộc Việt Nam, bao gồm cả Nhã nhạc cung đình. Với âm sắc trong sáng, vang vọng, Đàn Nguyệt thường giữ vai trò lĩnh xướng hoặc độc tấu, góp phần tạo nên sự trang trọng, tao nhã cho âm nhạc cung đình.",
};

export const TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID = "tranh_dam_cuoi_chuot";
export const TRANH_DAM_CUOI_CHUOT_ARTIFACT: Artifact = {
    id: TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID,
    name: "Bản khắc Tranh Đám Cưới Chuột",
    imageUrl: ImageUrls.TRANH_DAM_CUOI_CHUOT_URL,
    description: "Một tác phẩm tiêu biểu của dòng tranh dân gian Đông Hồ.",
    detailedDescription: "Tranh Đông Hồ là một dòng tranh dân gian Việt Nam có xuất xứ từ làng Đông Hồ (Bắc Ninh). Tranh 'Đám Cưới Chuột' là một trong những tác phẩm nổi tiếng nhất, mang ý nghĩa châm biếm sâu sắc về xã hội cũ. Bức tranh mô tả cảnh một đám cưới chuột rộn ràng nhưng lại phải cống nạp cho một con mèo đang ngồi vênh váo, ám chỉ tệ nạn tham nhũng, áp bức của tầng lớp cai trị."
};

export const HICH_TUONG_SI_ARTIFACT_ID = "cuon_hich_tuong_si";
export const HICH_TUONG_SI_ARTIFACT: Artifact = {
  id: HICH_TUONG_SI_ARTIFACT_ID,
  name: "Cuộn Hịch tướng sĩ",
  imageUrl: ImageUrls.HICH_TUONG_SI_SCROLL_URL,
  description: "Lời hịch vang dội non sông của Hưng Đạo Vương Trần Quốc Tuấn.",
  detailedDescription: "Hịch tướng sĩ là bài hịch do Trần Hưng Đạo soạn vào khoảng trước cuộc kháng chiến chống Mông-Nguyên lần thứ hai (1285). Bài hịch khích lệ lòng yêu nước, căm thù giặc của các tướng sĩ, kêu gọi họ học tập binh thư, rèn luyện võ nghệ để sẵn sàng chiến đấu bảo vệ Tổ quốc. Đây là một áng văn chính luận bất hủ, thể hiện lòng yêu nước nồng nàn và tư tưởng quân sự tiến bộ của Trần Hưng Đạo."
};

export const MU_TRU_NHA_TRAN_ARTIFACT_ID = "mu-tru-nha-tran";
export const MU_TRU_NHA_TRAN_ARTIFACT: Artifact = {
    id: MU_TRU_NHA_TRAN_ARTIFACT_ID,
    name: "Mũ trụ quân đội nhà Trần",
    imageUrl: ImageUrls.MU_TRU_NHA_TRAN_URL,
    description: "Một chiếc mũ trụ vững chắc, biểu tượng cho sức mạnh và kỷ luật của quân đội nhà Trần.",
    detailedDescription: "Dưới thời nhà Trần, quân đội được tổ chức chặt chẽ và trang bị tốt, là yếu tố then chốt làm nên ba lần chiến thắng quân xâm lược Mông-Nguyên. Chiếc mũ trụ này là một phần quan trọng trong bộ giáp của người lính, không chỉ bảo vệ họ trên chiến trường mà còn thể hiện sự uy nghiêm và tinh thần quyết chiến quyết thắng của quân đội Đại Việt.",
};

export const AO_BAO_TAY_SON_ARTIFACT_ID = "ao-bao-tay-son";
export const AO_BAO_TAY_SON_ARTIFACT: Artifact = {
    id: AO_BAO_TAY_SON_ARTIFACT_ID,
    name: "Áo bào của Nghĩa quân Tây Sơn",
    imageUrl: ImageUrls.AO_BAO_TAY_SON_URL,
    description: "Chiếc áo bào nhuốm màu khói lửa, chứng nhân cho cuộc hành quân thần tốc của vua Quang Trung.",
    detailedDescription: "Chiếc áo bào này là biểu tượng cho tinh thần 'áo vải cờ đào' của nghĩa quân Tây Sơn. Nó đã cùng vua Quang Trung và các tướng sĩ trải qua cuộc hành quân thần tốc từ Phú Xuân ra Thăng Long, đánh tan 29 vạn quân Thanh, viết nên một trong những trang sử chống ngoại xâm hào hùng nhất của dân tộc.",
};

export const DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID = "dong-tien-quang-trung";
export const DONG_TIEN_QUANG_TRUNG_ARTIFACT: Artifact = {
    id: DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID,
    name: "Đồng tiền Quang Trung Thông Bảo",
    imageUrl: ImageUrls.ARTIFACT_QUANG_TRUNG_COIN_MINTED_URL,
    description: "Đồng tiền được đúc tại xưởng, biểu tượng cho quyền lực và sự thống nhất của triều Tây Sơn.",
    detailedDescription: "Đồng 'Quang Trung Thông Bảo' được đúc bằng đồng, là một phần quan trọng trong nỗ lực cải cách kinh tế, tiền tệ của vua Quang Trung. Việc thống nhất hệ thống tiền tệ đã góp phần ổn định xã hội, thúc đẩy giao thương, khẳng định chủ quyền của một quốc gia độc lập, hùng mạnh.",
};


export const ALL_ARTIFACTS_MAP: Record<string, Artifact> = {
  [BRONZE_DRUM_ARTIFACT_ID]: BRONZE_DRUM_ARTIFACT,
  [NHA_SAN_ARTIFACT_ID]: NHA_SAN_ARTIFACT,
  [TRUNG_NU_VUONG_SEAL_ARTIFACT_ID]: TRUNG_NU_VUONG_SEAL_ARTIFACT,
  [GIAO_DONG_DONG_SON_ARTIFACT_ID]: GIAO_DONG_DONG_SON_ARTIFACT,
  [GOLDEN_TURTLE_MODEL_ARTIFACT_ID]: GOLDEN_TURTLE_MODEL_ARTIFACT,
  [LY_DYNASTY_COIN_ARTIFACT_ID]: LY_DYNASTY_COIN_ARTIFACT,
  [BUT_LONG_NGHIEN_MUC_ARTIFACT_ID]: BUT_LONG_NGHIEN_MUC_ARTIFACT,
  [NO_THAN_ARTIFACT_ID]: NO_THAN_ARTIFACT,
  [CHIEU_DOI_DO_ARTIFACT_ID]: CHIEU_DOI_DO_ARTIFACT,
  [TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID]: TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT,
  [DAN_NGUYET_ARTIFACT_ID]: DAN_NGUYET_ARTIFACT,
  [TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID]: TRANH_DAM_CUOI_CHUOT_ARTIFACT,
  [HICH_TUONG_SI_ARTIFACT_ID]: HICH_TUONG_SI_ARTIFACT,
  [MU_TRU_NHA_TRAN_ARTIFACT_ID]: MU_TRU_NHA_TRAN_ARTIFACT,
  [AO_BAO_TAY_SON_ARTIFACT_ID]: AO_BAO_TAY_SON_ARTIFACT,
  [DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID]: DONG_TIEN_QUANG_TRUNG_ARTIFACT,
};

// --- Memory Fragments ---
const BACH_DANG_STAKE_FRAGMENT_ID = 'fragment_bach_dang_stake';
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
  },
  [SEAL_FRAGMENT_HICH_ID]: {
    id: SEAL_FRAGMENT_HICH_ID,
    name: "Mảnh Ấn Tín của Trưng Nữ Vương",
    imageUrl: ImageUrls.RALLY_CALL_FRAGMENT_URL,
    description: "Một mảnh ấn tín cổ, mang trên mình khí phách của lời hiệu triệu năm xưa.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  },
  [SPEARHEAD_FRAGMENT_ID]: {
    id: SPEARHEAD_FRAGMENT_ID,
    name: "Mũi giáo đồng sắc bén",
    imageUrl: ImageUrls.SPEARHEAD_FRAGMENT_URL,
    description: "Một mũi giáo được rèn cẩn thận, sẵn sàng cho trận chiến.",
    belongsToArtifactId: GIAO_DONG_DONG_SON_ARTIFACT_ID,
  },
  [BACH_DANG_STAKE_FRAGMENT_ID]: {
    id: BACH_DANG_STAKE_FRAGMENT_ID,
    name: 'Mảnh Cọc gỗ Bạch Đằng',
    imageUrl: ImageUrls.BACH_DANG_STAKE_ICON_URL,
    description: 'Một mảnh cọc gỗ lim bịt sắt, vũ khí bí mật đã làm nên chiến thắng lịch sử trên sông Bạch Đằng.',
    belongsToArtifactId: GIAO_DONG_DONG_SON_ARTIFACT_ID, // Assign to an existing artifact for now
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

// --- Sandbox Backgrounds ---
export const ALL_SANDBOX_BACKGROUNDS_MAP: Record<string, SandboxBackground> = {
    'lang-que': {
        id: 'lang-que',
        name: 'Làng Quê Việt Nam',
        imageUrl: ImageUrls.SANDBOX_BG_DEFAULT_URL,
        unlockCondition: null, // Default unlocked
    },
    'bach-dang': {
        id: 'bach-dang',
        name: 'Chiến trường Bạch Đằng',
        imageUrl: ImageUrls.SANDBOX_BG_BACH_DANG_URL,
        unlockCondition: {
            type: 'complete_hoi',
            hoi_id: 'hoi_2_bat_khuat',
        },
    },
    'thang-long': {
        id: 'thang-long',
        name: 'Cung điện Thăng Long',
        imageUrl: ImageUrls.SANDBOX_BG_THANG_LONG_URL,
        unlockCondition: {
            type: 'complete_hoi',
            hoi_id: 'hoi_3_thoi_ky_vang_son',
        },
    },
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

// --- Rally Call Mission ---
export const MISSION_RALLY_CALL_HBT_ID = "mission_rally_call_hbt";
const MISSION_RALLY_CALL_HBT: RallyCallMissionData = {
    type: 'rallyCall',
    id: MISSION_RALLY_CALL_HBT_ID,
    title: "Lời Hiệu Triệu",
    rounds: [
      { prefix: "", options: ["Một xin rửa sạch nước thù,", "Hỡi đồng bào yêu dấu,", "Vì món nợ riêng của ta,"] },
      { prefix: "", options: ["Hai xin dựng lại nghiệp xưa họ Hùng.", "Hãy cùng nhau đứng lên!", "Hãy vùng lên vì vinh quang!"] },
      { prefix: "", options: ["Ba kêu oan ức lòng chồng,", "Quét sạch lũ giặc tham tàn,", "Giành lại những gì đã mất,"] },
      { prefix: "", options: ["Bốn xin vẻn vẹn sở công lênh này.", "Để non sông được thái bình.", "Để cái tên Trưng Nữ Vương được lưu danh!"] }
    ],
    reward: { type: 'fragment', id: SEAL_FRAGMENT_HICH_ID }
};

export const MISSION_HICH_TUONG_SI_ID = "mission_hich_tuong_si";
const MISSION_HICH_TUONG_SI: RallyCallMissionData = {
    type: 'rallyCall',
    id: MISSION_HICH_TUONG_SI_ID,
    title: "Soạn Hịch Tướng Sĩ",
    rounds: [
      { prefix: "Ta thường tới bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa; chỉ", options: ["căm tức chưa", "vui mừng vì", "buồn bã vì"] },
      { prefix: "xả thịt lột da, nuốt gan uống máu", options: ["quân thù.", "đồng bào.", "kẻ yếu."] },
      { prefix: "Dẫu cho trăm thân này phơi ngoài nội cỏ, nghìn xác này gói trong", options: ["da ngựa,", "gấm vóc,", "chiếu hoa,"] },
      { prefix: "ta cũng vui lòng.", options: ["Các ngươi có muốn như vậy không?", "Đó là điều ta mong muốn.", "Các ngươi nên biết điều đó."] }
    ],
    reward: { type: 'artifact', id: HICH_TUONG_SI_ARTIFACT_ID }
};

// --- Forging Mission ---
export const MISSION_FORGING_ID = "mission_forging_game";
const MISSION_FORGING_GAME: ForgingMissionData = {
    type: 'forging',
    id: MISSION_FORGING_ID,
    title: "Rèn vũ khí",
    targetProgress: 100,
    reward: { type: 'fragment', id: SPEARHEAD_FRAGMENT_ID },
};

// --- Timeline Mission ---
export const MISSION_HUNG_VUONG_TIMELINE_ID = "mission_hung_vuong_timeline";
const MISSION_HUNG_VUONG_TIMELINE: TimelineMissionData = {
  type: 'timeline',
  id: MISSION_HUNG_VUONG_TIMELINE_ID,
  title: "Dòng Thời Gian Hùng Vương",
  instructionText: "Kéo và thả các sự kiện vào đúng vị trí trên dòng thời gian để tái hiện lại lịch sử.",
  events: [
    { id: 'event1', text: 'Nhà nước Văn Lang ra đời', correctOrder: 1 },
    { id: 'event2', text: 'Sự tích Bánh Chưng, Bánh Dày', correctOrder: 2 },
    { id: 'event3', text: 'Thục Phán An Dương Vương nối ngôi', correctOrder: 3 },
  ],
  reward: { type: 'artifact', id: NHA_SAN_ARTIFACT_ID },
};

// --- AR Mission ---
export const MISSION_AR_GOLDEN_TURTLE_ID = "mission_ar_golden_turtle";
const MISSION_AR_GOLDEN_TURTLE: ARMissionData = {
    type: 'ar',
    id: MISSION_AR_GOLDEN_TURTLE_ID,
    title: "Cửa Sổ Thời Gian: Thần Kim Quy",
    markerPatternUrl: '/assets/ar/pattern-ar-crane.patt',
    modelUrl: '/assets/ar/golden_turtle.glb',
    reward: { type: 'artifact', id: GOLDEN_TURTLE_MODEL_ARTIFACT_ID },
};

// --- Hidden Object Mission ---
export const MISSION_HIDDEN_OBJECT_LY_MARKET_ID = 'mission_hidden_object_ly_market';
const MISSION_HIDDEN_OBJECT_LY_MARKET: HiddenObjectMissionData = {
    type: 'hiddenObject',
    id: MISSION_HIDDEN_OBJECT_LY_MARKET_ID,
    title: 'Phiên chợ thời Lý',
    backgroundImageUrl: ImageUrls.HIDDEN_OBJECT_BG_URL,
    objectsToFind: [
        { id: 'coin', name: 'Xâu tiền', iconUrl: ImageUrls.LY_DYNASTY_COIN_URL, coords: { x: 65, y: 70, width: 8, height: 12 } },
        { id: 'brush', name: 'Bút lông', iconUrl: ImageUrls.BUT_LONG_NGHIEN_MUC_URL, coords: { x: 20, y: 60, width: 10, height: 15 } },
        { id: 'pottery', name: 'Bình gốm', iconUrl: ImageUrls.TRADING_CERAMICS_ICON_URL, coords: { x: 80, y: 55, width: 10, height: 15 } },
    ],
    reward: { type: 'artifact', id: LY_DYNASTY_COIN_ARTIFACT_ID },
};

// --- Quiz Mission ---
export const MISSION_QUIZ_GENERAL_KNOWLEDGE_ID = 'mission_quiz_general_knowledge';
const MISSION_QUIZ_GENERAL_KNOWLEDGE: QuizMissionData = {
    type: 'quiz',
    id: MISSION_QUIZ_GENERAL_KNOWLEDGE_ID,
    title: 'Thử Tài Sử Học',
    questions: [
        { question: 'Vị vua nào đã dời đô từ Hoa Lư về thành Đại La (Thăng Long)?', options: ['Đinh Tiên Hoàng', 'Lê Đại Hành', 'Lý Thái Tổ', 'Trần Thái Tông'], correctAnswer: 'Lý Thái Tổ' },
        { question: 'Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?', options: ['Năm 40', 'Năm 938', 'Năm 1288', 'Năm 1789'], correctAnswer: 'Năm 40' },
        { question: 'Ai là người lãnh đạo cuộc kháng chiến chống quân Mông - Nguyên lần thứ hai?', options: ['Lý Thường Kiệt', 'Trần Hưng Đạo', 'Lê Lợi', 'Quang Trung'], correctAnswer: 'Trần Hưng Đạo' },
    ],
    reward: { type: 'artifact', id: BUT_LONG_NGHIEN_MUC_ARTIFACT_ID },
};

// --- Diplomacy Mission ---
export const MISSION_DIPLOMACY_LY_THAI_TO_ID = 'mission_diplomacy_ly_thai_to';
const MISSION_DIPLOMACY_LY_THAI_TO: DiplomacyMissionData = {
    type: 'diplomacy',
    id: MISSION_DIPLOMACY_LY_THAI_TO_ID,
    title: 'Đối Thoại: Chiếu Dời Đô',
    characterName: 'Vua Lý Thái Tổ',
    characterImageUrl: ImageUrls.LY_THAI_TO_AVATAR_URL,
    initialGoodwill: 50,
    targetGoodwill: 100,
    rounds: [
        { npc_dialogue: 'Trẫm thấy thành Đại La là nơi trung tâm trời đất, muôn vật phong phú tốt tươi. Các khanh nghĩ sao về việc dời đô về đây?', player_choices: [ { text: 'Tâu bệ hạ, đó là quyết định anh minh, hợp lòng trời, thuận ý dân.', points: 25 }, { text: 'Tâu, Hoa Lư tuy hiểm trở nhưng đã là kinh đô vững chắc...', points: -10 } ]},
        { npc_dialogue: 'Việc dời đô sẽ tốn kém, nhưng là vì cơ nghiệp lâu dài cho con cháu muôn đời. Trẫm tin dân chúng sẽ ủng hộ.', player_choices: [ { text: 'Thần hoàn toàn tin tưởng vào tầm nhìn của bệ hạ.', points: 25 }, { text: 'Thần e rằng dân chúng sẽ lầm than vì sưu cao thuế nặng.', points: -15 } ]},
    ],
    reward: { type: 'artifact', id: CHIEU_DOI_DO_ARTIFACT_ID },
};

// --- Crafting Mission (Gathers fragments for crafting) ---
export const MISSION_CRAFTING_FRAGMENTS_HBT_ID = 'mission_crafting_fragments_hbt';
const MISSION_CRAFTING_FRAGMENTS_HBT: TimelineMissionData = {
    type: 'timeline',
    id: MISSION_CRAFTING_FRAGMENTS_HBT_ID,
    title: 'Dấu Vết Khởi Nghĩa',
    instructionText: 'Sắp xếp các dấu mốc của cuộc khởi nghĩa để tìm lại các mảnh ký ức.',
    events: [
        { id: 'hbt_event1', text: 'Trưng Trắc dấy binh khởi nghĩa trả nợ nước, thù nhà.', correctOrder: 1 },
        { id: 'hbt_event2', text: 'Nghĩa quân chiếm thành Luy Lâu, lật đổ ách đô hộ.', correctOrder: 2 },
        { id: 'hbt_event3', text: 'Trưng Trắc lên ngôi, xưng là Trưng Nữ Vương.', correctOrder: 3 },
    ],
    // This mission grants a fragment instead of a full artifact
    reward: { type: 'fragment', id: SEAL_FRAGMENT_1_ID },
};

// --- Premium "What If" Mission ---
export const MISSION_WHAT_IF_QUANG_TRUNG_ID = 'mission_what_if_quang_trung';
const MISSION_WHAT_IF_QUANG_TRUNG: NarrativeMissionData = {
    type: 'narrative',
    id: MISSION_WHAT_IF_QUANG_TRUNG_ID,
    title: "Giả Sử Lịch Sử: Vận Mệnh Quang Trung",
    startNodeId: 'node_qt1',
    reward: { type: 'artifact', id: TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID },
    nodes: {
        'node_qt1': {
            id: 'node_qt1',
            title: 'Một Ngã Rẽ Bất Ngờ',
            text: 'Năm 1792, vua Quang Trung đột ngột lâm bệnh nặng. Các thái y đều bó tay. Giả sử, có một vị danh y từ phương xa đến, mang theo một phương thuốc lạ. Vua quyết định:',
            choices: [
                { text: 'Tin tưởng và dùng thử phương thuốc mới.', targetNodeId: 'node_qt2_survive' },
                { text: 'Không, chỉ tin vào thái y trong triều.', targetNodeId: 'node_qt2_historical' },
            ],
        },
        'node_qt2_survive': {
            id: 'node_qt2_survive',
            text: 'Phương thuốc có hiệu nghiệm! Vua Quang Trung qua khỏi và tiếp tục trị vì. Đại Việt dưới sự lãnh đạo của ông trở nên hùng cường, thống nhất và phát triển rực rỡ. Triều đại Tây Sơn kéo dài thêm nhiều thập kỷ, mở ra một trang sử mới huy hoàng cho dân tộc.',
            choices: [],
            isTerminal: true,
            isSuccessOutcome: true,
            grantsMissionReward: true,
        },
        'node_qt2_historical': {
            id: 'node_qt2_historical',
            text: 'Nhà vua đã đi theo đúng dòng chảy của lịch sử. Ngài qua đời vào ngày 29 tháng 7 năm Nhâm Tý (tức 16 tháng 9 năm 1792), để lại niềm tiếc thương vô hạn cho toàn dân tộc. Triều đại Tây Sơn dần suy yếu sau sự ra đi của ngài.',
            choices: [],
            isTerminal: true,
            isSuccessOutcome: false,
        }
    }
};

// --- Trading Mission ---
export const MISSION_TRADING_HOI_AN_ID = 'mission_trading_hoi_an';
const MISSION_TRADING_HOI_AN: TradingMissionData = {
    type: 'trading',
    id: MISSION_TRADING_HOI_AN_ID,
    title: 'Giao thương tại Hội An',
    initialCapital: 1000,
    targetCapital: 5000,
    daysLimit: 15,
    goods: [
        { id: 'silk', name: 'Tơ lụa', basePrice: 100, iconUrl: ImageUrls.TRADING_SILK_ICON_URL },
        { id: 'ceramics', name: 'Gốm sứ', basePrice: 50, iconUrl: ImageUrls.TRADING_CERAMICS_ICON_URL },
        { id: 'spices', name: 'Trầm hương', basePrice: 200, iconUrl: ImageUrls.TRADING_SPICES_ICON_URL },
    ],
    events: [
        { description: 'Thuyền buôn từ phương Tây cập bến, giá Tơ lụa tăng vọt!', priceModifier: { goodId: 'silk', multiplier: 1.8 } },
        { description: 'Mùa mưa bão làm hỏng Gốm sứ, giá giảm mạnh.', priceModifier: { goodId: 'ceramics', multiplier: 0.6 } },
        { description: 'Vua ban lệnh cấm Trầm hương, nguồn cung khan hiếm, giá tăng cao.', priceModifier: { goodId: 'spices', multiplier: 2.0 } },
    ],
    reward: { type: 'fragment', id: SEAL_FRAGMENT_2_ID },
};

// --- Rhythm Game Mission ---
export const MISSION_RHYTHM_HUE_COURT_ID = 'mission_rhythm_hue_court';
const MISSION_RHYTHM_HUE_COURT: RhythmMissionData = {
    type: 'rhythm',
    id: MISSION_RHYTHM_HUE_COURT_ID,
    title: 'Giai điệu Cung đình',
    songUrl: 'https://cdn.pixabay.com/download/audio/2022/10/05/audio_2c94bb1ac1.mp3',
    noteMap: [
        { time: 1000, lane: 1 }, { time: 1500, lane: 2 }, { time: 2000, lane: 3 }, { time: 2500, lane: 2 },
        { time: 3000, lane: 1 }, { time: 3250, lane: 3 }, { time: 3500, lane: 2 }, { time: 3750, lane: 1 },
        { time: 4500, lane: 3 }, { time: 4750, lane: 2 }, { time: 5000, lane: 1 }, { time: 5250, lane: 2 },
        { time: 5500, lane: 3 }, { time: 6000, lane: 1 },
    ],
    targetScore: 10,
    reward: { type: 'artifact', id: DAN_NGUYET_ARTIFACT_ID },
};

// --- Coloring Game Mission ---
export const MISSION_COLORING_DONG_HO_ID = 'mission_coloring_dong_ho';
const ROOSTER_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g id="rooster" stroke="black" stroke-width="1.5">
    <path id="tail_feather_3" d="M 30,100 C -20,160 30,190 70,120" fill="white" />
    <path id="tail_feather_2" d="M 45,100 C 10,150 50,180 80,115" fill="white" />
    <path id="tail_feather_1" d="M 60,100 C 40,140 70,170 90,110" fill="white" />
    <path id="body" d="M 60,100 C 90,50 160,50 175,100 C 160,150 90,160 70,120 L 60,100 Z" fill="white" />
    <path id="neck" d="M 145,55 C 150,30 170,30 175,50" fill="white" />
    <circle id="head" cx="170" cy="45" r="15" fill="white" />
    <path id="comb" d="M 165,30 C 160,20 170,20 175,30 L 170,35 Z" fill="white" />
    <path id="wattle" d="M 170,60 C 165,70 175,70 170,60" fill="white" />
    <polygon id="beak" points="185,45 195,50 185,55" fill="white" />
    <circle cx="172" cy="43" r="2.5" fill="black" stroke="none" />
  </g>
</svg>
`;
const MISSION_COLORING_DONG_HO: ColoringMissionData = {
    type: 'coloring',
    id: MISSION_COLORING_DONG_HO_ID,
    title: 'Vẽ Tranh Dân Gian',
    lineArtSVG: ROOSTER_SVG,
    colorPalette: ['#de4a3b', '#f4ac42', '#3a583a', '#000000'], // Red, Yellow, Green, Black
    solution: {
        'tail_feather_3': '#000000',
        'tail_feather_2': '#3a583a',
        'tail_feather_1': '#de4a3b',
        'body': '#f4ac42',
        'neck': '#f4ac42',
        'head': '#f4ac42',
        'comb': '#de4a3b',
        'wattle': '#de4a3b',
        'beak': '#f4ac42',
    },
    reward: { type: 'artifact', id: TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID },
};

// --- Quest Chain: Bach Dang ---
const MISSION_BACH_DANG_DO_THAM_ID = 'mission_bach_dang_do_tham';
const MISSION_BACH_DANG_CAM_COC_ID = 'mission_bach_dang_cam_coc';
const MISSION_BACH_DANG_CHUNG_KIEN_ID = 'mission_bach_dang_chung_kien';

const MISSION_BACH_DANG_DO_THAM: HiddenObjectMissionData = {
    type: 'hiddenObject',
    id: MISSION_BACH_DANG_DO_THAM_ID,
    title: 'Do thám địa hình',
    backgroundImageUrl: ImageUrls.SANDBOX_BG_BACH_DANG_URL,
    objectsToFind: [
        { id: 'bd_stake', name: 'Vị trí cắm cọc', iconUrl: ImageUrls.BACH_DANG_STAKE_ICON_URL, coords: { x: 55, y: 75, width: 15, height: 15 } },
        { id: 'bd_boat', name: 'Thuyền địch', iconUrl: ImageUrls.TRADING_SPICES_ICON_URL, coords: { x: 80, y: 30, width: 10, height: 10 } },
        { id: 'bd_tide', name: 'Dấu hiệu thủy triều', iconUrl: 'https://i.ibb.co/VMyXpgr/avatar-outfit-nhatbinh.png', coords: { x: 10, y: 85, width: 20, height: 8 } },
    ],
};

const MISSION_BACH_DANG_CAM_COC: TacticalMapMissionData = {
    type: 'tacticalMap',
    id: MISSION_BACH_DANG_CAM_COC_ID,
    title: 'Bố trí trận địa cọc',
    backgroundUrl: ImageUrls.SANDBOX_BG_BACH_DANG_URL,
    stakeImageUrl: ImageUrls.BACH_DANG_STAKE_ICON_URL,
    targetStakes: 10
};

const MISSION_BACH_DANG_CHUNG_KIEN: NarrativeMissionData = {
    type: 'narrative',
    id: MISSION_BACH_DANG_CHUNG_KIEN_ID,
    title: 'Chứng kiến Lịch sử',
    startNodeId: 'bd_victory',
    nodes: {
        'bd_victory': {
            id: 'bd_victory',
            title: 'Chiến Thắng Vang Dội',
            text: 'Nhờ kế sách cắm cọc gỗ của Ngô Quyền, quân ta đã nhử địch vào trận địa khi thủy triều lên. Khi nước rút, thuyền địch vỡ tan, quân Nam Hán đại bại. Chiến thắng Bạch Đằng năm 938 đã chấm dứt hơn 1000 năm Bắc thuộc, mở ra một kỷ nguyên độc lập tự chủ cho dân tộc.',
            choices: [],
            isTerminal: true,
            isSuccessOutcome: true,
            grantsMissionReward: true,
        }
    },
    reward: { type: 'fragment', id: BACH_DANG_STAKE_FRAGMENT_ID },
};

// --- Defense Mission ---
export const MISSION_DEFENSE_ID = 'mission_defense_thang_long';
const MISSION_DEFENSE_GAME: DefenseMissionData = {
    type: 'defense',
    id: MISSION_DEFENSE_ID,
    title: "Vườn không nhà trống",
    timeLimit: 60,
    reward: { type: 'artifact', id: MU_TRU_NHA_TRAN_ARTIFACT_ID },
    mapLayout: [
        ['village', 'village', 'empty', 'empty', 'empty', 'empty', 'empty', 'forest', 'forest', 'forest'],
        ['village', 'village', 'empty', 'road', 'road', 'road', 'road', 'road', 'forest', 'forest'],
        ['empty', 'empty', 'empty', 'road', 'empty', 'empty', 'empty', 'road', 'empty', 'empty'],
        ['empty', 'road', 'road', 'road', 'empty', 'road', 'road', 'road', 'empty', 'empty'],
        ['empty', 'road', 'empty', 'empty', 'empty', 'road', 'empty', 'empty', 'empty', 'village'],
        ['empty', 'road', 'empty', 'village', 'empty', 'road', 'empty', 'empty', 'empty', 'village'],
        ['empty', 'road', 'road', 'road', 'road', 'road', 'empty', 'empty', 'empty', 'empty'],
        ['forest', 'road', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        ['forest', 'forest', 'road', 'road', 'empty', 'village', 'village', 'empty', 'empty', 'empty'],
        ['forest', 'forest', 'forest', 'road', 'empty', 'village', 'village', 'empty', 'empty', 'empty'],
    ],
    initialItems: [
        { type: 'person', gridIndex: 2 },   // Top left
        { type: 'person', gridIndex: 11 },  // Top left
        { type: 'food', gridIndex: 53 },   // Middle
        { type: 'food', gridIndex: 95 },   // Bottom right
        { type: 'person', gridIndex: 96 },  // Bottom right
    ]
};

// --- Strategy Map Mission ---
export const MISSION_STRATEGY_MAP_NGOC_HOI_ID = 'mission_strategy_map_ngoc_hoi';
const MISSION_STRATEGY_MAP_NGOC_HOI: StrategyMapMissionData = {
    type: 'strategyMap',
    id: MISSION_STRATEGY_MAP_NGOC_HOI_ID,
    title: "Hành quân thần tốc",
    mapImageUrl: ImageUrls.STRATEGY_MAP_NGOC_HOI_URL,
    startPoint: { x: 50, y: 95 }, // Bottom center
    endPoint: { x: 50, y: 5 },   // Top center
    dangerZones: [
        { x: 30, y: 50, radius: 10 },
        { x: 70, y: 60, radius: 12 },
        { x: 50, y: 25, radius: 8 },
    ],
    reward: { type: 'artifact', id: AO_BAO_TAY_SON_ARTIFACT_ID },
};

// --- Coin Minting Mission ---
export const MISSION_COIN_MINTING_ID = 'mission_coin_minting_tay_son';
const MISSION_COIN_MINTING_TAY_SON: CoinMintingMissionData = {
    type: 'coinMinting',
    id: MISSION_COIN_MINTING_ID,
    title: "Xưởng Đúc Tiền Tây Sơn",
    reward: { type: 'artifact', id: DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID },
    tasks: [
        { id: 'qt_thong_bao', name: 'Quang Trung Thông Bảo', coinImageUrl: ImageUrls.ARTIFACT_QUANG_TRUNG_COIN_MINTED_URL, requiredMetalId: 'dong', requiredMoldId: 'khuon_quang_trung' },
    ],
    metalOptions: [
        { id: 'dong', name: 'Đồng', imageUrl: ImageUrls.METAL_COPPER_URL },
        { id: 'sat', name: 'Sắt', imageUrl: ImageUrls.METAL_IRON_URL },
    ],
    moldOptions: [
        { id: 'khuon_quang_trung', name: 'Khuôn Quang Trung', imageUrl: ImageUrls.MOLD_QUANG_TRUNG_URL },
        { id: 'khuon_ly', name: 'Khuôn Nhà Lý', imageUrl: ImageUrls.MOLD_LY_URL },
    ],
};


// --- ALL MISSIONS MAP ---
export const ALL_MISSIONS: Record<string, MissionData> = {
  [MISSION_BRONZE_DRUM_ID]: MISSION_BRONZE_DRUM_PUZZLE,
  [MISSION_RALLY_CALL_HBT_ID]: MISSION_RALLY_CALL_HBT,
  [MISSION_HICH_TUONG_SI_ID]: MISSION_HICH_TUONG_SI,
  [MISSION_FORGING_ID]: MISSION_FORGING_GAME,
  [MISSION_HUNG_VUONG_TIMELINE_ID]: MISSION_HUNG_VUONG_TIMELINE,
  [MISSION_AR_GOLDEN_TURTLE_ID]: MISSION_AR_GOLDEN_TURTLE,
  [MISSION_WHAT_IF_QUANG_TRUNG_ID]: MISSION_WHAT_IF_QUANG_TRUNG,
  [MISSION_CRAFTING_FRAGMENTS_HBT_ID]: MISSION_CRAFTING_FRAGMENTS_HBT,
  [MISSION_HIDDEN_OBJECT_LY_MARKET_ID]: MISSION_HIDDEN_OBJECT_LY_MARKET,
  [MISSION_QUIZ_GENERAL_KNOWLEDGE_ID]: MISSION_QUIZ_GENERAL_KNOWLEDGE,
  // [MISSION_CONSTRUCTION_CO_LOA_ID]: MISSION_CONSTRUCTION_CO_LOA, // Replaced by Quest Chain
  [MISSION_DIPLOMACY_LY_THAI_TO_ID]: MISSION_DIPLOMACY_LY_THAI_TO,
  [MISSION_TRADING_HOI_AN_ID]: MISSION_TRADING_HOI_AN,
  [MISSION_RHYTHM_HUE_COURT_ID]: MISSION_RHYTHM_HUE_COURT,
  [MISSION_COLORING_DONG_HO_ID]: MISSION_COLORING_DONG_HO,
  [MISSION_BACH_DANG_DO_THAM_ID]: MISSION_BACH_DANG_DO_THAM,
  [MISSION_BACH_DANG_CAM_COC_ID]: MISSION_BACH_DANG_CAM_COC,
  [MISSION_BACH_DANG_CHUNG_KIEN_ID]: MISSION_BACH_DANG_CHUNG_KIEN,
  [MISSION_DEFENSE_ID]: MISSION_DEFENSE_GAME,
  [MISSION_STRATEGY_MAP_NGOC_HOI_ID]: MISSION_STRATEGY_MAP_NGOC_HOI,
  [MISSION_COIN_MINTING_ID]: MISSION_COIN_MINTING_TAY_SON,
};

// --- Quest Chains ---
export const ALL_QUEST_CHAINS: Record<string, QuestChain> = {
  'bach-dang-chien': {
    id: 'bach-dang-chien',
    title: 'Chiến Dịch Bạch Đằng',
    description: 'Một chuỗi nhiệm vụ tái hiện lại trận Bạch Đằng lịch sử năm 938.',
    steps: [
      { id: 'step1_dotham', title: 'Do Thám Địa Hình', description: 'Tìm những vị trí chiến lược trên bản đồ.', missionId: MISSION_BACH_DANG_DO_THAM_ID, iconUrl: ImageUrls.BACH_DANG_DO_THAM_ICON_URL },
      { id: 'step2_camcoc', title: 'Cắm Cọc Gỗ', description: 'Bố trí bãi cọc để chặn đường lui của địch.', missionId: MISSION_BACH_DANG_CAM_COC_ID, iconUrl: ImageUrls.BACH_DANG_CAM_COC_ICON_URL },
      { id: 'step3_chungkien', title: 'Chứng Kiến Lịch Sử', description: 'Xem kết quả của trận đánh và nhận phần thưởng.', missionId: MISSION_BACH_DANG_CHUNG_KIEN_ID, iconUrl: ImageUrls.BACH_DANG_VICTORY_ICON_URL },
    ]
  }
};


// --- Hoi Data (Chapters) ---

// Hồi 1
const MISSION_INFO_BRONZE_DRUM: MissionInfo = { id: 'card_1_1', title: 'Phục dựng Trống đồng', imageUrl: ImageUrls.SAGA_KHAI_QUOC_URL, description: "Ghép các mảnh vỡ để phục hồi lại Trống đồng Đông Sơn.", missionId: MISSION_BRONZE_DRUM_ID };
const MISSION_INFO_HUNG_VUONG: MissionInfo = { id: 'card_1_2', title: 'Dòng Thời Gian Hùng Vương', imageUrl: ImageUrls.SAGA_HUNG_VUONG_URL, description: "Sắp xếp các sự kiện đúng thứ tự trong thời đại các vua Hùng.", missionId: MISSION_HUNG_VUONG_TIMELINE_ID };
const HOI_1_DUNG_NUOC: Hoi = {
  id: 'hoi_1_dung_nuoc',
  title: "Hồi 1: Buổi đầu Dựng nước",
  description: "Khám phá thời kỳ sơ khai của lịch sử Việt Nam qua các câu chuyện và di vật của nền văn hóa Đông Sơn và thời đại Hùng Vương.",
  missions: [MISSION_INFO_BRONZE_DRUM, MISSION_INFO_HUNG_VUONG],
};

// Hồi 2
const MISSION_INFO_RALLY_CALL: MissionInfo = { id: 'card_2_1', title: 'Lời Hiệu Triệu', imageUrl: ImageUrls.SAGA_BAT_KHUAT_URL, description: "Soạn một bài hịch đanh thép để kêu gọi lòng dân cùng Hai Bà Trưng.", missionId: MISSION_RALLY_CALL_HBT_ID };
const MISSION_INFO_FORGING: MissionInfo = { id: 'card_2_2', title: 'Rèn vũ khí', imageUrl: ImageUrls.SAGA_FORGING_URL, description: 'Rèn những mũi giáo sắc bén để trang bị cho nghĩa quân.', missionId: MISSION_FORGING_ID, dependsOnMissionId: MISSION_RALLY_CALL_HBT_ID };
const MISSION_INFO_BACH_DANG_CHAIN: MissionInfo = { id: 'card_2_3', title: 'Chiến Dịch Bạch Đằng', imageUrl: ImageUrls.BACH_DANG_DO_THAM_ICON_URL, description: 'Chỉ huy trận đánh lịch sử, đánh tan quân Nam Hán.', missionId: 'quest_chain_bach_dang', questChainId: 'bach-dang-chien', isOptionalForProgression: true };
const HOI_2_BAT_KHUAT: Hoi = {
  id: 'hoi_2_bat_khuat',
  title: "Hồi 2: Nghìn Năm Bất Khuất",
  description: "Sống lại những khoảnh khắc hào hùng của dân tộc trong các cuộc đấu tranh chống ngoại xâm đầu tiên, từ An Dương Vương đến Hai Bà Trưng.",
  missions: [MISSION_INFO_RALLY_CALL, MISSION_INFO_FORGING, MISSION_INFO_BACH_DANG_CHAIN],
};

// Hồi 3
const MISSION_INFO_HICH_TUONG_SI: MissionInfo = { id: 'card_3_0', title: 'Soạn Hịch Tướng Sĩ', imageUrl: ImageUrls.SAGA_HICH_TUONG_SI_URL, description: 'Hoàn thành lời hịch vang dội non sông của Trần Hưng Đạo.', missionId: MISSION_HICH_TUONG_SI_ID };
const MISSION_INFO_VUON_KHONG_NHA_TRONG: MissionInfo = { id: 'card_3_1', title: 'Vườn không nhà trống', imageUrl: ImageUrls.SAGA_VUON_KHONG_NHA_TRONG_URL, description: 'Thực hiện kế sách di tản người và của để chống giặc.', missionId: MISSION_DEFENSE_ID, dependsOnMissionId: MISSION_HICH_TUONG_SI_ID };
const MISSION_INFO_HIDDEN_OBJECT: MissionInfo = { id: 'card_3_2', title: 'Phiên chợ thời Lý', imageUrl: ImageUrls.SAGA_LY_MARKET_URL, description: "Tìm các vật phẩm quan trọng trong một phiên chợ sầm uất thời nhà Lý.", missionId: MISSION_HIDDEN_OBJECT_LY_MARKET_ID, dependsOnMissionId: MISSION_DEFENSE_ID };
const MISSION_INFO_DIPLOMACY: MissionInfo = { id: 'card_3_3', title: 'Đối Thoại Lịch Sử', imageUrl: ImageUrls.SAGA_DIPLOMACY_URL, description: "Thuyết phục vua Lý Thái Tổ về quyết định dời đô.", missionId: MISSION_DIPLOMACY_LY_THAI_TO_ID, dependsOnMissionId: MISSION_HIDDEN_OBJECT_LY_MARKET_ID};
const MISSION_INFO_AR_TURTLE: MissionInfo = { id: 'card_3_4', title: 'Cửa Sổ Thời Gian', imageUrl: ImageUrls.SAGA_AR_URL, description: "Dùng công nghệ AR để chứng kiến sự kiện lịch sử ngay trước mắt.", missionId: MISSION_AR_GOLDEN_TURTLE_ID, isOptionalForProgression: true };
const HOI_3_KY_NGUYEN_DAI_VIET: Hoi = {
  id: 'hoi_3_thoi_ky_vang_son',
  title: "Hồi 3: Kỷ Nguyên Đại Việt",
  description: "Trải nghiệm sự thịnh vượng của Đại Việt dưới các triều đại Lý, Trần qua các hoạt động kinh tế, văn hóa và các quyết sách lớn.",
  missions: [MISSION_INFO_HICH_TUONG_SI, MISSION_INFO_VUON_KHONG_NHA_TRONG, MISSION_INFO_HIDDEN_OBJECT, MISSION_INFO_DIPLOMACY, MISSION_INFO_AR_TURTLE],
};

// Hồi 4
const MISSION_INFO_HANH_QUAN_THAN_TOC: MissionInfo = { id: 'card_4_0', title: 'Hành quân thần tốc', imageUrl: ImageUrls.SAGA_HANH_QUAN_THAN_TOC_URL, description: 'Vạch ra đường hành quân tối ưu để làm nên chiến thắng Ngọc Hồi - Đống Đa.', missionId: MISSION_STRATEGY_MAP_NGOC_HOI_ID };
const MISSION_INFO_DUC_TIEN: MissionInfo = { id: 'card_4_1', title: 'Xưởng Đúc Tiền', imageUrl: ImageUrls.SAGA_COIN_MINTING_URL, description: 'Chọn đúng kim loại và khuôn để đúc tiền cho triều đại mới.', missionId: MISSION_COIN_MINTING_ID, dependsOnMissionId: MISSION_STRATEGY_MAP_NGOC_HOI_ID };
const MISSION_INFO_WHAT_IF_QUANG_TRUNG: MissionInfo = { id: 'card_4_2', title: 'Giả Sử: Vận Mệnh Quang Trung', imageUrl: ImageUrls.SAGA_WHAT_IF_URL, description: 'Nếu vua Quang Trung không mất sớm, lịch sử sẽ ra sao?', missionId: MISSION_WHAT_IF_QUANG_TRUNG_ID, isPremium: true, dependsOnMissionId: MISSION_COIN_MINTING_ID };
const HOI_4_BAO_TAP_PHAN_TRANH: Hoi = {
  id: 'hoi_4_bao_tap_phan_tranh',
  title: "Hồi 4: Bão Táp Phân Tranh",
  description: "Chứng kiến những thay đổi lớn lao của đất nước, đỉnh cao là phong trào Tây Sơn và cuộc hành quân thần tốc của Hoàng đế Quang Trung.",
  missions: [MISSION_INFO_HANH_QUAN_THAN_TOC, MISSION_INFO_DUC_TIEN, MISSION_INFO_WHAT_IF_QUANG_TRUNG],
};

// Hồi 5
const MISSION_INFO_QUIZ: MissionInfo = { id: 'card_5_1', title: 'Thử Tài Sử Học', imageUrl: ImageUrls.SAGA_QUIZ_URL, description: 'Kiểm tra kiến thức của bạn về các triều đại phong kiến Việt Nam.', missionId: MISSION_QUIZ_GENERAL_KNOWLEDGE_ID };
const MISSION_INFO_TRADING: MissionInfo = { id: 'card_5_2', title: 'Thương Cảng Hội An', imageUrl: ImageUrls.SAGA_HOI_AN_TRADING_URL, description: 'Trở thành một thương nhân, mua bán và làm giàu tại cảng Hội An.', missionId: MISSION_TRADING_HOI_AN_ID, dependsOnMissionId: MISSION_QUIZ_GENERAL_KNOWLEDGE_ID };
const HOI_5_GIAO_THOI: Hoi = {
  id: 'hoi_5_giao_thoi',
  title: "Hồi 5: Giao Thời và Hội Nhập",
  description: "Chứng kiến sự hội nhập với thế giới và những bước ngoặt lịch sử ở giai đoạn cuối các triều đại phong kiến.",
  missions: [MISSION_INFO_QUIZ, MISSION_INFO_TRADING],
};

// Hồi 6
const MISSION_INFO_COLORING_DONG_HO: MissionInfo = { id: 'card_6_1', title: 'Vẽ Tranh Dân Gian', imageUrl: ImageUrls.SAGA_COLORING_URL, description: 'Tô màu cho bức tranh Gà Trống theo đúng phong cách tranh Đông Hồ.', missionId: MISSION_COLORING_DONG_HO_ID };
const MISSION_INFO_RHYTHM_GAME: MissionInfo = { id: 'card_6_2', title: 'Giai điệu Cung đình', imageUrl: ImageUrls.SAGA_RHYTHM_GAME_URL, description: 'Cảm nhận Nhã nhạc cung đình Huế qua một thử thách âm nhạc.', missionId: MISSION_RHYTHM_HUE_COURT_ID, dependsOnMissionId: MISSION_COLORING_DONG_HO_ID };
const HOI_6_BAN_SAC_VAN_HOA: Hoi = {
  id: 'hoi_6_ban_sac_van_hoa',
  title: "Hồi 6: Bản Sắc Văn Hóa",
  description: "Tái hiện lại nét đẹp văn hóa dân gian qua các tác phẩm nghệ thuật truyền thống, khẳng định bản sắc dân tộc.",
  missions: [MISSION_INFO_COLORING_DONG_HO, MISSION_INFO_RHYTHM_GAME],
};


export const HOI_DATA: Hoi[] = [
  HOI_1_DUNG_NUOC,
  HOI_2_BAT_KHUAT,
  HOI_3_KY_NGUYEN_DAI_VIET,
  HOI_4_BAO_TAP_PHAN_TRANH,
  HOI_5_GIAO_THOI,
  HOI_6_BAN_SAC_VAN_HOA,
];


// --- AI Characters ---
export const AI_CHARACTERS: Record<string, AiCharacter> = {
  'quang-trung': {
    id: 'quang-trung',
    name: 'Vua Quang Trung',
    systemInstruction: 'Bạn là vua Quang Trung Nguyễn Huệ, một vị hoàng đế anh minh, một nhà quân sự thiên tài với ý chí sắt đá, đã dẫn dắt cuộc khởi nghĩa Tây Sơn đi đến thắng lợi, thống nhất đất nước. Lời nói của bạn đanh thép, hùng hồn, quyết đoán và luôn thể hiện ý chí xây dựng một quốc gia Đại Việt hùng mạnh. Bạn không biết về các sự kiện sau năm 1792.',
    avatarUrl: ImageUrls.QUANG_TRUNG_AVATAR_URL,
    unlockHoiId: 'hoi_4_bao_tap_phan_tranh', // Unlocked after completing Hoi 4
    unlockMessage: 'Hoàn thành Hồi 4: Bão Táp Phân Tranh để chiêu mộ Vua Quang Trung!',
  },
  'hai-ba-trung': {
    id: 'hai-ba-trung',
    name: 'Hai Bà Trưng',
    systemInstruction: 'Bạn là Trưng Trắc, vị Nữ vương đầu tiên trong lịch sử Việt Nam. Bạn cùng em gái Trưng Nhị đã lãnh đạo cuộc khởi nghĩa lật đổ ách đô hộ của nhà Đông Hán. Lời nói của bạn thể hiện sự uy nghi, dũng cảm, lòng yêu nước và ý chí độc lập mãnh liệt. Bạn không biết các sự kiện sau năm 43 SCN.',
    avatarUrl: ImageUrls.HAI_BA_TRUNG_AVATAR_URL,
    unlockHoiId: 'hoi_2_bat_khuat',
    unlockMessage: 'Hoàn thành Hồi 2: Ý Chí Bất Khuất để chiêu mộ Hai Bà Trưng!',
  },
  'ly-thai-to': {
    id: 'ly-thai-to',
    name: 'Vua Lý Thái Tổ',
    systemInstruction: 'Bạn là vua Lý Thái Tổ, người sáng lập ra triều Lý và có công dời đô từ Hoa Lư về Thăng Long. Bạn là một vị vua có tầm nhìn xa trông rộng, luôn lo cho dân cho nước. Lời nói của bạn ôn hòa, uyên bác nhưng đầy quyết đoán, thể hiện mong muốn xây dựng một đất nước thái bình, thịnh vượng. Bạn không biết các sự kiện sau năm 1028.',
    avatarUrl: ImageUrls.LY_THAI_TO_AVATAR_URL,
    unlockHoiId: null, // Unlocked by default
    unlockMessage: '',
  }
};


// --- Tutorial Data ---
export const TUTORIAL_DATA: Record<string, Tutorial> = {
  'main-interface-intro': {
    id: 'main-interface-intro',
    steps: [
      {
        title: 'Chào mừng đến Bảo tàng!',
        text: 'Đây là giao diện chính. Hãy cùng khám phá các chức năng nhé!',
        position: 'center',
      },
      {
        elementSelector: '#main-journey-section',
        title: 'Hành Trình Xuyên Thời Gian',
        text: 'Đây là các Hồi (chương) lịch sử. Hãy hoàn thành các nhiệm vụ trong mỗi Hồi để mở khóa Hồi tiếp theo.',
        position: 'top',
      },
      {
        elementSelector: '#main-collection-section',
        title: 'Bộ Sưu Tập Cổ Vật',
        text: 'Những cổ vật bạn thu thập được sẽ được trưng bày tại đây. Nhấn vào để xem chi tiết.',
        position: 'bottom',
      },
      {
        elementSelector: '#main-chatbot-button',
        title: 'Hỏi Đáp Lịch Sử',
        text: 'Nhấn vào đây để trò chuyện với các nhân vật lịch sử và hỏi họ bất cứ điều gì bạn tò mò!',
        position: 'left'
      },
      {
        elementSelector: '#main-leaderboard-button',
        title: 'Bảng Xếp Hạng',
        text: 'Xem thứ hạng của bạn so với các Nhà Sử Học khác tại đây!',
        position: 'left'
      }
    ]
  }
};

// --- Instruction Data ---
export const INSTRUCTION_DATA: Record<string, { title: string, text: string }> = {
    'puzzle': {
        title: 'Hướng dẫn: Ghép hình',
        text: 'Kéo các mảnh ghép từ dưới vào đúng vị trí trên khung để phục dựng lại hình ảnh cổ vật. Khi tất cả các mảnh được đặt đúng, bạn sẽ hoàn thành nhiệm vụ.'
    },
    'narrative': {
        title: 'Hướng dẫn: Nhiệm vụ Tường thuật',
        text: 'Đọc kỹ các tình huống lịch sử và đưa ra lựa chọn của bạn. Mỗi quyết định sẽ dẫn đến một kết quả khác nhau. Hãy lựa chọn một cách khôn ngoan!'
    },
    'timeline': {
        title: 'Hướng dẫn: Dòng thời gian',
        text: 'Kéo các thẻ sự kiện từ dưới và thả vào các ô trên dòng thời gian theo đúng thứ tự lịch sử. Sắp xếp đúng tất cả các sự kiện để chiến thắng.'
    },
    'ar': {
        title: 'Hướng dẫn: Thực tế Tăng cường (AR)',
        text: 'Hướng camera của bạn vào tấm thẻ marker được cung cấp (in ra hoặc hiển thị trên màn hình khác). Một mô hình 3D của cổ vật sẽ hiện ra! Nhấn "Quay về & Nhận Thưởng" để hoàn thành.'
    },
    'hiddenObject': {
        title: 'Hướng dẫn: Tìm vật phẩm',
        text: 'Tìm kiếm và nhấn vào các vật phẩm được liệt kê ở danh sách bên dưới trong bức tranh. Tìm đủ tất cả các vật phẩm để hoàn thành nhiệm vụ.'
    },
    'quiz': {
        title: 'Hướng dẫn: Trắc nghiệm Lịch sử',
        text: 'Trả lời các câu hỏi trắc nghiệm để kiểm tra kiến thức của bạn. Chọn câu trả lời bạn cho là đúng nhất.'
    },
    'construction': {
        title: 'Hướng dẫn: Xây dựng',
        text: 'Đầu tiên, thu thập đủ tài nguyên cần thiết. Sau đó, dùng tài nguyên để xây dựng các công trình theo yêu cầu trên bản đồ. Hoàn thành mục tiêu xây dựng để chiến thắng.'
    },
    'diplomacy': {
        title: 'Hướng dẫn: Đối thoại Ngoại giao',
        text: 'Lựa chọn các câu trả lời để tăng thanh "Thiện chí" với nhân vật lịch sử. Đạt được mục tiêu thiện chí để giành chiến thắng. Lựa chọn sai có thể làm giảm thiện chí!'
    },
    'trading': {
        title: 'Hướng dẫn: Giao thương',
        text: 'Sử dụng vốn ban đầu để mua và bán các mặt hàng trên thị trường. Tận dụng các sự kiện để kiếm lời. Đạt được mục tiêu vốn trước khi hết thời gian để chiến thắng.'
    },
    'rhythm': {
        title: 'Hướng dẫn: Giai điệu Cung đình',
        text: 'Nhấn các nút (A, S, D) tương ứng với các nốt nhạc khi chúng đi qua vạch kẻ. Càng chính xác, điểm càng cao. Đạt được điểm mục tiêu để hoàn thành.'
    },
    'coloring': {
        title: 'Hướng dẫn: Vẽ Tranh Dân Gian',
        text: 'Chọn một màu từ bảng màu bên dưới, sau đó nhấn vào một vùng trên bức tranh để tô màu. Hãy tô đúng tất cả các vùng theo màu sắc truyền thống để hoàn thành tác phẩm!'
    },
    'rallyCall': {
        title: 'Hướng dẫn: Lời Hiệu Triệu',
        text: 'Chọn những câu từ hào hùng nhất để soạn nên một bài hịch hoàn chỉnh, kêu gọi lòng dân. Mỗi lựa chọn sẽ góp phần tạo nên một áng văn bất hủ.'
    },
    'forging': {
        title: 'Hướng dẫn: Rèn Vũ Khí',
        text: 'Nhấn chuột hoặc phím cách khi thanh đánh dấu di chuyển vào vùng hoàn hảo để đạt được tiến độ cao nhất. Lấp đầy thanh tiến trình để rèn thành công vũ khí.'
    },
    'tacticalMap': {
        title: 'Hướng dẫn: Bố Trí Trận Địa',
        text: 'Nhấn vào các vị trí trên bản đồ để đóng cọc gỗ. Hoàn thành mục tiêu số lượng cọc để chuẩn bị cho trận thủy chiến quyết định.'
    },
    'defense': {
        title: 'Hướng dẫn: Vườn không nhà trống',
        text: 'Kéo và thả người dân và xe lương thực từ các làng mạc vào khu vực rừng rậm an toàn trước khi hết giờ. Bảo vệ tất cả mọi người và tài sản để chiến thắng!'
    },
    'strategyMap': {
        title: 'Hướng dẫn: Hành quân thần tốc',
        text: 'Vẽ một đường hành quân từ điểm xuất phát (màu xanh) tới điểm kết thúc (màu đỏ). Tránh các vùng nguy hiểm của địch. Nhấn "Bắt đầu Hành quân" để kiểm tra lộ trình.'
    },
    'coinMinting': {
        title: 'Hướng dẫn: Đúc tiền',
        text: 'Chọn đúng loại kim loại và khuôn đúc tương ứng với đồng tiền được yêu cầu. Sau đó nhấn "Tiến hành Đúc" để tạo ra cổ vật lịch sử!'
    }
};

// --- Achievements Data ---
export const ALL_ACHIEVEMENTS_MAP: Record<string, Achievement> = {
  'nha-khao-co': {
    id: 'nha-khao-co',
    name: 'Nhà Khảo Cổ',
    description: 'Thu thập 10 cổ vật khác nhau.',
    iconUrl: ImageUrls.ACHIEVEMENT_ARCHAEOLOGIST_URL,
    condition: (gs: SavedGameState) => (gs.collectedArtifactIds?.length || 0) >= 10,
  },
  'nghe-nhan-tai-hoa': {
    id: 'nghe-nhan-tai-hoa',
    name: 'Nghệ Nhân Tài Hoa',
    description: 'Hoàn thành nhiệm vụ Vẽ Tranh Dân Gian và Giai điệu Cung đình.',
    iconUrl: ImageUrls.ACHIEVEMENT_ARTIST_URL,
    condition: (gs: SavedGameState) => 
      (gs.collectedArtifactIds?.includes(TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID) && 
       gs.collectedArtifactIds?.includes(DAN_NGUYET_ARTIFACT_ID)),
  },
  'su-gia-thong-thai': {
    id: 'su-gia-thong-thai',
    name: 'Sử Gia Thông Thái',
    description: 'Chiêu mộ tất cả các nhân vật lịch sử AI.',
    iconUrl: ImageUrls.ACHIEVEMENT_HISTORIAN_URL,
    condition: (gs: SavedGameState) => (gs.unlockedCharacterIds?.length || 0) >= Object.keys(AI_CHARACTERS).length,
  },
};
