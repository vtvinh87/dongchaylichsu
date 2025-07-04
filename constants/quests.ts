// constants/quests.ts
import { QuestChain, SideQuest } from '../types';
import * as ImageUrls from '../imageUrls';
import { BA_TRIEU_CLOGS_ARTIFACT_ID } from './items';

export const ALL_QUEST_CHAINS: Record<string, QuestChain> = {
  'bach-dang-chien': {
    id: 'bach-dang-chien',
    title: 'Đại Phá Quân Nam Hán',
    description: 'Một chuỗi nhiệm vụ tái hiện lại trận Bạch Đằng lịch sử của Ngô Quyền, từ việc chuẩn bị trận địa đến lúc quyết chiến.',
    steps: [
      { id: 'step0_bachdang', title: 'Khảo Sát Địa Hình', description: 'Tìm ra vị trí mai phục lý tưởng trên sông Bạch Đằng.', missionId: 'find-bach-dang-ambush-spot', iconUrl: ImageUrls.QUEST_KHAO_SAT_DIA_HINH_ICON_URL },
      { id: 'step1_bachdang', title: 'Bố Trí Trận Địa', description: 'Đóng cọc xuống lòng sông Bạch Đằng để chuẩn bị bẫy quân địch.', missionId: 'bach-dang-tactical-map', iconUrl: ImageUrls.QUEST_BO_TRI_TRAN_DIA_ICON_URL },
      { id: 'step2_bachdang', title: 'Quyết Chiến', description: 'Nhử địch vào trận địa và tổng tấn công khi thủy triều rút.', missionId: 'bach-dang-naval-battle', iconUrl: ImageUrls.QUEST_QUYET_CHIEN_ICON_URL },
    ]
  },
};

export const SIDE_QUESTS: Record<string, SideQuest> = {
  'gianh_giat_su_song': {
    id: 'gianh_giat_su_song',
    title: 'Giành Giật Sự Sống',
    giver: 'co_y_ta',
    startDialogueKey: 'start_gianh_giat_su_song',
    endDialogueKey: 'end_gianh_giat_su_song',
    stages: [
        { description: "Tìm cây thảo dược ở một khu rừng rậm trên đường vượt Cửa Chùa.", targetMap: 'strategic-path-cua-chua', target: {x: 1, y: 12} },
        { description: "Tìm thêm một loại lá khác gần một con sông lớn ở Sê Băng Hiêng.", targetMap: 'strategic-path-sebanghieng', target: {x: 5, y: 13} },
    ],
    reward: {
      type: 'notebook_unlock',
      pageIndex: 7, // Placeholder, can point to a real page
      message: "Bạn đã mở khóa trang nhật ký về cây thuốc!"
    }
  },
};