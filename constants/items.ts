
// constants/items.ts
import { Artifact, Decoration, HeroCard, MemoryFragment, CustomizationItem } from '../types';
import * as ImageUrls from '../imageUrls';

// --- ARTIFACT IDs ---
export const BRONZE_DRUM_ARTIFACT_ID = "bronze_drum_dong_son";
export const NHA_SAN_ARTIFACT_ID = "nha_san_hung_vuong";
export const TRUNG_NU_VUONG_SEAL_ARTIFACT_ID = "trung_nu_vuong_seal";
export const GIAO_DONG_DONG_SON_ARTIFACT_ID = "giao_dong_dong_son";
export const GOLDEN_TURTLE_MODEL_ARTIFACT_ID = "golden_turtle_model_ar";
export const LY_DYNASTY_COIN_ARTIFACT_ID = "ly_dynasty_coin";
export const BUT_LONG_NGHIEN_MUC_ARTIFACT_ID = "but_long_nghien_muc";
export const NO_THAN_ARTIFACT_ID = "no_than_lien_chau";
export const CHIEU_DOI_DO_ARTIFACT_ID = "chieu_doi_do";
export const TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID = "tien_quang_trung";
export const DAN_NGUYET_ARTIFACT_ID = "dan_nguyet";
export const TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID = "tranh_dam_cuoi_chuot";
export const HICH_TUONG_SI_ARTIFACT_ID = "cuon_hich_tuong_si";
export const MU_TRU_NHA_TRAN_ARTIFACT_ID = "mu-tru-nha-tran";
export const AO_BAO_TAY_SON_ARTIFACT_ID = "ao-bao-tay-son";
export const DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID = "dong-tien-quang-trung";
export const MO_HINH_CUU_DINH_ARTIFACT_ID = "mo_hinh_cuu_dinh";
export const GIA_DINH_BAO_ARTIFACT_ID = "ban-in-bao-gia-dinh";
export const VALI_DONG_DU_ARTIFACT_ID = "vali-dong-du";
export const TRUONG_SON_COMPASS_ARTIFACT_ID = 'truong_son_compass_artifact';
export const DIEN_DAI_TRINH_SAT_ARTIFACT_ID = 'dien_dai_trinh_sat_artifact';
export const BA_TRIEU_CLOGS_ARTIFACT_ID = "ba_trieu_ivory_clogs";
export const BA_TRIEU_PHOENIX_HAIRPIN_ARTIFACT_ID = "ba_trieu_phoenix_hairpin";
export const MO_HINH_CHUA_VAN_XUAN_ARTIFACT_ID = 'mo-hinh-chua-van-xuan';
export const COC_GO_BACH_DANG_ARTIFACT_ID = "coc-go-bach-dang";
export const GOLDEN_SHEAF_ARTIFACT_ID = 'golden_sheaf';

// --- FRAGMENT IDs ---
export const SEAL_FRAGMENT_SWORD_ID = 'seal_fragment_sword';
export const SEAL_FRAGMENT_ELEPHANT_ID = 'seal_fragment_elephant';
export const SEAL_FRAGMENT_FLAG_ID = 'seal_fragment_flag';
export const SEAL_FRAGMENT_HICH_ID = 'seal_fragment_hich';
export const SPEARHEAD_FRAGMENT_ID = 'spearhead_fragment_dong_son';
export const BACH_DANG_STAKE_FRAGMENT_ID = 'fragment_bach_dang_stake';

// --- HERO CARD IDs ---
export const HERO_CARD_TRUNG_TRAC_ID = "hero_card_trung_sisters";

// --- DECORATION IDs ---
export const GOLDEN_THRONE_DECORATION_ID = 'decoration_golden_throne';
export const PONTOON_BRIDGE_MODEL_ID = 'decoration_pontoon_bridge';

// --- CUSTOMIZATION ITEM IDs ---
export const OUTFIT_DEFAULT_ID = 'default_outfit';
export const OUTFIT_NHAT_BINH_ID = 'nhat_binh_outfit';
export const HAT_NON_LA_ID = 'non_la_hat';


// --- Artifact Definitions ---
export const ALL_ARTIFACTS_MAP: Record<string, Artifact> = {
  [BRONZE_DRUM_ARTIFACT_ID]: {
    id: BRONZE_DRUM_ARTIFACT_ID,
    name: "Trống đồng Đông Sơn",
    imageUrl: ImageUrls.TRONG_DONG_URL,
    description: "Một biểu tượng văn hóa của người Việt cổ.",
    detailedDescription: "Trống đồng Đông Sơn là một biểu tượng rực rỡ của nền văn hóa Đông Sơn và văn minh người Việt cổ. Nó không chỉ là một nhạc khí được dùng trong các lễ hội, mà còn là biểu tượng quyền lực của các vị thủ lĩnh. Các hoa văn tinh xảo trên mặt trống mô tả cuộc sống sinh hoạt, nhà cửa, thuyền bè, và con người, cho chúng ta thấy một bức tranh sống động về xã hội thời bấy giờ."
  },
  [NHA_SAN_ARTIFACT_ID]: {
    id: NHA_SAN_ARTIFACT_ID,
    name: "Nhà sàn thời Hùng Vương",
    imageUrl: ImageUrls.NHA_SAN_URL,
    description: "Kiến trúc nhà ở độc đáo của người Việt cổ.",
    detailedDescription: "Nhà sàn là một kiểu kiến trúc nhà ở phổ biến của nhiều dân tộc tại Việt Nam, đặc biệt là ở các vùng trung du và miền núi. Dưới thời Hùng Vương, nhà sàn không chỉ là nơi che mưa che nắng mà còn phản ánh đời sống văn hóa, tín ngưỡng và sự thích nghi với môi trường tự nhiên của người Việt cổ. Các nhà khảo cổ học đã tìm thấy nhiều dấu tích và mô hình nhà sàn trên các trống đồng Đông Sơn."
  },
  [TRUNG_NU_VUONG_SEAL_ARTIFACT_ID]: {
    id: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
    name: "Ấn của Trưng Nữ Vương",
    imageUrl: ImageUrls.TRUNG_NU_VUONG_SEAL_URL,
    description: "Biểu tượng quyền lực và ý chí độc lập sau khởi nghĩa Hai Bà Trưng.",
    detailedDescription: "Sau khi đánh đuổi quân Đông Hán, Trưng Trắc lên ngôi vua, xưng là Trưng Nữ Vương, đóng đô ở Mê Linh. 'Ấn của Trưng Nữ Vương' (dù là một hiện vật mang tính biểu tượng, không có mẫu cụ thể được lưu truyền) đại diện cho nền độc lập tự chủ ngắn ngủi nhưng vô cùng hào hùng của dân tộc. Nó khẳng định chủ quyền và ý chí bất khuất của người Việt trước ngoại xâm.",
    craftingRequirements: [SEAL_FRAGMENT_SWORD_ID, SEAL_FRAGMENT_ELEPHANT_ID, SEAL_FRAGMENT_FLAG_ID, SEAL_FRAGMENT_HICH_ID],
  },
  [GIAO_DONG_DONG_SON_ARTIFACT_ID]: {
    id: GIAO_DONG_DONG_SON_ARTIFACT_ID,
    name: "Giáo đồng Đông Sơn",
    imageUrl: ImageUrls.BRONZE_SPEAR_URL,
    description: "Vũ khí phổ biến và hiệu quả của quân lính thời Âu Lạc.",
    detailedDescription: "Giáo đồng là một trong những vũ khí chủ lực của quân đội thời An Dương Vương. Với mũi giáo được đúc bằng đồng sắc bén, nó thể hiện trình độ luyện kim và kỹ thuật quân sự phát triển của người Việt cổ, góp phần quan trọng trong việc bảo vệ thành Cổ Loa và chống lại các cuộc xâm lược.",
    craftingRequirements: [SPEARHEAD_FRAGMENT_ID],
  },
  [GOLDEN_TURTLE_MODEL_ARTIFACT_ID]: {
    id: GOLDEN_TURTLE_MODEL_ARTIFACT_ID,
    name: "Mô Hình Rùa Vàng (AR)",
    imageUrl: ImageUrls.GOLDEN_TURTLE_MODEL_IMAGE_URL,
    description: "Chiêm ngưỡng Rùa Vàng thần thoại qua công nghệ AR.",
    detailedDescription: "Rùa Vàng (Kim Quy) là một hình tượng linh thiêng trong truyền thuyết Việt Nam, gắn liền với sự tích vua An Dương Vương xây dựng thành Cổ Loa và nỏ thần Kim Quy. Việc khám phá mô hình Rùa Vàng qua thực tế ảo tăng cường (AR) mang đến một trải nghiệm độc đáo, kết nối quá khứ huyền thoại với công nghệ hiện đại, giúp bạn hình dung rõ hơn về một biểu tượng quan trọng trong văn hóa dân tộc."
  },
  [LY_DYNASTY_COIN_ARTIFACT_ID]: {
    id: LY_DYNASTY_COIN_ARTIFACT_ID,
    name: "Tiền cổ thời Lý",
    imageUrl: ImageUrls.LY_DYNASTY_COIN_URL,
    description: "Tiền xu được đúc và lưu hành dưới triều đại nhà Lý.",
    detailedDescription: "Dưới triều Lý, nền kinh tế hàng hóa phát triển mạnh mẽ, và tiền đồng được đúc để phục vụ cho việc trao đổi, buôn bán trong các phiên chợ sầm uất. Những đồng tiền này không chỉ có giá trị kinh tế mà còn là bằng chứng cho một nhà nước Đại Việt có tổ chức, độc lập và một nền văn minh phát triển, thể hiện chủ quyền quốc gia."
  },
  [BUT_LONG_NGHIEN_MUC_ARTIFACT_ID]: {
    id: BUT_LONG_NGHIEN_MUC_ARTIFACT_ID,
    name: "Bút lông và Nghiên mực",
    imageUrl: ImageUrls.BUT_LONG_NGHIEN_MUC_URL,
    description: "Công cụ không thể thiếu của các sĩ tử và nhà nho xưa.",
    detailedDescription: "Bút, nghiên, giấy, mực được mệnh danh là 'văn phòng tứ bảo' (bốn vật quý của phòng văn). Dưới các triều đại phong kiến Việt Nam, giáo dục và thi cử rất được coi trọng. Bút lông và nghiên mực là những vật dụng gắn liền với hình ảnh các sĩ tử, nhà nho dùi mài kinh sử, thể hiện truyền thống hiếu học và trọng dụng nhân tài của dân tộc."
  },
  [NO_THAN_ARTIFACT_ID]: {
    id: NO_THAN_ARTIFACT_ID,
    name: "Nỏ Thần Liên Châu",
    imageUrl: ImageUrls.NO_THAN_URL,
    description: "Vũ khí huyền thoại của vua An Dương Vương, bắn một lúc nhiều mũi tên.",
    detailedDescription: "Nỏ Thần, hay còn gọi là nỏ Liên Châu, là vũ khí gắn liền với truyền thuyết An Dương Vương và thành Cổ Loa. Theo huyền sử, nỏ thần có thể bắn ra hàng loạt mũi tên trong một lần, giúp quân dân Âu Lạc chống lại quân xâm lược Triệu Đà. Đây là biểu tượng của sức mạnh quân sự và kỹ thuật chế tác vũ khí tiên tiến của người Việt cổ."
  },
  [CHIEU_DOI_DO_ARTIFACT_ID]: {
      id: CHIEU_DOI_DO_ARTIFACT_ID,
      name: "Bản sao Chiếu dời đô",
      imageUrl: ImageUrls.CHIEU_DOI_DO_URL,
      description: "Văn bản lịch sử quan trọng của vua Lý Thái Tổ, đặt nền móng cho thủ đô Thăng Long - Hà Nội.",
      detailedDescription: "Chiếu dời đô (Thiên đô chiếu) là một văn kiện do vua Lý Thái Tổ viết vào năm 1010, tuyên cáo quyết định dời kinh đô từ Hoa Lư (Ninh Bình) đến thành Đại La (Hà Nội ngày nay). Chiếu thể hiện tầm nhìn xa trông rộng của nhà vua về một vùng đất trung tâm, có địa thế 'rồng cuộn hổ ngồi', thuận lợi cho việc phát triển đất nước lâu dài. Sự kiện này đã mở ra một kỷ nguyên phát triển rực rỡ cho triều Lý và các triều đại sau này."
  },
  [TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID]: {
      id: TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID,
      name: "Tiền Quang Trung Thông Bảo",
      imageUrl: ImageUrls.TIEN_QUANG_TRUNG_URL,
      description: "Đồng tiền được đúc dưới triều đại Tây Sơn, biểu trưng cho một nền kinh tế thống nhất.",
      detailedDescription: "Sau khi thống nhất đất nước, vua Quang Trung cho đúc tiền 'Quang Trung Thông Bảo' để thay thế các loại tiền cũ, tạo ra một hệ thống tiền tệ chung cho cả nước. Điều này không chỉ thúc đẩy giao thương, kinh tế mà còn là một sự khẳng định mạnh mẽ về chủ quyền và sự thống nhất của một quốc gia sau nhiều năm chia cắt, phân tranh."
  },
  [DAN_NGUYET_ARTIFACT_ID]: {
      id: DAN_NGUYET_ARTIFACT_ID,
      name: "Đàn Nguyệt",
      imageUrl: ImageUrls.DAN_NGUYET_URL,
      description: "Nhạc cụ dây gảy, một phần quan trọng của Nhã nhạc cung đình Huế.",
      detailedDescription: "Đàn Nguyệt, hay còn gọi là đàn kìm, là một nhạc cụ truyền thống có vai trò quan trọng trong nhiều thể loại âm nhạc dân tộc Việt Nam, bao gồm cả Nhã nhạc cung đình. Với âm sắc trong sáng, vang vọng, Đàn Nguyệt thường giữ vai trò lĩnh xướng hoặc độc tấu, góp phần tạo nên sự trang trọng, tao nhã cho âm nhạc cung đình.",
  },
  [TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID]: {
      id: TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID,
      name: "Bản khắc Tranh Đám Cưới Chuột",
      imageUrl: ImageUrls.TRANH_DAM_CUOI_CHUOT_URL,
      description: "Một tác phẩm tiêu biểu của dòng tranh dân gian Đông Hồ.",
      detailedDescription: "Tranh Đông Hồ là một dòng tranh dân gian Việt Nam có xuất xứ từ làng Đông Hồ (Bắc Ninh). Tranh 'Đám Cưới Chuột' là một trong những tác phẩm nổi tiếng nhất, mang ý nghĩa châm biếm sâu sắc về xã hội cũ. Bức tranh mô tả cảnh một đám cưới chuột rộn ràng nhưng lại phải cống nạp cho một con mèo đang ngồi vênh váo, ám chỉ tệ nạn tham nhũng, áp bức của tầng lớp cai trị."
  },
  [HICH_TUONG_SI_ARTIFACT_ID]: {
    id: HICH_TUONG_SI_ARTIFACT_ID,
    name: "Cuộn Hịch tướng sĩ",
    imageUrl: ImageUrls.HICH_TUONG_SI_SCROLL_URL,
    description: "Lời hịch vang dội non sông của Hưng Đạo Vương Trần Quốc Tuấn.",
    detailedDescription: "Hịch tướng sĩ là bài hịch do Trần Hưng Đạo soạn vào khoảng trước cuộc kháng chiến chống Mông-Nguyên lần thứ hai (1285). Bài hịch khích lệ lòng yêu nước, căm thù giặc của các tướng sĩ, kêu gọi họ học tập binh thư, rèn luyện võ nghệ để sẵn sàng chiến đấu bảo vệ Tổ quốc. Đây là một áng văn chính luận bất hủ, thể hiện lòng yêu nước nồng nàn và tư tưởng quân sự tiến bộ của Trần Hưng Đạo."
  },
  [MU_TRU_NHA_TRAN_ARTIFACT_ID]: {
      id: MU_TRU_NHA_TRAN_ARTIFACT_ID,
      name: "Mũ trụ quân đội nhà Trần",
      imageUrl: ImageUrls.MU_TRU_NHA_TRAN_URL,
      description: "Một chiếc mũ trụ vững chắc, biểu tượng cho sức mạnh và kỷ luật của quân đội nhà Trần.",
      detailedDescription: "Dưới thời nhà Trần, quân đội được tổ chức chặt chẽ và trang bị tốt, là yếu tố then chốt làm nên ba lần chiến thắng quân xâm lược Mông-Nguyên. Chiếc mũ trụ này là một phần quan trọng trong bộ giáp của người lính, không chỉ bảo vệ họ trên chiến trường mà còn thể hiện sự uy nghiêm và tinh thần quyết chiến quyết thắng của quân đội Đại Việt.",
  },
  [AO_BAO_TAY_SON_ARTIFACT_ID]: {
      id: AO_BAO_TAY_SON_ARTIFACT_ID,
      name: "Áo bào của Nghĩa quân Tây Sơn",
      imageUrl: ImageUrls.AO_BAO_TAY_SON_URL,
      description: "Chiếc áo bào nhuốm màu khói lửa, chứng nhân cho cuộc hành quân thần tốc của vua Quang Trung.",
      detailedDescription: "Chiếc áo bào này là biểu tượng cho tinh thần 'áo vải cờ đào' của nghĩa quân Tây Sơn. Nó đã cùng vua Quang Trung và các tướng sĩ trải qua cuộc hành quân thần tốc từ Phú Xuân ra Thăng Long, đánh tan 29 vạn quân Thanh, viết nên một trong những trang sử chống ngoại xâm hào hùng nhất của dân tộc.",
  },
  [DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID]: {
      id: DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID,
      name: "Đồng tiền Quang Trung Thông Bảo",
      imageUrl: ImageUrls.ARTIFACT_QUANG_TRUNG_COIN_MINTED_URL,
      description: "Đồng tiền được đúc tại xưởng, biểu tượng cho quyền lực và sự thống nhất của triều Tây Sơn.",
      detailedDescription: "Đồng 'Quang Trung Thông Bảo' được đúc bằng đồng, là một phần quan trọng trong nỗ lực cải cách kinh tế, tiền tệ của vua Quang Trung. Việc thống nhất hệ thống tiền tệ đã góp phần ổn định xã hội, thúc đẩy giao thương, khẳng định chủ quyền của một quốc gia độc lập, hùng mạnh.",
  },
  [MO_HINH_CUU_DINH_ARTIFACT_ID]: {
      id: MO_HINH_CUU_DINH_ARTIFACT_ID,
      name: "Mô hình Cửu đỉnh",
      imageUrl: ImageUrls.MO_HINH_CUU_DINH_URL,
      description: "Biểu tượng cho sự trường tồn và thống nhất của triều Nguyễn.",
      detailedDescription: "Cửu Đỉnh (chín cái đỉnh) là chín cái đỉnh đồng lớn được vua Minh Mạng cho đúc vào năm 1835, đặt tại sân Thế Miếu trong Hoàng thành Huế. Mỗi đỉnh được khắc tên riêng và chạm khắc 17 hình ảnh tinh xảo về cảnh vật, sông núi, sản vật của Việt Nam, tượng trưng cho sự giàu đẹp và thống nhất của đất nước. Cửu Đỉnh là một kiệt tác của nghệ thuật đúc đồng và là di sản văn hóa quý giá của dân tộc.",
  },
  [GIA_DINH_BAO_ARTIFACT_ID]: {
    id: GIA_DINH_BAO_ARTIFACT_ID,
    name: "Bản in báo Gia Định Báo",
    imageUrl: ImageUrls.ARTIFACT_GIA_DINH_BAO_URL,
    description: "Một trong những tờ báo chữ Quốc ngữ đầu tiên tại Việt Nam.",
    detailedDescription: "Gia Định Báo là tờ báo tiếng Việt đầu tiên, ra đời năm 1865 tại Sài Gòn. Việc sử dụng chữ Quốc ngữ trong báo chí đã đánh dấu một bước ngoặt quan trọng, giúp phổ biến chữ viết này và đưa thông tin đến với đông đảo quần chúng, góp phần vào sự phát triển của văn hóa và trí tuệ dân tộc trong giai đoạn đầu của thời kỳ Pháp thuộc."
  },
  [VALI_DONG_DU_ARTIFACT_ID]: {
      id: VALI_DONG_DU_ARTIFACT_ID,
      name: "Vali của nhà yêu nước",
      imageUrl: ImageUrls.VALI_DONG_DU_ARTIFACT_URL,
      description: "Chiếc vali chứa đựng tài liệu và ý chí của một thanh niên trên đường sang Nhật tìm đường cứu nước.",
      detailedDescription: "Chiếc vali này là biểu tượng cho hành trình đầy gian khổ nhưng cũng chan chứa hy vọng của các thanh niên Việt Nam trong phong trào Đông Du đầu thế kỷ 20. Bên trong nó không chỉ có quần áo, sách vở, mà còn là cả một tương lai của đất nước, là khát vọng học hỏi văn minh phương Tây qua con đường Nhật Bản để về cứu giúp quốc gia đang trong vòng nô lệ."
  },
  [TRUONG_SON_COMPASS_ARTIFACT_ID]: {
      id: TRUONG_SON_COMPASS_ARTIFACT_ID,
      name: "La bàn của người lính",
      imageUrl: ImageUrls.TRUONG_SON_COMPASS_ARTIFACT_URL,
      description: "Vật dụng quan trọng giúp các chiến sĩ định hướng trên con đường mòn Trường Sơn huyền thoại.",
      detailedDescription: "Chiếc la bàn đơn sơ này là người bạn đồng hành không thể thiếu của các chiến sĩ trên đường Trường Sơn. Giữa núi rừng trùng điệp, nó đã giúp họ xác định phương hướng, vượt qua bom đạn và những điều kiện khắc nghiệt nhất để vận chuyển quân lương, vũ khí chi viện cho chiến trường miền Nam, góp phần to lớn vào cuộc kháng chiến giải phóng dân tộc."
  },
  [DIEN_DAI_TRINH_SAT_ARTIFACT_ID]: {
      id: DIEN_DAI_TRINH_SAT_ARTIFACT_ID,
      name: "Điện đài trinh sát",
      imageUrl: ImageUrls.DIEN_DAI_TRINH_SAT_ARTIFACT_URL,
      description: "Một chiếc điện đài cũ, công cụ liên lạc quan trọng của các chiến sĩ trinh sát.",
      detailedDescription: "Trong điều kiện chiến đấu gian khổ, thông tin liên lạc là mạch máu của trận đánh. Chiếc điện đài này đã giúp các chiến sĩ trinh sát truyền đi những thông tin tình báo quý giá, góp phần vào thắng lợi chung. Nó là biểu tượng của sự mưu trí, dũng cảm và thầm lặng của người lính thông tin."
  },
  [BA_TRIEU_CLOGS_ARTIFACT_ID]: {
    id: BA_TRIEU_CLOGS_ARTIFACT_ID,
    name: "Guốc ngà của Bà Triệu",
    imageUrl: ImageUrls.BA_TRIEU_CLOGS_ARTIFACT_URL,
    description: "Đôi guốc ngà mà Vua Bà đã mang khi ra trận, thể hiện khí phách hiên ngang.",
    detailedDescription: "Truyền thuyết kể rằng, Triệu Thị Trinh (Bà Triệu) thường đi guốc ngà, mặc áo giáp vàng, cài trâm vàng, cưỡi voi trắng một ngà ra trận. Đôi guốc này không chỉ là vật trang sức mà còn là biểu tượng cho khí phách phi thường, hiên ngang, không chịu cúi đầu làm nô lệ của vị nữ tướng anh hùng."
  },
  [BA_TRIEU_PHOENIX_HAIRPIN_ARTIFACT_ID]: {
    id: BA_TRIEU_PHOENIX_HAIRPIN_ARTIFACT_ID,
    name: "Trâm cài tóc vàng hình phượng",
    imageUrl: ImageUrls.BA_TRIEU_PHOENIX_HAIRPIN_URL,
    description: "Chiếc trâm cài thể hiện vẻ đẹp và uy quyền của Vua Bà.",
    detailedDescription: "Truyền thuyết kể rằng, ngoài áo giáp vàng và guốc ngà, Bà Triệu còn dùng trâm vàng cài tóc khi ra trận. Chiếc trâm hình phượng hoàng này không chỉ là một món trang sức quý giá mà còn là biểu tượng cho sự cao quý, khí phách và ý chí không chịu khuất phục của nữ tướng."
  },
  [MO_HINH_CHUA_VAN_XUAN_ARTIFACT_ID]: {
      id: MO_HINH_CHUA_VAN_XUAN_ARTIFACT_ID,
      name: "Mô hình Chùa Vạn Xuân",
      imageUrl: ImageUrls.MO_HINH_CHUA_VAN_XUAN_URL,
      description: "Mô hình ngôi chùa do Lý Bí cho xây dựng sau khi lập nên nước Vạn Xuân.",
      detailedDescription: "Sau khi đánh đuổi quân Lương và lên ngôi vua (Lý Nam Đế), Lý Bí đã cho dựng chùa Khai Quốc (sau đổi tên thành Trấn Quốc) ở gần bờ sông Hồng. Ngôi chùa này, cùng với nước Vạn Xuân, là biểu tượng cho nền độc lập, tự chủ và sự phát triển của Phật giáo thời kỳ đó.",
  },
  [COC_GO_BACH_DANG_ARTIFACT_ID]: {
      id: COC_GO_BACH_DANG_ARTIFACT_ID,
      name: "Cọc gỗ Bạch Đằng",
      imageUrl: ImageUrls.COC_GO_BACH_DANG_URL,
      description: "Vũ khí bí mật làm nên chiến thắng lịch sử trên sông Bạch Đằng.",
      detailedDescription: "Cọc gỗ lim bịt đầu sắt là một sáng kiến quân sự thiên tài của Ngô Quyền. Hàng ngàn chiếc cọc được đóng xuống lòng sông Bạch Đằng, tạo thành một bãi chướng ngại vật chết người. Khi thủy triều lên, bãi cọc bị che khuất, quân ta nhử thuyền địch vào. Khi triều rút, thuyền địch bị cọc đâm thủng và mắc kẹt, tạo điều kiện cho quân ta phản công và giành chiến thắng vang dội."
  },
  [GOLDEN_SHEAF_ARTIFACT_ID]: {
    id: GOLDEN_SHEAF_ARTIFACT_ID,
    name: "Bó Lúa Vàng",
    imageUrl: ImageUrls.GOLDEN_SHEAF_ARTIFACT_URL,
    description: "Một bó lúa vàng óng, biểu tượng cho một vụ mùa bội thu và sự ấm no.",
    detailedDescription: "Bó lúa vàng là một biểu tượng mạnh mẽ của sự sung túc nông nghiệp, thịnh vượng và là mạch sống của nền văn minh Việt Nam. Nó đại diện cho sự thành công của một mùa thu hoạch, thời điểm của lễ hội và sự sum họp cộng đồng sau những ngày lao động vất vả.",
  },
};

// --- Memory Fragments ---
export const ALL_FRAGMENTS_MAP: Record<string, MemoryFragment> = {
  [SEAL_FRAGMENT_SWORD_ID]: {
    id: SEAL_FRAGMENT_SWORD_ID,
    name: "Mảnh Gươm Báu",
    imageUrl: ImageUrls.SEAL_FRAGMENT_SWORD_URL,
    description: "Một mảnh vỡ từ thanh gươm của một nữ tướng. Ánh thép vẫn còn sắc lạnh, dường như chứa đựng ý chí của chủ nhân.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  },
  [SEAL_FRAGMENT_ELEPHANT_ID]: {
    id: SEAL_FRAGMENT_ELEPHANT_ID,
    name: "Mảnh Tượng Voi",
    imageUrl: ImageUrls.SEAL_FRAGMENT_ELEPHANT_URL,
    description: "Mảnh vỡ có hình một con voi chiến oai phong, biểu tượng của sức mạnh và sự dũng mãnh trên chiến trường.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  },
  [SEAL_FRAGMENT_FLAG_ID]: {
    id: SEAL_FRAGMENT_FLAG_ID,
    name: "Mảnh Cờ Hiệu",
    imageUrl: ImageUrls.SEAL_FRAGMENT_FLAG_URL,
    description: "Một góc của lá cờ hiệu đã bạc màu theo năm tháng nhưng vẫn phấp phới niềm tự hào.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  },
  [SEAL_FRAGMENT_HICH_ID]: {
    id: SEAL_FRAGMENT_HICH_ID,
    name: "Mảnh Lời Thề",
    imageUrl: ImageUrls.RALLY_CALL_FRAGMENT_URL,
    description: "Vài chữ Hán cổ còn sót lại trên mảnh giấy, như một lời hiệu triệu vang vọng từ quá khứ.",
    belongsToArtifactId: TRUNG_NU_VUONG_SEAL_ARTIFACT_ID,
  },
  [SPEARHEAD_FRAGMENT_ID]: {
    id: SPEARHEAD_FRAGMENT_ID,
    name: "Mảnh Mũi Giáo Đồng",
    imageUrl: ImageUrls.SPEARHEAD_FRAGMENT_URL,
    description: "Một mảnh vỡ từ mũi giáo được đúc bằng đồng, vẫn còn sắc bén sau hàng ngàn năm.",
    belongsToArtifactId: GIAO_DONG_DONG_SON_ARTIFACT_ID,
  },
  [BACH_DANG_STAKE_FRAGMENT_ID]: {
    id: BACH_DANG_STAKE_FRAGMENT_ID,
    name: "Mảnh Cọc Bạch Đằng",
    imageUrl: ImageUrls.BACH_DANG_STAKE_ICON_URL,
    description: "Một mảnh gỗ lim còn sót lại, minh chứng cho một trận thủy chiến thiên tài.",
    belongsToArtifactId: COC_GO_BACH_DANG_ARTIFACT_ID,
  }
};

// --- Hero Cards ---
export const ALL_HERO_CARDS: Record<string, HeroCard> = {
  [HERO_CARD_TRUNG_TRAC_ID]: {
    id: HERO_CARD_TRUNG_TRAC_ID,
    name: "Trưng Nữ Vương",
    imageUrl: ImageUrls.HAI_BA_TRUNG_HERO_CARD_URL,
    description: "Nữ vương đầu tiên trong lịch sử Việt Nam.",
  },
};

// --- Decorations ---
export const ALL_DECORATIONS_MAP: Record<string, Decoration> = {
  [GOLDEN_THRONE_DECORATION_ID]: {
    id: GOLDEN_THRONE_DECORATION_ID,
    name: "Ngai Vàng Rực Rỡ",
    imageUrl: ImageUrls.GOLDEN_THRONE_URL,
    description: "Một chiếc ngai vàng lộng lẫy, biểu tượng của quyền lực tối cao. Chỉ dành cho Nhà Sử Học Premium.",
  },
  [PONTOON_BRIDGE_MODEL_ID]: {
    id: PONTOON_BRIDGE_MODEL_ID,
    name: "Mô hình Cầu phao",
    imageUrl: ImageUrls.ICON_PONTOON_BRIDGE_URL,
    description: "Mô hình một cây cầu phao, biểu tượng cho sự sáng tạo và vượt khó trên đường Trường Sơn.",
  },
};

// --- Customization Items ---
export const ALL_CUSTOMIZATION_ITEMS_MAP: Record<string, CustomizationItem> = {
  [OUTFIT_DEFAULT_ID]: {
    id: OUTFIT_DEFAULT_ID,
    name: 'Trang phục Mặc định',
    type: 'outfit',
    imageUrl: ImageUrls.AVATAR_OUTFIT_DEFAULT_URL, // This is more a placeholder, base avatar contains default clothes
  },
  [HAT_NON_LA_ID]: {
    id: HAT_NON_LA_ID,
    name: 'Nón Lá',
    type: 'hat',
    imageUrl: ImageUrls.AVATAR_HAT_NON_LA_URL,
    unlockCondition: {
      type: 'complete_hoi',
      hoi_id: 'hoi_2_giu_nuoc',
    },
  },
  [OUTFIT_NHAT_BINH_ID]: {
    id: OUTFIT_NHAT_BINH_ID,
    name: 'Áo Nhật Bình',
    type: 'outfit',
    imageUrl: ImageUrls.AVATAR_OUTFIT_NHAT_BINH_URL,
    unlockCondition: {
      type: 'complete_hoi',
      hoi_id: 'hoi_5_phong_kien',
    },
  },
};

export const HICH_TUONG_SI_EXTRA_DEFINITIONS: Record<string, string> = {
    'Ta thường': 'Ta thường nghe rằng',
    'Kỷ Tín': 'Một gia thần của Hán Cao Tổ Lưu Bang, đã giả làm Lưu Bang để cứu chủ thoát khỏi vòng vây của Hạng Vũ.',
    'Do Vu': 'Một viên tướng nước Tề, đã chìa lưng chịu giáo che cho Tề Tương Công.',
    'Dự Nhượng': 'Một gia thần của Trí Bá, đã nuốt than để thay đổi giọng nói, tự hủy hoại thân thể để báo thù cho chủ.',
    'Thân Khoái': 'Một người nước Vệ, đã chặt tay để cứu Vệ Ý Công.',
    'cốt đãi': 'chỉ mong, chỉ đối đãi',
    'thái ấp': 'Đất vua ban cho chư hầu, công thần.',
    'bổng lộc': 'Lương bổng và của cải vua ban.',
    'quân hiệu': 'Chức vụ trong quân đội.',
    'điền nô': 'Nô tì làm ruộng.',
    'thê tử': 'Vợ con.',
    'Thát Đát': 'Chỉ quân Mông Cổ.',
    'uốn lưỡi cú diều': 'Chỉ những lời lẽ hống hách, kiêu ngạo của quân giặc.',
    'đem thân dê chó': 'Chỉ hành động hèn hạ, phục tùng quân giặc.',
    'mồi cho hổ đói': 'Trở thành miếng mồi ngon cho quân giặc hung bạo.',
    'xã tắc': 'Đất nước, giang sơn.',
    'tổ tông': 'Tổ tiên, dòng họ.',
    'bêu đầu': 'Bị chặt đầu và treo lên để thị chúng.',
    'phơi thây': 'Bị chết và phơi xác ngoài đồng.',
    'trăm thân': 'Một trăm thân xác, ý chỉ dù có chết trăm lần cũng không hết nhục.',
    'cựa gà': 'Trò chơi chọi gà, một thú vui tầm thường.',
    'tiếng hát': 'Những thú vui giải trí, ca hát.',
    'dược tử': 'Sách dạy về chiến thuật, binh pháp do Trương Lương và Hoàng Thạch Công soạn.',
    'Thao lược': 'Sách binh pháp của Khương Tử Nha (Lục Thao, Tam Lược).',
    'binh thư yếu lược': 'Cuốn sách binh pháp do chính Trần Quốc Tuấn biên soạn.',
};
