// constants/sandbox.ts
import { SandboxBackground } from '../types';
import * as ImageUrls from '../imageUrls';

export const ALL_SANDBOX_BACKGROUNDS_MAP: Record<string, SandboxBackground> = {
  'lang-que': {
    id: 'lang-que',
    name: 'Làng quê Bắc Bộ',
    imageUrl: ImageUrls.SANDBOX_BG_DEFAULT_URL,
    unlockCondition: null, // Unlocked by default
  },
  'cung-dinh': {
    id: 'cung-dinh',
    name: 'Cung điện Thăng Long',
    imageUrl: ImageUrls.SANDBOX_BG_THANG_LONG_URL,
    unlockCondition: {
      type: 'complete_hoi',
      hoi_id: 'hoi_3_thang_long',
    },
  },
  'chien-truong': {
    id: 'chien-truong',
    name: 'Chiến trường Bạch Đằng',
    imageUrl: ImageUrls.SANDBOX_BG_BACH_DANG_URL,
    unlockCondition: {
      type: 'complete_hoi',
      hoi_id: 'hoi_2_giu_nuoc',
    },
  },
};
