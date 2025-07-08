// constants/instructions.ts
import { Tutorial } from '../types';

export const INSTRUCTION_DATA: Record<string, { title: string; text: string }> = {
  puzzle: {
    title: 'Ghép hình Cổ vật',
    text: "Chào mừng Nhà Sử Học! Trong màn chơi này, bạn hãy kéo các mảnh ghép từ kho bên dưới và thả vào đúng vị trí trên khung để hoàn thành bức tranh về Cổ vật. Hoàn thành trong thời gian thử thách để nhận thêm phần thưởng nhé!",
  },
  narrative: {
    title: 'Dòng chảy Lựa chọn',
    text: "Mỗi quyết định của bạn sẽ viết nên một trang sử mới. Hãy đọc kỹ tình huống và chọn một trong các phương án để tiếp tục câu chuyện. Lựa chọn của bạn sẽ quyết định kết quả của nhiệm vụ.",
  },
  timeline: {
    title: 'Dòng thời gian Lịch sử',
    text: "Lịch sử là một dòng chảy của các sự kiện. Hãy sắp xếp các sự kiện vào đúng vị trí trên dòng thời gian. Bạn có thể nhấp vào từng sự kiện để xem chi tiết trước khi kéo và thả.",
  },
  ar: {
    title: 'Cửa sổ Thời gian AR',
    text: "Hướng camera của bạn vào Hình ảnh Đánh Dấu (Marker) đặc biệt. Một cổ vật 3D sẽ xuất hiện ngay trong thế giới thực! Hãy khám phá nó từ mọi góc độ.",
  },
  hiddenObject: {
    title: 'Tìm vật phẩm',
    text: "Trong bức tranh lịch sử này, có những vật phẩm quan trọng đang được ẩn giấu. Hãy tìm và nhấp vào tất cả các vật phẩm được liệt kê ở phía dưới để hoàn thành nhiệm vụ.",
  },
  quiz: {
    title: 'Thử tài Sử học',
    text: "Kiểm tra kiến thức lịch sử của bạn! Hãy đọc kỹ câu hỏi và chọn câu trả lời mà bạn cho là đúng nhất từ các lựa chọn được đưa ra.",
  },
  construction: {
    title: 'Xây dựng Công trình',
    text: "Hãy thu thập tài nguyên, sau đó sử dụng chúng để xây dựng các phần của công trình theo yêu cầu. Hoàn thành công trình để làm nên lịch sử!",
  },
  diplomacy: {
    title: 'Đối thoại Lịch sử',
    text: "Trò chuyện với các nhân vật lịch sử và đưa ra những lựa chọn đối thoại khôn ngoan để tăng mức độ thiện chí của họ. Đạt được mục tiêu để hoàn thành nhiệm vụ.",
  },
  detective: {
    title: 'Mật Thám Chốn Thị Thành',
    text: 'Chào mừng đến với Thăng Long thành! Một vụ án gián điệp đang gây xôn xao. Nhiệm vụ của bạn là hỏi chuyện các nhân vật (NPC), thu thập manh mối và tìm ra mâu thuẫn. Sử dụng sổ tay để xem lại manh mối và bảng suy luận để buộc tội nghi phạm. Mỗi hành động sẽ tốn một lượt đi. Hãy phá án trước khi hết lượt nhé!',
  },
  rhythm: {
    title: 'Giai điệu Cung đình',
    text: "Cảm nhận nhịp điệu của lịch sử! Khi các nốt nhạc đi xuống đến vạch đích, hãy nhấn các phím 'A', 'S', 'D' tương ứng để ghi điểm.",
  },
  coloring: {
    title: 'Tô màu Lịch sử',
    text: "Làm sống lại các tác phẩm nghệ thuật dân gian! Chọn một màu từ bảng màu và nhấp vào vùng bạn muốn tô. Hãy tô đúng màu theo mẫu để hoàn thành bức tranh.",
  },
  rallyCall: {
    title: 'Hiệu Triệu Quân Sĩ',
    text: "Trong màn chơi chọn lựa, hãy chọn những lời hiệu triệu mạnh mẽ nhất để tăng sĩ khí quân lính. Đạt được mục tiêu để chiến thắng.",
  },
  rallyCallFillBlank: {
    title: 'Soạn Hịch Tướng Sĩ',
    text: "Hoàn thành bài hịch kinh điển của Hưng Đạo Vương. Kéo hoặc nhấp để đặt các từ từ ngân hàng vào đúng chỗ trống. Hoàn thành trước khi hết giờ!",
  },
  forging: {
    title: 'Rèn vũ khí',
    text: "Hãy đập búa vào đúng thời điểm để rèn nên những vũ khí sắc bén nhất! Nhấn chuột hoặc phím cách khi thanh chỉ báo nằm trong vùng màu xanh lá cây để đạt hiệu quả cao nhất.",
  },
  tacticalMap: {
    title: 'Bố Trí Trận Địa Cọc',
    text: "Đây là trận địa sông Bạch Đằng. Hãy nhấp vào các vị trí trên bản đồ để đóng cọc, chuẩn bị cho trận thủy chiến lịch sử. Đóng đủ số cọc yêu cầu để hoàn thành.",
  },
  defense: {
      title: 'Vườn không nhà trống',
      text: "Sơ tán các đơn vị khỏi khu vực nguy hiểm bằng cách kéo họ vào các ô rừng cây. Mỗi hành động sẽ tốn một số lượt đi nhất định. Hãy hoàn thành việc sơ tán trước khi quân địch đến!",
  },
  strategyMap: {
      title: 'Hành quân thần tốc',
      text: "Vẽ một đường hành quân trên bản đồ từ điểm xuất phát (xanh lá) đến đích (cam), tránh các vùng nguy hiểm của địch. Sau khi vẽ xong, nhấn 'Bắt đầu Hành quân' để xác nhận.",
  },
  strategicMarch: {
    title: 'Hành Quân Thần Tốc',
    text: "Nhiệm vụ của bạn là dẫn dắt đội quân đến đích. Hãy chú ý đến 3 tài nguyên quan trọng: Thời Gian, Sĩ Khí và Binh Lực. Trên đường đi, bạn sẽ gặp các sự kiện bất ngờ. Hãy đưa ra những lựa chọn khôn ngoan vì chúng sẽ ảnh hưởng trực tiếp đến tài nguyên và sự thành bại của chiến dịch. Chúc may mắn, Tướng quân!",
  },
  coinMinting: {
      title: 'Xưởng đúc tiền',
      text: "Chọn đúng loại kim loại và khuôn đúc được yêu cầu để tạo ra đồng tiền chính xác. Hoàn thành nhiệm vụ để khẳng định chủ quyền và kinh tế của triều đại!",
  },
  cityPlanning: {
      title: 'Xây dựng Kinh thành',
      text: "Kéo các công trình kiến trúc từ danh sách bên cạnh và thả vào đúng vị trí của chúng trên bản đồ quy hoạch Kinh thành Huế.",
  },
  typesetting: {
      title: 'In báo Chữ Quốc Ngữ',
      text: "Kéo và thả các con chữ từ khay vào đúng vị trí trên khuôn in để tạo thành tít báo mẫu. Sắp xếp chính xác để hoàn thành bản in đầu tiên!",
  },
  adventurePuzzle: {
      title: 'Vượt biển Đông Du',
      text: "Giải các câu đố để tìm ra con đường an toàn. Đọc kỹ câu đố và nhập câu trả lời của bạn. Gợi ý có thể xuất hiện nếu bạn trả lời sai.",
  },
  strategicPath: {
      title: 'Mở đường Trường Sơn',
      text: "Nhấp vào các ô liền kề để di chuyển và mở đường. Sử dụng các kỹ năng đặc biệt để vượt qua chướng ngại vật. Hãy cẩn thận, mỗi hành động đều làm tăng mức độ rủi ro!",
  },
  constructionPuzzle: {
      title: 'Xây dựng Chùa Vạn Xuân',
      text: "Kéo các khối kiến trúc từ bảng bên cạnh và đặt vào lưới. Nhấp vào một khối trong bảng để xoay nó. Hãy lắp ráp chúng thành một ngôi chùa hoàn chỉnh theo bản thiết kế.",
  },
  navalBattle: {
      title: 'Đại phá quân Nam Hán',
      text: "Chờ cho hạm đội địch tiến vào bãi cọc (vùng được đánh dấu) và thủy triều rút xuống mức thấp (thanh màu xanh bên trái). Sau đó, nhấn nút 'Tổng Phản Công' để giành chiến thắng!",
  },
  laneBattle: {
      title: 'Cưỡi voi đánh giặc',
      text: "Di chuyển qua lại giữa các làn đường và sử dụng các kỹ năng để ngăn chặn quân địch tiến xuống dưới. Sống sót cho đến khi hết giờ để chiến thắng!",
  },
};

export const TUTORIAL_DATA: Record<string, Tutorial> = {
  'main-interface-intro': {
    id: 'main-interface-intro',
    steps: [
      {
        elementSelector: '#main-journey-section',
        title: 'Chào mừng bạn!',
        text: 'Đây là Hành Trình Xuyên Thời Gian. Hãy bắt đầu cuộc phiêu lưu của bạn bằng cách chọn một nhiệm vụ trong các Hồi truyện.',
        position: 'top',
      },
      {
        elementSelector: '#main-collection-section',
        title: 'Bộ Sưu Tập Cổ Vật',
        text: 'Mỗi khi hoàn thành nhiệm vụ, bạn sẽ nhận được các cổ vật. Tất cả chúng sẽ được trưng bày tại đây.',
        position: 'top',
      },
      {
        elementSelector: '#main-chatbot-button',
        title: 'Hỏi Đáp Lịch Sử',
        text: 'Nếu có bất kỳ thắc mắc nào về lịch sử, hãy nhấp vào đây để trò chuyện với các nhân vật lịch sử đã được chiêu mộ!',
        position: 'bottom',
      },
       {
        elementSelector: '#main-leaderboard-button',
        title: 'Bảng Xếp Hạng',
        text: 'Xem thứ hạng của bạn so với các Nhà Sử Học khác tại đây. Cố gắng thu thập thật nhiều cổ vật nhé!',
        position: 'bottom',
      }
    ]
  }
};
