import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_16BEAT: RhythmStyle[] = [
  createStyle(
    '10',
    '16Beat Pop 1',
    '16BEAT',
    96,
    [4, 4],
    'Klasyczny szesnastkowy rytm popowy z gęstym hi-hatem granym na dwie ręce.',
    'Hi-hat: ciągłe szesnastki. Werbel: 2 i 4. Stopa: 1, 3 oraz synkopy na szesnastki.',
    'Równomierność szesnastek naprzemienną pracą rąk (RLRL).',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 8, 11], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.7)
        .add('hihat_open', [7, 15], 0.75)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 3, 6, 8, 11, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '11',
    '16Beat Pop 2',
    '16BEAT',
    92,
    [4, 4],
    'Zmysłowy 16-beat z subtelnym side-stickiem i synkopowaną stopą.',
    'Side stick na 2 i 4, szesnastki na hi-hacie z akcentami na ćwierćnuty.',
    'Kontrola dynamiki na hi-hacie (akcenty vs ghosty) przy precyzyjnej stopie.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.5)
        .add('hihat_closed', [0, 4, 8, 12], 0.8) // akcenty
        .add('rimshot', [4, 12], 0.85)
        .add('kick', [0, 7, 10], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .addEvery('shaker', 1, 0, 0.5)
        .add('snare', [4, 12], 0.9)
        .add('snare', [9, 15], 0.35)
        .add('kick', [0, 5, 8, 10, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '12',
    '16Beat Funk',
    '16BEAT',
    102,
    [4, 4],
    'Dynamiczny groove funkowy z ghost notes na werblu w stylu Davida Garibaldiego.',
    'Hi-hat 16-tkowy z akcentami, stopa synkopowana, gęste duszki na werblu.',
    'Niezależność kończyn i ciche, precyzyjne "ghost notes" na werblu.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [6, 14], 0.75)
        .add('snare', [4, 12], 0.95)
        .add('snare', [7, 10, 15], 0.35) // ghost notes
        .add('kick', [0, 3, 8, 11], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('cowbell', [2, 6, 10, 14], 0.6)
        .add('snare', [4, 12], 1.0)
        .add('snare', [2, 7, 9, 15], 0.35)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '13',
    '16Beat Ballad',
    '16BEAT',
    76,
    [4, 4],
    'Płynny, szeroki rytm balladowy z miękką szesnastkową pulsacją.',
    'Pojedynczy hi-hat z otwarciami, stopa na "raz" i "trzy i".',
    'Utrzymanie stabilnego wolnego pulsu bez przyspieszania szesnastek.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.55)
        .add('hihat_open', [14], 0.7)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 8, 10], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .addEvery('hihat_closed', 1, 0, 0.45)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 6, 8, 11, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '14',
    '16Beat Shuffle',
    '16BEAT',
    108,
    [4, 4],
    'Szesnastkowy swing/shuffle (Bernard Purdie half-time shuffle).',
    'Hi-hat z bujającym swingiem (Purdie shuffle feel), werbel na 3, ghosty.',
    'Bujanie triolowo-szesnastkowe (swing feel) i lekkość ghost notes.',
    {
      mainA: new PatternBuilder({ swing: 0.55 })
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [8], 0.95) // half-time backbeat
        .add('snare', [2, 5, 11, 14], 0.35) // shuffle ghost notes
        .add('kick', [0, 6, 10], 0.9)
        .build(),
      mainB: new PatternBuilder({ swing: 0.55 })
        .addEvery('hihat_closed', 1, 0, 0.7)
        .add('hihat_open', [7, 15], 0.8)
        .add('snare', [8], 1.0)
        .add('snare', [2, 4, 11, 13], 0.4)
        .add('kick', [0, 3, 6, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '15',
    '16Beat Fusion',
    '16BEAT',
    114,
    [4, 4],
    'Wirtuozerski jazz-rock/fusion beat z dzwonkiem ride’a i synkopami.',
    'Ride z akcentem na ride bell, stopa łamana w stylu Dave Weckl / Steve Gadd.',
    'Koordynacja czterokończynowa i akcentowanie dzwonka talerza.',
    {
      mainA: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('ride_bell', [3, 7, 11], 0.85)
        .add('hihat_pedal', [4, 12], 0.6)
        .add('snare', [4, 12], 0.9)
        .add('snare', [1, 9, 15], 0.35)
        .add('kick', [0, 6, 8, 11, 14], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 3, 6, 8, 11, 14], 0.9)
        .addEvery('hihat_closed', 1, 0, 0.5)
        .add('snare', [4, 12], 0.95)
        .add('snare', [2, 7, 10, 15], 0.4)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '16',
    '16Beat Urban',
    '16BEAT',
    88,
    [4, 4],
    'Nowoczesny groove R&B / Urban Pop z mięsistą stopą i clapem.',
    'Clap z werblem na 2 i 4, szybkie podwójne uderzenia hi-hatu.',
    'Czystość wykonania szybkich rollsów na hi-hacie.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [14], 0.75)
        .add('snare', [4, 12], 0.85)
        .add('clap', [4, 12], 0.75)
        .add('kick', [0, 3, 8, 10], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [4, 12], 0.9)
        .add('clap', [4, 12], 0.85)
        .add('kick', [0, 2, 6, 8, 11, 14], 0.95)
        .add('shaker', [1, 3, 5, 7, 9, 11, 13, 15], 0.5)
        .build()
    }
  ),
  createStyle(
    '17',
    'Modern Groove',
    '16BEAT',
    98,
    [4, 4],
    'Nowoczesny groove z mocno zarysowanym basem i akcentami na talerzu.',
    'Mocny kick, wyraziste otwarcia hi-hatu, werbel punktujący.',
    'Punktualność stopy z basem i dynamiczne uderzenia.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12], 0.7)
        .add('hihat_open', [14], 0.8)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 3, 8, 10, 14], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('hihat_closed', [1, 3, 5, 7, 9, 11, 13, 15], 0.5)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 2, 6, 8, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '18',
    '16Beat Synth',
    '16BEAT',
    105,
    [4, 4],
    'Elektroniczny 16-beat w stylu lat 80/90 z cowbellem i clapem.',
    'Kombinacja elektroniki: cowbell, clap, wyrazisty werbel.',
    'Mechaniczna precyzja i równomierna siła każdego uderzenia.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('clap', [4, 12], 0.8)
        .add('snare', [4, 12], 0.7)
        .add('cowbell', [2, 8, 10], 0.65)
        .add('kick', [0, 6, 8, 10], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.7)
        .add('hihat_open', [6, 14], 0.75)
        .add('clap', [4, 12], 0.9)
        .add('snare', [4, 12], 0.8)
        .add('cowbell', [0, 3, 6, 8, 11, 14], 0.7)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.95)
        .build()
    }
  ),
  createStyle(
    '19',
    'Soul 16Beat',
    '16BEAT',
    90,
    [4, 4],
    'Ciepły, bujający soul z tamburynem i synkopowaną stopą.',
    'Tamburyn na szesnastki, rimshot/snare, miękki bęben basowy.',
    'Budowanie ciepłego laid-back groove’u bez przyspieszania.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('tambourine', [4, 12], 0.75)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 5, 8, 10], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('tambourine', 1, 0, 0.6)
        .add('snare', [4, 12], 0.9)
        .add('snare', [7, 15], 0.3)
        .add('kick', [0, 3, 6, 8, 11, 14], 0.9)
        .build()
    }
  )
];
