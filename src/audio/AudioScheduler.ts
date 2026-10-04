import { pulses, stepDuration, unitDuration } from '../domain/timing';
import { expandHit } from '../domain/rudiments';
import { RhythmStyle, RhythmSection, DrumHit } from '../types/rhythm';
import { FillType } from '../types/audio';
import { DrumSynthesizer } from './DrumSynthesizer';

export interface SchedulerCallbacks {
  onStepChange?: (step: number, bar: number, section: RhythmSection, hits: DrumHit[]) => void;
  onSectionChange?: (section: RhythmSection) => void;
  onFillTriggered?: (fill: FillType | null, target: RhythmSection) => void;
  onBarComplete?: (bars: number) => void;
  onPlaybackEnd?: () => void;
  onCountInBeat?: (beat: number, total: number) => void;
}
interface VisualEvent {
  time: number;
  action: () => void;
}
/** Lookahead audio clock; transitions happen at the end of a complete authored phrase. */
export class AudioScheduler {
  private isRunning = false;
  private timerId: number | null = null;
  private animationFrameId: number | null = null;
  private currentSection: RhythmSection = 'mainA';
  private nextSection: RhythmSection | null = null;
  private returnSection: RhythmSection = 'mainA';
  private activeFillType: FillType | null = null;
  private bpm: number;
  private humanize = 0;
  private nextStepTime = 0;
  private currentStep = 0;
  private totalBars = 0;
  private countInTotal = 0;
  private countInIndex = 0;
  private endingScheduled = false;
  private metronomeEnabled = false;
  private metronomeVolume = 0.6;
  private events: VisualEvent[] = [];
  private pendingStrokes: { instrument: DrumHit['instrument']; time: number; velocity: number }[] = [];
  private callbacks: SchedulerCallbacks = {};
  private readonly ahead = 0.12;

  constructor(private synth: DrumSynthesizer, private currentStyle: RhythmStyle) {
    this.bpm = currentStyle.defaultBpm;
  }
  setCallbacks(callbacks: SchedulerCallbacks) { this.callbacks = callbacks; }
  setStyle(style: RhythmStyle, resetBpm = true) {
    if (style.id !== this.currentStyle.id) {
      this.currentSection = 'mainA'; this.currentStep = 0; this.nextSection = null;
      this.activeFillType = null; this.countInTotal = 0;
    }
    this.currentStyle = style;
    if (resetBpm) this.bpm = style.defaultBpm;
  }
  setBpm(value: number) { if (Number.isFinite(value)) this.bpm = Math.max(30, Math.min(300, value)); }
  getBpm() { return this.bpm; }
  setHumanize(value: number) { this.humanize = Math.max(0, Math.min(12, value)); }
  setMetronome(enabled: boolean, volume = 0.6) { this.metronomeEnabled = enabled; this.metronomeVolume = volume; }
  getIsRunning() { return this.isRunning; }
  getCurrentSection() { return this.currentSection; }
  getNextSection() { return this.nextSection; }
  getActiveFillType() { return this.activeFillType; }

  triggerSmartTransition(type: 'same' | 'switch' | 'full', target?: RhythmSection) {
    this.triggerSection(type === 'same' ? 'fillA' : type === 'switch' ? target ?? (this.currentSection === 'mainA' ? 'mainB' : 'mainA') : target ?? 'fillA');
  }
  triggerSection(section: RhythmSection, immediate = false) {
    if (section === 'fillA' || section === 'fillB') {
      this.returnSection = this.currentSection === 'mainB' ? 'mainB' : 'mainA';
      this.activeFillType = 'full';
      this.callbacks.onFillTriggered?.('full', this.returnSection);
    }
    if (!this.isRunning || immediate) {
      this.currentSection = section; this.currentStep = 0; this.nextSection = null;
      this.callbacks.onSectionChange?.(section);
    } else this.nextSection = section;
  }
  start(countInBars = 0) {
    if (this.isRunning) return;
    void this.synth.initAudio();
    this.isRunning = true;
    this.currentStep = 0; this.totalBars = 0; this.countInIndex = 0;
    this.countInTotal = Math.max(0, Math.floor(countInBars)) * pulses(this.currentStyle).length;
    this.nextSection = null; this.events = []; this.pendingStrokes = []; this.endingScheduled = false;
    this.nextStepTime = this.synth.getContext().currentTime + 0.05;
    this.timerId = window.setInterval(() => this.schedule(), 25);
    this.animationFrameId = requestAnimationFrame(() => this.visualSync());
    this.schedule(); // First grace may precede the first 25 ms timer tick.
  }
  stop() {
    this.isRunning = false; this.countInTotal = 0; this.nextSection = null;
    this.activeFillType = null; this.events = []; this.pendingStrokes = [];
    this.synth.stopVoices();
    if (this.timerId !== null) clearInterval(this.timerId);
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    this.timerId = null; this.animationFrameId = null;
    this.callbacks.onPlaybackEnd?.();
  }
  private schedule() {
    const ctx = this.synth.getContext();
    // Recover from a background-tab clock stall without a burst of missed bars.
    if (this.nextStepTime < ctx.currentTime - this.ahead) this.nextStepTime = ctx.currentTime + 0.05;
    // Reserve 40 ms for anticipatory graces, even at a phrase boundary.
    while (this.isRunning && !this.endingScheduled && this.nextStepTime < ctx.currentTime + this.ahead + 0.04) {
      if (this.countInIndex < this.countInTotal) this.scheduleCountIn();
      else this.scheduleStep();
    }
    // Chronological dispatch matters for hi-hat choking: a long triplet may
    // overlap a later edited cell. Never schedule its future stroke first.
    this.pendingStrokes.sort((a,b)=>a.time-b.time);
    while (this.pendingStrokes.length && this.pendingStrokes[0].time < ctx.currentTime + this.ahead) {
      const hit = this.pendingStrokes.shift()!;
      this.synth.trigger(hit.instrument,Math.max(ctx.currentTime,hit.time),hit.velocity);
    }
  }
  private scheduleCountIn() {
    const pulseList = pulses(this.currentStyle);
    const pulse = pulseList[this.countInIndex % pulseList.length];
    const count = ++this.countInIndex;
    const time = this.nextStepTime;
    this.synth.triggerMetronome(time, pulse.unit === 0, this.metronomeVolume);
    this.events.push({ time, action: () => this.callbacks.onCountInBeat?.(count, this.countInTotal) });
    this.nextStepTime += unitDuration(this.currentStyle, this.bpm) * pulse.durationUnits;
  }
  private scheduleStep() {
    const section = this.currentSection;
    const p = this.currentStyle.sections[section];
    const step = this.currentStep;
    const stepsPerBar = p.stepsPerBeat * p.timeSignature[0];
    const bar = Math.floor(step / stepsPerBar) + 1;
    const time = this.nextStepTime;
    const hits = p.steps[step];
    const pulse = pulses(this.currentStyle).findIndex(item => item.unit * p.stepsPerBeat === step % stepsPerBar);
    if (this.metronomeEnabled && pulse >= 0) this.synth.triggerMetronome(time, pulse === 0, this.metronomeVolume);
    for (const hit of hits) {
      for (const played of expandHit(hit, this.currentStyle, p, this.bpm, step, this.totalBars, this.humanize))
        this.pendingStrokes.push({instrument:hit.instrument,time:time + played.offset,velocity:played.velocity});
    }
    this.events.push({ time, action: () => this.callbacks.onStepChange?.(step, bar, section, hits) });
    this.nextStepTime += stepDuration(this.currentStyle, p, this.bpm, step);
    this.currentStep++;
    if (this.currentStep % stepsPerBar === 0) {
      const bars = ++this.totalBars;
      this.events.push({ time: this.nextStepTime, action: () => this.callbacks.onBarComplete?.(bars) });
    }
    if (this.currentStep === p.steps.length) {
      this.currentStep = 0;
      if (section === 'ending') {
        this.endingScheduled = true;
        this.events.push({ time: this.nextStepTime, action: () => this.stop() });
        return;
      }
      const next = this.nextSection ?? (section === 'fillA' || section === 'fillB' ? this.returnSection : section === 'intro' ? 'mainA' : section);
      this.nextSection = null;
      this.currentSection = next;
      if (next !== section) this.events.push({ time: this.nextStepTime, action: () => {
        this.callbacks.onSectionChange?.(next);
        if (section === 'fillA' || section === 'fillB') { this.activeFillType = null; this.callbacks.onFillTriggered?.(null, next); }
      } });
    }
  }
  private visualSync() {
    if (!this.isRunning) return;
    const now = this.synth.getContext().currentTime;
    while (this.isRunning && this.events.length && this.events[0].time <= now) this.events.shift()!.action();
    if (this.isRunning) this.animationFrameId = requestAnimationFrame(() => this.visualSync());
  }
}
