// constants/narrative.ts
import { Speaker, SpeakerKey, DialogueEntry, NotebookPage } from '../types';
import * as ImageUrls from '../imageUrls';

export const SPEAKER_DATA: Record<SpeakerKey, Speaker> = {
  'chi_huy': { name: 'Vị Chỉ Huy', avatarUrl: ImageUrls.CHI_HUY_AVATAR_URL },
  'nhan_vat_chinh': { name: 'Bạn', avatarUrl: '' }, // Avatar is handled dynamically
  'cong_binh': { name: 'Đồng chí công binh', avatarUrl: ImageUrls.CONG_BINH_AVATAR_URL },
  'giao_lien': { name: 'Cô giao liên', avatarUrl: ImageUrls.GIAO_LIEN_AVATAR_URL },
  'system': { name: 'Hệ thống', avatarUrl: ImageUrls.LOGO_SMALL_URL },
  'co_y_ta': { name: 'Cô y tá', avatarUrl: ImageUrls.CO_Y_TA_AVATAR_URL },
  'anh_trinh_sat': { name: 'Anh trinh sát', avatarUrl: ImageUrls.ANH_TRINH_SAT_AVATAR_URL },
};

export const NOTEBOOK_PAGES: Record<string, DialogueEntry[] | NotebookPage> = {
  // These are notebook pages
  0: { type: 'text', content: `**Ngày... tháng... năm...**\nTrời mưa tầm tã. Con đường mòn giờ trơn như đổ mỡ. Mỗi bước chân là một cuộc vật lộn. Bùn đất bám chặt lấy đôi dép cao su, có lúc tưởng như không nhấc nổi chân lên.` },
  1: { type: 'text', content: `**Ngày... tháng... năm...**\nĐêm nay lại một trận sốt rét rừng hành hạ. Rét run cầm cập dù đã đắp bao nhiêu là chăn võng. Các đồng chí phải lấy thân mình để sưởi ấm cho tôi. Tình đồng đội thật thiêng liêng.` },
  2: { type: 'text', content: `**Ngày... tháng... năm...**\nChúng tôi vừa lấp xong một hố bom to bằng cả cái ao. Đất đá bị cày xới tung lên. Nhìn cảnh tượng này, lòng căm thù giặc lại càng sôi sục.` },
  3: { type: 'text', content: `**Ngày... tháng... năm...**\nCây cầu tạm bằng gỗ vừa được bắc qua con suối. Anh em công binh thật tài tình. Nhìn dòng xe đạp thồ chở đầy hàng qua cầu, ai cũng thấy vui trong lòng. Con đường ra tiền tuyến lại được nối liền.` },
  4: { type: 'text', content: `**Ngày... tháng... năm...**\nTròn mười ngày hành quân không nghỉ. Đôi chân đã mỏi rã rời, nhưng không ai kêu ca một lời. Tất cả vì miền Nam ruột thịt!` },
  5: { type: 'text', content: `**Ngày... tháng... năm...**\nSuýt nữa thì toi mạng. Máy bay địch bất ngờ bổ nhào. May mà có kinh nghiệm, chúng tôi đã kịp ẩn nấp vào một gốc cây to. Tiếng bom rền vang trời, đất rung chuyển. Nguy hiểm thật, nhưng chúng tôi vẫn an toàn.` },
  6: { type: 'text', content: `**Ngày... tháng... năm...**\nBảy ngày ròng rã, cuối cùng cũng vượt qua được đoạn đường khó khăn này. Con đường tự tay mình mở ra, dù chông gai, nhưng thật tự hào.` },
  7: { type: 'text', content: `**Trang Bị Y Tế - Cây Thuốc Nam**\n**Cây Nhọ Nồi (Cỏ Mực):** Dễ tìm ven đường, bờ ruộng. Giã nát, vắt lấy nước uống để hạ sốt, cầm máu. Bã đắp lên vết thương giúp nhanh lành.\n**Lá Trầu Không:** Có tính sát khuẩn cao. Nấu nước để rửa vết thương, tránh nhiễm trùng. Vò nát lá có thể giảm sưng tấy do côn trùng cắn.` },


  // These are dialogue scripts
  'start_gianh_giat_su_song': [
    { type: 'dialogue', speaker: 'co_y_ta', text: 'Đồng chí ơi, chúng tôi đang cần gấp một loại thảo dược để cứu chữa cho thương binh. Nó mọc ở sâu trong rừng, anh có thể giúp chúng tôi tìm được không?' },
    {
      type: 'dialogue',
      speaker: 'nhan_vat_chinh',
      text: 'Tôi sẽ đi ngay. Cô hãy tả hình dáng loại cây đó cho tôi.',
      options: [
        { text: 'Chấp nhận nhiệm vụ.', action: 'accept_quest', questId: 'gianh_giat_su_song' }
      ]
    }
  ],
  'end_gianh_giat_su_song': [
    { type: 'dialogue', speaker: 'co_y_ta', text: 'Cảm ơn đồng chí rất nhiều! Nhờ có loại thảo dược này mà chúng tôi đã cứu được nhiều anh em. Đây là chút quà mọn, một trang ghi chép về các loại cây thuốc trong rừng, hy vọng sẽ giúp ích cho đồng chí.' },
    { type: 'notebook_unlock', pageIndex: 7, message: 'Bạn đã mở khóa trang nhật ký về cây thuốc!' }
  ],
  
  // A generic fallback for now, can be expanded
  'before_mission_strategic-path-dong-loc': [
      { type: 'dialogue', speaker: 'chi_huy', text: 'Đồng chí đã sẵn sàng chưa? Ngã ba Đồng Lộc là một trọng điểm ác liệt. Phải hết sức cẩn thận với bom nổ chậm của địch.'},
      { type: 'dialogue', speaker: 'nhan_vat_chinh', text: 'Rõ! Tôi sẽ hoàn thành nhiệm vụ.'},
  ],
};