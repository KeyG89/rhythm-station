import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_TRADITIONAL: RhythmStyle[] = [
  createStyle(
    '90',
    'March 2/4',
    'TRADITIONAL',
    116,
    [2, 4],
    'Tradycyjny marsz orkiestrowy (John Philip Sousa style) z rudymentarnym werblem.',
    'Werbel grający tremola i akcenty marszowe, talerze crash na "raz", bęben basowy 1 & 2.',
    'Rudymenty werblowe (paradiddle, flamy, press roll) i żelazny puls marszowy.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 4, 8, 12], 0.7)
        .add('snare', [0, 2, 4, 6, 7, 8, 10, 12, 14, 15], 0.5)
        .add('snare', [0, 4, 8, 12], 0.85) // accents
        .add('kick', [0, 8], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('crash', [0, 8], 0.9)
        .add('snare', [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15], 0.55)
        .add('snare', [0, 4, 8, 12], 0.95)
        .add('kick', [0, 8], 0.95)
        .build()
    }
  ),
  createStyle(
    '91',
    'March 6/8',
    'TRADITIONAL',
    112,
    [6, 8],
    'Marsz wojskowy 6/8 (np. The Liberty Bell, Washington Post).',
    'Rytm 6/8: 1-2-3, 4-5-6 z akcentami na 1 i 4, stopa na każdą część taktu.',
    'Marszowe podziały triolowe (diddle w 6/8) i precyzyjne odliczanie.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('snare', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 0.45)
        .add('snare', [0, 6], 0.9)
        .add('kick', [0, 6], 0.9)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('crash', [0], 0.9)
        .add('snare', [0, 1, 2, 4, 5, 6, 7, 8, 10, 11], 0.55)
        .add('snare', [0, 6], 0.95)
        .add('kick', [0, 4, 6, 10], 0.95)
        .build()
    }
  ),
  createStyle(
    '92',
    'German Polka',
    'TRADITIONAL',
    124,
    [2, 4],
    'Klasyczna bawarska Polka (Oompah style) z mocnym "um-pah, um-pah".',
    'Stopa: 1 oraz 2 (um). Werbel i hi-hat: "i" po każdej mierze (pah).',
    'Szybkie uderzenia werbla na słabą część taktu (off-beat) bez opóźnienia.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 8], 0.9)
        .add('hihat_closed', [4, 12], 0.75)
        .add('snare', [4, 12], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 6, 8, 14], 0.95)
        .add('hihat_open', [4, 12], 0.8)
        .add('snare', [4, 12], 0.9)
        .add('snare', [2, 10], 0.35)
        .add('cowbell', [0, 4, 8, 12], 0.65)
        .build()
    }
  ),
  createStyle(
    '93',
    'Fast Polka',
    'TRADITIONAL',
    144,
    [2, 4],
    'Szybka, skoczna polka z akcentami na talerzach i tamburynie.',
    'Stopa na 1 i 2, werbel z tamburynem na off-beacie, szybkie przejścia.',
    'Wytrzymałość nadgarstka przy szybkim tempie powyżej 140 BPM.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 8], 0.95)
        .add('snare', [4, 12], 0.9)
        .add('tambourine', [4, 12], 0.75)
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 0.95)
        .add('snare', [4, 12], 0.95)
        .add('snare', [2, 6, 10, 14], 0.4)
        .add('crash', [0], 0.85)
        .add('tambourine', [0, 4, 8, 12], 0.8)
        .build()
    }
  ),
  createStyle(
    '94',
    'Vienna Waltz',
    'TRADITIONAL',
    180,
    [3, 4],
    'Szybki, arystokratyczny Walc Wiedeński (Johann Strauss style) w metrum 3/4.',
    'Metrum 3/4: Stopa na 1 (bum), werbel/obręcz i hi-hat na 2 i 3 (cyk-cyk).',
    'Wiedeński akcent: lekkie wyprzedzenie drugiego uderzenia (vocalized waltz pulse).',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('kick', [0], 0.9) // Beat 1
        .add('rimshot', [4, 8], 0.8) // Beats 2 and 3
        .add('hihat_closed', [4, 8], 0.65)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('kick', [0], 0.95)
        .add('snare', [4, 8], 0.85)
        .add('hihat_closed', [4, 8], 0.7)
        .add('triangle', [] as any, 0)
        .add('tom_low', [0], 0.6)
        .build()
    }
  ),
  createStyle(
    '95',
    'French Waltz',
    'TRADITIONAL',
    140,
    [3, 4],
    'Nastrojowy walc paryski (akordeonowy Musette style) w 3/4.',
    'Ciepła stopa na 1, subtelny werbel na 2 i 3, shaker.',
    'Lekkość gry w 3/4 z francuskim klimatem.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('kick', [0], 0.85)
        .add('rimshot', [4, 8], 0.75)
        .add('shaker', [0, 4, 8], 0.45)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('kick', [0], 0.9)
        .add('snare', [4, 8], 0.8)
        .add('hihat_closed', [0, 2, 4, 6, 8, 10], 0.6)
        .build()
    }
  ),
  createStyle(
    '96',
    'English Waltz',
    'TRADITIONAL',
    90,
    [3, 4],
    'Wolny, elegancki Walc Angielski (Slow Waltz) w 3/4.',
    'Bardzo wolne tempo 3/4, miękki side-stick na 2 i 3, delikatny ride.',
    'Dyscyplina i równość w wolnym metrum 3/4.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('ride', [0, 4, 8], 0.65)
        .add('rimshot', [4, 8], 0.8)
        .add('kick', [0], 0.8)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('ride', [0, 2, 4, 6, 8, 10], 0.7)
        .add('snare', [4, 8], 0.85)
        .add('kick', [0, 6], 0.85)
        .build()
    }
  ),
  createStyle(
    '97',
    'Pasodoble',
    'TRADITIONAL',
    124,
    [2, 4],
    'Hiszpański bitwowy Pasodoble (muzyka do korridy) z kastanietami/tamburynem.',
    'Mocna stopa, dynamiczne akcenty na tamburynie i werblu, dramatyczne pauzy.',
    'Dramatyczna dynamika i hiszpański temperament uderzeń.',
    {
      mainA: new PatternBuilder()
        .add('kick', [0, 8], 0.95)
        .add('tambourine', [0, 4, 8, 12], 0.8)
        .add('snare', [0, 4, 8, 12], 0.75)
        .build(),
      mainB: new PatternBuilder()
        .add('kick', [0, 4, 8, 12], 1.0)
        .add('tambourine', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('snare', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('crash', [0, 8], 0.95)
        .build()
    }
  ),
  createStyle(
    '98',
    'Baroque 3/4',
    'TRADITIONAL',
    110,
    [3, 4],
    'Dworski menuet barokowy w metrum 3/4 (Jan Sebastian Bach style).',
    'Delikatny side-stick na miary 2 i 3, akustyczny bęben basowy na 1.',
    'Precyzja dynamiczna i czyste trzymanie pulsu 3/4.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('hihat_closed', [0, 4, 8], 0.6)
        .add('rimshot', [4, 8], 0.75)
        .add('kick', [0], 0.8)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('ride', [0, 4, 8], 0.65)
        .add('snare', [4, 8], 0.8)
        .add('tom_low', [0], 0.7)
        .add('kick', [0, 4], 0.85)
        .build()
    }
  ),
  createStyle(
    '99',
    'Pop Waltz',
    'TRADITIONAL',
    128,
    [3, 4],
    'Nowoczesny pop w metrum 3/4 (np. Kelly Clarkson, Goo Goo Dolls).',
    'Pełny zestaw: stopa na 1, mocny werbel na 2 i 3, otwarty hi-hat.',
    'Współczesne, rockowo-popowe podejście do metrum 3/4.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10], 0.7)
        .add('snare', [4, 8], 0.9)
        .add('kick', [0, 6], 0.9)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4] })
        .add('ride', [0, 2, 4, 6, 8, 10], 0.8)
        .add('hihat_open', [6, 10], 0.75)
        .add('snare', [4, 8], 0.95)
        .add('kick', [0, 2, 6], 0.95)
        .build()
    }
  )
];
