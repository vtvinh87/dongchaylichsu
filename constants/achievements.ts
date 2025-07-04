// constants/achievements.ts
import { Achievement, SavedGameState } from '../types';
import * as ImageUrls from '../imageUrls';
import { GIAO_DONG_DONG_SON_ARTIFACT_ID } from './items';

export const ALL_ACHIEVEMENTS_MAP: Record<string, Achievement> = {
  'first-artifact': {
    id: 'first-artifact',
    name: 'Nhà Khảo Cổ Mới Nổi',
    description: 'Thu thập được Cổ vật đầu tiên của bạn.',
    iconUrl: ImageUrls.ACH_FIRST_ARTIFACT_URL,
    condition: (gameState: SavedGameState) => gameState.collectedArtifactIds.length >= 1,
  },
  'complete-hoi-1': {
    id: 'complete-hoi-1',
    name: 'Chương Đầu Tiên',
    description: 'Hoàn thành Hồi 1: Buổi đầu Dựng nước.',
    iconUrl: ImageUrls.ACH_COMPLETE_HOI_1_URL,
    condition: (gameState: SavedGameState) => {
        // Checks if the reward from the last main mission of Hoi 1 is collected.
        return gameState.collectedArtifactIds.includes(GIAO_DONG_DONG_SON_ARTIFACT_ID);
    },
  },
  'unlock-first-char': {
    id: 'unlock-first-char',
    name: 'Người Bạn Đồng Hành',
    description: 'Mở khóa Nhân vật AI đầu tiên để trò chuyện.',
    iconUrl: ImageUrls.ACH_FIRST_CHAR_URL,
    condition: (gameState: SavedGameState) => (gameState.unlockedCharacterIds || []).length > 0,
  },
  'premium-supporter': {
    id: 'premium-supporter',
    name: 'Mạnh Thường Quân',
    description: 'Nâng cấp lên tài khoản Premium và ủng hộ dự án.',
    iconUrl: ImageUrls.ACH_PREMIUM_SUPPORTER_URL,
    condition: (gameState: SavedGameState) => !!gameState.isPremium,
  }
};
