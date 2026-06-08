// Audio Utility for Gamification

// Placeholder URLs for sounds (Can be replaced with local assets later)
const CLICK_SOUND_URL = 'https://actions.google.com/sounds/v1/cartoon/pop.ogg';
const CORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
const BGM_URL = 'https://archive.org/download/monkeys-spinning-monkeys/Monkeys%20Spinning%20Monkeys.mp3'; // Upbeat, kid-friendly background music

class AudioController {
  constructor() {
    this.clickSfx = new Audio(CLICK_SOUND_URL);
    this.correctSfx = new Audio(CORRECT_SOUND_URL);
    
    this.bgm = new Audio(BGM_URL);
    this.bgm.loop = true;
    this.bgm.volume = 0.2; // Keep background music soft
    
    this.isBgmPlaying = false;
  }

  playClick() {
    this.clickSfx.currentTime = 0;
    this.clickSfx.volume = 0.5;
    this.clickSfx.play().catch(e => console.log('Audio play prevented:', e));
  }

  playCorrect() {
    this.correctSfx.currentTime = 0;
    this.correctSfx.play().catch(e => console.log('Audio play prevented:', e));
  }

  toggleBgm() {
    if (this.isBgmPlaying) {
      this.bgm.pause();
      this.isBgmPlaying = false;
    } else {
      this.bgm.play().catch(e => console.log('BGM play prevented:', e));
      this.isBgmPlaying = true;
    }
    return this.isBgmPlaying;
  }
}

export const audioController = new AudioController();

// Global click listener for all buttons and auto-play BGM
export const initGlobalAudio = (onBgmStart) => {
  if (window.__AUDIO_INITIALIZED__) return;
  window.__AUDIO_INITIALIZED__ = true;

  document.addEventListener('click', (e) => {
    // Autoplay BGM on first user interaction (browser policy workaround)
    if (!audioController.isBgmPlaying) {
      audioController.bgm.play().then(() => {
        audioController.isBgmPlaying = true;
        if (onBgmStart) onBgmStart(true);
      }).catch(e => console.log('Autoplay prevented:', e));
    }

    // Play click sound if the clicked element is a button or has cursor-pointer
    if (e.target.closest('button') || e.target.closest('.cursor-pointer')) {
        audioController.playClick();
    }
  });
};
