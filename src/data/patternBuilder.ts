import { DrumInstrument, DrumHit, PatternStep, RhythmPattern, RhythmSection, RhythmStyle, RhythmCategory } from '../types/rhythm';

export interface GridBuilderConfig {
  stepsCount: number; // 16 for 4/4 16ths, 12 for 3/4 or 6/8, 32 for 2-bar 4/4
  stepsPerBeat: number;
  timeSignature: [number, number];
  bars: number;
  swing?: number;
}

/**
 * Helper to build RhythmPattern from ASCII grid or hit maps
 */
export class PatternBuilder {
  private config: GridBuilderConfig;
  private grid: PatternStep[];

  constructor(config: Partial<GridBuilderConfig> = {}) {
    this.config = {
      stepsCount: config.stepsCount || 16,
      stepsPerBeat: config.stepsPerBeat || 4,
      timeSignature: config.timeSignature || [4, 4],
      bars: config.bars || 1,
      swing: config.swing || 0
    };
    this.grid = Array.from({ length: this.config.stepsCount }, () => []);
  }

  public add(instrument: DrumInstrument, stepIndices: number[], velocity: number = 0.8, probability: number = 1.0): PatternBuilder {
    stepIndices.forEach((step) => {
      if (step >= 0 && step < this.grid.length) {
        this.grid[step].push({ instrument, velocity, probability });
      }
    });
    return this;
  }

  public addEvery(instrument: DrumInstrument, interval: number, offset: number = 0, velocity: number = 0.8): PatternBuilder {
    for (let i = offset; i < this.grid.length; i += interval) {
      this.grid[i].push({ instrument, velocity });
    }
    return this;
  }

  /**
   * Helper using ASCII string representation (e.g. "x...x...x...x...")
   */
  public addPattern(instrument: DrumInstrument, patternStr: string, velocityMap: Record<string, number> = { 'x': 0.85, 'X': 1.0, 'o': 0.6, 'g': 0.35 }): PatternBuilder {
    const chars = patternStr.replace(/\s+/g, '');
    for (let i = 0; i < Math.min(chars.length, this.grid.length); i++) {
      const char = chars[i];
      if (velocityMap[char] !== undefined) {
        this.grid[i].push({ instrument, velocity: velocityMap[char] });
      }
    }
    return this;
  }

  public build(): RhythmPattern {
    return {
      steps: this.grid,
      stepsPerBeat: this.config.stepsPerBeat,
      timeSignature: this.config.timeSignature,
      bars: this.config.bars,
      swing: this.config.swing
    };
  }
}

/**
 * Standard Fill-in Generator helpers
 */
export function createRockFillA(stepsPerBeat = 4): RhythmPattern {
  return new PatternBuilder({ stepsCount: 16, stepsPerBeat })
    .add('kick', [0, 4, 8])
    .add('snare', [4, 8, 9, 10, 11], 0.9)
    .add('tom_high', [10, 11], 0.85)
    .add('tom_mid', [12, 13], 0.9)
    .add('tom_low', [14, 15], 0.95)
    .add('crash', [0], 0.9)
    .build();
}

export function createRockFillB(stepsPerBeat = 4): RhythmPattern {
  return new PatternBuilder({ stepsCount: 16, stepsPerBeat })
    .add('kick', [0, 6, 8, 14])
    .add('snare', [4, 8, 9, 10, 11, 12, 13, 14, 15], 0.95)
    .add('tom_high', [8, 9], 0.85)
    .add('tom_mid', [10, 11, 12], 0.9)
    .add('tom_low', [13, 14, 15], 0.95)
    .add('crash', [0, 15], 1.0)
    .build();
}

export function createStandardIntro(styleName: string): RhythmPattern {
  return new PatternBuilder({ stepsCount: 16, stepsPerBeat: 4 })
    .add('hihat_closed', [0, 4, 8, 12], 0.7) // 4 hi-hat count-in clicks
    .add('snare', [8, 10, 12, 14], 0.8)
    .add('kick', [0, 12, 14], 0.9)
    .add('crash', [0], 0.85)
    .build();
}

export function createStandardEnding(): RhythmPattern {
  return new PatternBuilder({ stepsCount: 16, stepsPerBeat: 4 })
    .add('kick', [0, 4, 8, 12])
    .add('snare', [4, 8, 10, 12, 14], 0.95)
    .add('tom_low', [14], 0.9)
    .add('crash', [0, 12, 15], 1.0)
    .build();
}

export function createStyle(
  id: string,
  name: string,
  category: RhythmCategory,
  defaultBpm: number,
  timeSignature: [number, number],
  description: string,
  drumPatternDescription: string,
  practiceFocus: string,
  sections: {
    mainA: RhythmPattern;
    mainB: RhythmPattern;
    fillA?: RhythmPattern;
    fillB?: RhythmPattern;
    intro?: RhythmPattern;
    ending?: RhythmPattern;
  }
): RhythmStyle {
  return {
    id,
    name,
    category,
    defaultBpm,
    timeSignature,
    description,
    drumPatternDescription,
    practiceFocus,
    sections: {
      mainA: sections.mainA,
      mainB: sections.mainB,
      fillA: sections.fillA || createRockFillA(sections.mainA.stepsPerBeat),
      fillB: sections.fillB || createRockFillB(sections.mainA.stepsPerBeat),
      intro: sections.intro || createStandardIntro(name),
      ending: sections.ending || createStandardEnding()
    }
  };
}
