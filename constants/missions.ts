// constants/missions.ts
import { MissionData, DetectiveMissionData, RallyCallMissionData, TacticalBattleMissionData, NewspaperPublisherMissionData } from '../types';
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
                {id: 'choice3_1', text: "Ba kẻo oan ức lòng chồng!", iconUrl: ImageUrls.ICON_VOW_PERSONAL_URL, moralePoints: 20},
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
  'thang_long_spy': {
    type: 'detective',
    id: 'thang_long_spy',
    title: 'Mật Thám Chốn Thị Thành',
    reward: { id: Items.LY_DYNASTY_COIN_ARTIFACT_ID, type: 'artifact' },
    backgroundUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Background/B-phien-cho-thoi-ly.png',
    turnLimit: 12,
    npcs: [
      {
        id: 'ba_ban_tra', name: 'Bà bán trà',
        avatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-ba-ban-tra.png',
        dialogueAvatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-ba-ban-tra-avt.png',
        position: { top: '30%', left: '15%' },
        initialDialogue: "Trà mới đây, trà mới thơm ngon đây! Chà, trông quan nhân có vẻ đang tìm kiếm gì đó thì phải?",
        clue: { id: 'clue_dialogue_1', text: 'Bà bán trà nghe loáng thoáng có người hẹn gặp ở bến tàu để giao "hàng đặc biệt".', isTrue: false, iconUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-cuoc-hoi-thoai.png' },
        turnCost: 1,
        professionInfo: {
          title: "Nghề Bán Trà (Thời Lý)",
          description: "Ở Thăng Long thời Lý, các quán trà là nơi tụ tập của đủ mọi tầng lớp, từ quan lại đến dân thường. Đây không chỉ là nơi thưởng thức trà mà còn là trung tâm trao đổi thông tin, bàn luận chuyện thời sự. Một người bán trà có thể nghe được rất nhiều bí mật."
        }
      },
      {
        id: 'nguoi_ban_lua', name: 'Cô bán lụa',
        avatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-nguoi-ban-lua.png',
        dialogueAvatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-nguoi-ban-lua-avt.png',
        position: { top: '65%', left: '25%' },
        initialDialogue: "Lụa Hà Đông đẹp nhất Thăng Long thành đây, quan nhân muốn mua một tấm không?",
        clue: { id: 'clue_silk_1', text: 'Cô bán lụa bán một tấm vải đen, dày cho một người đàn ông đi khập khiễng, có vẻ để gói vật nặng.', isTrue: false, iconUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-vai-lua.png' },
        turnCost: 1,
        professionInfo: {
          title: "Nghề Bán Lụa (Thời Lý)",
          description: "Lụa là một mặt hàng xa xỉ và là niềm tự hào của Đại Việt. Các làng nghề dệt lụa nổi tiếng như lụa Vạn Phúc (Hà Đông) đã có từ lâu đời. Các cửa hàng bán lụa ở kinh thành thường giao thương với cả thương nhân trong và ngoài nước."
        }
      },
      {
        id: 'bac_tho_ren', name: 'Bác thợ rèn',
        avatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-bac-tho-ren.png',
        dialogueAvatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-bac-tho-ren-avt.png',
        position: { top: '50%', left: '70%' },
        initialDialogue: "Búa và đe của tôi lúc nào cũng sẵn sàng. Quan nhân cần rèn thứ gì à?",
        clue: { id: 'clue_metal_box_1', text: 'Bác thợ rèn được đặt làm một chiếc hộp sắt nhỏ nhưng rất nặng. Người đặt hàng không hề đi khập khiễng.', isTrue: true, iconUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-thanh-sat.png' },
        turnCost: 2,
        professionInfo: {
          title: "Nghề Thợ Rèn (Thời Lý)",
          description: "Thợ rèn là một nghề quan trọng, chuyên sản xuất công cụ nông nghiệp và vũ khí. Các lò rèn thường rất ồn ào và tấp nập, là một phần không thể thiếu của cuộc sống thành thị, cung cấp những vật dụng thiết yếu cho cả dân sinh và quân đội."
        }
      },
      {
        id: 'linh_gac_thanh', name: 'Lính gác thành',
        avatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-linh-gac-thanh.png',
        dialogueAvatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-linh-gac-thanh-avt.png',
        position: { top: '10%', left: '85%' },
        initialDialogue: "Cửa Tây nghiêm ngặt, phận sự của ta là đảm bảo không kẻ gian nào lọt qua.",
        clue: { id: 'clue_gate_1', text: 'Lính gác thành để ý thấy có kẻ lạ mặt lảng vảng gần cửa Tây, có cử chỉ ám muội với một vị thương nhân ngoại quốc.', isTrue: true, iconUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-vu-khi-la.png' },
        turnCost: 3,
        professionInfo: {
          title: "Lính Gác Thành (Cấm quân)",
          description: "Việc canh gác các cổng thành ở kinh đô Thăng Long là vô cùng trọng yếu. Lính gác (Cấm quân) chịu trách nhiệm kiểm soát người và hàng hóa ra vào, đảm bảo an ninh và ngăn chặn gián điệp. Họ có tai mắt tinh tường và am hiểu các ngõ ngách của kinh thành."
        }
      },
      {
        id: 'nguoi_ban_hoa_qua', name: 'Chị bán hoa quả',
        avatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-nguoi-ban-hoa-qua.png',
        dialogueAvatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-nguoi-ban-hoa-qua-avt.png',
        position: { top: '75%', left: '55%' },
        initialDialogue: "Mận, đào, mơ tươi ngon! Mời quan nhân nếm thử!",
        clue: { id: 'clue_fruits_1', text: 'Một vị quý tộc trông có vẻ lo lắng, mua rất nhiều hoa quả rẻ tiền, khác hẳn với thói quen thường ngày.', isTrue: true, iconUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-quan-sat.png' },
        turnCost: 1,
        professionInfo: {
            title: "Nghề Bán Hàng Rong (Thời Lý)",
            description: "Chợ búa ở Thăng Long rất sầm uất với nhiều loại hoa quả, nông sản từ các vùng lân cận đổ về. Người bán hàng rong như chị bán hoa quả tiếp xúc với rất nhiều người mỗi ngày và có thể để ý những hành vi bất thường của khách mua."
        }
      },
      {
        id: 'nguoi_dan_thuong', name: 'Người dân thường',
        avatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-dan-thuong.png',
        dialogueAvatarUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/NPCs/NPC-dan-thuong-avt.png',
        position: { top: '40%', left: '40%' },
        initialDialogue: "Haizz, dạo này sưu cao thuế nặng, cuộc sống khó khăn quá...",
        clue: { id: 'clue_marina_1', text: 'Người dân thường phàn nàn về việc bến tàu dạo này có nhiều lính canh hơn, kiểm tra hàng hóa rất gắt gao.', isTrue: false, iconUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-ben-tau.png' },
        turnCost: 1,
        professionInfo: {
            title: "Đời sống dân thường (Thời Lý)",
            description: "Đời sống của dân thường ở kinh thành Thăng Long xoay quanh các phường hội thủ công và buôn bán. Họ là tai mắt của triều đình, những thay đổi nhỏ nhất trong cuộc sống hay sự xuất hiện của những kẻ lạ mặt đều không qua được mắt họ."
        }
      },
    ],
    suspects: [
      { id: 'suspect_1', name: 'Lão thương nhân', portraitUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Character/C-nghi-pham-1.png' },
      { id: 'suspect_2', name: 'Vị quý tộc', portraitUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Character/C-nghi-pham-2.png' },
      { id: 'suspect_3', name: 'Thợ thủ công ngoại quốc', portraitUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/Character/C-nghi-pham-3.png' },
    ],
    solution: {
      culpritId: 'suspect_3',
      evidenceIds: ['clue_metal_box_1', 'clue_gate_1', 'clue_deception_1']
    },
    contradictions: {
      'clue_silk_1': ['clue_metal_box_1', 'clue_deception_1'],
    },
    deductionClues: {
      'clue_deception_1': {
        id: 'clue_deception_1',
        text: 'Manh mối mâu thuẫn! Có kẻ đang cố tình tung hỏa mù. Vụ án có thể có 2 người, hoặc một kẻ cải trang.',
        isTrue: true,
        iconUrl: 'https://raw.githubusercontent.com/vtvinh87/dongchaylichsu/refs/heads/main/pictures/icon/icon-mat-na.png',
        revealedByContradiction: true,
      }
    }
  } as DetectiveMissionData,
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
      turnLimit: 10,
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
    fullText: `Huống chi, ta cùng các ngươi sinh ra phải thời loạn lạc, lớn lên gặp buổi gian nan. Lén nhìn sứ ngụy đi lại nghênh ngang ngoài đường, uốn tấc lưỡi cú diều mà lăng nhục triều đình; đem tấm thân dê chó mà khinh rẻ tổ phụ. Ỷ mệnh Hốt Tất Liệt mà đòi ngọc lụa để phụng sự lòng tham khôn cùng; khoác hiệu Vân Nam Vương mà hạch bạc vàng, để vét kiệt của kho có hạn. Thật khác nào đem thịt ném cho hổ đói, tránh sao khỏi tai họa về sau.\nTa thường tới bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa; chỉ giận chưa thể xả thịt, lột da, ăn gan, uống máu quân thù; dẫu cho trăm thân ta phơi ngoài nội cỏ, nghìn thây ta bọc trong da ngựa, cũng nguyện xin làm.`,
  },
  'tay_son_march': {
    type: 'strategicMarch',
    id: 'tay_son_march',
    title: 'Hành Quân Thần Tốc',
    mapImageUrl: ImageUrls.MARCH_MAP_URL,
    armyIconUrl: ImageUrls.ARMY_ICON_TAY_SON_URL,
    initialTime: 100,
    initialMorale: 80,
    initialManpower: 50000,
    path: [
      { x: 50, y: 85 }, { x: 52, y: 78 }, { x: 48, y: 70 },
      { x: 55, y: 62 }, { x: 60, y: 55 }, { x: 58, y: 48 },
      { x: 50, y: 40 }, { x: 45, y: 32 }, { x: 48, y: 25 },
      { x: 50, y: 15 },
    ],
    events: [
      {
        id: 'event1',
        triggerAtStep: 2,
        prompt: "Phía trước là một con sông lớn, nhưng cầu đã bị phá hủy. Chúng ta phải làm gì?",
        imageUrl: ImageUrls.EVENT_INTEL_URL,
        choices: [
          { text: "Dành thời gian tìm khúc cạn để lội qua. (Tốn Thời Gian, ít rủi ro)", effects: { time: -10, morale: -5, manpower: 0 }, historicalNote: "Sự kiên nhẫn và tìm đường an toàn thể hiện sự thận trọng của một vị tướng, bảo toàn lực lượng cho trận đánh lớn." },
          { text: "Chặt tre kết bè để vượt sông nhanh chóng. (Tốn Binh Lực, nhanh hơn)", effects: { time: -5, morale: 5, manpower: -2000 }, historicalNote: "Quân Tây Sơn nổi tiếng với khả năng hành quân linh hoạt, tận dụng mọi phương tiện để vượt địa hình, tạo nên yếu tố 'thần tốc'." },
        ],
      },
      {
        id: 'event2',
        triggerAtStep: 5,
        prompt: "Dân địa phương mang lương thực ra ủng hộ quân ta! Họ muốn gia nhập nghĩa quân.",
        imageUrl: ImageUrls.EVENT_RECRUIT_URL,
        choices: [
          { text: "Chào đón họ! (Tăng Binh Lực, Sĩ Khí)", effects: { time: 0, morale: 15, manpower: 5000 }, historicalNote: "Vua Quang Trung được lòng dân sâu sắc. Đi đến đâu, ông cũng được nhân dân ủng hộ, gia nhập nghĩa quân, tạo nên sức mạnh to lớn." },
          { text: "Cảm ơn nhưng từ chối. Giữ cho đội quân tinh nhuệ. (Tăng Sĩ Khí)", effects: { time: 0, morale: 5, manpower: 0 }, historicalNote: "Giữ vững kỷ luật và đảm bảo đội quân tinh gọn cũng là một chiến lược quan trọng để duy trì tốc độ và khả năng chiến đấu." },
        ],
      },
      {
        id: 'event3',
        triggerAtStep: 8,
        prompt: "Một toán quân địch nhỏ đang phục kích trong rừng. Ta nên làm gì?",
        imageUrl: ImageUrls.EVENT_INTEL_URL,
        choices: [
          { text: "Dùng một đội nhỏ đánh lạc hướng và đi đường vòng. (Tốn Thời Gian)", effects: { time: -8, morale: 0, manpower: -500 }, historicalNote: "Chiến thuật 'nghi binh' thường được sử dụng để tránh những cuộc đụng độ không cần thiết và bảo toàn lực lượng cho mục tiêu chính." },
          { text: "Tấn công trực diện để dẹp đường. (Tốn Binh Lực, Sĩ Khí)", effects: { time: -2, morale: 10, manpower: -3000 }, historicalNote: "Những chiến thắng nhỏ trên đường đi giúp củng cố tinh thần quân sĩ, thể hiện uy thế và sức mạnh của đội quân Tây Sơn." },
        ],
      },
    ],
    landmarks: [
        { id: 'tam_diep', name: 'Phòng tuyến Tam Điệp', description: 'Đây là nơi vua Quang Trung cho dừng quân, chỉnh đốn lại đội ngũ và tổ chức lễ duyệt binh lớn để củng cố tinh thần quân sĩ trước khi tiến ra Thăng Long.', position: { x: 58, y: 48 }, iconUrl: ImageUrls.ICON_PHONG_TUYEN_TAM_DIEP_URL },
        { id: 'nghe_an', name: 'Nghệ An', description: 'Nghệ An là vùng đất "địa linh nhân kiệt", nơi vua Quang Trung đã dừng chân để tuyển mộ thêm hàng vạn binh lính, chuẩn bị cho cuộc đại phá quân Thanh.', position: { x: 60, y: 78 }, iconUrl: ImageUrls.ICON_NGHE_AN_URL },
        { id: 'song_gian', name: 'Sông Gián', description: 'Một trận thủy chiến nhỏ nhưng quan trọng đã diễn ra tại đây, tiêu diệt một phần lực lượng của quân Thanh, làm chậm bước tiến của chúng và tạo lợi thế cho quân ta.', position: { x: 40, y: 40 }, iconUrl: ImageUrls.ICON_SONG_GIAN_URL },
        { id: 'dong_da', name: 'Gò Đống Đa', description: 'Đây là một trong những chiến trường ác liệt nhất, nơi quân Tây Sơn đã làm nên một chiến thắng vang dội, thiêu rụi đồn trại của quân Thanh, góp phần quyết định vào thắng lợi cuối cùng của chiến dịch.', position: { x: 55, y: 15 }, iconUrl: ImageUrls.ICON_GO_DONG_DA_URL },
    ],
  },
  'tay_son_oath': {
    type: 'rallyCall',
    id: 'tay_son_oath',
    title: 'Hẹn Ước Thăng Long',
    rounds: [
        {
            prompt: "Vua Quang Trung nói: 'Hỡi các tướng sĩ! Giặc Thanh đã chiếm Thăng Long. Nỗi nhục này, ta và các ngươi quyết không đội trời chung!'",
            choices: [
                {id: 'oath1_1', text: "Thề quyết một trận tử chiến!", iconUrl: ImageUrls.ICON_POINT_SWORD_URL, moralePoints: 30, historicalNote: "Tinh thần quyết chiến của binh lính là yếu tố quan trọng nhất trong các trận đánh của quân Tây Sơn."},
                {id: 'oath1_2', text: "Xin Bệ hạ hãy cẩn trọng.", iconUrl: ImageUrls.ICON_VOW_PERSONAL_URL, moralePoints: 5},
                {id: 'oath1_3', text: "Chúng ta cần thêm quân.", iconUrl: ImageUrls.ICON_CALL_SOLDIERS_URL, moralePoints: 10},
            ]
        },
        {
            prompt: "Nhà vua tiếp lời: 'Ta sẽ tổ chức một bữa tiệc lớn ngay tại Thăng Long vào ngày mùng 7 Tết. Các ngươi có tin ta không?'",
            choices: [
                {id: 'oath2_1', text: "Chúng thần tin tưởng tuyệt đối vào Bệ hạ!", iconUrl: ImageUrls.ICON_RAISE_FLAG_URL, moralePoints: 40, historicalNote: "Niềm tin vào vị chủ soái là sức mạnh vô địch. Lời hẹn ước này đã trở thành một giai thoại lịch sử, thể hiện tài thao lược và sự tự tin của Quang Trung."},
                {id: 'oath2_2', text: "Đây là một nhiệm vụ khó khăn...", iconUrl: ImageUrls.ICON_VOW_WEALTH_URL, moralePoints: -5},
                {id: 'oath2_3', text: "Thần sẽ theo Bệ hạ đến cùng!", iconUrl: ImageUrls.ICON_VOW_NATION_URL, moralePoints: 20},
            ]
        },
        {
            prompt: "Vua Quang Trung dõng dạc: 'Vậy thì, hãy tiến lên! Đánh cho chúng phiến giáp bất hoàn! Đánh cho chúng biết nước Nam anh hùng là có chủ!'",
            choices: [
                {id: 'oath3_1', text: "XUNG PHONG!!!", iconUrl: ImageUrls.ICON_CHARGE_URL, moralePoints: 50, historicalNote: "Lời hịch ngắn gọn, đanh thép của Quang Trung có sức mạnh hiệu triệu to lớn, biến đội quân thành một cơn bão quét sạch quân thù."},
                {id: 'oath3_2', text: "Vì non sông Đại Việt!", iconUrl: ImageUrls.ICON_RAISE_FLAG_URL, moralePoints: 30},
                {id: 'oath3_3', text: "Thực hiện kế hoạch thôi.", iconUrl: ImageUrls.ICON_VOW_PERSONAL_URL, moralePoints: 10},
            ]
        },
    ]
  } as RallyCallMissionData,
  'tay_son_battle': {
    type: 'tacticalBattle',
    id: 'tay_son_battle',
    title: 'Đại Phá Ngọc Hồi - Đống Đa',
    reward: { id: Items.AO_BAO_TAY_SON_ARTIFACT_ID, type: 'artifact' },
    mapLayout: [
        ['forest', 'forest', 'road', 'road', 'empty', 'empty', 'forest', 'forest', 'forest', 'forest'],
        ['forest', 'empty', 'road', 'road', 'empty', 'empty', 'road', 'road', 'village', 'forest'],
        ['empty', 'empty', 'road', 'road', 'empty', 'empty', 'road', 'road', 'empty', 'empty'],
        ['road', 'road', 'road', 'village', 'empty', 'empty', 'empty', 'village', 'empty', 'empty'],
        ['road', 'road', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        ['road', 'road', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    unitDefinitions: {
        'bo_binh_tay_son': { id: 'bo_binh_tay_son', name: 'Bộ Binh Tây Sơn', iconUrl: ImageUrls.SPRITE_INFANTRY_ELITE_URL, maxHp: 100, attack: 25, attackRange: 1, moveRange: 3, description: "Lực lượng chủ lực, đặc biệt là lính từ Thanh - Nghệ, nổi tiếng thiện chiến, kỷ luật và có tinh thần chiến đấu cao." },
        'tuong_binh_tay_son': { id: 'tuong_binh_tay_son', name: 'Tượng Binh', iconUrl: ImageUrls.SPRITE_ELEPHANT_URL, maxHp: 250, attack: 40, attackRange: 1, moveRange: 2, specialAbility: 'charge', description: "Sức mạnh đột phá, có thể húc đổ đồn địch. Tượng binh là một trong những vũ khí lợi hại nhất của quân Tây Sơn, chuyên dùng để phá vỡ đội hình và gây hoảng loạn cho quân địch trong các trận đánh lớn." },
        'quan_thanh_bo': { id: 'quan_thanh_bo', name: 'Bộ Binh Thanh', iconUrl: ImageUrls.SPRITE_ENEMY_UNIT_URL, maxHp: 80, attack: 20, attackRange: 1, moveRange: 2, description: "Quân chính quy của nhà Thanh, được trang bị tốt nhưng sĩ khí kém." },
        'don_ngoc_hoi': { id: 'don_ngoc_hoi', name: 'Đồn Ngọc Hồi', iconUrl: ImageUrls.ICON_ENEMY_FORT_URL, maxHp: 500, attack: 10, attackRange: 2, moveRange: 0, description: "Một trong những đồn lũy kiên cố nhất của quân Thanh, phòng thủ vòng ngoài cho Thăng Long." },
        'cong_su': { id: 'cong_su', name: 'Công sự', iconUrl: ImageUrls.SPRITE_CONG_SU_URL, maxHp: 150, attack: 0, attackRange: 0, moveRange: 0, description: "Hàng rào phòng thủ, chặn đường di chuyển của quân bộ." },
    },
    playerUnitPool: ['bo_binh_tay_son', 'tuong_binh_tay_son'],
    playerUnits: [
        { unitId: 'tuong_binh_tay_son', x: 4, y: 5, isEnemy: false },
        { unitId: 'bo_binh_tay_son', x: 2, y: 5, isEnemy: false },
        { unitId: 'bo_binh_tay_son', x: 3, y: 5, isEnemy: false },
        { unitId: 'bo_binh_tay_son', x: 5, y: 5, isEnemy: false },
        { unitId: 'bo_binh_tay_son', x: 6, y: 5, isEnemy: false },
    ],
    enemyUnits: [
        // Infantry line
        { unitId: 'quan_thanh_bo', x: 2, y: 1, isEnemy: true },
        { unitId: 'quan_thanh_bo', x: 3, y: 1, isEnemy: true },
        { unitId: 'quan_thanh_bo', x: 6, y: 1, isEnemy: true },
        { unitId: 'quan_thanh_bo', x: 7, y: 1, isEnemy: true },
        // Fortification line
        { unitId: 'cong_su', x: 2, y: 2, isEnemy: true, isFort: true },
        { unitId: 'cong_su', x: 3, y: 2, isEnemy: true, isFort: true },
        { unitId: 'cong_su', x: 5, y: 2, isEnemy: true, isFort: true },
        { unitId: 'cong_su', x: 6, y: 2, isEnemy: true, isFort: true },
        { unitId: 'cong_su', x: 7, y: 2, isEnemy: true, isFort: true },
        // Main Fort
        { unitId: 'don_ngoc_hoi', x: 4, y: 0, isEnemy: true, isFort: true },
    ],
    deploymentZone: { x_min: 0, x_max: 9, y_min: 5, y_max: 5 },
    winCondition: { type: 'destroy_fort', position: {x: 4, y: 0} }
  } as TacticalBattleMissionData,
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
  },
  'hue-imperial-city-construction': {
    type: 'hueConstruction',
    id: 'hue-imperial-city-construction',
    title: 'Thuận Thiên Ý - Kiến Tạo Kinh Thành',
    reward: { id: Items.MO_HINH_CUU_DINH_ARTIFACT_ID, type: 'artifact' },
    mapImageUrl: ImageUrls.BG_HUE_PLANNING_URL,
    initialVatTu: 500,
    buildings: [
        { id: 'ky_dai', name: 'Kỳ Đài', cost: 100, phase: 1, iconUrl: ImageUrls.ICON_KY_DAI_URL, width: 8, height: 10 },
        { id: 'ngo_mon', name: 'Ngọ Môn Quan', cost: 150, phase: 1, iconUrl: ImageUrls.ICON_NGO_MON_QUAN_URL, width: 20, height: 15 },
        { id: 'thai_hoa', name: 'Điện Thái Hòa & Sân Đại Triều', cost: 200, phase: 2, iconUrl: ImageUrls.ICON_THAI_HOA_DAI_URL, width: 25, height: 25 },
        { id: 'the_mieu', name: 'Thế Tổ Miếu', cost: 120, phase: 3, iconUrl: ImageUrls.ICON_THE_TO_MIEU_URL, width: 18, height: 30 },
        { id: 'hien_lam', name: 'Hiển Lâm Các', cost: 120, phase: 3, iconUrl: ImageUrls.ICON_HIEN_LAM_CAC_URL, width: 12, height: 18 },
        { id: 'cuu_dinh', name: 'Cửu Đỉnh', cost: 80, phase: 3, iconUrl: ImageUrls.ICON_CUU_DINH_NHO_URL, width: 15, height: 8 },
    ],
    dropZones: [
        { id: 'ngo_mon', x: 40, y: 75, width: 20, height: 15, phase: 1, thanDaoBonus: 50 },
        { id: 'ky_dai', x: 46, y: 90, width: 8, height: 10, phase: 1, phongThuyBonus: 20 },
        { id: 'thai_hoa', x: 37.5, y: 45, width: 25, height: 25, phase: 2, thanDaoBonus: 50, phongThuyBonus: 50 },
        { id: 'the_mieu', x: 15, y: 35, width: 18, height: 30, phase: 3, phongThuyBonus: 30 },
        { id: 'hien_lam', x: 38, y: 25, width: 12, height: 18, phase: 3, thanDaoBonus: 30 },
        { id: 'cuu_dinh', x: 42, y: 35, width: 15, height: 8, phase: 3, thanDaoBonus: 30 },
    ],
    phaseGoals: [
        { phase: 1, uyNghiRequired: 200 },
        { phase: 2, uyNghiRequired: 450 },
        { phase: 3, uyNghiRequired: 700 },
    ],
    advisorTips: {
        1: { title: "Giai Đoạn 1: Nền Móng", text: "Tâu Bệ hạ, để đặt nền móng cho Kinh thành, trước hết cần xây dựng Ngọ Môn Quan để thể hiện uy nghi và Kỳ Đài để treo cờ hiệu. Đây là những công trình án ngữ mặt tiền, vô cùng quan trọng." },
        2: { title: "Giai Đoạn 2: Trung Tâm Quyền Lực", text: "Bẩm, nền móng đã vững. Nay xin Bệ hạ cho xây Điện Thái Hòa và Sân Đại Triều. Đây là nơi thiết triều, trung tâm của cả quốc gia, phải đặt ở chính giữa theo trục Thần đạo." },
        3: { title: "Giai Đoạn 3: Tưởng Vọng Tiên Tổ", text: "Muôn tâu, đại sự sắp thành! Giờ là lúc xây dựng Thế Tổ Miếu để thờ các vị vua triều Nguyễn, cùng với Hiển Lâm Các và Cửu Đỉnh để ghi nhớ công đức, thể hiện sự trường tồn của vương triều." },
    }
  },
  'chu-but-bao-quoc-ngu': {
    type: 'newspaperPublisher',
    id: 'chu-but-bao-quoc-ngu',
    title: 'Chủ Bút Báo Quốc Ngữ',
    reward: { id: Items.GIA_DINH_BAO_ARTIFACT_ID, type: 'artifact' },
    durationInWeeks: 12,
    initialStats: { uyTin: 50, nganSach: 200, nguyCo: 10 },
    maxStats: { uyTin: 100, nganSach: 500, nguyCo: 100 },
    typesettingTimeLimit: 30, // seconds
    upgrades: [
        { id: 'phong_vien_dieu_tra', name: 'Thuê Phóng viên Điều tra', description: 'Mở khóa các lựa chọn bài viết "Phóng sự Điều tra" độc quyền, mang lại nhiều Uy Tín hơn.', cost: 100 },
        { id: 'hoa_si_biem_hoa', name: 'Thuê Họa sĩ Biếm họa', description: 'Thêm các bức tranh biếm họa vào tờ báo, giúp tăng mạnh Uy Tín nhưng cũng tăng Nguy Cơ.', cost: 80 },
        { id: 'may_in_tot_hon', name: 'Nâng cấp Máy in', description: 'Giảm độ khó của mini-game Sắp chữ, tăng thời gian cho phép lên 45 giây.', cost: 150 },
    ],
    specialArticleChoices: [
        { headline: 'Phóng sự: Tệ nạn thuốc phiện trong giới lao động', description: 'Phơi bày góc khuất xã hội, tăng uy tín mạnh nhưng có thể bị kiểm duyệt.', effects: { uyTin: 30, nganSach: 20, nguyCo: 25 }, isSpecial: true, requiredUpgrade: 'phong_vien_dieu_tra'},
        { headline: 'Biếm họa: "Quan lớn và Chiếc ô"', description: 'Bức tranh châm biếm sâu cay về một viên quan Pháp. Rất nguy hiểm!', effects: { uyTin: 35, nganSach: 10, nguyCo: 50 }, isSpecial: true, requiredUpgrade: 'hoa_si_biem_hoa'},
    ],
    weeklyArticleChoices: [
        // Week 1
        [
            { headline: 'Thông báo lịch tàu bè đến Cảng Sài Gòn', description: 'Tin tức an toàn, hữu ích cho giới thương nhân.', effects: { uyTin: 5, nganSach: 10, nguyCo: -10 } },
            { headline: 'Kêu gọi giữ gìn vệ sinh đường phố', description: 'Bài viết có ích cho xã hội, được lòng dân chúng.', effects: { uyTin: 15, nganSach: 20, nguyCo: 5 } },
            { headline: 'Ca ngợi vẻ đẹp và sự trong sáng của Tiếng Việt', description: 'Một bài viết khơi gợi lòng tự tôn dân tộc một cách nhẹ nhàng.', effects: { uyTin: 25, nganSach: 15, nguyCo: 20 } }
        ],
        // ... add more weeks up to week 11
        [
            { headline: 'Giá cả các mặt hàng tại chợ Bến Thành', description: 'Thông tin thiết thực, giúp bình ổn giá.', effects: { uyTin: 10, nganSach: 15, nguyCo: -5 } },
            { headline: 'Phóng sự về một vụ cháy, kêu gọi quyên góp', description: 'Thể hiện vai trò xã hội của tờ báo, tăng uy tín mạnh.', effects: { uyTin: 25, nganSach: 25, nguyCo: 10 } },
            { headline: 'In một bài thơ của Nguyễn Đình Chiểu', description: 'Văn chương yêu nước có thể khiến chính quyền để ý.', effects: { uyTin: 35, nganSach: 20, nguyCo: 30 } }
        ],
        [
            { headline: 'Tin tức từ Pháp quốc và Âu châu', description: 'Dịch lại các tin tức an toàn từ báo Pháp.', effects: { uyTin: 5, nganSach: 10, nguyCo: -15 } },
            { headline: 'Phê phán tệ nạn cờ bạc trong dân chúng', description: 'Bài viết gai góc, có thể động chạm nhưng được lòng người có học.', effects: { uyTin: 20, nganSach: 15, nguyCo: 15 } },
            { headline: 'Bàn về Tinh thần bất khuất của Hai Bà Trưng', description: 'Chủ đề nhạy cảm, có thể bị xem là kích động.', effects: { uyTin: 40, nganSach: 20, nguyCo: 45 } }
        ],
        [
            { headline: 'Quảng cáo cho một hiệu buôn mới mở', description: 'Một nguồn thu nhập an toàn cho tờ báo.', effects: { uyTin: -5, nganSach: 50, nguyCo: -5 } },
            { headline: 'Giới thiệu một phương thuốc dân gian chữa bệnh thông thường', description: 'Bài viết hữu ích, giúp tăng lượng độc giả trong dân chúng.', effects: { uyTin: 20, nganSach: 20, nguyCo: 5 } },
            { headline: 'Trích đăng "Bình Ngô Đại Cáo"', description: 'Một tác phẩm kinh điển, nhưng có thể bị diễn giải là chống đối.', effects: { uyTin: 45, nganSach: 25, nguyCo: 60 } }
        ]
    ],
    specialEvents: [
        {
            id: 'lu-lut-sai-gon',
            triggerAfterWeek: 3,
            title: 'Sự kiện Đặc biệt: Lũ lụt Sài Gòn',
            stages: [
                {
                    prompt: 'Một trận lụt lớn chưa từng thấy đã tàn phá các vùng lân cận Sài Gòn! Quý báo có muốn thực hiện một tuyến bài điều tra dài 2 kỳ về vấn đề này không?',
                    choices: [
                        { text: 'Thực hiện tuyến bài', effects: {} },
                        { text: 'Bỏ qua, tập trung vào tin tức khác', effects: {} }
                    ]
                },
                {
                    prompt: 'Kỳ 1: Bạn muốn tập trung vào khía cạnh nào của thảm họa?',
                    choices: [
                        { text: 'Phóng sự về những thiệt hại tang thương', effects: { uyTin: 25, nguyCo: 5 }, historicalNote: 'Báo chí thời kỳ này bắt đầu có vai trò quan trọng trong việc phản ánh đời sống xã hội.' },
                        { text: 'Chất vấn về công tác phòng chống lụt bão của chính quyền', effects: { uyTin: 20, nguyCo: 30 }, historicalNote: 'Việc chất vấn chính quyền là một hành động dũng cảm nhưng đầy rủi ro cho các nhà báo.' }
                    ]
                },
                {
                    prompt: 'Kỳ 2: Sau bài báo đầu tiên, bạn sẽ làm gì tiếp theo?',
                    choices: [
                        { text: 'Kêu gọi người dân quyên góp cho nạn nhân', effects: { uyTin: 30, nganSach: 40 }, historicalNote: 'Báo chí trở thành cầu nối, huy động sự tương trợ trong cộng đồng.' },
                        { text: 'Vạch trần sự chậm trễ của bộ máy công quyền', effects: { uyTin: 10, nguyCo: 50 }, historicalNote: 'Những bài báo chỉ trích trực diện có thể dẫn đến việc tờ báo bị đóng cửa.' }
                    ],
                    isTerminal: true,
                }
            ]
        }
    ]
  } as NewspaperPublisherMissionData,
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
  },
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
  },
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
  },
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
  },
  'ba-trieu-lanes': {
    type: 'laneBattle',
    id: 'ba-trieu-lanes',
    title: 'Cưỡi voi đánh giặc',
    duration: 90, // 90 seconds
    defensePoints: 10,
    reward: { id: Items.BA_TRIEU_PHOENIX_HAIRPIN_ARTIFACT_ID, type: 'artifact' }
  },
  'xay-chua-van-xuan': {
    type: 'constructionPuzzle',
    id: 'xay-chua-van-xuan',
    title: 'Lý Bí và nước Vạn Xuân',
    gridSize: { rows: 10, cols: 10 },
    pieces: [
        { id: 'foundation', name: 'Nền móng', shape: [[1, 1, 1, 1],[1, 1, 1, 1],[1, 1, 1, 1],[1, 1, 1, 1]], imageUrl: ImageUrls.PUZZLE_CHUA_NEN_MONG_URL },
        { id: 'gate', name: 'Cổng chùa', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_CONG_CHUA_URL },
        { id: 'corridor', name: 'Hành lang', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_HANH_LANG_URL },
        { id: 'main_hall', name: 'Chính điện', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_CHINH_DIEN_URL },
        { id: 'roof', name: 'Mái chùa', shape: [[1,1,1],[1,1,1],[1,1,1]], imageUrl: ImageUrls.PUZZLE_CHUA_MAI_CHUA_URL },
    ],
    solution: {
        'foundation': { x: 3, y: 5, rotationIndex: 0 },
        'gate':       { x: 0, y: 6, rotationIndex: 0 },
        'corridor':   { x: 7, y: 6, rotationIndex: 0 },
        'main_hall':  { x: 3, y: 4, rotationIndex: 0 },
        'roof':       { x: 3, y: 2, rotationIndex: 0 },
    },
    reward: { id: Items.MO_HINH_CHUA_VAN_XUAN_ARTIFACT_ID, type: 'artifact' },
  },
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
  },
  'bach-dang-naval-battle': {
      type: 'navalBattle',
      id: 'bach-dang-naval-battle',
      title: 'Đại phá quân Nam Hán',
      backgroundUrl: ImageUrls.BG_LANE_BATTLE_URL,
      enemyShipIconUrl: ImageUrls.ENEMY_SHIP_ICON_URL,
      trapZone: { start: 40, end: 70 }, // 40% to 70% of the screen width
      shipSpeed: 80, // pixels per second
      tideDuration: 10, // 10 seconds for a full cycle
      reward: { id: Items.COC_GO_BACH_DANG_ARTIFACT_ID, type: 'artifact' },
  },
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
  },
};