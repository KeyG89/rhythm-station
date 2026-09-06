import { RhythmStyle, RhythmSection, DrumHit, RhythmPattern } from '../types/rhythm';
import { FillType } from '../types/audio';
import { DrumSynthesizer } from './DrumSynthesizer';

export interface SchedulerCallbacks {
  onStepChange?: (stepIndex: number, barNumber: number, section: RhythmSection, hits: DrumHit[]) => void;
  onSectionChange?: (section: RhythmSection) => void;
  onFillTriggered?: (fillType: FillType | null, targetSection: RhythmSection) => void;
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
  private readonly lookaheadMs = 25; // Check every 25ms
  private readonly scheduleAheadTime = 0.12; // Schedule audio 120ms ahead

  // State
  private currentStyle!: RhythmStyle;
  private currentSection: RhythmSection = 'mainA';
  private nextSection: RhythmSection | null = null;
  private returnToSectionAfterFill: RhythmSection = 'mainA';

  // Smart Fill state
  private activeFillType: FillType | null = null;
  private fillStartStep: number = -1;
  private fillLengthSteps: number = 4;
  private fillTargetSection: RhythmSection = 'mainA';
  private fillPatternSource: 'fillA' | 'fillB' = 'fillA';

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

  /**
   * Smart Contextual Transition Handler
   * - Clicking same Main (e.g. Main A -> Main A): 1-beat micro fill (1/4 in 4/4, 1/3 in 3/4)
   * - Clicking switch (Main A -> Main B): 2-beat medium fill (1/2 in 4/4)
   * - Clicking Fill A / Fill B: Full 1-bar fill
   */
  public triggerSmartTransition(type: 'same' | 'switch' | 'full', targetSection?: RhythmSection) {
    if (!this.isRunning) {
      const target = targetSection || (this.currentSection === 'mainA' ? 'mainB' : 'mainA');
      this.currentSection = target;
      this.callbacks.onSectionChange?.(target);
      return;
    }

    const pattern = this.currentStyle.sections[this.currentSection] || this.currentStyle.sections.mainA;
    const stepsPerBeat = pattern.stepsPerBeat || 4;
    const beatsInBar = this.currentStyle.timeSignature[0];
    const stepsPerBar = beatsInBar * stepsPerBeat;
    const stepInBar = this.currentStep % stepsPerBar;
    const remainingInBar = stepsPerBar - stepInBar;

    if (type === 'same') {
      // 1-beat Micro Fill: 1/4 in 4/4, 1/3 in 3/4, or exactly 1 beat length
      const fillDuration = stepsPerBeat;
      this.activeFillType = 'micro';
      this.fillLengthSteps = fillDuration;
      this.fillPatternSource = this.currentSection === 'mainB' ? 'fillB' : 'fillA';
      this.fillTargetSection = this.currentSection;

      if (remainingInBar >= fillDuration) {
        // Space available in CURRENT bar! Start at the beginning of the last beat of this bar
        this.fillStartStep = this.currentStep + (remainingInBar - fillDuration);
      } else {
        // Space not available in current bar: schedule for the last beat of the next bar
        this.fillStartStep = this.currentStep + remainingInBar + (stepsPerBar - fillDuration);
      }
      this.callbacks.onFillTriggered?.('micro', this.fillTargetSection);

    } else if (type === 'switch') {
      // 2-beat Medium Fill: 2x longer, half of 4/4 bar
      const fillBeats = Math.max(1, Math.floor(beatsInBar / 2));
      const fillDuration = fillBeats * stepsPerBeat;
      const target = targetSection || (this.currentSection === 'mainA' ? 'mainB' : 'mainA');

      this.activeFillType = 'medium';
      this.fillLengthSteps = fillDuration;
      this.fillPatternSource = target === 'mainB' ? 'fillA' : 'fillB';
      this.fillTargetSection = target;

      if (remainingInBar >= fillDuration) {
        // Space available in CURRENT bar! Start at the halfway point of this bar
        this.fillStartStep = this.currentStep + (remainingInBar - fillDuration);
      } else {
        // Space not available in current bar: schedule for the halfway point of the next bar
        this.fillStartStep = this.currentStep + remainingInBar + (stepsPerBar - fillDuration);
      }
      this.callbacks.onFillTriggered?.('medium', target);

    } else {
      // Full 1-bar Fill
      const fillSec = targetSection === 'fillB' ? 'fillB' : 'fillA';
      this.activeFillType = 'full';
      this.fillPatternSource = fillSec;
      this.fillLengthSteps = stepsPerBar;
      this.fillTargetSection = fillSec === 'fillB' ? 'mainB' : 'mainA';

      if (stepInBar <= 2) {
        // At very beginning of bar: play full fill now
        this.currentSection = fillSec;
        this.currentStep = 0;
        this.callbacks.onSectionChange?.(fillSec);
      } else {
        // Queue for next bar
        this.nextSection = fillSec;
      }
      this.callbacks.onFillTriggered?.('full', this.fillTargetSection);
    }
  }

  public triggerSection(section: RhythmSection, immediate = false) {
    if (!this.isRunning) {
      this.currentSection = section;
      this.callbacks.onSectionChange?.(section);
      return;
    }

    if (section === 'fillA' || section === 'fillB') {
      this.triggerSmartTransition('full', section);
      return;
    }

    if (immediate) {
      this.currentSection = section;
      this.currentStep = 0;
      this.activeFillType = null;
      this.fillStartStep = -1;
      this.callbacks.onSectionChange?.(section);
    } else {
      if (section === this.currentSection) {
        this.triggerSmartTransition('same', section);
      } else if (
        (this.currentSection === 'mainA' && section === 'mainB') ||
        (this.currentSection === 'mainB' && section === 'mainA')
      ) {
        this.triggerSmartTransition('switch', section);
      } else {
        this.nextSection = section;
      }
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
    this.activeFillType = null;
    this.fillStartStep = -1;
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
    this.activeFillType = null;
    this.fillStartStep = -1;

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

  public getActiveFillType(): FillType | null {
    return this.activeFillType;
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
    let hits = pattern.steps[stepIndex] || [];
    let sectionForDisplay = this.currentSection;

    // Check if we are currently executing a micro or medium fill slice
    if (this.activeFillType && this.fillStartStep >= 0 && stepIndex >= this.fillStartStep) {
      const fillPattern: RhythmPattern = this.currentStyle.sections[this.fillPatternSource] || this.currentStyle.sections.fillA;
      const fillStepsCount = fillPattern.steps.length;
      const fillDuration = this.fillLengthSteps || stepsPerBeat;
      const offsetInFill = stepIndex - this.fillStartStep;

      // Map to the climactic end portion of the fill pattern
      const sourceStepIdx = (fillStepsCount - fillDuration) + offsetInFill;
      if (sourceStepIdx >= 0 && sourceStepIdx < fillStepsCount) {
        hits = fillPattern.steps[sourceStepIdx] || [];
        sectionForDisplay = this.fillPatternSource;
      }
    }

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
      section: sectionForDisplay,
      hits
    });

    // Calculate step duration + swing
    let stepDuration = (60.0 / this.bpm) / stepsPerBeat;
    const swing = pattern.swing || 0;
    if (swing > 0 && stepsPerBeat === 4) {
      if (stepIndex % 2 === 0) {
        stepDuration += (stepDuration * swing * 0.4);
      } else {
        stepDuration -= (stepDuration * swing * 0.4);
      }
    }

    this.nextStepTime += stepDuration;
    this.currentStep++;

    // Check if we finished a bar
    if (this.currentStep % stepsPerBar === 0) {
      this.currentBar++;
      this.totalBarsPlayed++;
      this.callbacks.onBarComplete?.(this.totalBarsPlayed);

      // If a micro or medium fill just finished at the end of this bar, transition to destination section immediately!
      if (this.activeFillType && this.activeFillType !== 'full' && this.fillStartStep >= 0 && this.currentStep > this.fillStartStep) {
        this.currentSection = this.fillTargetSection;
        this.activeFillType = null;
        this.fillStartStep = -1;
        this.callbacks.onSectionChange?.(this.currentSection);
        this.callbacks.onFillTriggered?.(null, this.currentSection);
      }
    }

    // Section transition logic at end of pattern
    if (this.currentStep >= totalSteps) {
      this.currentStep = 0;
      this.currentBar = 1;

      if (this.currentSection === 'ending') {
        this.stop();
        return;
      }

      if (this.activeFillType) {
        // Fill finished! Transition to target section
        this.currentSection = this.fillTargetSection;
        this.activeFillType = null;
        this.fillStartStep = -1;
        this.callbacks.onSectionChange?.(this.currentSection);
        this.callbacks.onFillTriggered?.(null, this.currentSection);
      } else if (this.currentSection === 'intro') {
        this.currentSection = 'mainA';
        this.callbacks.onSectionChange?.('mainA');
      } else if (this.currentSection === 'fillA' || this.currentSection === 'fillB') {
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
