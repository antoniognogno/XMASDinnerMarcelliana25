// Utility per effetti sonori usando Web Audio API

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playBuzzerSound = () => {
  if (!audioContext) return;
  
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  // Suono "buzzer" - frequenza variabile
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.setValueAtTime(600, now + 0.1);
  
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  
  osc.start(now);
  osc.stop(now + 0.2);
};

export const playWinnerSound = () => {
  if (!audioContext) return;
  
  const now = audioContext.currentTime;
  const notes = [523, 659, 784, 1047]; // Do, Mi, Sol, Do alto
  
  notes.forEach((freq, index) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext!.destination);
    
    const startTime = now + index * 0.1;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
    
    osc.start(startTime);
    osc.stop(startTime + 0.15);
  });
};

export const playPointsSound = (points: number) => {
  if (!audioContext) return;
  
  const now = audioContext.currentTime;
  
  // Suoni diversi a seconda dei punti
  let baseFreq = 400;
  let duration = 0.15;
  
  if (points === 50) {
    baseFreq = 800;
    duration = 0.3;
  } else if (points === 30) {
    baseFreq = 600;
    duration = 0.2;
  } else if (points === 10) {
    baseFreq = 400;
    duration = 0.15;
  }
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(baseFreq, now);
  
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
  
  osc.start(now);
  osc.stop(now + duration);
};

export const playResetSound = () => {
  if (!audioContext) return;
  
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  // Suono decrescente (reset)
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
  
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  
  osc.start(now);
  osc.stop(now + 0.3);
};

export const playBuzzReadySound = () => {
  if (!audioContext) return;
  
  const now = audioContext.currentTime;
  // Due note ascendenti - notifica che il buzz è pronto
  const notes = [440, 550]; // La, Do#
  
  notes.forEach((freq, index) => {
    const osc = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext!.destination);
    
    const startTime = now + index * 0.15;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
    
    osc.start(startTime);
    osc.stop(startTime + 0.2);
  });
};
