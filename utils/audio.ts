// utils/audio.ts

const audioAssets = {
  // Nhạc nền (BGM)
  bgm_main: 'https://www.chosic.com/wp-content/uploads/2021/07/The-Quiet-Morning.mp3',
  bgm_museum: 'https://www.chosic.com/wp-content/uploads/2022/01/forgotten-time.mp3',
  bgm_truong_son: 'https://www.chosic.com/wp-content/uploads/2021/08/Hopeful-and-Nostalgic-Sentimental-Music.mp3',

  // Hiệu ứng âm thanh (SFX)
  sfx_click: 'https://cdn.jsdelivr.net/gh/kessib/sounds/ui_click.wav',
  sfx_success: 'https://cdn.jsdelivr.net/gh/kessib/sounds/sfx_success.wav',
  sfx_fail: 'https://cdn.jsdelivr.net/gh/kessib/sounds/sfx_fail.wav',
  sfx_collect: 'https://cdn.jsdelivr.net/gh/kessib/sounds/sfx_collect.wav',
  sfx_dig: 'https://cdn.jsdelivr.net/gh/kessib/sounds/sfx_dig.mp3',
  sfx_explosion: 'https://cdn.jsdelivr.net/gh/kessib/sounds/sfx_explosion.wav',
  sfx_build: 'https://cdn.jsdelivr.net/gh/kessib/sounds/sfx_build.wav',
  
  // Âm thanh từ hệ thống cũ vẫn đang được sử dụng
  sfx_unlock: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_845c437a36.mp3',
  sfx_page_turn: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_49225c5058.mp3',
  sfx_flood: 'https://cdn.pixabay.com/download/audio/2023/04/24/audio_8222b347b5.mp3',
};

// Biến để quản lý trạng thái âm thanh
let isMuted = false;
let sfxPool: Record<string, HTMLAudioElement> = {}; // Nơi lưu trữ các đối tượng Audio cho SFX
let currentMusic: HTMLAudioElement | null = null; // Đối tượng Audio cho BGM đang phát

// Hàm này được gọi khi khởi động game
export function initializeAudio() {
  // Tải trước tất cả các hiệu ứng âm thanh
  for (const key in audioAssets) {
    if (key.startsWith('sfx_')) {
      sfxPool[key] = new Audio(audioAssets[key as keyof typeof audioAssets]);
      sfxPool[key].preload = 'auto';
    }
  }
}

// Hàm phát hiệu ứng âm thanh (SFX) mới
export function playSound(key: string) {
  if (isMuted || !sfxPool[key]) return;
  // Tạo một bản sao để có thể phát nhiều tiếng click chồng lên nhau
  const sound = sfxPool[key].cloneNode() as HTMLAudioElement;
  sound.play().catch(e => console.error(`Error playing sound ${key}:`, e));
}

// Hàm phát nhạc nền (BGM) mới, ổn định hơn
export function playMusic(key: keyof typeof audioAssets | null) {
  if (key === null) {
    stopMusic();
    return;
  }
  
  // Nếu bản nhạc mới giống hệt bản đang phát thì không làm gì cả
  if (currentMusic && currentMusic.getAttribute('src') === audioAssets[key]) {
    // Music is already playing, ensure it's not muted if sound was just re-enabled
    if(currentMusic.muted !== isMuted) {
        currentMusic.muted = isMuted;
    }
    // And ensure it's playing if it was paused
    if (currentMusic.paused && !isMuted) {
        currentMusic.play().catch(e => console.error("Music restart error:", e));
    }
    return;
  }

  // Dừng và xóa bản nhạc cũ
  stopMusic();

  // Phát bản nhạc mới
  if (audioAssets[key]) {
    currentMusic = new Audio(audioAssets[key]);
    currentMusic.loop = true;
    currentMusic.muted = isMuted;
    currentMusic.volume = 0.3; // BGM should be quieter
    currentMusic.play().catch(e => console.error(`Music play error:`, e));
  }
}

export function stopMusic(): void {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic = null;
    }
}

export function toggleAudio(): boolean {
    isMuted = !isMuted;
    
    if (currentMusic) {
      currentMusic.muted = isMuted;
    } else if (!isMuted) {
      // If we are un-muting and no music is playing, the App's useEffect will handle starting it.
    }

    // Return the new state so the React component can update its UI
    return !isMuted;
}

export function getIsSoundEnabled(): boolean {
    // Initial state from the perspective of the React component.
    // The actual isMuted variable is local to this module.
    // This function can be used to initialize the component state.
    return !isMuted;
}
