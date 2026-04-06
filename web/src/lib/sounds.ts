let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  // Resume if suspended (browsers require user gesture first)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.25,
  startDelay = 0,
) {
  const context = ac();
  const osc  = context.createOscillator();
  const gain_ = context.createGain();
  osc.connect(gain_);
  gain_.connect(context.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, context.currentTime + startDelay);
  gain_.gain.setValueAtTime(gain, context.currentTime + startDelay);
  gain_.gain.exponentialRampToValueAtTime(0.001, context.currentTime + startDelay + duration);
  osc.start(context.currentTime + startDelay);
  osc.stop(context.currentTime + startDelay + duration + 0.01);
}

export function playClick() {
  tone(900, 0.05, 'square', 0.15);
}

export function playTick() {
  tone(1400, 0.035, 'square', 0.12);
}

export function playWin() {
  // Ascending arpeggio: C5 E5 G5 C6
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'sine', 0.28, i * 0.1));
}

export function playLose() {
  // Descending: G4 Eb4 C4
  [392, 311, 262].forEach((f, i) => tone(f, 0.28, 'sine', 0.22, i * 0.18));
}
