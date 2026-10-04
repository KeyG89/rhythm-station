export type DrumInstrument =
  | 'clave'
  | 'kick'
  | 'snare'
  | 'rimshot'
  | 'clap'
  | 'hihat_closed'
  | 'hihat_open'
  | 'hihat_pedal'
  | 'tom_high'
  | 'tom_mid'
  | 'tom_low'
  | 'crash'
  | 'ride'
  | 'ride_bell'
  | 'tambourine'
  | 'cowbell'
  | 'conga_high'
  | 'conga_low'
  | 'shaker';

export interface DrumInstrumentMeta {
  id: DrumInstrument;
  name: string;
  shortName: string;
  category: 'core' | 'cymbals' | 'toms' | 'percussion';
  midiNote: number;
  color: string;
}

export const DRUM_INSTRUMENTS_META: Record<DrumInstrument, DrumInstrumentMeta> = {
  clave: { id: 'clave', name: 'Claves', shortName: 'CLV', category: 'percussion', midiNote: 75, color: '#d97706' },
  kick: { id: 'kick', name: 'Bass Drum (Stopa)', shortName: 'BD', category: 'core', midiNote: 36, color: '#ef4444' },
  snare: { id: 'snare', name: 'Snare Drum (Werbel)', shortName: 'SD', category: 'core', midiNote: 38, color: '#f97316' },
  rimshot: { id: 'rimshot', name: 'Side Stick (Obręcz)', shortName: 'SS', category: 'core', midiNote: 37, color: '#f59e0b' },
  clap: { id: 'clap', name: 'Hand Clap', shortName: 'CLP', category: 'percussion', midiNote: 39, color: '#eab308' },
  hihat_closed: { id: 'hihat_closed', name: 'Closed Hi-Hat', shortName: 'CHH', category: 'cymbals', midiNote: 42, color: '#10b981' },
  hihat_open: { id: 'hihat_open', name: 'Open Hi-Hat', shortName: 'OHH', category: 'cymbals', midiNote: 46, color: '#06b6d4' },
  hihat_pedal: { id: 'hihat_pedal', name: 'Pedal Hi-Hat', shortName: 'PHH', category: 'cymbals', midiNote: 44, color: '#14b8a6' },
  ride: { id: 'ride', name: 'Ride Cymbal', shortName: 'RD', category: 'cymbals', midiNote: 51, color: '#3b82f6' },
  ride_bell: { id: 'ride_bell', name: 'Ride Bell', shortName: 'RDB', category: 'cymbals', midiNote: 53, color: '#6366f1' },
  crash: { id: 'crash', name: 'Crash Cymbal', shortName: 'CR', category: 'cymbals', midiNote: 49, color: '#8b5cf6' },
  tom_high: { id: 'tom_high', name: 'High Tom', shortName: 'HT', category: 'toms', midiNote: 50, color: '#ec4899' },
  tom_mid: { id: 'tom_mid', name: 'Mid Tom', shortName: 'MT', category: 'toms', midiNote: 47, color: '#d946ef' },
  tom_low: { id: 'tom_low', name: 'Low / Floor Tom', shortName: 'LT', category: 'toms', midiNote: 43, color: '#a855f7' },
  tambourine: { id: 'tambourine', name: 'Tambourine', shortName: 'TAM', category: 'percussion', midiNote: 54, color: '#e11d48' },
  cowbell: { id: 'cowbell', name: 'Cowbell', shortName: 'CB', category: 'percussion', midiNote: 56, color: '#ca8a04' },
  conga_high: { id: 'conga_high', name: 'High Conga', shortName: 'HCG', category: 'percussion', midiNote: 62, color: '#65a30d' },
  conga_low: { id: 'conga_low', name: 'Low Conga', shortName: 'LCG', category: 'percussion', midiNote: 64, color: '#16a34a' },
  shaker: { id: 'shaker', name: 'Shaker / Maracas', shortName: 'SHK', category: 'percussion', midiNote: 70, color: '#0d9488' }
};

export type RhythmCategory =
  | '8BEAT'
  | '16BEAT'
  | 'ROCK_BLUES'
  | 'DISCO_DANCE'
  | 'FUNK_SOUL'
  | 'JAZZ_SWING'
  | 'LATIN'
  | 'COUNTRY_FOLK'
  | 'BALLAD'
  | 'TRADITIONAL';

export const CATEGORY_NAMES: Record<RhythmCategory, { title: string; range: string; desc: string }> = {
  '8BEAT': { title: '8-Beat Pop & Standard', range: '00-09', desc: 'Podstawowe rytmy ósemkowe pop, rock ballad i standard' },
  '16BEAT': { title: '16-Beat & Modern Groove', range: '10-19', desc: 'Szesnastkowe rytmy funk-pop, fusion i współczesne beaty' },
  'ROCK_BLUES': { title: 'Rock, Metal & Blues', range: '20-29', desc: 'Hard Rock, Heavy Metal, Shuffle, Rock & Roll, Blues' },
  'DISCO_DANCE': { title: 'Disco, Eurobeat & Dance', range: '30-39', desc: 'Eurobeat, Synth Pop, Techno, House, Disco 70s/80s' },
  'FUNK_SOUL': { title: 'Funk, R&B & Gospel', range: '40-49', desc: 'Groove funkowy, motown, soul, gospel i modern R&B' },
  'JAZZ_SWING': { title: 'Jazz, Swing & Big Band', range: '50-59', desc: 'Swing, Bebop, Jazz Waltz, Big Band, Dixieland' },
  'LATIN': { title: 'Latin, Bossa & Caribbean', range: '60-74', desc: 'Bossa Nova, Samba, Salsa, Mambo, Cha-Cha, Reggae, Calypso' },
  'COUNTRY_FOLK': { title: 'Country, Folk & Bluegrass', range: '75-79', desc: 'Country 2/4, Country Shuffle, Bluegrass, Folk Rock' },
  'BALLAD': { title: 'Ballads & Slow Rock (6/8)', range: '80-89', desc: 'Pop Ballad, Piano Ballad, 6/8 Slow Rock, Blues Ballad' },
  'TRADITIONAL': { title: 'Traditional, March & Waltz', range: '90-99', desc: 'Marsz, Polka, Walc wiedeński, Baroque, Pasodoble' }
};

export type RhythmSection = 'intro' | 'mainA' | 'mainB' | 'fillA' | 'fillB' | 'ending';

export interface DrumHit {
  instrument: DrumInstrument;
  velocity: number; // 0.0 - 1.0
  probability?: number; // 0.0 - 1.0 (default 1.0)
  role?: 'essential' | 'variation' | 'ghost';
}

export type PatternStep = DrumHit[];

export interface RhythmPattern {
  steps: PatternStep[]; // Array of step hits
  stepsPerBeat: number; // Typically 4 for 16th notes, 3 for 12/8 or triplets, 2 for 8ths
  timeSignature: [number, number]; // [4,4], [3,4], [6,8], [12,8]
  bars: number;
  swing?: number; // 0.0 to 1.0 (triplet feel delay on even 16ths/8ths)
  swingStepGroup?: number; // 1: paired grid steps; 2: swing eighths on a sixteenth grid
  swingRatio?: number; // 50 = straight; 66.67 = triplet long-short pairs
}

export interface SimilarSong {
  title: string;
  artist: string;
  year?: string;
  vibeDescription?: string;
}

export interface RhythmStyle {
  bpmUnit?: 'quarter' | 'dotted-quarter';
  pulseGroups?: number[]; // groups of denominator units, e.g. 3+3 or 2+2+3
  id: string; // e.g. "00", "01" ... "99"
  name: string;
  category: RhythmCategory;
  defaultBpm: number;
  timeSignature: [number, number];
  description: string;
  drumPatternDescription: string; // e.g. "Hi-hat 8ths, Kick on 1 & 3, Snare on 2 & 4"
  practiceFocus: string; // Co ćwiczyć na perkusji przy tym rytmie
  similarSongs?: SimilarSong[]; // Piosenki o podobnym klimacie i rytmie
  sections: Record<RhythmSection, RhythmPattern>;
}
