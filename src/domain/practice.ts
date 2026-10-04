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

export interface LaboratoryConfig {
  enabled: boolean; gap: boolean; audiblePhrases: number; silentPhrases: number;
  ladder: boolean; phrasesPerLevel: number; targetLevel: number;
}
export const LABORATORY_FEATURES = [
  { id:'gap', title:'Znikający groove', description:'Akompaniament i klik znikają na całe frazy. Graj dalej i sprawdź powrót na jedynkę.' },
  { id:'ladder', title:'Drabinka Complexity', description:'Co kilka pełnych fraz przechodzisz o poziom wyżej, przy tym samym tempie.' },
  { id:'comparison', title:'Porównanie A/B', description:'Zapamiętaj dwie wersje z tempem i brzmieniem, przełączaj je i zobacz różnice w partiach.' },
] as const;
export function normalizeLaboratory(value: Partial<LaboratoryConfig> = {}): LaboratoryConfig {
  if(!value || typeof value!=='object') value={};
  const n=(v:number|undefined,def:number,min:number,max:number)=>Number.isFinite(v)?Math.max(min,Math.min(max,Math.round(v!))):def;
  const enabled=value.enabled===true;
  return {enabled,gap:enabled && value.gap===true,ladder:enabled && value.ladder===true,audiblePhrases:n(value.audiblePhrases,2,1,16),silentPhrases:n(value.silentPhrases,2,1,16),phrasesPerLevel:n(value.phrasesPerLevel,4,1,16),targetLevel:n(value.targetLevel,4,0,7)};
}
export function silentPracticePhrase(phrase:number, value:Partial<LaboratoryConfig>):boolean {
  const lab=normalizeLaboratory(value);
  return lab.gap && Math.max(0,Math.floor(phrase))%(lab.audiblePhrases+lab.silentPhrases)>=lab.audiblePhrases;
}
export function ladderLevel(start:number,completedPhrases:number,value:Partial<LaboratoryConfig>,max:number):number {
  const lab=normalizeLaboratory(value);
  return lab.ladder ? Math.min(max,Math.max(start,Math.min(lab.targetLevel,start+Math.floor(Math.max(0,completedPhrases)/lab.phrasesPerLevel)))) : start;
}
export function inspectPracticePlan(config:Partial<LaboratoryConfig>={}, start=0, max=7, phrases=16) {
  const lab=normalizeLaboratory(config);
  max=Number.isFinite(max)?Math.max(0,Math.min(7,Math.round(max))):7;
  start=Number.isFinite(start)?Math.max(0,Math.min(max,Math.round(start))):0;
  phrases=Number.isFinite(phrases)?Math.max(1,Math.min(64,Math.round(phrases))):16;
  return {config:lab,features:LABORATORY_FEATURES,phrases:Array.from({length:Math.max(1,Math.min(64,Math.round(phrases)))},(_,phrase)=>({phrase:phrase+1,audible:!silentPracticePhrase(phrase,lab),complexity:ladderLevel(start,phrase,lab,max)}))};
}
