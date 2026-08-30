import { RhythmStyle, RhythmSection, DrumHit } from '../types/rhythm';
import { DrumSynthesizer } from './DrumSynthesizer';

export interface SchedulerCallbacks {
  onStepChange?: (stepIndex: number, barNumber: number, section: RhythmSection, hits: DrumHit[]) => void;
  onSectionChange?: (section: RhythmSection) => void;
  onBarComplete?: (totalBars: number) => void;
  onPlaybackEnd?: () => void;
  onCountInBeat?: (beatNumber: number, totalBeats: number) => void;
}

export class AudioScheduler {
  private synth: DrumSynthesizer;
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private animationFrameId: number | null = null;

  // Timing constants
  private readonly lookaheadMs = 30; // Check every 30ms
  private readonly scheduleAheadTime = 0.12; // Schedule audio 120ms ahead

  // State
  private currentStyle!: RhythmStyle;
  private currentSection: RhythmSection = 'mainA';
  private nextSection: RhythmSection | null = null;
  private returnToSectionAfterFill: RhythmSection = 'mainA';

  private bpm: number = 120;
  private nextStepTime: number = 0;
  private currentStep: number = 0;
  private currentBar: number = 1;
  private totalBarsPlayed: number = 0;

  // Count-in
  private countInBarsTotal: number = 0; // 0 for off, 1 or 2 for count-in
  private countInBeatsRemaining: number = 0;
  private isCountInActive: boolean = false;

  // Metronome
  private metronomeEnabled: boolean = false;
  private metronomeVolume: number = 0.6;

  // Visual event queue to sync UI with audio currentTime
  private eventQueue: Array<{
    time: number;
    step: number;
    bar: number;
    section: RhythmSection;
    hits: DrumHit[];
  }> = [];

  private callbacks: SchedulerCallbacks = {};

  constructor(synth: DrumSynthesizer, initialStyle: RhythmStyle) {
    this.synth = synth;
    this.currentStyle = initialStyle;
    this.bpm = initialStyle.defaultBpm;
  }

  public setCallbacks(callbacks: SchedulerCallbacks) {
    this.callbacks = callbacks;
  }

  public setStyle(style: RhythmStyle, resetBpm = true) {
    this.currentStyle = style;
    if (resetBpm) {
      this.bpm = style.defaultBpm;
    }
    // If running, ensure current step doesn't exceed new section length
    const pattern = this.currentStyle.sections[this.currentSection] || this.currentStyle.sections.mainA;
    if (this.currentStep >= pattern.steps.length) {
      this.currentStep = 0;
    }
  }

  public setBpm(bpm: number) {
    this.bpm = Math.max(30, Math.min(300, bpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setMetronome(enabled: boolean, volume = 0.6) {
    this.metronomeEnabled = enabled;
    this.metronomeVolume = volume;
  }

  public triggerSection(section: RhythmSection, immediate = false) {
    if (!this.isRunning) {
      this.currentSection = section;
      this.callbacks.onSectionChange?.(section);
      return;
    }

    if (section === 'fillA' || section === 'fillB') {
      // Remember which main section to return to
      if (this.currentSection === 'mainA' || this.currentSection === 'mainB') {
        this.returnToSectionAfterFill = section === 'fillA' ? 'mainA' : 'mainB';
      }
    }

    if (immediate) {
      this.currentSection = section;
      this.currentStep = 0;
      this.callbacks.onSectionChange?.(section);
    } else {
      this.nextSection = section;
    }
  }

  public start(countInBars = 0) {
    if (this.isRunning) return;

    this.synth.initAudio();
    const ctx = this.synth.getContext();

    this.isRunning = true;
    this.currentStep = 0;
    this.currentBar = 1;
    this.totalBarsPlayed = 0;
    this.eventQueue = [];

    const beatsPerBar = this.currentStyle.timeSignature[0];
    this.countInBarsTotal = countInBars;
    this.countInBeatsRemaining = countInBars * beatsPerBar;
    this.isCountInActive = countInBars > 0;

    this.nextStepTime = ctx.currentTime + 0.05;

    this.timerId = window.setInterval(() => this.schedulerLoop(), this.lookaheadMs);
    this.startVisualSyncLoop();
  }

  public stop() {
    this.isRunning = false;
    this.isCountInActive = false;
    this.nextSection = null;

    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.eventQueue = [];
    this.callbacks.onPlaybackEnd?.();
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getCurrentSection(): RhythmSection {
    return this.currentSection;
  }

  public getNextSection(): RhythmSection | null {
    return this.nextSection;
  }

  // --- Scheduler Core ---

  private schedulerLoop() {
    if (!this.isRunning) return;
    const ctx = this.synth.getContext();

    while (this.nextStepTime < ctx.currentTime + this.scheduleAheadTime) {
      if (this.isCountInActive) {
        this.scheduleCountInBeat(this.nextStepTime);
      } else {
        this.schedulePatternStep(this.nextStepTime);
      }
    }
  }

  private scheduleCountInBeat(time: number) {
    const beatsPerBar = this.currentStyle.timeSignature[0];
    const totalBeats = this.countInBarsTotal * beatsPerBar;
    const currentCountBeat = totalBeats - this.countInBeatsRemaining + 1;
    const beatInBar = ((currentCountBeat - 1) % beatsPerBar) + 1;

    const isAccent = beatInBar === 1;
    this.synth.triggerMetronome(time, isAccent, this.metronomeVolume * 1.2);

    this.callbacks.onCountInBeat?.(currentCountBeat, totalBeats);

    const secondsPerBeat = 60.0 / this.bpm;
    this.nextStepTime += secondsPerBeat;
    this.countInBeatsRemaining--;

    if (this.countInBeatsRemaining <= 0) {
      this.isCountInActive = false;
      this.currentStep = 0;
      this.currentBar = 1;
    }
  }

  private schedulePatternStep(time: number) {
    const pattern = this.currentStyle.sections[this.currentSection] || this.currentStyle.sections.mainA;
    const totalSteps = pattern.steps.length;
    const stepsPerBeat = pattern.stepsPerBeat || 4;
    const timeSigNumerator = pattern.timeSignature[0];
    const stepsPerBar = stepsPerBeat * timeSigNumerator;

    const stepIndex = this.currentStep;
    const hits = pattern.steps[stepIndex] || [];

    // Metronome click on beat starts
    if (this.metronomeEnabled && stepIndex % stepsPerBeat === 0) {
      const beatInBar = Math.floor(stepIndex / stepsPerBeat) % timeSigNumerator;
      const isAccent = beatInBar === 0;
      this.synth.triggerMetronome(time, isAccent, this.metronomeVolume);
    }

    // Schedule drum hits for this step
    hits.forEach((hit) => {
      const prob = hit.probability !== undefined ? hit.probability : 1.0;
      if (prob >= 1.0 || Math.random() <= prob) {
        this.synth.trigger(hit.instrument, time, hit.velocity);
      }
    });

    // Add to visual sync queue
    this.eventQueue.push({
      time,
      step: stepIndex,
      bar: this.currentBar,
      section: this.currentSection,
      hits
    });

    // Calculate step duration + swing
    let stepDuration = (60.0 / this.bpm) / stepsPerBeat;
    const swing = pattern.swing || 0;
    if (swing > 0 && stepsPerBeat === 4) {
      // Swing on 16th notes
      if (stepIndex % 2 === 0) {
        stepDuration += (stepDuration * swing * 0.4);
      } else {
        stepDuration -= (stepDuration * swing * 0.4);
      }
    }

    this.nextStepTime += stepDuration;
    this.currentStep++;

    // Check if we finished a bar or the entire section
    if (this.currentStep % stepsPerBar === 0) {
      this.currentBar++;
      this.totalBarsPlayed++;
      this.callbacks.onBarComplete?.(this.totalBarsPlayed);
    }

    // Section transition logic at end of pattern
    if (this.currentStep >= totalSteps) {
      this.currentStep = 0;
      this.currentBar = 1;

      if (this.currentSection === 'ending') {
        this.stop();
        return;
      }

      if (this.currentSection === 'intro') {
        this.currentSection = 'mainA';
        this.callbacks.onSectionChange?.('mainA');
      } else if (this.currentSection === 'fillA' || this.currentSection === 'fillB') {
        // Return to main after fill
        this.currentSection = this.returnToSectionAfterFill;
        this.callbacks.onSectionChange?.(this.returnToSectionAfterFill);
      } else if (this.nextSection) {
        this.currentSection = this.nextSection;
        this.nextSection = null;
        this.callbacks.onSectionChange?.(this.currentSection);
      }
    }
  }

  // --- Visual Sync Loop with RequestAnimationFrame ---

  private startVisualSyncLoop() {
    const checkSync = () => {
      if (!this.isRunning) return;
      const ctx = this.synth.getContext();
      const now = ctx.currentTime;

      while (this.eventQueue.length > 0 && this.eventQueue[0].time <= now) {
        const ev = this.eventQueue.shift()!;
        this.callbacks.onStepChange?.(ev.step, ev.bar, ev.section, ev.hits);
      }

      this.animationFrameId = requestAnimationFrame(checkSync);
    };

    this.animationFrameId = requestAnimationFrame(checkSync);
  }
}
