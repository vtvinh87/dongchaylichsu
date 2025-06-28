// utils/audio.ts

let hasInteracted = false;

const onFirstInteraction = () => {
    if (hasInteracted) return;
    hasInteracted = true;
    
    // Attempt to "unlock" all audio elements by playing and immediately pausing them.
    // This is a common strategy for enabling programmatic audio playback in browsers.
    const sounds = document.querySelectorAll('audio');
    sounds.forEach(sound => {
        // We don't care about the result, just that we tried to interact with the audio context.
        sound.play().then(() => {
            sound.pause();
            sound.currentTime = 0; // Reset after pausing
        }).catch(() => {
            // This can fail for various reasons, it is not critical.
        });
    });
};

// Listen for the very first user interaction.
// The `{ once: true, capture: true }` options ensure the listener runs early and only once,
// then automatically removes itself.
window.addEventListener('click', onFirstInteraction, { once: true, capture: true });
window.addEventListener('keydown', onFirstInteraction, { once:true, capture: true });
window.addEventListener('touchstart', onFirstInteraction, { once: true, capture: true });


export function playSound(soundId: string): void {
  // If the user has not interacted with the page yet, we should not attempt to play sound.
  // This will prevent the "user didn't interact" error in the console.
  if (!hasInteracted) {
    // You can uncomment the line below for debugging to see which sounds are skipped.
    // console.log(`Sound play skipped ('${soundId}'): Waiting for user interaction.`);
    return;
  }

  const sound = document.getElementById(soundId) as HTMLAudioElement | null;
  if (sound) {
    sound.currentTime = 0; // Rewind to the start to allow playing again quickly
    sound.play().catch(error => console.error(`Error playing sound ${soundId}:`, error));
  } else {
    console.warn(`Sound element with ID "${soundId}" not found.`);
  }
}
