import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_COUNTRY_FOLK: RhythmStyle[] = [
  createStyle(
    '75',
    'Country 2/4',
    'COUNTRY_FOLK',
    116,
    [2, 4],
    'Klasyczny prosty country 2/4 (Johnny Cash "train beat" feel).',
    'Train beat: naprzemienne uderzenia na werblu z akcentem na 2 i 4, stopa na 1 i 3.',
    'Perfekcyjny "train beat" grany miotełkami lub pałkami (RLRL z akcentem).',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('snare', [4, 12], 0.9)
        .add('snare', [2, 6, 10, 14], 0.35)
        .add('kick', [0, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [0, 2, 4, 6, 8, 10, 12, 14], 0.45)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 6, 8, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '76',
    'Country Ballad',
    'COUNTRY_FOLK',
    78,
    [4, 4],
    'Nastrojowa ballada country (Willie Nelson style) z side-stickiem.',
    'Side-stick na 2 i 4, ciepły hi-hat, rzadka i głęboka stopa.',
    'Czystość brzmienia rimshota i głęboki spokój w tempie.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .add('rimshot', [4, 12], 0.85)
        .add('kick', [0, 8], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 6, 8, 10], 0.85)
        .add('tambourine', [4, 12], 0.6)
        .build()
    }
  ),
  createStyle(
    '77',
    'Country Shuffle',
    'COUNTRY_FOLK',
    130,
    [4, 4],
    'Żwawy country shuffle z bujającymi ósemkami i podwójnym uderzeniem werbla.',
    'Bujający swing, podwójny train-beat shuffle na werblu, stopa 1 & 3.',
    'Płynność swingu w muzyce Nashville country.',
    {
      mainA: new PatternBuilder({ swing: 0.6 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [4, 12], 0.9)
        .add('snare', [2, 10], 0.35)
        .add('kick', [0, 8], 0.9)
        .build(),
      mainB: new PatternBuilder({ swing: 0.6 })
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('snare', [2, 6, 10, 14], 0.4)
        .add('kick', [0, 6, 8, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '78',
    'Bluegrass',
    'COUNTRY_FOLK',
    155,
    [2, 4],
    'Bardzo szybki tradycyjny Bluegrass z pędzącą pracą rąk.',
    'Bardzo szybkie szesnastki na hi-hacie lub werblu, stopa na 1 i 2.',
    'Wytrzymałość i dynamika rąk przy tempach powyżej 150 BPM.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [0, 2, 4, 6, 8, 10, 12, 14], 0.4)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 4, 8, 12], 0.9)
        .build()
    }
  ),
  createStyle(
    '79',
    'Country Rock',
    'COUNTRY_FOLK',
    124,
    [4, 4],
    'Mocny southern/country rock (Eagles style) z tamburynem i mocnym werblem.',
    'Tamburyn, otwierany hi-hat, rockowy werbel, napędzająca stopa.',
    'Połączenie country precyzji z rockową energią.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('tambourine', [4, 12], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 6, 8, 10], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('hihat_open', [6, 14], 0.8)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 14], 0.95)
        .build()
    }
  )
];
