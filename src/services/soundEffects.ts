/**
 * Web Audio API procedural sound synthesizer for League of Legends Hextech Clicker
 * Zero external audio file dependencies - 100% reliable in any browser environment
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Master Yi regular sword slash & metal hit
   */
  public playSlash() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // White noise swoosh
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    whiteNoise.start(now);

    // Blade clang harmonic tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Critical Strike heavy slash with punchy low-end impact
   */
  public playCrit() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Heavy punch sub-bass
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(240, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    subGain.gain.setValueAtTime(this.volume * 0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.2);

    // High critical slice ringing tone
    const bladeOsc = this.ctx.createOscillator();
    const bladeGain = this.ctx.createGain();
    bladeOsc.type = 'sawtooth';
    bladeOsc.frequency.setValueAtTime(1400, now);
    bladeOsc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
    bladeGain.gain.setValueAtTime(this.volume * 0.45, now);
    bladeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    bladeOsc.connect(bladeGain);
    bladeGain.connect(this.ctx.destination);
    bladeOsc.start(now);
    bladeOsc.stop(now + 0.15);
  }

  /**
   * Alpha Strike (Master Yi Q Skill) - 4 rapid sonic slashes
   */
  public playAlphaStrike() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const delays = [0, 0.07, 0.14, 0.22];
    delays.forEach((delay, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900 + idx * 250, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      }, delay * 1000);
    });
  }

  /**
   * Level Up triumphant fanfare chord
   */
  public playLevelUp() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A Major arpeggio
    notes.forEach((freq, index) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(this.volume * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      }, index * 90);
    });
  }

  /**
   * Hextech Key awarded chime
   */
  public playKeyEarned() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [659.25, 830.61, 1046.5]; // E major crystal chime
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }, idx * 70);
    });
  }

  /**
   * Mor Cevher (Mythic Essence / Gemstone) discovery sound - celestial sparkling chime
   */
  public playGemstoneDrop() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      }, idx * 60);
    });
  }

  /**
   * Hextech Chest opening sequence: mechanical gear unlock -> magical burst
   */
  public playChestOpen() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Heavy mechanical gear clicks
    [200, 350, 520, 680].forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const clickTime = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, clickTime);
        osc.frequency.exponentialRampToValueAtTime(100, clickTime + 0.08);
        gain.gain.setValueAtTime(this.volume * 0.35, clickTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(clickTime);
        osc.stop(clickTime + 0.09);
      }, idx * 60);
    });

    // Deep power charging bass swell
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(80, now);
    subOsc.frequency.exponentialRampToValueAtTime(280, now + 0.6);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.5);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.75);

    // Magical crystal opening explosion after 500ms
    setTimeout(() => {
      if (!this.ctx) return;
      const burstTime = this.ctx.currentTime;
      const burstOsc = this.ctx.createOscillator();
      const burstGain = this.ctx.createGain();
      burstOsc.type = 'sine';
      burstOsc.frequency.setValueAtTime(320, burstTime);
      burstOsc.frequency.exponentialRampToValueAtTime(1280, burstTime + 0.45);
      burstGain.gain.setValueAtTime(this.volume * 0.6, burstTime);
      burstGain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.65);
      burstOsc.connect(burstGain);
      burstGain.connect(this.ctx.destination);
      burstOsc.start(burstTime);
      burstOsc.stop(burstTime + 0.7);

      // Arcane shimmer sparkle notes
      [784, 987, 1318, 1567].forEach((f, i) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const t = this.ctx.currentTime;
          const sOsc = this.ctx.createOscillator();
          const sGain = this.ctx.createGain();
          sOsc.type = 'triangle';
          sOsc.frequency.setValueAtTime(f, t);
          sGain.gain.setValueAtTime(this.volume * 0.4, t);
          sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          sOsc.connect(sGain);
          sGain.connect(this.ctx.destination);
          sOsc.start(t);
          sOsc.stop(t + 0.45);
        }, i * 50);
      });
    }, 550);
  }

  /**
   * Add To Loot (Claim) sound: metallic whoosh & latch
   */
  public playAddToLoot() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Whoosh
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
    filter.Q.setValueAtTime(2, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // Chime latch
    [659.25, 987.77].forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(this.volume * 0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      }, idx * 60);
    });
  }

  /**
   * UI Click / button sound (Hextech gold style)
   */
  public playButtonClick() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.04);
    gain.gain.setValueAtTime(this.volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playClick() {
    this.playButtonClick();
  }

  /**
   * Baron Hit Groan
   */
  public playBaronGrowl() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);
    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export const soundFx = new SoundEngine();

export const playChestOpenSound = (vol?: number) => {
  if (vol !== undefined) soundFx.setVolume(vol);
  soundFx.playChestOpen();
};

export const playLegendarySound = (vol?: number) => {
  if (vol !== undefined) soundFx.setVolume(vol);
  soundFx.playGemstoneDrop();
};
