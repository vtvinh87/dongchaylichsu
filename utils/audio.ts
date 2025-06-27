// utils/audio.ts

export function playSound(soundId: string): void {
  const sound = document.getElementById(soundId) as HTMLAudioElement | null;
  if (sound) {
    sound.currentTime = 0; // Rewind to the start to allow playing again quickly
    sound.play().catch(error => console.error(`Error playing sound ${soundId}:`, error));
  } else {
    console.warn(`Sound element with ID "${soundId}" not found.`);
  }
}
