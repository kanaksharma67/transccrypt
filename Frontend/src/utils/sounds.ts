// src/utils/sounds.ts
const baseSoundPath = '/sounds/'; // Directly use the public path

const createAudio = (filename: string) => {
  try {
    const audio = new Audio(`${baseSoundPath}${filename}`);
    audio.preload = 'auto';
    return audio;
  } catch (error) {
    console.error(`Error creating audio for ${filename}:`, error);
    return null;
  }
};

// Preload sounds
const clickSound = createAudio('mixkit-modern-technology-select-3124.wav');

export const playClickSound = () => {
  if (!clickSound) return;
  
  try {
    clickSound.currentTime = 0; // Rewind to start if already playing
    clickSound.volume = 0.3;
    clickSound.play().catch(e => console.log("Click sound playback prevented:", e));
  } catch (error) {
    console.error("Error playing click sound:", error);
  }
};

export const preloadSounds = () => {
  if (clickSound) clickSound.load();
};