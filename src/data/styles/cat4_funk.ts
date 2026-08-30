import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_FUNK_SOUL: RhythmStyle[] = [
  createStyle(
    '40',
    'Funk Rock',
    'FUNK_SOUL',
    108,
    [4, 4],
    'Mieszanka rockowej energii z funkowym groovem (Red Hot Chili Peppers / Chad Smith style).',
    'Mocny kick, wyraziste otwarcia hi-hatu, ghosty na werblu.',
    'Energia połączona z precyzyjną artykulacją ghost-notes.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [6, 14], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('snare', [7, 10, 15], 0.35)
        .add('kick', [0, 3, 8, 10], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 4, 8, 12], 0.9)
        .addEvery('hihat_closed', 1, 0, 0.5)
        .add('snare', [4, 12], 1.0)
        .add('snare', [2, 7, 9, 15], 0.35)
        .add('kick', [0, 2, 6, 8, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '41',
    'Cool Funk',
    'FUNK_SOUL',
    96,
    [4, 4],
    'Spokojny, głęboki funk z dużą ilością przestrzeni (The Meters / Zigaboo Modeliste style).',
    'Synkopowany hi-hat, minimalna stopa, subtelne duszki werblowe.',
    'Granie przestrzenią (niezapełnianie każdego ułamka taktu) i groove.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 3, 6, 8, 10, 11, 14], 0.65)
        .add('snare', [4, 12], 0.9)
        .add('snare', [7, 15], 0.3)
        .add('kick', [0, 5, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [3, 11], 0.75)
        .add('snare', [4, 12], 0.9)
        .add('snare', [1, 7, 9, 15], 0.35)
        .add('kick', [0, 5, 8, 10, 14], 0.9)
        .add('cowbell', [4, 12], 0.6)
        .build()
    }
  ),
  createStyle(
    '42',
    'Soul Groove',
    'FUNK_SOUL',
    92,
    [4, 4],
    'Klasyczny soul groove (Al Green, Otis Redding).',
    'Hi-hat ósemkowy z subtelnym swingiem, stopa na 1 i 3, werbel 2 i 4.',
    'Ciepłe, głębokie brzmienie i idealny time-keeping.',
    {
      mainA: new PatternBuilder({ swing: 0.3 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.85)
        .add('snare', [15], 0.3)
        .add('kick', [0, 6, 8, 10], 0.85)
        .build(),
      mainB: new PatternBuilder({ swing: 0.3 })
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('tambourine', [4, 12], 0.75)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '43',
    'Gospel Fast',
    'FUNK_SOUL',
    132,
    [4, 4],
    'Ekspresyjny gospel chops / praise beat z gęstym werblem i stopą.',
    'Błyskawiczne przejścia, akcenty na hi-hacie, szybkie dwójki na stopie.',
    'Technika stopy (slide/heel-toe) i szybkie uderzenia gospel chops.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.7)
        .add('hihat_open', [6, 14], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('snare', [2, 7, 10, 15], 0.4)
        .add('kick', [0, 2, 6, 8, 10, 14], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('crash', [0, 8], 0.9)
        .addEvery('hihat_closed', 1, 0, 0.75)
        .add('snare', [4, 12], 1.0)
        .add('snare', [1, 2, 7, 9, 10, 15], 0.4)
        .add('kick', [0, 3, 6, 8, 11, 14], 1.0)
        .build()
    }
  ),
  createStyle(
    '44',
    'Motown 60s',
    'FUNK_SOUL',
    124,
    [4, 4],
    'Legendarne brzmienie Motown z Detroit (Funk Brothers / Benny Benjamin style).',
    'Tamburyn i werbel grają na KAŻDĄ miarę (1, 2, 3, 4) lub mocno na 2 i 4.',
    'Porywający puls i uniezależnienie stopy od stałego werbla/tamburynu.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('tambourine', [0, 4, 8, 12], 0.8)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 2, 6, 8, 10], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('tambourine', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('snare', [0, 4, 8, 12], 0.9) // All four beats snare accent!
        .add('kick', [0, 3, 6, 8, 11, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '45',
    'R&B Groove',
    'FUNK_SOUL',
    86,
    [4, 4],
    'Współczesny płynny R&B z hi-hatem granym na 32-ki/triole i głębokim basem.',
    'Clap + werbel, synkopowana stopa, zróżnicowane gęstości hi-hatu.',
    'Płynne przechodzenie z prostych szesnastek w gęstsze podziały.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.55)
        .add('clap', [4, 12], 0.85)
        .add('snare', [4, 12], 0.6)
        .add('kick', [0, 7, 10], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [6, 14], 0.75)
        .add('clap', [4, 12], 0.9)
        .add('snare', [4, 12], 0.7)
        .add('kick', [0, 3, 6, 8, 10, 13], 0.95)
        .add('shaker', [1, 3, 5, 7, 9, 11, 13, 15], 0.45)
        .build()
    }
  ),
  createStyle(
    '46',
    'Slap Funk',
    'FUNK_SOUL',
    104,
    [4, 4],
    'Agresywny funk do podkładu basowego slap (Marcus Miller / Flea style).',
    'Gęsty kick punktujący slap basu, cowbell i snapping snare.',
    'Precyzyjny timing stopy z werblem.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [4, 12], 0.95)
        .add('snare', [7, 15], 0.35)
        .add('kick', [0, 2, 6, 8, 11, 14], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.7)
        .add('cowbell', [0, 4, 8, 12], 0.75)
        .add('snare', [4, 12], 1.0)
        .add('snare', [2, 7, 10, 15], 0.4)
        .add('kick', [0, 2, 6, 8, 10, 14], 1.0)
        .build()
    }
  ),
  createStyle(
    '47',
    'Gospel Slow',
    'FUNK_SOUL',
    68,
    [4, 4],
    'Bardzo wolny, potężny gospel z głębokim werblem i hi-hatem na 32-ki.',
    'Głęboka przestrzeń, mocny backbeat na 2 i 4, cichy hi-hat.',
    'Dyscyplina w bardzo wolnym tempie (nieprzyspieszanie taktu).',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.5)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 6, 8, 11], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.55)
        .add('hihat_open', [14], 0.7)
        .add('snare', [4, 12], 1.0)
        .add('snare', [10, 15], 0.35)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '48',
    'Neo Soul',
    'FUNK_SOUL',
    82,
    [4, 4],
    'Cechujący się opóźnionym, pijanym groovem beat neo-soul (Questlove style).',
    'Rimshot / snare z opóźnieniem (laid back), luźny hi-hat.',
    'Granie "za bitem" z naturalnym feelingiem.',
    {
      mainA: new PatternBuilder({ swing: 0.38 })
        .addEvery('hihat_closed', 1, 0, 0.55)
        .add('rimshot', [4, 12], 0.85)
        .add('kick', [0, 5, 8, 11], 0.85)
        .build(),
      mainB: new PatternBuilder({ swing: 0.38 })
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [7, 15], 0.7)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 3, 6, 8, 11, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '49',
    'Funk Fusion',
    'FUNK_SOUL',
    110,
    [4, 4],
    'Zaawansowany rytm jazz-funkowy z dzwonkiem ride’a i gęstymi akcentami.',
    'Ride z dzwonkiem, lewa noga na hi-hacie, polirytmiczna stopa.',
    'Prawdziwy test koordynacji dla zaawansowanego perkusisty.',
    {
      mainA: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('ride_bell', [4, 10], 0.85)
        .add('hihat_pedal', [4, 12], 0.6)
        .add('snare', [4, 12], 0.95)
        .add('snare', [2, 7, 9, 15], 0.35)
        .add('kick', [0, 3, 6, 8, 11, 14], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 3, 6, 8, 11, 14], 0.9)
        .add('hihat_closed', [2, 4, 6, 10, 12, 14], 0.6)
        .add('snare', [4, 12], 1.0)
        .add('snare', [1, 2, 7, 9, 15], 0.4)
        .add('kick', [0, 2, 5, 8, 10, 14], 1.0)
        .build()
    }
  )
];
