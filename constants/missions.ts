// constants/missions.ts
import { MissionData, PuzzlePieceItem, TradingGood, TradingEvent, TimelineEventItem, HiddenObjectItem, QuizQuestion, DiplomacyRound, DiplomacyChoice, RallyCallRound, RallyCallChoice, TacticalMapMissionData, DefenseMissionData, StrategyMapMissionData, CoinMintingTask, CityPlanningMissionData, TypesettingMissionData, AdventurePuzzleRiddle, StrategicPathMissionData, ConstructionPuzzlePiece, ConstructionPuzzleMissionData, NavalBattleMissionData, LaneBattleMissionData, CoinMintingMissionData, AdventurePuzzleMissionData, TradingMissionData, HiddenObjectMissionData } from '../types';
import * as Items from './items';
import * as ImageUrls from '../imageUrls';

export const MISSION_HICH_TUONG_SI_ID = 'hich-tuong-si-fill-blank';
export const MISSION_DONG_LOC_PATH_ID = 'strategic-path-dong-loc';
export const MISSION_CUA_CHUA_PATH_ID = 'strategic-path-cua-chua';
export const MISSION_SEBANGHIENG_PATH_ID = 'strategic-path-sebanghieng';

export const ALL_MISSIONS: Record<string, MissionData> = {
  'dong-son-puzzle': {
    type: 'puzzle',
    id: 'dong-son-puzzle',
    title: 'Thắp sáng Hoa văn Trống Đồng',
    reward: { id: Items.BRONZE_DRUM_ARTIFACT_ID, type: 'artifact' },
    puzzleImage: ImageUrls.TRONG_DONG_URL,
    pieces: [
      {
        id: 0,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Ngôi sao ở trung tâm trống đồng không chỉ để trang trí, mà còn là biểu tượng của Mặt Trời, thể hiện tín ngưỡng thờ thần Mặt Trời của người Việt cổ."
      },
      {
        id: 1,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Những đàn chim Lạc bay ngược chiều kim đồng hồ là hoa văn đặc trưng nhất, thể hiện sự hòa hợp giữa con người và thiên nhiên trong nền văn minh lúa nước."
      },
      {
        id: 2,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Hình ảnh người giã gạo cho thấy cây lúa đã đóng một vai trò vô cùng quan trọng trong đời sống vật chất và tinh thần của cư dân Văn Lang."
      },
      {
        id: 3,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Kiến trúc nhà sàn mái cong hình thuyền là một nét độc đáo, giúp người Việt cổ thích nghi với môi trường sông nước và tránh thú dữ."
      },
      {
        id: 4,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Những chiếc thuyền chiến được trang trí cầu kỳ cho thấy người Việt cổ không chỉ giỏi đi biển mà còn có một lực lượng thủy quân mạnh mẽ để bảo vệ lãnh thổ."
      },
      {
        id: 5,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Hình ảnh các chiến binh cầm vũ khí như giáo, mác, rìu chiến cho thấy một xã hội luôn phải sẵn sàng chiến đấu để chống lại kẻ thù và bảo vệ cuộc sống."
      },
      {
        id: 6,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Các vũ công và nhạc công với những nhạc cụ như khèn, trống cho thấy đời sống tinh thần của người xưa rất phong phú với các lễ hội và nghi lễ tưng bừng."
      },
      {
        id: 7,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Sự xuất hiện của hươu, nai trên mặt trống không chỉ phản ánh hệ động vật đa dạng mà còn có thể liên quan đến các hoạt động săn bắt hoặc tín ngưỡng vật tổ."
      },
      {
        id: 8,
        imageUrl: ImageUrls.TRONG_DONG_URL,
        funFact: "Các vòng tròn đồng tâm và vạch ngắn xen kẽ không chỉ để lấp đầy không gian mà còn có thể biểu thị cho lịch, đếm ngày tháng của người xưa."
      }
    ],
    timeLimit: 120,
  },
  'hung-vuong-timeline': {
    type: 'timeline',
    id: 'hung-vuong-timeline',
    title: 'Dòng thời gian Hùng Vương',
    instructionText: "Sắp xếp các sự kiện và truyền thuyết sau theo đúng trình tự thời gian.",
    events: [
        { id: 'event_laclongquan', text: 'Lạc Long Quân và Âu Cơ', correctOrder: 1, imageUrl: ImageUrls.EVENT_LAC_LONG_QUAN_URL, details: 'Truyền thuyết về cha Lạc Long Quân và mẹ Âu Cơ sinh ra bọc trăm trứng, nở thành một trăm người con, là khởi nguồn của dân tộc Việt Nam, giải thích về nguồn gốc "con Rồng cháu Tiên".' },
        { id: 'event_caylua', text: 'Vua Hùng dạy dân cấy lúa', correctOrder: 2, imageUrl: ImageUrls.EVENT_VUA_HUNG_CAY_LUA_URL, details: 'Câu chuyện kể về việc các Vua Hùng đã dạy cho người dân cách trồng lúa nước, từ đó mở ra nền văn minh lúa nước, nền tảng cho sự phát triển của quốc gia.' },
        { id: 'event_banhchung', text: 'Sự tích Bánh Chưng, Bánh Dày', correctOrder: 3, imageUrl: ImageUrls.EVENT_BANH_CHUNG_URL, details: 'Hoàng tử Lang Liêu đã sáng tạo ra Bánh Chưng (tượng trưng cho Đất) và Bánh Dày (tượng trưng cho Trời) để dâng lên vua cha, thể hiện lòng hiếu thảo và sự trân trọng nền nông nghiệp.' },
        { id: 'event_thanhgiong', text: 'Thánh Gióng đánh giặc Ân', correctOrder: 4, imageUrl: ImageUrls.EVENT_THANH_GIONG_URL, details: 'Cậu bé làng Gióng vươn vai thành tráng sĩ, cưỡi ngựa sắt, dùng roi sắt và cả những bụi tre để đánh tan giặc Ân xâm lược, là biểu tượng cho sức mạnh và tinh thần chống ngoại xâm của dân tộc.' },
        { id: 'event_anduongvuong', text: 'An Dương Vương và Nỏ thần', correctOrder: 5, imageUrl: ImageUrls.EVENT_AN_DUONG_VUONG_NO_THAN_URL, details: 'Sau khi kết thúc thời đại Hùng Vương, Thục Phán An Dương Vương lập nên nước Âu Lạc, xây thành Cổ Loa và chế tạo Nỏ thần để bảo vệ đất nước khỏi quân xâm lược.' }
    ],
    reward: { id: Items.NHA_SAN_ARTIFACT_ID, type: 'artifact' },
    timeLimit: 60,
  },
   'loi-the-song-hat': {
    type: 'rallyCall',
    id: 'loi-the-song-hat',
    title: 'Lời thề trên sông Hát',
    reward: { id: Items.SEAL_FRAGMENT_HICH_ID, type: 'fragment' },
    rounds: [
        {
            prompt: "Trước toàn thể quân sĩ, Trưng Trắc rút gươm, dõng dạc hô vang lời thề đầu tiên:",
            choices: [
                {id: 'choice1_1', text: "Một xin rửa sạch nước thù!", iconUrl: ImageUrls.ICON_POINT_SWORD_URL, moralePoints: 30},
                {id: 'choice1_2', text: "Giành lại của cải đã mất", iconUrl: ImageUrls.ICON_VOW_WEALTH_URL, moralePoints: 10},
                {id: 'choice1_3', text: "Trả thù cho gia đình", iconUrl: ImageUrls.ICON_VOW_PERSONAL_URL, moralePoints: 5},
            ]
        },
        {
            prompt: "Lời thề thứ hai vang dội, thể hiện quyết tâm khôi phục cơ đồ:",
            choices: [
                {id: 'choice2_1', text: "Hai xin dựng lại nghiệp xưa họ Hùng!", iconUrl: ImageUrls.ICON_VOW_NATION_URL, moralePoints: 30},
                {id: 'choice2_2', text: "Xây dựng một triều đại mới", iconUrl: ImageUrls.ICON_VOW_PERSONAL_URL, moralePoints: 10},
                {id: 'choice2_3', text: "Chia đều đất đai", iconUrl: ImageUrls.ICON_VOW_WEALTH_URL, moralePoints: 5},
            ]
        },
        {
            prompt: "Lời thề thứ ba nhắm vào kẻ thù trực tiếp, kẻ đã gây ra bao đau thương:",
            choices: [
                {id: 'choice3_1', text: "Ba xin kẻo oan ức lòng chồng!", iconUrl: ImageUrls.ICON_VOW_PERSONAL_URL, moralePoints: 20},
                {id: 'choice3_2', text: "Đuổi Tô Định về nước", iconUrl: ImageUrls.ICON_POINT_SWORD_URL, moralePoints: 30},
                {id: 'choice3_3', text: "Bắt kẻ địch phải quỳ gối", iconUrl: ImageUrls.ICON_VOW_WEALTH_URL, moralePoints: 10},
            ]
        },
         {
            prompt: "Lời thề cuối cùng khẳng định sự quyết tâm sắt đá:",
            choices: [
                {id: 'choice4_1', text: "Bốn xin vẻn vẹn sở công lênh này!", iconUrl: ImageUrls.ICON_RAISE_FLAG_URL, moralePoints: 30},
                {id: 'choice4_2', text: "Thắng lợi rồi sẽ mở tiệc ăn mừng", iconUrl: ImageUrls.ICON_POUR_WINE_URL, moralePoints: 5},
                {id: 'choice4_3', text: "Để lịch sử ghi danh", iconUrl: ImageUrls.ICON_VOW_PERSONAL_URL, moralePoints: 10},
            ]
        }
    ]
  },
  'forging-spearhead': {
    type: 'forging',
    id: 'forging-spearhead',
    title: 'Rèn Mũi Giáo Đồng',
    targetProgress: 100,
    reward: { id: Items.SPEARHEAD_FRAGMENT_ID, type: 'fragment' },
  },
  'hoi-lang-ngay-mua': {
    type: 'hiddenObject',
    id: 'hoi-lang-ngay-mua',
    title: 'Hội Làng Ngày Mùa',
    backgroundImageUrl: ImageUrls.HIDDEN_OBJECT_FESTIVAL_BG_URL,
    objectsToFind: [
        { id: 'nha_san', name: 'Nhà sàn', iconUrl: ImageUrls.ICON_NHA_SAN_URL, details: 'Nhà sàn là kiến trúc đặc trưng của người Việt cổ, giúp tránh thú dữ và lũ lụt.', coords: { x: 5, y: 10, width: 30, height: 35 } },
        { id: 'da_gao', name: 'Giã gạo', iconUrl: ImageUrls.ICON_NGUOI_DA_GAO_URL, details: 'Hoạt động giã gạo thể hiện nền văn minh lúa nước và tinh thần lao động tập thể.', coords: { x: 20, y: 65, width: 20, height: 25 } },
        { id: 'thuyen_doc_moc', name: 'Thuyền độc mộc', iconUrl: ImageUrls.ICON_THUYEN_DOC_MOC_URL, details: 'Thuyền độc mộc là phương tiện di chuyển chính trên sông nước, cho thấy kỹ năng đóng thuyền của người xưa.', coords: { x: 60, y: 80, width: 25, height: 15 } },
    ],
    reward: { id: Items.GOLDEN_SHEAF_ARTIFACT_ID, type: 'artifact' },
  },
  'what-if-trung-sisters': {
      type: 'narrative',
      id: 'what-if-trung-sisters',
      title: 'Giả sử Lịch sử: Nếu Hai Bà Trưng chiến thắng?',
      reward: { id: Items.HERO_CARD_TRUNG_TRAC_ID, type: 'heroCard' },
      startNodeId: 'start',
      nodes: {
        'start': {
          id: 'start',
          text: "Năm 43, Mã Viện dẫn quân sang xâm lược. Thay vì thất bại ở Cẩm Khê, Hai Bà Trưng đã lãnh đạo quân dân, dựa vào địa hình hiểm trở và lòng dân, đẩy lùi hoàn toàn cuộc xâm lược của quân Hán. Nền độc lập của dân tộc được giữ vững. Trước mặt Trưng Nữ Vương bây giờ là hai con đường: xây dựng một nhà nước theo mô hình cũ của các vua Hùng, hay cải cách theo mô hình nhà Hán để củng cố quốc gia?",
          choices: [
            { text: "Duy trì mô hình Lạc tướng, Lạc hầu.", targetNodeId: 'traditional_model' },
            { text: "Cải cách hành chính, học hỏi nhà Hán.", targetNodeId: 'reform_model' },
          ],
        },
        'traditional_model': {
          id: 'traditional_model',
          text: "Trưng Vương quyết định giữ lại cấu trúc nhà nước quen thuộc với các Lạc tướng đứng đầu các bộ lạc. Điều này giúp ổn định xã hội nhanh chóng vì được lòng dân và các tù trưởng. Tuy nhiên, quyền lực không tập trung, dẫn đến sự cát cứ và khó khăn trong việc đối phó với các mối đe dọa lớn từ phương Bắc trong những năm sau đó. Nền độc lập mong manh nhưng lòng dân vẫn luôn hướng về cội nguồn.",
          choices: [],
          isTerminal: true,
          isSuccessOutcome: true,
          grantsMissionReward: true,
        },
        'reform_model': {
          id: 'reform_model',
          text: "Trưng Vương quyết định cải cách, chia lại các đơn vị hành chính và bổ nhiệm quan lại cai trị trực tiếp, tập trung quyền lực vào triều đình trung ương. Việc này ban đầu gây ra sự chống đối từ các Lạc tướng cũ, nhưng về lâu dài đã tạo ra một nhà nước vững mạnh, có khả năng tổ chức quân đội và kinh tế hiệu quả, đủ sức chống lại các cuộc xâm lược sau này. Việt Nam bước vào một kỷ nguyên độc lập và tự cường sớm hơn trong lịch sử.",
          choices: [],
          isTerminal: true,
          isSuccessOutcome: true,
          grantsMissionReward: true,
        },
      }
  },
  'ar-golden-turtle': {
    type: 'ar',
    id: 'ar-golden-turtle',
    title: 'Nỏ Thần Kim Quy',
    markerPatternUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/AR/AR-Marker-NoThan.patt',
    modelUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/main/pictures/AR/NoThan-AR.glb',
    reward: { id: Items.NO_THAN_ARTIFACT_ID, type: 'artifact' },
  },
  'hidden-object-ly-market': {
    type: 'hiddenObject',
    id: 'hidden-object-ly-market',
    title: 'Tìm vật phẩm ở chợ thời Lý',
    backgroundImageUrl: ImageUrls.HIDDEN_OBJECT_BG_URL,
    objectsToFind: [
        { id: 'item_coin', name: 'Tiền đồng', iconUrl: ImageUrls.LY_DYNASTY_COIN_URL, details: 'Tiền đồng là đơn vị tiền tệ chính được lưu hành dưới thời Lý, cho thấy một nền kinh tế thương mại phát triển.', coords: { x: 55, y: 75, width: 8, height: 12 } },
        { id: 'item_brush', name: 'Bút lông', iconUrl: ImageUrls.BUT_LONG_NGHIEN_MUC_URL, details: 'Bút lông và nghiên mực là vật dụng không thể thiếu của các nhà nho và sĩ tử, thể hiện sự coi trọng giáo dục.', coords: { x: 22, y: 55, width: 10, height: 15 } },
        { id: 'item_pottery', name: 'Gốm sứ', iconUrl: ImageUrls.TRADING_CERAMICS_ICON_URL, details: 'Gốm sứ men ngọc thời Lý nổi tiếng với chất lượng và hoa văn tinh xảo, là một mặt hàng xuất khẩu có giá trị.', coords: { x: 78, y: 60, width: 12, height: 18 } },
    ],
    reward: { id: Items.LY_DYNASTY_COIN_ARTIFACT_ID, type: 'artifact' },
  },
  'quiz-general-knowledge': {
    type: 'quiz',
    id: 'quiz-general-knowledge',
    title: 'Thử tài Sử học',
    questions: [], // Questions are now generated by AI in the component
    reward: { id: Items.BUT_LONG_NGHIEN_MUC_ARTIFACT_ID, type: 'artifact' },
  },
  'vuon-khong-nha-trong': {
      type: 'defense',
      id: 'vuon-khong-nha-trong',
      title: 'Kế sách "Vườn không nhà trống"',
      mapLayout: [
          ['forest', 'forest', 'road', 'road', 'empty', 'empty', 'empty', 'forest', 'forest', 'forest'],
          ['forest', 'road', 'road', 'village', 'road', 'road', 'empty', 'empty', 'forest', 'forest'],
          ['road', 'village', 'empty', 'empty', 'road', 'village', 'road', 'empty', 'empty', 'forest'],
          ['empty', 'road', 'empty', 'empty', 'road', 'empty', 'road', 'road', 'road', 'forest'],
          ['empty', 'road', 'village', 'road', 'road', 'empty', 'empty', 'village', 'road', 'forest'],
          ['empty', 'empty', 'road', 'road', 'empty', 'empty', 'empty', 'road', 'road', 'forest'],
          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'road', 'road', 'forest', 'forest'],
          ['forest', 'empty', 'empty', 'empty', 'empty', 'road', 'road', 'forest', 'forest', 'forest'],
          ['forest', 'forest', 'empty', 'empty', 'road', 'road', 'forest', 'forest', 'forest', 'forest'],
          ['forest', 'forest', 'forest', 'road', 'road', 'forest', 'forest', 'forest', 'forest', 'forest'],
      ],
      units: [
          { id: 'unit1', type: 'civilian', gridIndex: 13, evacuationCost: 1 },
          { id: 'unit2', type: 'supplies', gridIndex: 21, evacuationCost: 2 },
          { id: 'unit3', type: 'wounded', gridIndex: 42, evacuationCost: 3 },
          { id: 'unit4', type: 'civilian', gridIndex: 47, evacuationCost: 1 },
      ],
      turnLimit: 12,
      enemyProgressBarSegments: 10,
      reward: { id: Items.MU_TRU_NHA_TRAN_ARTIFACT_ID, type: 'artifact' },
  },
  'diplomacy-ly-thai-to': {
    type: 'diplomacy',
    id: 'diplomacy-ly-thai-to',
    title: 'Đối thoại với Lý Thái Tổ',
    characterName: 'Lý Thái Tổ',
    characterImageUrl: ImageUrls.LY_THAI_TO_AVATAR_URL,
    initialGoodwill: 20,
    targetGoodwill: 100,
    rounds: [
        {
            npc_dialogue: "Khanh nói kinh đô Hoa Lư địa thế hiểm trở, nhưng cũng vì thế mà tù túng, không phải là nơi để phát triển cơ nghiệp lâu dài. Khanh nghĩ sao?",
            player_choices: [
                { text: "Tâu bệ hạ, địa thế hiểm trở chỉ hợp phòng thủ, không lợi cho dân sinh phát triển.", points: 30 },
                { text: "Bệ hạ nói chí phải. Nhưng dời đô là việc lớn, cần cân nhắc kỹ lưỡng.", points: 10 },
                { text: "Hoa Lư là kinh đô cũ, đã gắn với công lao của tiên đế, không nên dời đi.", points: -10 },
            ]
        },
        {
            npc_dialogue: "Ta thấy thành Đại La đất rộng lại bằng phẳng, ở trung tâm trời đất, là nơi hội tụ của bốn phương. Đó có phải là nơi đế vương muôn đời ở không?",
            player_choices: [
                { text: "Tâu bệ hạ, đó chính là nơi 'rồng cuộn hổ ngồi', địa thế tuyệt vời nhất.", points: 30 },
                { text: "Thành Đại La tuy tốt nhưng từng bị giặc phương Bắc đô hộ, e rằng lòng dân chưa yên.", points: -5 },
                { text: "Nơi nào cũng được miễn là bệ hạ anh minh.", points: 5 },
            ]
        },
        {
            npc_dialogue: "Vậy theo khanh, nếu dời đô về Đại La, điều gì là quan trọng nhất cần làm trước tiên?",
            player_choices: [
                { text: "Phải xây dựng thành trì kiên cố, đặt tên mới là Thăng Long để thể hiện khí thế vươn lên.", points: 30 },
                { text: "Cần giảm thuế, vỗ về dân chúng để họ an cư lạc nghiệp.", points: 20 },
                { text: "Nên xây dựng cung điện nguy nga để thể hiện uy quyền của triều đình.", points: -10 },
            ]
        }
    ],
    reward: { id: Items.CHIEU_DOI_DO_ARTIFACT_ID, type: 'artifact' }
  },
  'trading-hoi-an': {
      type: 'trading',
      id: 'trading-hoi-an',
      title: 'Giao thương Hội An',
      initialCapital: 1000,
      targetCapital: 5000,
      daysLimit: 20,
      goods: [
          { id: 'silk', name: 'Tơ lụa', basePrice: 100, iconUrl: ImageUrls.TRADING_SILK_ICON_URL },
          { id: 'ceramics', name: 'Gốm sứ', basePrice: 60, iconUrl: ImageUrls.TRADING_CERAMICS_ICON_URL },
          { id: 'spices', name: 'Trầm hương', basePrice: 250, iconUrl: ImageUrls.TRADING_SPICES_ICON_URL },
      ],
      events: [
          { description: 'Thuyền buôn Ba Tư đến, giá Trầm hương tăng vọt!', priceModifier: { goodId: 'spices', multiplier: 1.8 } },
          { description: 'Làng gốm Bát Tràng được mùa, gốm sứ giá rẻ!', priceModifier: { goodId: 'ceramics', multiplier: 0.7 } },
          { description: 'Nắng nóng kéo dài, tằm kém ăn, giá tơ lụa tăng.', priceModifier: { goodId: 'silk', multiplier: 1.5 } },
          { description: 'Bão lớn, thuyền buôn không thể cập bến, mọi thứ đều đắt đỏ!', priceModifier: { goodId: 'spices', multiplier: 1.2 } },
          { description: 'Mùa màng thất bát, giá Tơ lụa giảm mạnh.', priceModifier: { goodId: 'silk', multiplier: 0.6 } },
          { description: 'Phát hiện mỏ đất sét mới, giá Gốm sứ hạ.', priceModifier: { goodId: 'ceramics', multiplier: 0.8 } },
      ],
      reward: { id: Items.TIEN_QUANG_TRUNG_THONG_BAO_ARTIFACT_ID, type: 'artifact' }
  } as TradingMissionData,
  'coloring-dong-ho': {
    type: 'coloring',
    id: 'coloring-dong-ho',
    title: 'Tô màu tranh Đông Hồ',
    lineArtSVG: `<svg width="400" height="300" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="mouse_body" d="M50 100 Q75 50 100 100 T150 100" stroke="black" stroke-width="2" fill="#fff"/><path id="mouse_ear_1" d="M60 80 Q65 70 70 80" stroke="black" stroke-width="2" fill="#fff"/><path id="mouse_ear_2" d="M130 80 Q135 70 140 80" stroke="black" stroke-width="2" fill="#fff"/><path id="cat_body" d="M25 50 H175 V25 H25 Z" stroke="black" stroke-width="2" fill="#fff"/></svg>`, // Dummy SVG
    colorPalette: ['#FFD700', '#F08080', '#8B4513'], // Gold, LightCoral, SaddleBrown
    solution: {
        'mouse_body': '#8B4513',
        'mouse_ear_1': '#F08080',
        'mouse_ear_2': '#F08080',
        'cat_body': '#FFD700'
    },
    reward: { id: Items.TRANH_DAM_CUOI_CHUOT_ARTIFACT_ID, type: 'artifact' }
  },
  'rhythm-nha-nhac': {
    type: 'rhythm',
    id: 'rhythm-nha-nhac',
    title: 'Nhã nhạc Cung đình',
    songUrl: 'https://cdn.pixabay.com/audio/2022/08/03/audio_3fa9e392ad.mp3',
    noteMap: [
        { time: 1000, lane: 1 }, { time: 1500, lane: 2 }, { time: 2000, lane: 3 },
        { time: 2500, lane: 1 }, { time: 2750, lane: 2 }, { time: 3000, lane: 1 },
        { time: 3500, lane: 3 }, { time: 3750, lane: 2 }, { time: 4000, lane: 3 },
    ],
    targetScore: 50,
    reward: { id: Items.DAN_NGUYET_ARTIFACT_ID, type: 'artifact' }
  },
  [MISSION_HICH_TUONG_SI_ID]: {
    type: 'rallyCall',
    id: MISSION_HICH_TUONG_SI_ID,
    title: 'Hoàn thành Hịch tướng sĩ',
    reward: { id: Items.HICH_TUONG_SI_ARTIFACT_ID, type: 'artifact' },
    fullText: `Ta thường nghe: Kỷ Tín đem mình chết thay, cứu thoát cho Cao Đế; Do Vu chìa lưng chịu giáo, che chở cho Chiêu Vương; Dự Nhượng nuốt than, báo thù cho chủ; Thân Khoái chặt tay để cứu nạn cho nước. Các người ở cùng ta, coi giữ binh quyền đã lâu, không có mặc thì ta cho áo, không có ăn thì ta cho cơm. Quan nhỏ thì ta thăng chức, lương ít thì ta cấp bổng. Đi thủy thì ta cho thuyền, đi bộ thì ta cho ngựa. Nay các ngươi nhìn chủ nhục mà không biết lo, thấy nước nhục mà không biết thẹn. Làm tướng triều đình phải hầu quân giặc mà không biết tức. Có kẻ lấy việc chọi gà làm vui, có kẻ lấy việc đánh bạc làm tiêu khiển. Hoặc vui thú vườn ruộng, hoặc quyến luyến vợ con. Nếu có giặc Mông Thát tràn sang thì cựa gà trống không thể đâm thủng áo giáp của giặc, mẹo cờ bạc không thể dùng làm mưu lược nhà binh.`,
    possibleBlanks: ['Kỷ Tín', 'Do Vu', 'Dự Nhượng', 'Thân Khoái', 'binh quyền', 'chủ nhục', 'nước nhục', 'chọi gà', 'đánh bạc', 'Mông Thát']
  },
  'quang-trung-strategy-map': {
      type: 'strategyMap',
      id: 'quang-trung-strategy-map',
      title: 'Hành quân thần tốc',
      mapImageUrl: ImageUrls.STRATEGY_MAP_NGOC_HOI_URL,
      startPoint: { x: 50, y: 90 }, // Bottom center
      endPoint: { x: 50, y: 10 }, // Top center
      dangerZones: [
          { x: 20, y: 65, radius: 10 },
          { x: 80, y: 55, radius: 12 },
          { x: 50, y: 35, radius: 15 },
      ],
      reward: { id: Items.AO_BAO_TAY_SON_ARTIFACT_ID, type: 'artifact' },
  } as StrategyMapMissionData,
  'quang-trung-coin-minting': {
      type: 'coinMinting',
      id: 'quang-trung-coin-minting',
      title: 'Đúc tiền Quang Trung Thông Bảo',
      tasks: [
        { id: 'task1', name: 'Quang Trung Thông Bảo', coinImageUrl: ImageUrls.ARTIFACT_QUANG_TRUNG_COIN_MINTED_URL, requiredMetalId: 'copper', requiredMoldId: 'mold_quang_trung' }
      ],
      metalOptions: [
        { id: 'copper', name: 'Đồng', imageUrl: ImageUrls.METAL_COPPER_URL },
        { id: 'iron', name: 'Sắt', imageUrl: ImageUrls.METAL_IRON_URL },
      ],
      moldOptions: [
        { id: 'mold_quang_trung', name: 'Khuôn Quang Trung', imageUrl: ImageUrls.MOLD_QUANG_TRUNG_URL },
        { id: 'mold_ly', name: 'Khuôn thời Lý', imageUrl: ImageUrls.MOLD_LY_URL },
      ],
      reward: { id: Items.DONG_TIEN_QUANG_TRUNG_ARTIFACT_ID, type: 'artifact' },
  } as CoinMintingMissionData,
  'hue-city-planning': {
    type: 'cityPlanning',
    id: 'hue-city-planning',
    title: 'Xây dựng Kinh thành Huế',
    mapImageUrl: ImageUrls.MAP_KINH_THANH_HUE_URL,
    buildings: [
        { id: 'ngo-mon', name: 'Ngọ Môn', iconUrl: ImageUrls.ICON_NGO_MON_URL, correctPosition: { x: 45, y: 75 } },
        { id: 'thai-hoa', name: 'Điện Thái Hòa', iconUrl: ImageUrls.ICON_THAI_HOA_URL, correctPosition: { x: 45, y: 45 } },
        { id: 'the-mieu', name: 'Thế Miếu', iconUrl: ImageUrls.ICON_THE_MIEU_URL, correctPosition: { x: 15, y: 60 } },
    ],
    reward: { id: Items.MO_HINH_CUU_DINH_ARTIFACT_ID, type: 'artifact' },
  } as CityPlanningMissionData,
  'quoc-ngu-typesetting': {
    type: 'typesetting',
    id: 'quoc-ngu-typesetting',
    title: 'In báo Chữ Quốc Ngữ',
    targetText: 'ĐỘC LẬP TỰ DO',
    availableLetters: ['Đ', 'Ộ', 'C', 'L', 'Ậ', 'P', 'T', 'Ự', 'D', 'O', 'A', 'N', 'H', 'G', 'Ê', 'M'],
    reward: { id: Items.GIA_DINH_BAO_ARTIFACT_ID, type: 'artifact' },
  } as TypesettingMissionData,
  'dong-du-adventure-puzzle': {
    type: 'adventurePuzzle',
    id: 'dong-du-adventure-puzzle',
    title: 'Vượt biển Đông Du',
    riddles: [
        { riddleText: "Ta là người khởi xướng phong trào, hiệu là Sào Nam. Ta là ai?", correctAnswer: "Phan Boi Chau", hint: "Tên của ông có nghĩa là 'châu báu họ Phan'." },
        { riddleText: "Đất nước mặt trời mọc, nơi các nhà yêu nước tìm đến để học hỏi. Đó là nước nào?", correctAnswer: "Nhat Ban", hint: "Quốc gia này nổi tiếng với hoa anh đào." },
        { riddleText: "Phong trào mang tên 'Hành trình về phương Đông'. Tên của phong trào là gì?", correctAnswer: "Dong Du", hint: "Tên phong trào có hai chữ, ghép từ 'phương Đông' và 'du học'." },
    ],
    reward: { id: Items.VALI_DONG_DU_ARTIFACT_ID, type: 'artifact' },
  } as AdventurePuzzleMissionData,
  [MISSION_DONG_LOC_PATH_ID]: {
    type: 'strategicPath',
    id: MISSION_DONG_LOC_PATH_ID,
    title: 'Ngã ba Đồng Lộc',
    reward: { id: Items.TRUONG_SON_COMPASS_ARTIFACT_ID, type: 'artifact' },
    start: { x: 5, y: 14 },
    end: { x: 5, y: 0 },
    initialSupplies: 100,
    mapLayout: [ // 15 rows, 10 cols
        [1,1,1,1,1,8,1,1,1,1],
        [1,1,3,1,1,8,1,1,3,1],
        [1,1,8,8,8,8,8,8,8,1],
        [1,6,8,1,1,1,1,1,8,1],
        [1,1,8,1,9,1,1,1,8,1],
        [1,1,8,1,1,1,1,1,8,1],
        [3,8,8,8,8,5,8,8,8,3],
        [1,1,1,1,8,1,1,1,1,1],
        [1,3,1,1,8,1,1,3,1,1],
        [1,8,8,8,8,8,8,8,8,1],
        [1,8,1,1,1,6,1,1,8,1],
        [1,8,1,9,1,1,1,1,8,1],
        [1,8,1,1,1,1,1,1,8,1],
        [3,8,8,5,8,8,8,8,8,3],
        [1,1,1,1,1,8,1,1,1,1],
    ]
  } as StrategicPathMissionData,
  [MISSION_CUA_CHUA_PATH_ID]: {
    type: 'strategicPath',
    id: MISSION_CUA_CHUA_PATH_ID,
    title: 'Cua chữ A - Đèo Phu La Nhích',
    reward: { id: Items.DIEN_DAI_TRINH_SAT_ARTIFACT_ID, type: 'artifact' },
    start: { x: 0, y: 7 },
    end: { x: 9, y: 7 },
    initialSupplies: 150,
    mapLayout: [ // 15 rows, 10 cols
        [1,1,1,1,1,1,1,1,1,1],
        [1,10,1,1,1,1,1,10,1,1],
        [1,0,10,0,0,0,0,10,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [11,0,1,0,0,0,0,1,0,5],
        [8,8,8,8,8,8,8,8,8,8], // Cửa Chùa
        [1,0,1,0,0,0,0,1,0,11],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,10,0,0,0,16,10,0,1],
        [1,10,1,1,1,1,1,10,1,1],
        [1,1,1,15,1,1,1,1,1,1],
    ],
    unstableMountains: [ {x:2, y:3}, {x:2, y:5}, {x:7, y:3}, {x:7, y:5}, {x:2, y:13}, {x:7, y:13} ],
  } as StrategicPathMissionData,
  [MISSION_SEBANGHIENG_PATH_ID]: {
    type: 'strategicPath',
    id: MISSION_SEBANGHIENG_PATH_ID,
    title: 'Vượt sông Sê Băng Hiêng',
    reward: { id: Items.PONTOON_BRIDGE_MODEL_ID, type: 'decoration' },
    start: { x: 0, y: 0 }, // Player start doesn't matter as much, convoy does
    end: { x: 9, y: 0 },   // Convoy end goal
    initialSupplies: 200,
    mapLayout: [ // 15 rows, 10 cols
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,0,1,1,0,1,1,0],
        [0,1,1,0,1,1,0,1,1,0],
        [8,8,8,8,8,8,8,8,8,8], // Convoy path
        [12,12,12,12,12,12,12,12,12,12], // River
        [12,12,12,12,12,12,12,12,12,12],
        [12,12,12,12,12,12,12,12,12,12],
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,0,0,1,1,0,1,1],
        [13,0,1,1,0,1,1,0,1,13],
        [0,0,0,1,0,1,0,0,0,0],
        [1,1,0,1,0,1,0,1,1,0],
        [1,1,0,0,0,0,0,1,1,0],
        [0,0,16,1,1,1,1,1,0,0],
        [15,0,0,0,0,0,0,0,0,15],
    ],
    convoyPath: [ {x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:8, y:3}, {x:9, y:3} ],
  } as StrategicPathMissionData,
  'ba-trieu-lanes': {
    type: 'laneBattle',
    id: 'ba-trieu-lanes',
    title: 'Cưỡi voi đánh giặc',
    duration: 90, // 90 seconds
    defensePoints: 10,
    reward: { id: Items.BA_TRIEU_PHOENIX_HAIRPIN_ARTIFACT_ID, type: 'artifact' }
  } as LaneBattleMissionData,
  'xay-chua-van-xuan': {
    type: 'constructionPuzzle',
    id: 'xay-chua-van-xuan',
    title: 'Lý Bí và nước Vạn Xuân',
    gridSize: { rows: 10, cols: 10 },
    pieces: [
        { id: 'foundation', shape: [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ], imageUrl: ImageUrls.PUZZLE_CHUA_NEN_MONG_URL },
        { id: 'gate', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_CONG_CHUA_URL },
        { id: 'corridor', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_HANH_LANG_URL },
        { id: 'main_hall', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_CHINH_DIEN_URL },
        { id: 'roof', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_MAI_CHUA_URL },
    ],
    solution: {
        'foundation': { x: 3, y: 5, rotationIndex: 0 },
        'gate':       { x: 0, y: 6, rotationIndex: 0 },
        'corridor':   { x: 7, y: 6, rotationIndex: 0 },
        'main_hall':  { x: 3, y: 4, rotationIndex: 0 },
        'roof':       { x: 3, y: 2, rotationIndex: 0 },
    },
    reward: { id: Items.MO_HINH_CHUA_VAN_XUAN_ARTIFACT_ID, type: 'artifact' },
  } as ConstructionPuzzleMissionData,
  'bach-dang-tactical-map': {
      type: 'tacticalMap',
      id: 'bach-dang-tactical-map',
      title: 'Bố Trí Trận Địa',
      backgroundUrl: ImageUrls.BG_LANE_BATTLE_URL,
      stakeImageUrl: ImageUrls.BACH_DANG_STAKE_ICON_URL,
      reward: { id: Items.BACH_DANG_STAKE_FRAGMENT_ID, type: 'fragment' },
      dropZones: [
        { id: 'narrow_estuary', x: 45, y: 30, width: 10, height: 25 },
        { id: 'reed_bank', x: 10, y: 40, width: 25, height: 40 },
        { id: 'whirlpool', x: 65, y: 60, width: 15, height: 20 },
      ],
  } as TacticalMapMissionData,
  'bach-dang-naval-battle': {
      type: 'navalBattle',
      id: 'bach-dang-naval-battle',
      title: 'Đại Phá Quân Nam Hán',
      backgroundUrl: ImageUrls.BG_LANE_BATTLE_URL,
      enemyShipIconUrl: ImageUrls.ENEMY_SHIP_ICON_URL,
      trapZone: { start: 40, end: 70 }, // 40% to 70% of the screen width
      shipSpeed: 80, // pixels per second
      tideDuration: 10, // 10 seconds for a full cycle
      reward: { id: Items.COC_GO_BACH_DANG_ARTIFACT_ID, type: 'artifact' },
  } as NavalBattleMissionData,
  'find-bach-dang-ambush-spot': {
    type: 'hiddenObject',
    id: 'find-bach-dang-ambush-spot',
    title: 'Khảo Sát Địa Hình Bạch Đằng',
    backgroundImageUrl: ImageUrls.BG_LANE_BATTLE_URL,
    objectsToFind: [
        { id: 'narrow_estuary', name: 'Cửa Sông Hẹp', iconUrl: ImageUrls.ICON_CUA_SONG_HEP_URL, details: 'Nơi cửa sông thu hẹp, dễ dàng cho việc bố trí trận địa và ngăn chặn đường lui của địch.', coords: { x: 45, y: 30, width: 10, height: 25 } },
        { id: 'reed_bank', name: 'Bờ Lau Sậy', iconUrl: ImageUrls.ICON_BAI_LAU_SAY_URL, details: 'Các bờ lau sậy um tùm là nơi lý tưởng để mai phục quân, tạo yếu tố bất ngờ.', coords: { x: 10, y: 40, width: 25, height: 40 } },
        { id: 'whirlpool', name: 'Vùng Nước Xoáy', iconUrl: ImageUrls.ICON_VUNG_NUOC_XOAY_URL, details: 'Vùng nước chảy xiết và có xoáy sẽ gây khó khăn cho thuyền lớn của địch khi di chuyển.', coords: { x: 65, y: 60, width: 15, height: 20 } },
    ],
    // No reward, this mission is just a step in a quest.
  } as HiddenObjectMissionData,
};