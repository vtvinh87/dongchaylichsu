// constants/sagas.ts
import { Hoi } from '../types';
import * as ImageUrls from '../imageUrls';

export const HOI_DATA: Hoi[] = [
  {
    id: 'hoi_1_dung_nuoc',
    title: 'Hồi 1: Buổi đầu Dựng nước',
    description: 'Khám phá thời kỳ sơ khai của dân tộc, từ những truyền thuyết đầu tiên đến các hoạt động cộng đồng và sản xuất.',
    missions: [
      { id: 'mission_1_1', title: 'Thắp sáng Hoa văn Trống Đồng', imageUrl: ImageUrls.SAGA_KHAI_QUOC_URL, description: 'Giải mã những hoa văn trên trống đồng Đông Sơn để hiểu về đời sống người Việt cổ.', missionId: 'dong-son-puzzle' },
      { id: 'mission_1_2', title: 'Dòng thời gian Hùng Vương', imageUrl: ImageUrls.SAGA_HUNG_VUONG_URL, description: 'Sắp xếp các sự kiện quan trọng trong thời đại các Vua Hùng.', missionId: 'hung-vuong-timeline', dependsOnMissionId: 'dong-son-puzzle' },
      { id: 'mission_1_3', title: 'Hội Làng Ngày Mùa', imageUrl: ImageUrls.SAGA_HOI_LANG_NGAY_MUA_URL, description: 'Tìm kiếm các vật phẩm và hoạt động đặc trưng trong một lễ hội làng.', missionId: 'hoi-lang-ngay-mua', dependsOnMissionId: 'hung-vuong-timeline' },
    ]
  },
  {
    id: 'hoi_2_giu_nuoc',
    title: 'Hồi 2: Ý chí Bất khuất',
    description: 'Chứng kiến ý chí quật cường của dân tộc qua các cuộc khởi nghĩa chống lại ách đô hộ phương Bắc, đỉnh cao là chiến thắng Bạch Đằng lừng lẫy.',
    missions: [
       { id: 'mission_2_1', title: 'Lời thề trên sông Hát', imageUrl: ImageUrls.SAGA_LOI_THE_SONG_HAT_URL, description: 'Hùng hồn đọc lời thề quyết chiến của Hai Bà Trưng.', missionId: 'loi-the-song-hat' },
       { id: 'mission_2_2', title: 'Rèn Mũi Giáo Đồng', imageUrl: ImageUrls.SAGA_FORGING_URL, description: 'Chuẩn bị vũ khí cho cuộc khởi nghĩa.', missionId: 'forging-spearhead', dependsOnMissionId: 'loi-the-song-hat' },
       { id: 'mission_2_3', title: 'Cưỡi voi đánh giặc', imageUrl: ImageUrls.SAGA_CUOI_VOI_DANH_GIAC_URL, description: 'Theo chân Bà Triệu, thống lĩnh quân sĩ, phá tan quân thù.', missionId: 'ba-trieu-lanes', dependsOnMissionId: 'forging-spearhead' },
       { id: 'mission_2_4', title: 'Lý Bí và nước Vạn Xuân', imageUrl: ImageUrls.SAGA_LY_BI_VAN_XUAN_URL, description: 'Giúp Lý Bí xây dựng ngôi chùa biểu tượng cho nền độc lập.', missionId: 'xay-chua-van-xuan', dependsOnMissionId: 'ba-trieu-lanes' },
       { id: 'mission_2_5', title: 'Đại Phá Quân Nam Hán', imageUrl: ImageUrls.QUEST_CHAIN_BACH_DANG_BANNER_URL, description: 'Tái hiện trận Bạch Đằng lịch sử năm 938 của Ngô Quyền.', questChainId: 'bach-dang-chien', missionId: 'bach-dang-tactical-map', dependsOnMissionId: 'xay-chua-van-xuan'},
    ]
  },
  {
    id: 'hoi_3_thang_long',
    title: 'Hồi 3: Kỷ nguyên Đại Việt',
    description: 'Sống trong không khí của một quốc gia độc lập, từ việc dời đô về Thăng Long đến ba lần đánh bại quân xâm lược Mông - Nguyên.',
    missions: [
      { id: 'mission_3_1', title: 'Đối thoại với Lý Thái Tổ', imageUrl: ImageUrls.SAGA_DIPLOMACY_URL, description: 'Thuyết phục nhà vua về sự cần thiết của việc dời đô.', missionId: 'diplomacy-ly-thai-to' },
      { id: 'mission_3_2', title: 'Soạn Hịch tướng sĩ', imageUrl: ImageUrls.SAGA_HICH_TUONG_SI_URL, description: 'Giúp Trần Hưng Đạo hoàn thành bài hịch vang dội non sông.', missionId: 'hich-tuong-si-fill-blank', dependsOnMissionId: 'diplomacy-ly-thai-to' },
      { id: 'mission_3_3', title: 'Vườn không nhà trống', imageUrl: ImageUrls.SAGA_VUON_KHONG_NHA_TRONG_URL, description: 'Thực hiện kế sách độc đáo để chống lại quân Mông-Nguyên.', missionId: 'vuon-khong-nha-trong', dependsOnMissionId: 'hich-tuong-si-fill-blank'},
      { id: 'mission_3_4', title: 'Mật Thám Chốn Thị Thành', imageUrl: ImageUrls.SAGA_DETECTIVE_URL, description: 'Một vụ án bí ẩn tại kinh thành. Hãy tìm ra kẻ gian và bằng chứng.', missionId: 'thang_long_spy', isOptionalForProgression: true },
      { id: 'mission_3_5', title: 'Cửa sổ thời gian: Nỏ Thần', imageUrl: ImageUrls.SAGA_AR_URL, description: 'Sử dụng công nghệ AR để khám phá vũ khí huyền thoại.', missionId: 'ar-golden-turtle', isOptionalForProgression: true },
    ]
  },
  {
    id: 'hoi_4_bao_tap',
    title: 'Hồi 4: Bão táp Tây Sơn',
    description: 'Trải nghiệm một trong những giai đoạn hào hùng nhất của lịch sử dân tộc với cuộc khởi nghĩa Tây Sơn và thiên tài quân sự của Hoàng đế Quang Trung.',
    isPremiumChapter: true,
    missions: [
      {
        id: 'mission_4_1_campaign',
        title: 'Chiến Dịch Thần Tốc',
        imageUrl: ImageUrls.QUEST_CHAIN_TAY_SON_BANNER_URL,
        description: 'Tham gia vào chiến dịch vĩ đại của Hoàng đế Quang Trung, từ Phú Xuân đến Thăng Long.',
        questChainId: 'tay_son_campaign',
        missionId: 'tay_son_march', // Match the first step's missionId as a convention
        isPremium: true
      },
      { id: 'mission_4_2', title: 'Xưởng đúc tiền', imageUrl: ImageUrls.SAGA_COIN_MINTING_URL, description: 'Giúp vua Quang Trung đúc những đồng tiền đầu tiên của triều đại mới.', missionId: 'quang-trung-coin-minting', isOptionalForProgression: true, isPremium: true},
      { id: 'mission_4_3', title: 'Giả sử Lịch sử: Hai Bà Trưng', imageUrl: ImageUrls.SAGA_WHAT_IF_URL, description: 'Nếu Hai Bà Trưng không tuẫn tiết, lịch sử sẽ ra sao?', missionId: 'what-if-trung-sisters', isPremium: true, isOptionalForProgression: true},
    ]
  },
   {
    id: 'hoi_5_phong_kien',
    title: 'Hồi 5: Vận Nước Đổi Thay',
    description: 'Tìm hiểu về triều đại phong kiến cuối cùng của Việt Nam, sự ra đời của chữ Quốc ngữ và những bước chân đầu tiên trên hành trình cứu nước.',
    missions: [
      { id: 'mission_5_1', title: 'Thuận Thiên Ý - Kiến Tạo Kinh Thành', imageUrl: ImageUrls.SAGA_KINH_THANH_HUE_URL, description: 'Quy hoạch và xây dựng các công trình trọng điểm của Kinh thành Huế theo đúng Phong thủy và Dũng đạo.', missionId: 'hue-imperial-city-construction' },
      { id: 'mission_5_2', title: 'Chủ Bút Báo Quốc Ngữ', imageUrl: ImageUrls.SAGA_TYPESETTING_URL, description: 'Vào vai chủ bút, lèo lái tờ báo đầu tiên của Việt Nam vượt qua thử thách.', missionId: 'chu-but-bao-quoc-ngu', dependsOnMissionId: 'hue-imperial-city-construction'},
      { id: 'mission_5_3', title: 'Vượt biển Đông Du', imageUrl: ImageUrls.SAGA_DONG_DU_URL, description: 'Giải các câu đố để tìm đường sang Nhật Bản an toàn.', missionId: 'dong-du-adventure-puzzle', dependsOnMissionId: 'chu-but-bao-quoc-ngu'},
    ]
  },
  {
    id: 'hoi_6_truong_son',
    title: 'Hồi 6: Con Đường Huyền Thoại',
    description: 'Hóa thân thành một người lính trên con đường mòn Trường Sơn, đối mặt với hiểm nguy và thử thách để chi viện cho tiền tuyến.',
    missions: [
        { id: 'mission_6_1', title: 'Ngã ba Đồng Lộc', imageUrl: ImageUrls.SAGA_DONG_LOC_URL, description: 'Vượt qua trọng điểm Đồng Lộc đầy bom đạn.', missionId: 'strategic-path-dong-loc' },
        { id: 'mission_6_2', title: 'Cua chữ A - Đèo Phu La Nhích', imageUrl: ImageUrls.SAGA_CUA_CHUA_URL, description: 'Đối mặt với địa hình hiểm trở và các cảm biến của địch.', missionId: 'strategic-path-cua-chua', dependsOnMissionId: 'strategic-path-dong-loc'},
        { id: 'mission_6_3', title: 'Vượt sông Sê Băng Hiêng', imageUrl: ImageUrls.SAGA_SEBANGHIENG_URL, description: 'Hộ tống đoàn xe vận tải qua sông trong mùa mưa lũ.', missionId: 'strategic-path-sebanghieng', dependsOnMissionId: 'strategic-path-cua-chua'},
    ]
  },
  {
    id: 'hoi_7_giao_thoi',
    title: 'Hồi 7: Giao Thời và Hội Nhập',
    description: 'Trải nghiệm sự phát triển thương mại và những biến đổi của xã hội Việt Nam khi tiếp xúc với thế giới thông qua các thương cảng sầm uất.',
    missions: [
      { id: 'mission_7_1', title: 'Thử tài Sử học', imageUrl: ImageUrls.SAGA_DIPLOMACY_URL, description: 'Kiểm tra kiến thức lịch sử của bạn qua các câu hỏi hóc búa.', missionId: 'quiz-general-knowledge' },
    ]
  },
];
