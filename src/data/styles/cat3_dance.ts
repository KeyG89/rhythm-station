import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_DISCO_DANCE: RhythmStyle[] = [
  createStyle(
    '30',
    'Eurobeat',
    'DISCO_DANCE',
    140,
    [4, 4],
    'Szybki, energetyczny eurodance/eurobeat z lat 90. (PSR-220 signature style!).',
    'Stopa: 4/4 na każdą ćwierćnutę (Four-on-the-floor). Otwarty hi-hat na "i" (off-beat). Werbel: 2 i 4.',
    'Perfekcyjne zgranie otwierania hi-hatu z uderzeniem stopy w szybkim tempie.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .add('hihat_open', [2, 6, 10, 14], 0.8)
        .add('hihat_closed', [0, 4, 8, 12], 0.6)
        .add('snare', [4, 12], 0.95)
        .add('clap', [4, 12], 0.75)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .add('snare', [4, 12], 1.0)
        .add('clap', [4, 12], 0.85)
        .add('cowbell', [0, 3, 6, 8, 11, 14], 0.7)
        .build()
    }
  ),
  createStyle(
    '31',
    'Disco 70s',
    'DISCO_DANCE',
    120,
    [4, 4],
    'Klasyczne disco lat 70. (Bee Gees, Donna Summer, ABBA).',
    'Four-on-the-floor kick, szesnastki na hi-hacie z otwarciem na każde "i", werbel na 2 i 4.',
    'Płynna praca lewej stopy na pedale hi-hatu.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 0.95)
        .addEvery('hihat_closed', 1, 0, 0.55)
        .add('hihat_open', [2, 6, 10, 14], 0.8)
        .add('snare', [4, 12], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .addEvery('shaker', 1, 0, 0.6)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .add('snare', [4, 12], 0.95)
        .add('clap', [4, 12], 0.8)
        .add('tom_high', [14, 15], 0.8)
        .build()
    }
  ),
  createStyle(
    '32',
    'Disco Phunk',
    'DISCO_DANCE',
    115,
    [4, 4],
    'Funky Disco z congami i otwartym hi-hatem (Earth, Wind & Fire style).',
    'Stopa 4-on-the-floor, perkusjonalia (conga, cowbell), werbel 2 & 4.',
    'Nakładanie warstw perkusyjnych i granie z groovem.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 0.95)
        .add('hihat_closed', [0, 4, 8, 12], 0.6)
        .add('hihat_open', [2, 6, 10, 14], 0.75)
        .add('snare', [4, 12], 0.9)
        .add('conga_high', [2, 6, 11], 0.7)
        .add('conga_low', [8, 14], 0.7)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [2, 6, 10, 14], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('cowbell', [0, 3, 6, 10, 12], 0.7)
        .add('conga_high', [2, 7, 11, 15], 0.75)
        .build()
    }
  ),
  createStyle(
    '33',
    'Techno',
    'DISCO_DANCE',
    135,
    [4, 4],
    'Mocny klubowy puls techno z metalicznym hi-hatem i podbitym basem.',
    'Bezkompromisowy kick na 1, 2, 3, 4, ostry hi-hat, clap na 2 i 4.',
    'Hipotermiczna precyzja i maksymalna stabilność tempa.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .add('clap', [4, 12], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .addEvery('hihat_closed', 1, 0, 0.7)
        .add('hihat_open', [2, 6, 10, 14], 0.9)
        .add('clap', [4, 12], 0.95)
        .add('snare', [4, 12], 0.8)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .build()
    }
  ),
  createStyle(
    '34',
    'House',
    'DISCO_DANCE',
    124,
    [4, 4],
    'Klasyczny Chicago/Deep House z bujającym swingiem na szesnastkach.',
    'Kick 4-on-the-floor, swingujący hi-hat (swing 0.4), snappy clap i werbel.',
    'Poczucie swingu w muzyce house (micro-timing).',
    {
      mainA: new PatternBuilder({ swing: 0.35 })
        .add('kick', [0, 4, 8, 12], 0.95)
        .add('hihat_open', [2, 6, 10, 14], 0.8)
        .add('hihat_closed', [1, 3, 5, 7, 9, 11, 13, 15], 0.5)
        .add('snare', [4, 12], 0.85)
        .add('clap', [4, 12], 0.85)
        .build(),
      mainB: new PatternBuilder({ swing: 0.35 })
        .add('kick', [0, 4, 8, 12], 1.0)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .addEvery('shaker', 1, 0, 0.6)
        .add('snare', [4, 12], 0.9)
        .add('clap', [4, 12], 0.9)
        .add('conga_high', [2, 7, 10, 15], 0.7)
        .build()
    }
  ),
  createStyle(
    '35',
    'Synth Pop 80s',
    'DISCO_DANCE',
    118,
    [4, 4],
    'Kultowy beat syntezatorowy z lat 80. (Depeche Mode, New Order, A-ha).',
    'Punktowa stopa, potężny gated snare / clap, hi-hat na szesnastki.',
    'Mocne uderzenie werbla (rimshot / center) w stylu vintage automatu perkusyjnego.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 6, 8, 10], 0.95)
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('snare', [4, 12], 0.95)
        .add('clap', [4, 12], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 3, 6, 8, 10, 14], 1.0)
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('hihat_open', [6, 14], 0.8)
        .add('snare', [4, 12], 1.0)
        .add('clap', [4, 12], 0.9)
        .add('tom_high', [14], 0.8)
        .add('tom_low', [15], 0.85)
        .build()
    }
  ),
  createStyle(
    '36',
    'Hip Hop Classic',
    'DISCO_DANCE',
    90,
    [4, 4],
    'Klasyczny hip-hop Boom Bap lat 90. (DJ Premier, J Dilla).',
    'Ciężka, głęboka stopa, trzaskający werbel, bujający swing.',
    'Granie za bitem (laid-back boom bap feel) z ciężkim akcentem.',
    {
      mainA: new PatternBuilder({ swing: 0.45 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 3, 10], 1.0)
        .build(),
      mainB: new PatternBuilder({ swing: 0.45 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('hihat_open', [6, 14], 0.75)
        .add('snare', [4, 12], 1.0)
        .add('snare', [15], 0.35)
        .add('kick', [0, 2, 7, 10, 13], 1.0)
        .build()
    }
  ),
  createStyle(
    '37',
    'Trance',
    'DISCO_DANCE',
    138,
    [4, 4],
    'Pędzący rytm trance z otwartym hi-hatem i przyspieszonymi werblami.',
    'Masywna stopa 4x4, talerze crash i gęsty hi-hat.',
    'Wytrzymałość nóg i stała kontrola dynamiki.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .add('clap', [4, 12], 0.9)
        .add('snare', [12], 0.7)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .add('crash', [0], 0.9)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .add('clap', [4, 12], 0.95)
        .add('snare', [4, 12], 0.85)
        .build()
    }
  ),
  createStyle(
    '38',
    'Electro Dance',
    'DISCO_DANCE',
    128,
    [4, 4],
    'Elektro pop z synkopami i podwójnymi uderzeniami stopy.',
    'Stopa: 1, 2-i, 3, 4. Werbel i clap na 2 i 4.',
    'Czystość synkop stopy w gęstym bicie.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 6, 8, 12], 0.95)
        .add('hihat_closed', [0, 2, 4, 8, 10, 12], 0.7)
        .add('hihat_open', [6, 14], 0.8)
        .add('snare', [4, 12], 0.9)
        .add('clap', [4, 12], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 3, 6, 8, 11, 12], 1.0)
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [4, 12], 0.95)
        .add('clap', [4, 12], 0.9)
        .add('tom_high', [14, 15], 0.8)
        .build()
    }
  ),
  createStyle(
    '39',
    'Club Dance',
    'DISCO_DANCE',
    130,
    [4, 4],
    'Klasyczny klubowy beat lat 90. z tamburynem i potężnym clapem.',
    'Four-on-the-floor kick, tamburyn na szesnastki, otwarty hi-hat.',
    'Utrzymywanie napędzającego groove’u tanecznego.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .add('hihat_open', [2, 6, 10, 14], 0.8)
        .add('tambourine', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('clap', [4, 12], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .add('tambourine', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('clap', [4, 12], 0.95)
        .add('cowbell', [2, 8, 10], 0.65)
        .build()
    }
  )
];
