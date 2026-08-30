import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_8BEAT: RhythmStyle[] = [
  createStyle(
    '00',
    '8Beat Pop 1',
    '8BEAT',
    120,
    [4, 4],
    'Klasyczny prosty rytm popowy z ósemkowym hi-hatem i stopą na 1 i 3.',
    'Hi-hat: proste ósemki. Stopa: 1 oraz 3. Werbel: 2 oraz 4 (backbeat).',
    'Ćwicz precyzyjną synchronizację prawej ręki na hi-hacie z lewą na werblu oraz uniezależnienie prawej stopy.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('hihat_pedal', [4, 12], 0.5)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 6, 8, 10], 0.9)
        .build(),
      fillA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6], 0.7)
        .add('snare', [4, 8, 9, 10, 11], 0.9)
        .add('tom_high', [10, 11], 0.85)
        .add('tom_low', [12, 13, 14, 15], 0.9)
        .add('kick', [0, 8], 0.9)
        .build()
    }
  ),
  createStyle(
    '01',
    '8Beat Pop 2',
    '8BEAT',
    116,
    [4, 4],
    'Popowy rytm z synkopowaną stopą na "i" po drugim uderzeniu.',
    'Hi-hat: ósemki z akcentem na ćwierćnuty. Stopa: 1, 2-i (step 6), 3.',
    'Skup się na synkopie stopy między werblem a kolejną miarą taktu.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 6, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [4, 12], 0.95)
        .add('snare', [10], 0.35) // ghost note
        .add('kick', [0, 6, 8, 14], 0.9)
        .add('tambourine', [0, 4, 8, 12], 0.6)
        .build()
    }
  ),
  createStyle(
    '02',
    '8Beat Standard',
    '8BEAT',
    124,
    [4, 4],
    'Uniwersalny standard pop/rock 8-beat używany w setkach przebojów.',
    'Hi-hat: ósemki. Stopa: 1, 1-i, 3. Werbel: 2, 4.',
    'Płynne granie podwójnego uderzenia stopy na miarze 1.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 2, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('hihat_open', [6, 14], 0.75)
        .add('hihat_closed', [0, 2, 4, 8, 10, 12], 0.7)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 2, 8, 10], 0.9)
        .build()
    }
  ),
  createStyle(
    '03',
    '8Beat Upbeat',
    '8BEAT',
    132,
    [4, 4],
    'Energiczny rytm z otwartym hi-hatem na słabe części taktu (off-beat).',
    'Hi-hat otwarty na "i" (kroki 2, 6, 10, 14). Stopa pulsująca na ćwierćnuty.',
    'Otwieranie i zamykanie hi-hatu lewą nogą dokładnie w tempie.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 4, 8, 12], 0.8)
        .add('hihat_open', [2, 6, 10, 14], 0.75)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 8, 10], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('clap', [4, 12], 0.7)
        .add('kick', [0, 4, 8, 10, 12], 0.9)
        .build()
    }
  ),
  createStyle(
    '04',
    '8Beat Ballad',
    '8BEAT',
    84,
    [4, 4],
    'Spokojny, przestrzenny rytm ballad popowych z obręczą (side stick).',
    'Side stick na 2 i 4 miarę, delikatna stopa, subtelny hi-hat.',
    'Równe i spokojne trzymanie wolnego tempa oraz czyste brzmienie rimshota.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .add('rimshot', [4, 12], 0.85)
        .add('kick', [0, 6, 8], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 6, 8, 10], 0.9)
        .add('shaker', [0, 2, 4, 6, 8, 10, 12, 14], 0.4)
        .build()
    }
  ),
  createStyle(
    '05',
    '8Beat Medium',
    '8BEAT',
    108,
    [4, 4],
    'Średnie tempo pop-rock z napędzającą stopą i ghost notes na werblu.',
    'Stopa: 1, 2-i, 3, 3-i. Werbel: 2, 4 + ghost note.',
    'Balans dynamiczny między głośnym akcentem werbla a cichym duszkiem.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 6, 8, 10], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [4, 12], 0.95)
        .add('snare', [7, 15], 0.3)
        .add('kick', [0, 4, 6, 8, 10], 0.9)
        .build()
    }
  ),
  createStyle(
    '06',
    '8Beat Heavy',
    '8BEAT',
    112,
    [4, 4],
    'Mocny, osadzony beat w stylu klasycznego rocka lat 80/90.',
    'Mocny kick na 1, 2-i, 3 oraz potężny werbel z otwartym hi-hatem.',
    'Solidny, ciężki cios i pełna dynamika uderzenia.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12], 0.8)
        .add('hihat_open', [14], 0.85)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 6, 8, 12], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 4, 8, 12], 0.85)
        .add('ride', [2, 6, 10, 14], 0.75)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 12], 0.95)
        .build()
    }
  ),
  createStyle(
    '07',
    '8Beat Folk',
    '8BEAT',
    104,
    [4, 4],
    'Akustyczny rytm folkowy / singer-songwriter z tamburynem.',
    'Akustyczny hi-hat i tamburyn na 2 i 4 miarę, stopa punktująca.',
    'Lekkość gry i wyczucie akustycznego pulsu.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('tambourine', [4, 12], 0.75)
        .add('snare', [4, 12], 0.75)
        .add('kick', [0, 8, 10], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .add('tambourine', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 6, 8, 10, 14], 0.85)
        .build()
    }
  ),
  createStyle(
    '08',
    '60s 8Beat',
    '8BEAT',
    136,
    [4, 4],
    'Retro beat z lat 60. w stylu British Invasion (The Beatles, The Kinks).',
    'Ciągły otwierany hi-hat, prosty werbel i stopa 1 & 3.',
    'Energiczny drive z kontrolowaną głośnością talerzy.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 4, 8, 12], 0.75)
        .add('hihat_open', [2, 6, 10, 14], 0.7)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 2, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('crash', [0], 0.85)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('snare', [4, 8, 12], 0.9)
        .add('kick', [0, 2, 6, 10], 0.9)
        .build()
    }
  ),
  createStyle(
    '09',
    'Modern 8Beat',
    '8BEAT',
    118,
    [4, 4],
    'Współczesny radiowy pop 8-beat z domieszką handclapu.',
    'Połączenie werbla i clapa na 2 i 4, gęstsza stopa.',
    'Idealny do ćwiczenia nowoczesnego grania z precyzyjnym groovem.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.85)
        .add('clap', [4, 12], 0.7)
        .add('kick', [0, 6, 8, 10, 14], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('hihat_open', [6, 14], 0.8)
        .add('snare', [4, 12], 0.9)
        .add('clap', [4, 12], 0.8)
        .add('kick', [0, 2, 6, 8, 10, 14], 0.95)
        .build()
    }
  )
];
