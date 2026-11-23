export type MusicMode = 'off' | 'entry' | 'hub' | 'battle' | 'boss' | 'summon' | 'intro';

// Note frequency helper (MIDI-like pitch table in Hz)
const N: Record<string, number> = {
  // Octave 2
  C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, Fs2: 92.5, G2: 98.0, Ab2: 103.83, A2: 110.0, Bb2: 116.54, B2: 123.47,
  // Octave 3
  C3: 130.81, Cs3: 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.0, G3: 196.0, Ab3: 207.65, A3: 220.0, Bb3: 233.08, B3: 246.94,
  // Octave 4
  C4: 261.63, Cs4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.0, Ab4: 415.3, A4: 440.0, Bb4: 466.16, B4: 493.88,
  // Octave 5
  C5: 523.25, Cs5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.0, Bb5: 932.33, B5: 987.77,
  // Octave 6
  C6: 1046.5, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98, A6: 1760.0,
};

/* ==================== 1. HUB / ADVENTURE THEME (D Dorian / Heroic Fantasy, 128 BPM) ==================== */
const HUB_CHORDS: number[][] = [
  [N.D3, N.A3, N.F4], // Dm
  [N.C3, N.G3, N.E4], // C
  [N.Bb2, N.F3, N.D4], // Bb
  [N.A2, N.E3, N.Cs4], // A
  [N.D3, N.A3, N.F4], // Dm
  [N.F3, N.C4, N.A4], // F
  [N.G3, N.D4, N.B4], // G
  [N.A3, N.E4, N.Cs4], // A7
];
const HUB_BASS: number[] = [
  N.D2, 0, N.A2, 0, N.C2, 0, N.G2, 0,
  N.Bb2, 0, N.F2, 0, N.A2, 0, N.E2, N.A2,
  N.D2, 0, N.A2, 0, N.F2, 0, N.C3, 0,
  N.G2, 0, N.D3, 0, N.A2, 0, N.E2, 0,
];
const HUB_ARP: number[] = [
  N.D4, N.F4, N.A4, N.D5, N.C4, N.E4, N.G4, N.C5,
  N.Bb3, N.D4, N.F4, N.Bb4, N.A3, N.Cs4, N.E4, N.A4,
  N.D4, N.F4, N.A4, N.D5, N.F4, N.A4, N.C5, N.F5,
  N.G4, N.B4, N.D5, N.G5, N.A4, N.E5, N.Cs5, N.A4,
];
const HUB_LEAD: number[] = [
  N.A4, 0, N.D5, N.E5, N.F5, 0, N.E5, N.C5,
  N.D5, 0, N.C5, N.Bb4, N.A4, 0, N.E4, 0,
  N.F4, N.G4, N.A4, N.D5, N.C5, 0, N.A4, N.F4,
  N.G4, N.B4, N.D5, N.E5, N.Cs5, 0, N.A4, 0,
];

/* ==================== 2. BATTLE THEME (E Minor Energetic RPG Combat, 154 BPM) ==================== */
const BATTLE_CHORDS: number[][] = [
  [N.E3, N.B3, N.G4], // Em
  [N.C3, N.G3, N.E4], // C
  [N.D3, N.A3, N.Fs4], // D
  [N.B2, N.Fs3, N.D4], // Bm
  [N.E3, N.B3, N.G4], // Em
  [N.G3, N.D4, N.B4], // G
  [N.A3, N.E4, N.C5], // Am
  [N.B3, N.Fs4, N.Eb4], // B7
];
const BATTLE_BASS: number[] = [
  N.E2, N.E2, N.B2, N.E2, N.C2, N.C2, N.G2, N.C2,
  N.D2, N.D2, N.A2, N.D2, N.B2, N.B2, N.Fs2, N.B2,
  N.E2, N.E2, N.B2, N.E2, N.G2, N.G2, N.D3, N.G2,
  N.A2, N.A2, N.E3, N.A2, N.B2, N.B2, N.Fs2, N.B2,
];
const BATTLE_ARP: number[] = [
  N.E4, N.G4, N.B4, N.E5, N.C4, N.E4, N.G4, N.C5,
  N.D4, N.Fs4, N.A4, N.D5, N.B3, N.D4, N.Fs4, N.B4,
  N.E4, N.G4, N.B4, N.E5, N.G4, N.B4, N.D5, N.G5,
  N.A4, N.C5, N.E5, N.A5, N.B4, N.Eb5, N.Fs5, N.B5,
];
const BATTLE_LEAD: number[] = [
  N.E5, 0, N.G5, N.Fs5, N.E5, N.D5, N.C5, 0,
  N.D5, 0, N.Fs5, N.E5, N.D5, N.B4, 0, N.B4,
  N.E5, N.Fs5, N.G5, 0, N.G5, N.A5, N.B5, 0,
  N.A5, N.G5, N.Fs5, N.E5, N.Fs5, 0, N.B4, 0,
];

/* ==================== 3. BOSS THEME (D Minor Epic War Drums, 166 BPM) ==================== */
const BOSS_CHORDS: number[][] = [
  [N.D3, N.A3, N.F4], // Dm
  [N.Eb3, N.Bb3, N.G4], // Eb (Phrygian tension)
  [N.C3, N.G3, N.E4], // C
  [N.A2, N.E3, N.Cs4], // A
  [N.D3, N.A3, N.F4], // Dm
  [N.Bb2, N.F3, N.D4], // Bb
  [N.G2, N.D3, N.Bb3], // Gm
  [N.A2, N.E3, N.Cs4], // A7
];
const BOSS_BASS: number[] = [
  N.D2, N.D2, N.D2, N.A2, N.Eb2, N.Eb2, N.Eb2, N.Bb2,
  N.C2, N.C2, N.C2, N.G2, N.A2, N.A2, N.Cs3, N.A2,
  N.D2, N.D2, N.D2, N.A2, N.Bb2, N.Bb2, N.F2, N.Bb2,
  N.G2, N.G2, N.D3, N.G2, N.A2, N.A2, N.E2, N.A2,
];
const BOSS_LEAD: number[] = [
  N.D5, N.D5, N.F5, N.A5, N.Bb5, 0, N.G5, N.Eb5,
  N.E5, 0, N.G5, N.E5, N.Cs5, 0, N.A4, 0,
  N.D5, N.E5, N.F5, N.A5, N.Bb5, N.A5, N.G5, N.F5,
  N.G5, N.F5, N.E5, N.D5, N.Cs5, 0, N.E5, 0,
];

/* ==================== 4. SUMMON THEME (Celestial Lydian Portal, 114 BPM) ==================== */
const SUMMON_CHORDS: number[][] = [
  [N.F3, N.A3, N.C4, N.E4], // Fmaj7
  [N.G3, N.B3, N.D4, N.E4], // G6
  [N.E3, N.G3, N.B3, N.D4], // Em7
  [N.A3, N.C4, N.E4, N.G4], // Am7
  [N.D3, N.F3, N.A3, N.C4], // Dm7
  [N.G3, N.B3, N.D4, N.F4], // G7
  [N.C3, N.G3, N.B3, N.E4], // Cmaj7
  [N.G3, N.B3, N.D4, N.G4], // G
];
const SUMMON_BASS: number[] = [
  N.F2, 0, 0, N.C3, N.G2, 0, 0, N.D3,
  N.E2, 0, 0, N.B2, N.A2, 0, 0, N.E3,
  N.D2, 0, 0, N.A2, N.G2, 0, 0, N.D3,
  N.C2, 0, 0, N.G2, N.G2, 0, N.B2, 0,
];
const SUMMON_CELESTA: number[] = [
  N.F5, N.A5, N.C6, N.E6, N.G5, N.B5, N.D6, N.G6,
  N.E5, N.G5, N.B5, N.E6, N.A5, N.C6, N.E6, N.G6,
  N.D5, N.F5, N.A5, N.C6, N.G5, N.B5, N.D6, N.F6,
  N.E5, N.G5, N.C6, N.E6, N.D5, N.G5, N.B5, N.D6,
];
const SUMMON_LEAD: number[] = [
  N.A5, 0, N.E5, 0, N.B5, 0, N.G5, 0,
  N.B5, 0, N.D6, N.C6, N.A5, 0, N.E5, 0,
  N.F5, 0, N.A5, N.C6, N.B5, 0, N.G5, 0,
  N.C6, 0, N.E6, 0, N.D6, 0, N.B5, 0,
];

/* ==================== 5. INTRO THEME (Temporal Clockwork & Destiny, 100 BPM) ==================== */
const INTRO_CHORDS: number[][] = [
  [N.A2, N.E3, N.C4], // Am
  [N.F2, N.C3, N.A3], // F
  [N.C3, N.G3, N.E4], // C
  [N.G2, N.D3, N.B3], // G
  [N.D3, N.A3, N.F4], // Dm
  [N.A2, N.E3, N.C4], // Am
  [N.F2, N.C3, N.A3], // F
  [N.E2, N.B2, N.Ab3], // E
];
const INTRO_LEAD: number[] = [
  N.E5, 0, N.C5, 0, N.A4, 0, N.C5, 0,
  N.G5, 0, N.E5, 0, N.D5, 0, N.B4, 0,
  N.F5, 0, N.D5, 0, N.E5, 0, N.C5, 0,
  N.A4, 0, N.C5, N.D5, N.E5, 0, 0, 0,
];

/* ==================== 6. ENTRY / HOURGLASS TITLE OVERTURE (C Minor Majestic Clockwork, 108 BPM) ==================== */
const ENTRY_CHORDS: number[][] = [
  [N.C3, N.G3, N.Eb4], // Cm
  [N.Ab2, N.Eb3, N.C4], // Ab
  [N.Eb3, N.Bb3, N.G4], // Eb
  [N.Bb2, N.F3, N.D4], // Bb
  [N.F3, N.C4, N.Ab4], // Fm
  [N.C3, N.G3, N.Eb4], // Cm
  [N.Ab2, N.Eb3, N.C4], // Ab
  [N.G2, N.D3, N.B3], // G
];
const ENTRY_BASS: number[] = [
  N.C2, 0, N.G2, 0, N.Ab2, 0, N.Eb2, 0,
  N.Eb2, 0, N.Bb2, 0, N.Bb2, 0, N.F2, 0,
  N.F2, 0, N.C3, 0, N.C2, 0, N.G2, 0,
  N.Ab2, 0, N.Eb2, 0, N.G2, 0, N.D2, N.G2,
];
const ENTRY_ARP: number[] = [
  N.C5, N.Eb5, N.G5, N.C6, N.Ab4, N.C5, N.Eb5, N.Ab5,
  N.Eb5, N.G5, N.Bb5, N.Eb6, N.Bb4, N.D5, N.F5, N.Bb5,
  N.F5, N.Ab5, N.C6, N.F6, N.C5, N.Eb5, N.G5, N.C6,
  N.Ab4, N.C5, N.Eb5, N.Ab5, N.G4, N.B4, N.D5, N.G5,
];
const ENTRY_LEAD: number[] = [
  N.G5, 0, N.Eb5, N.F5, N.Ab5, 0, N.G5, N.Eb5,
  N.Bb5, 0, N.G5, N.Eb5, N.F5, 0, N.D5, 0,
  N.Ab5, 0, N.G5, N.F5, N.G5, 0, N.Eb5, N.C5,
  N.Eb5, 0, N.D5, N.C5, N.D5, 0, N.B4, 0,
];

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private musicMasterGain: GainNode | null = null;
  private delaySend: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private musicMode: MusicMode = 'off';
  private musicStep = 0;

  private soundEnabled = true;
  private musicVolume = 85;
  private sfxVolume = 85;

  public syncSettings(soundEnabled: boolean, musicVolume: number, sfxVolume: number): void {
    this.soundEnabled = soundEnabled;
    this.musicVolume = musicVolume;
    this.sfxVolume = sfxVolume;
    this.updateMusicGain();
  }

  public unlockAudio(): void {
    const ctx = this.ensureAudioCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          this.updateMusicGain();
          if (this.musicMode !== 'off') {
            this.tickStep();
          }
        })
        .catch(() => {});
    }
    this.updateMusicGain();
  }

  private ensureAudioCtx(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtor) {
          this.audioCtx = new AudioCtor();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      if (this.audioCtx && !this.musicMasterGain) {
        const ctx = this.audioCtx;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.knee.value = 18;
        comp.ratio.value = 5;
        comp.attack.value = 0.004;
        comp.release.value = 0.16;

        this.musicMasterGain = ctx.createGain();
        this.musicMasterGain.connect(comp);
        comp.connect(ctx.destination);

        // Warm musical echo/space send bus for depth and richness
        const delayNode = ctx.createDelay(1.0);
        delayNode.delayTime.value = 0.28;
        const delayFilter = ctx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.value = 2400;
        const delayFeedback = ctx.createGain();
        delayFeedback.gain.value = 0.32;
        const delayWet = ctx.createGain();
        delayWet.gain.value = 0.38;

        this.delaySend = ctx.createGain();
        this.delaySend.gain.value = 1.0;

        this.delaySend.connect(delayNode);
        delayNode.connect(delayFilter);
        delayFilter.connect(delayFeedback);
        delayFeedback.connect(delayNode);
        delayFilter.connect(delayWet);
        delayWet.connect(this.musicMasterGain);

        // Precompute white noise buffer for crisp drums & percussion
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buffer;

        this.updateMusicGain();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public updateMusicGain(): void {
    try {
      if (this.musicMasterGain && this.audioCtx) {
        // Much fuller, stronger output level (up to ~0.95 at 100%)
        const target = this.soundEnabled ? (this.musicVolume / 100) * 0.95 : 0;
        this.musicMasterGain.gain.setTargetAtTime(target, this.audioCtx.currentTime, 0.06);
      }
    } catch {
      // ignore
    }
  }

  private playSynthVoice(opts: {
    freq: number;
    dur: number;
    wave?: OscillatorType;
    detuneCents?: number;
    vol?: number;
    attack?: number;
    cutoff?: number;
    cutoffEnd?: number;
    sendDelay?: number;
    secondHarmonic?: boolean;
  }): void {
    try {
      if (!this.soundEnabled || this.musicVolume <= 0 || !this.audioCtx || !this.musicMasterGain || !opts.freq) {
        return;
      }
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const dur = opts.dur;
      const attack = opts.attack ?? 0.015;
      const vol = opts.vol ?? 0.25;

      const flt = ctx.createBiquadFilter();
      flt.type = 'lowpass';
      const startCut = opts.cutoff ?? 2400;
      flt.frequency.setValueAtTime(startCut, t);
      if (opts.cutoffEnd) {
        flt.frequency.exponentialRampToValueAtTime(Math.max(120, opts.cutoffEnd), t + dur);
      }
      flt.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      const osc1 = ctx.createOscillator();
      osc1.type = opts.wave ?? 'triangle';
      osc1.frequency.setValueAtTime(opts.freq, t);
      osc1.connect(flt);

      let osc2: OscillatorNode | null = null;
      if (opts.detuneCents) {
        osc2 = ctx.createOscillator();
        osc2.type = opts.wave ?? 'triangle';
        osc2.frequency.setValueAtTime(opts.freq, t);
        osc2.detune.setValueAtTime(opts.detuneCents, t);
        osc2.connect(flt);
      } else if (opts.secondHarmonic) {
        osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(opts.freq * 2, t);
        const hGain = ctx.createGain();
        hGain.gain.value = 0.25;
        osc2.connect(hGain);
        hGain.connect(flt);
      }

      flt.connect(gain);
      gain.connect(this.musicMasterGain);

      if (opts.sendDelay && this.delaySend) {
        const sGain = ctx.createGain();
        sGain.gain.value = opts.sendDelay;
        gain.connect(sGain);
        sGain.connect(this.delaySend);
      }

      osc1.start(t);
      osc1.stop(t + dur + 0.05);
      if (osc2) {
        osc2.start(t);
        osc2.stop(t + dur + 0.05);
      }
    } catch {
      // ignore
    }
  }

  private playChordPad(freqs: number[], dur: number, vol = 0.14, cutoff = 1600): void {
    freqs.forEach((f) => {
      this.playSynthVoice({
        freq: f,
        dur,
        wave: 'sawtooth',
        detuneCents: 7,
        vol: vol / freqs.length,
        attack: 0.12,
        cutoff,
        cutoffEnd: cutoff * 0.65,
        sendDelay: 0.25,
      });
    });
  }

  private playKick(vol = 0.45): void {
    try {
      if (!this.soundEnabled || this.musicVolume <= 0 || !this.audioCtx || !this.musicMasterGain) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.11);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.musicMasterGain);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch {
      // ignore
    }
  }

  private playSnare(vol = 0.24): void {
    try {
      if (!this.soundEnabled || this.musicVolume <= 0 || !this.audioCtx || !this.musicMasterGain || !this.noiseBuffer) {
        return;
      }
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      // Noise burst
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const hp = ctx.createBiquadFilter();
      hp.type = 'bandpass';
      hp.frequency.value = 1800;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(vol, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      src.connect(hp);
      hp.connect(nGain);
      nGain.connect(this.musicMasterGain);
      src.start(t);
      src.stop(t + 0.14);

      // Snare body tone
      const osc = ctx.createOscillator();
      const oGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(210, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.07);
      oGain.gain.setValueAtTime(vol * 0.65, t);
      oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(oGain);
      oGain.connect(this.musicMasterGain);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // ignore
    }
  }

  private playHiHat(vol = 0.1, open = false): void {
    try {
      if (!this.soundEnabled || this.musicVolume <= 0 || !this.audioCtx || !this.musicMasterGain || !this.noiseBuffer) {
        return;
      }
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const dur = open ? 0.14 : 0.045;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 6800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      src.connect(hp);
      hp.connect(gain);
      gain.connect(this.musicMasterGain);
      src.start(t);
      src.stop(t + dur + 0.02);
    } catch {
      // ignore
    }
  }

  private playBellChime(freq: number, dur = 0.65, vol = 0.2): void {
    this.playSynthVoice({
      freq,
      dur,
      wave: 'sine',
      secondHarmonic: true,
      vol,
      attack: 0.006,
      cutoff: 5200,
      cutoffEnd: 1600,
      sendDelay: 0.52,
    });
  }

  private tickStep(): void {
    if (!this.soundEnabled || this.musicVolume <= 0 || this.musicMode === 'off') return;
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    const i = this.musicStep % 32;
    const chordIdx = Math.floor(i / 4) % 8;

    if (this.musicMode === 'hub') {
      // Heroic Medieval-Fantasy Hub Adventure
      if (i % 4 === 0) {
        this.playChordPad(HUB_CHORDS[chordIdx], 1.15, 0.26, 1500);
      }
      const bass = HUB_BASS[i];
      if (bass) {
        this.playSynthVoice({
          freq: bass,
          dur: 0.42,
          wave: 'triangle',
          vol: 0.34,
          attack: 0.01,
          cutoff: 520,
        });
      }
      const arp = HUB_ARP[i];
      if (arp) {
        this.playSynthVoice({
          freq: arp,
          dur: 0.32,
          wave: 'triangle',
          secondHarmonic: true,
          vol: 0.19,
          attack: 0.008,
          cutoff: 3200,
          cutoffEnd: 950,
          sendDelay: 0.32,
        });
      }
      const lead = HUB_LEAD[i];
      if (lead) {
        this.playSynthVoice({
          freq: lead,
          dur: 0.5,
          wave: 'sawtooth',
          detuneCents: 6,
          vol: 0.22,
          attack: 0.025,
          cutoff: 2400,
          cutoffEnd: 1200,
          sendDelay: 0.38,
        });
      }
      // Light lively frame-drum + shaker groove
      if (i % 4 === 0) this.playKick(0.28);
      if (i % 4 === 2) this.playHiHat(0.09, false);
      if (i % 8 === 6) this.playSnare(0.11);
    } else if (this.musicMode === 'battle') {
      // Adrenaline-Pumping Energetic RPG Battle
      if (i % 4 === 0) {
        this.playChordPad(BATTLE_CHORDS[chordIdx], 0.85, 0.26, 2100);
      }
      const bass = BATTLE_BASS[i];
      if (bass) {
        this.playSynthVoice({
          freq: bass,
          dur: 0.22,
          wave: 'sawtooth',
          vol: 0.33,
          attack: 0.006,
          cutoff: 780,
          cutoffEnd: 260,
        });
      }
      const arp = BATTLE_ARP[i];
      if (arp) {
        this.playSynthVoice({
          freq: arp,
          dur: 0.2,
          wave: 'square',
          vol: 0.13,
          attack: 0.006,
          cutoff: 2500,
          cutoffEnd: 800,
          sendDelay: 0.22,
        });
      }
      const lead = BATTLE_LEAD[i];
      if (lead) {
        this.playSynthVoice({
          freq: lead,
          dur: 0.34,
          wave: 'sawtooth',
          detuneCents: 10,
          vol: 0.26,
          attack: 0.012,
          cutoff: 3200,
          cutoffEnd: 1400,
          sendDelay: 0.32,
        });
      }
      // Punchy RPG battle percussion
      if (i % 4 === 0 || i % 8 === 5) this.playKick(0.48);
      if (i % 4 === 2) this.playSnare(0.28);
      this.playHiHat(i % 2 === 0 ? 0.11 : 0.06, i % 8 === 7);
    } else if (this.musicMode === 'boss') {
      // Epic High-Stakes Boss Battle
      if (i % 4 === 0) {
        this.playChordPad(BOSS_CHORDS[chordIdx], 0.78, 0.3, 2400);
      }
      const bass = BOSS_BASS[i];
      if (bass) {
        this.playSynthVoice({
          freq: bass,
          dur: 0.19,
          wave: 'sawtooth',
          detuneCents: 8,
          vol: 0.38,
          attack: 0.005,
          cutoff: 920,
          cutoffEnd: 280,
        });
      }
      const lead = BOSS_LEAD[i];
      if (lead) {
        this.playSynthVoice({
          freq: lead,
          dur: 0.32,
          wave: 'sawtooth',
          detuneCents: 12,
          vol: 0.29,
          attack: 0.01,
          cutoff: 3600,
          cutoffEnd: 1500,
          sendDelay: 0.35,
        });
      }
      // Urgent ostinato octave hit
      if (i % 2 === 0) {
        const root = BOSS_CHORDS[chordIdx][0];
        this.playSynthVoice({
          freq: root * 2,
          dur: 0.15,
          wave: 'square',
          vol: 0.13,
          attack: 0.004,
          cutoff: 2200,
        });
      }
      // Double-kick war drums
      if (i % 2 === 0 || i % 8 === 7) this.playKick(0.52);
      if (i % 4 === 2) this.playSnare(0.32);
      this.playHiHat(0.1, i % 4 === 3);
    } else if (this.musicMode === 'summon') {
      // Celestial Mystical Summoning Portal
      if (i % 4 === 0) {
        this.playChordPad(SUMMON_CHORDS[chordIdx], 1.45, 0.32, 2200);
      }
      const bass = SUMMON_BASS[i];
      if (bass) {
        this.playSynthVoice({
          freq: bass,
          dur: 0.85,
          wave: 'sine',
          vol: 0.32,
          attack: 0.04,
          cutoff: 450,
        });
      }
      const chime = SUMMON_CELESTA[i];
      if (chime) {
        this.playBellChime(chime, 0.58, 0.19);
      }
      const lead = SUMMON_LEAD[i];
      if (lead) {
        this.playSynthVoice({
          freq: lead,
          dur: 0.72,
          wave: 'triangle',
          detuneCents: 8,
          secondHarmonic: true,
          vol: 0.23,
          attack: 0.03,
          cutoff: 3400,
          sendDelay: 0.55,
        });
      }
      // Subtle cosmic pulse & sparkle
      if (i % 8 === 0) this.playKick(0.2);
      if (i % 4 === 2) this.playHiHat(0.055, true);
    } else if (this.musicMode === 'entry') {
      // Majestic Hourglass Title Overture: soaring melody + hourglass chimes + clockwork pulse
      if (i % 4 === 0) {
        this.playChordPad(ENTRY_CHORDS[chordIdx], 1.5, 0.3, 1750);
      }
      const bass = ENTRY_BASS[i];
      if (bass) {
        this.playSynthVoice({
          freq: bass,
          dur: 0.62,
          wave: 'triangle',
          vol: 0.34,
          attack: 0.02,
          cutoff: 480,
        });
      }
      const arp = ENTRY_ARP[i];
      if (arp) {
        this.playBellChime(arp, 0.56, 0.17);
      }
      const lead = ENTRY_LEAD[i];
      if (lead) {
        this.playSynthVoice({
          freq: lead,
          dur: 0.72,
          wave: 'sawtooth',
          detuneCents: 8,
          vol: 0.24,
          attack: 0.035,
          cutoff: 2600,
          cutoffEnd: 1200,
          sendDelay: 0.48,
        });
      }
      // Subtle clockwork tick-tock & cinematic pulse
      if (i % 4 === 0) this.playKick(0.28);
      if (i % 2 === 0) this.playHiHat(i % 4 === 0 ? 0.075 : 0.045, false);
    } else if (this.musicMode === 'intro') {
      // Temporal Prologue: Clockwork ticks + warm atmospheric melody
      if (i % 4 === 0) {
        this.playChordPad(INTRO_CHORDS[chordIdx], 1.6, 0.28, 1400);
      }
      const lead = INTRO_LEAD[i];
      if (lead) {
        this.playBellChime(lead, 0.85, 0.24);
      }
      // Subtle clockwork tick-tock
      if (i % 2 === 0) {
        this.playHiHat(i % 4 === 0 ? 0.08 : 0.045, false);
      }
    }

    this.musicStep++;
  }

  public setMusicMode(mode: MusicMode): void {
    try {
      if (this.musicMode === mode) {
        if (mode !== 'off') this.ensureAudioCtx();
        return;
      }
      this.musicMode = mode;
      this.musicStep = 0;
      if (this.musicTimer) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
      if (mode === 'off') return;
      this.ensureAudioCtx();

      const stepMsMap: Record<Exclude<MusicMode, 'off'>, number> = {
        entry: 278,  // ~108 BPM majestic hourglass overture
        hub: 235,    // ~128 BPM lively fantasy adventure
        battle: 195, // ~154 BPM high-energy RPG combat
        boss: 180,   // ~166 BPM intense epic boss
        summon: 265, // ~113 BPM shimmering celestial portal
        intro: 300,  // ~100 BPM atmospheric prologue
      };

      this.tickStep();
      this.musicTimer = setInterval(() => this.tickStep(), stepMsMap[mode]);
    } catch {
      // ignore
    }
  }

  public playRiftExplosion(hasGold: boolean): void {
    if (!this.soundEnabled || this.sfxVolume <= 0) return;
    try {
      const ctx = this.ensureAudioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const sfxScale = this.sfxVolume / 100;

      // Sub-bass shockwave boom
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(160, t);
      boom.frequency.exponentialRampToValueAtTime(34, t + 0.55);
      boomGain.gain.setValueAtTime(0.42 * sfxScale, t);
      boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.62);
      boom.connect(boomGain);
      boomGain.connect(ctx.destination);
      boom.start(t);
      boom.stop(t + 0.65);

      // Crystalline shatter sparkle burst
      if (this.noiseBuffer) {
        const src = ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(2400, t);
        bp.frequency.exponentialRampToValueAtTime(6000, t + 0.35);
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.24 * sfxScale, t);
        nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
        src.connect(bp);
        bp.connect(nGain);
        nGain.connect(ctx.destination);
        src.start(t);
        src.stop(t + 0.42);
      }

      // Radiant chord chime
      const chord = hasGold
        ? [N.C5, N.E5, N.G5, N.C6, N.E6, N.G6]
        : [N.D5, N.A5, N.D6];
      this.playTone(chord, hasGold ? 0.55 : 0.32);
    } catch {
      // ignore
    }
  }

  public playSummonFanfare(hasGold: boolean): void {
    if (!this.soundEnabled || this.sfxVolume <= 0) return;
    const notes = hasGold
      ? [N.C5, N.E5, N.G5, N.B5, N.C6, N.E6]
      : [N.F4, N.A4, N.C5, N.F5];
    this.playTone(notes, hasGold ? 0.38 : 0.26);
  }

  public playTone(freqs: number[], dur = 0.2): void {
    if (!this.soundEnabled || this.sfxVolume <= 0) return;
    try {
      const ctx = this.ensureAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = (this.sfxVolume / 100) * 0.16;
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.055);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.055);
        gain.gain.linearRampToValueAtTime(vol, now + idx * 0.055 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.055);
        osc.stop(now + idx * 0.055 + dur + 0.05);
      });
    } catch {
      // ignore
    }
  }

  public playLightning(intensity: 'normal' | 'heavy' = 'heavy'): void {
    if (!this.soundEnabled || this.sfxVolume <= 0) return;
    try {
      const ctx = this.ensureAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = (this.sfxVolume / 100) * (intensity === 'heavy' ? 0.95 : 0.68);

      // Build 1.6s white-noise buffer for thunder & electric crackle
      const sampleRate = ctx.sampleRate || 44100;
      const len = Math.floor(sampleRate * 1.6);
      const noiseBuf = ctx.createBuffer(1, len, sampleRate);
      const ch = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        ch[i] = Math.random() * 2 - 1;
      }

      // 1. Sharp electrical crack
      const crack = ctx.createBufferSource();
      crack.buffer = noiseBuf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(1700, now);
      hp.frequency.exponentialRampToValueAtTime(320, now + 0.25);
      const crackGain = ctx.createGain();
      crackGain.gain.setValueAtTime(0.0001, now);
      crackGain.gain.linearRampToValueAtTime(0.42 * vol, now + 0.012);
      crackGain.gain.exponentialRampToValueAtTime(0.05 * vol, now + 0.09);
      crackGain.gain.linearRampToValueAtTime(0.3 * vol, now + 0.13);
      crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
      crack.connect(hp);
      hp.connect(crackGain);
      crackGain.connect(ctx.destination);
      crack.start(now);
      crack.stop(now + 0.38);

      // 2. Electric plasma zap sweep
      const zap = ctx.createOscillator();
      const zapGain = ctx.createGain();
      zap.type = 'sawtooth';
      zap.frequency.setValueAtTime(1400, now);
      zap.frequency.exponentialRampToValueAtTime(95, now + 0.22);
      zapGain.gain.setValueAtTime(0.0001, now);
      zapGain.gain.linearRampToValueAtTime(0.14 * vol, now + 0.01);
      zapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      zap.connect(zapGain);
      zapGain.connect(ctx.destination);
      zap.start(now);
      zap.stop(now + 0.25);

      // 3. Deep rolling thunder tail
      const rumble = ctx.createBufferSource();
      rumble.buffer = noiseBuf;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(250, now + 0.04);
      lp.frequency.exponentialRampToValueAtTime(64, now + 1.5);
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(0.0001, now);
      rumbleGain.gain.linearRampToValueAtTime(0.46 * vol, now + 0.08);
      rumbleGain.gain.exponentialRampToValueAtTime(0.2 * vol, now + 0.58);
      rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);
      rumble.connect(lp);
      lp.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      rumble.start(now + 0.03);
      rumble.stop(now + 1.58);

      // 4. Sub-bass thunder boom
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(88, now + 0.04);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.95);
      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.24 * vol, now + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now + 0.04);
      sub.stop(now + 1.02);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
