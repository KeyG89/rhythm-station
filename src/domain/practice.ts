import { SpeedTrainerConfig } from '../types/audio';

/** A bar may be delivered twice by a render; only new completed bars advance tempo. */
export function trainerTempo(bpm: number, bars: number, previousBars: number, config: SpeedTrainerConfig, maxBpm: number): number {
  if (!config.enabled || bars <= previousBars || bars === 0 || bars % Math.max(1, config.barsPerStep) !== 0) return bpm;
  return Math.min(maxBpm, Math.max(bpm, Math.min(config.targetBpm, bpm + Math.max(1, config.bpmStep))));
}

export function normalizeTrainer(config: SpeedTrainerConfig, range: [number, number]): SpeedTrainerConfig {
  const clamp = (n: number) => Math.max(range[0], Math.min(range[1], Math.round(Number.isFinite(n) ? n : range[0])));
  const startBpm = clamp(config.startBpm);
  return { ...config, startBpm, targetBpm: Math.max(startBpm, clamp(config.targetBpm)), bpmStep: Math.max(1, Math.min(20, Math.round(config.bpmStep) || 1)), barsPerStep: Math.max(1, Math.min(32, Math.round(config.barsPerStep) || 1)) };
}
