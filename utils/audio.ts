// utils/audio.ts

const audioAssets = {
  // Nhạc nền (BGM) - Stable URLs
  bgm_main: 'https://cdn.pixabay.com/audio/2022/11/17/audio_87460b6163.mp3',
  bgm_museum: 'https://cdn.pixabay.com/audio/2023/02/13/audio_434825509a.mp3',
  bgm_truong_son: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1cba96d45f.mp3',

  // Hiệu ứng âm thanh (SFX) - Stable URLs
  sfx_click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_71a729c788.mp3',
  sfx_success: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3b092e347.mp3',
  sfx_fail: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c6ccf3964a.mp3',
  sfx_collect: 'https://cdn.pixabay.com/audio/2022/11/19/audio_24a23743ab.mp3',
  sfx_dig: 'https://cdn.pixabay.com/audio/2022/03/25/audio_a66c4e0984.mp3',
  sfx_explosion: 'https://cdn.pixabay.com/audio/2022/01/18/audio_25501b7a56.mp3',
  sfx_build: 'https://cdn.pixabay.com/audio/2021/09/24/audio_13a391dc13.mp3',
  sfx_unlock: 'https://cdn.pixabay.com/audio/2022/03/22/audio_2d813a3098.mp3',
  sfx_page_turn: 'https://cdn.pixabay.com/audio/2022/10/28/audio_c363de6344.mp3',
  sfx_flood: 'https://cdn.pixabay.com/audio/2022/03/13/audio_034b02c326.mp3',
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