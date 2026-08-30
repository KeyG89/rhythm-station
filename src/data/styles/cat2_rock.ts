import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_ROCK_BLUES: RhythmStyle[] = [
  createStyle(
    '20',
    'Hard Rock',
    'ROCK_BLUES',
    130,
    [4, 4],
    'Agresywny, mocny rytm hard rockowy z otwartym, dudniącym hi-hatem i potężnym werblem.',
    'Półotwarty hi-hat na ósemki, potężny werbel z rimshotem, gęsta stopa.',
    'Wytrzymałość rąk i nóg, potężny rimshot (center snare + rim) dla rockowego kopa.',
    {
      mainA: new PatternBuilder()
        .add('hihat_open', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 6, 8, 10], 1.0)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 2, 4, 6, 8, 10, 12, 14], 0.9)
        .add('crash', [0], 0.95)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 14], 1.0)
        .build(),
      fillA: new PatternBuilder()
        .add('crash', [0], 1.0)
        .add('snare', [0, 2, 4, 6, 8, 9, 10, 11], 0.95)
        .add('tom_high', [8, 9], 0.9)
        .add('tom_mid', [10, 11], 0.95)
        .add('tom_low', [12, 13, 14, 15], 1.0)
        .add('kick', [0, 12, 14], 1.0)
        .build()
    }
  ),
  createStyle(
    '21',
    'Heavy Metal',
    'ROCK_BLUES',
    145,
    [4, 4],
    'Szybki beat heavymetalowy z podwójną stopą (double bass drum style).',
    'Ciągłe szesnastki na stopie (double bass) lub gęsta ósemkowa stopa i crash.',
    'Koordynacja podwójnej stopy i równe uderzenia przy wysokich tempach.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 4, 6, 8, 10, 12, 14], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('crash', [0, 8], 0.95)
        .add('snare', [4, 12], 1.0)
        .addEvery('kick', 1, 0, 0.95) // full double bass 16ths!
        .build()
    }
  ),
  createStyle(
    '22',
    'Rock & Roll',
    'ROCK_BLUES',
    168,
    [4, 4],
    'Klasyczny, szybki rock and roll w stylu Chucka Berry’ego i Elvisa Presleya.',
    'Ósemkowy prosty hi-hat, mocny werbel na 2 i 4, stopa na każdą ćwierćnutę (four on the floor).',
    'Precyzyjne utrzymanie szybkiego tempa bez spinania nadgarstka.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 4, 8, 12], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 4, 8, 10, 12], 0.95)
        .add('clap', [4, 12], 0.7)
        .build()
    }
  ),
  createStyle(
    '23',
    'Slow Rock',
    'ROCK_BLUES',
    72,
    [4, 4],
    'Ciężki, wolny blues-rock (np. Jimi Hendrix, Led Zeppelin).',
    'Szeroki, przestrzenny rytm z głęboką stopą i potężnym werblem.',
    'Granie za bitem (laid-back) i unikanie popędzania.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 6, 8, 10], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [4, 12], 1.0)
        .add('snare', [15], 0.4)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '24',
    'Blues Shuffle',
    'ROCK_BLUES',
    116,
    [4, 4],
    'Klasyczny bluesowy shuffle na triolach / swingu (Chicago Blues).',
    'Hi-hat i ride grają rytm shuffle (triola: raz-i-ta), stopa na 1 i 3, werbel 2 i 4.',
    'Prawdziwy triolowy swing feel (długie pierwsze uderzenie, krótkie drugie).',
    {
      mainA: new PatternBuilder({ swing: 0.65 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 8, 10], 0.9)
        .build(),
      mainB: new PatternBuilder({ swing: 0.65 })
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('hihat_pedal', [4, 12], 0.6)
        .add('snare', [4, 12], 1.0)
        .add('snare', [2, 10], 0.35)
        .add('kick', [0, 4, 8, 10, 12], 0.95)
        .build()
    }
  ),
  createStyle(
    '25',
    'Boogie Woogie',
    'ROCK_BLUES',
    152,
    [4, 4],
    'Skoczny, swingujący boogie rock z szybkim pulsem.',
    'Szybki shuffle na ride i hi-hacie, akcentowany werbel.',
    'Sprężystość nadgarstka przy szybkim swingu.',
    {
      mainA: new PatternBuilder({ swing: 0.6 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 4, 8, 12], 0.9)
        .build(),
      mainB: new PatternBuilder({ swing: 0.6 })
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 2, 4, 6, 8, 10, 12, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '26',
    '70s Rock',
    'ROCK_BLUES',
    124,
    [4, 4],
    'Vintage rock z lat 70. (The Who, Deep Purple, Queen).',
    'Wyrazisty werbel, dzwonek ride’a, otwarty hi-hat.',
    'Wyraziste akcentowanie i potęga uderzenia.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 8, 10, 12], 0.8)
        .add('hihat_open', [6, 14], 0.85)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 2, 8, 10], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 4, 8, 12], 0.9)
        .add('ride', [2, 6, 10, 14], 0.8)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 14], 1.0)
        .build()
    }
  ),
  createStyle(
    '27',
    'Punk Rock',
    'ROCK_BLUES',
    178,
    [4, 4],
    'Superszybki, bezkompromisowy punk rock (Ramones, Green Day, Blink-182).',
    'Otwarty hi-hat / crash na ósemki, werbel na 2 i 4, szybka stopa.',
    'Maksymalna wydolność, szybkość i energia w rękach.',
    {
      mainA: new PatternBuilder()
        .add('hihat_open', [0, 2, 4, 6, 8, 10, 12, 14], 0.9)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 14], 1.0)
        .build(),
      mainB: new PatternBuilder()
        .add('crash', [0, 2, 4, 6, 8, 10, 12, 14], 0.95)
        .add('snare', [2, 6, 10, 14], 1.0) // double-time feel
        .add('kick', [0, 4, 8, 12], 1.0)
        .build()
    }
  ),
  createStyle(
    '28',
    'Grunge Rock',
    'ROCK_BLUES',
    116,
    [4, 4],
    'Surowy, brudny rock lat 90. (Nirvana, Soundgarden, Pearl Jam).',
    'Ciężki crash/hi-hat, głęboki werbel, łamana stopa Dave’a Grohla.',
    'Dynamika cicho/głośno (verse vs chorus).',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12], 0.75)
        .add('hihat_open', [14], 0.85)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 3, 6, 8, 11], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('crash', [0, 4, 8, 12], 0.95)
        .add('hihat_open', [2, 6, 10, 14], 0.85)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 14], 1.0)
        .build()
    }
  ),
  createStyle(
    '29',
    'Southern Rock',
    'ROCK_BLUES',
    128,
    [4, 4],
    'Południowy rock z dwiema stopami i cowbellem (Lynyrd Skynyrd, ZZ Top).',
    'Cowbell punktujący ćwierćnuty, gęsta stopa, mocny werbel.',
    'Rytmiczne granie cowbella prawą ręką przy pracy na zestawie.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('cowbell', [0, 4, 8, 12], 0.7)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 3, 8, 10], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('cowbell', [0, 3, 6, 8, 11, 14], 0.8)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 14], 1.0)
        .build()
    }
  )
];
