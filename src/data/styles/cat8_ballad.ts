import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_BALLAD: RhythmStyle[] = [
  createStyle(
    '80',
    'Piano Ballad',
    'BALLAD',
    72,
    [4, 4],
    'Elegancka ballada fortepianowa z ciepłym side-stickiem i subtelną stopą.',
    'Side-stick na 2 i 4 miarę, cichy hi-hat, punktowa stopa na 1 i "trzy i".',
    'Prawdziwa muzykalność: granie dynamicznie i z wyczuciem dla wokalisty.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.55)
        .add('rimshot', [4, 12], 0.85)
        .add('kick', [0, 10], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 6, 8, 10], 0.85)
        .add('shaker', [0, 2, 4, 6, 8, 10, 12, 14], 0.4)
        .build()
    }
  ),
  createStyle(
    '81',
    '6/8 Pop Ballad',
    'BALLAD',
    60,
    [6, 8],
    'Piękna ballada popowa w metrum 6/8 (np. Adele, Whitney Houston).',
    'Metrum 6/8: 6 ósemek w takcie. Werbel na 4 ósemkę (druga główna miara taktu).',
    'Liczenie 6/8 (RAZ-dwa-trzy, DWA-dwa-trzy) z werblem dokładnie na 4.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10], 0.65)
        .add('snare', [6], 0.9) // Beat 4 (second dotted quarter)
        .add('kick', [0, 4], 0.85)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('ride', [0, 2, 4, 6, 8, 10], 0.75)
        .add('snare', [6], 0.95)
        .add('snare', [11], 0.35)
        .add('kick', [0, 4, 8, 10], 0.9)
        .build()
    }
  ),
  createStyle(
    '82',
    '6/8 Slow Rock 1',
    'BALLAD',
    66,
    [6, 8],
    'Klasyczny 6/8 Slow Rock (np. Nothing Else Matters - Metallica, Hallelujah).',
    'Ciągłe ósemki na hi-hacie, potężny werbel na 4, głęboka stopa.',
    'Potęga uderzenia werbla na 4. ósemkę i płynny przepływ taktu 6/8.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10], 0.7)
        .add('snare', [6], 0.95)
        .add('kick', [0, 8], 0.9)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('ride', [0, 2, 4, 6, 8, 10], 0.8)
        .add('crash', [0], 0.9)
        .add('snare', [6], 1.0)
        .add('kick', [0, 4, 8, 10], 0.95)
        .build()
    }
  ),
  createStyle(
    '83',
    '6/8 Slow Rock 2',
    'BALLAD',
    72,
    [6, 8],
    'Mocniejszy 6/8 slow rock z dzwonkiem ride’a i tomami.',
    'Dzwonek ride na 1 i 4, tomy wariacji, potężna stopa.',
    'Różnicowanie brzmienia talerzy i prowadzenie frazy.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('ride_bell', [0, 6], 0.85)
        .add('ride', [2, 4, 8, 10], 0.7)
        .add('snare', [6], 0.95)
        .add('kick', [0, 2, 8], 0.9)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('ride_bell', [0, 6], 0.9)
        .add('ride', [2, 4, 8, 10], 0.8)
        .add('snare', [6], 1.0)
        .add('tom_mid', [10], 0.7)
        .add('kick', [0, 2, 6, 8, 10], 0.95)
        .build()
    }
  ),
  createStyle(
    '84',
    '12/8 Blues Ballad',
    'BALLAD',
    54,
    [12, 8],
    'Głęboki blues w metrum 12/8 (np. The Thrill Is Gone, Texas Flood).',
    'Triolowy ride (12 ósemek w takcie), werbel na 4 i 10 ósemkę (miary 2 i 4).',
    'Wyliczanie powolnych 12 ósemek z bezbłędnym akcentem.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 3, timeSignature: [12, 8] })
        .addEvery('hihat_closed', 1, 0, 0.65)
        .add('snare', [3, 9], 0.95) // beats 2 and 4 in 12/8
        .add('kick', [0, 6, 8], 0.9)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 3, timeSignature: [12, 8] })
        .addEvery('ride', 1, 0, 0.75)
        .add('hihat_pedal', [3, 9], 0.6)
        .add('snare', [3, 9], 1.0)
        .add('snare', [2, 8, 11], 0.35)
        .add('kick', [0, 5, 6, 8, 11], 0.95)
        .build()
    }
  ),
  createStyle(
    '85',
    'Pop Ballad 16',
    'BALLAD',
    68,
    [4, 4],
    'Wolna ballada szesnastkowa z bogatą fakturą bębnów.',
    'Gęste szesnastki na hi-hacie, głęboki werbel z pogłosem, synkopy basu.',
    'Kontrola cichych szesnastek na hi-hacie w wolnym tempie.',
    {
      mainA: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.5)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 8, 10], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('hihat_closed', 1, 0, 0.55)
        .add('hihat_open', [6, 14], 0.7)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '86',
    'Acoustic Ballad',
    'BALLAD',
    80,
    [4, 4],
    'Akustyczna ballada z tamburynem i ciepłym rimshotem.',
    'Tamburyn, side-stick, miękki kick.',
    'Czystość akustycznego miksu instrumentów.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .add('rimshot', [4, 12], 0.85)
        .add('tambourine', [4, 12], 0.7)
        .add('kick', [0, 8, 10], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.5)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 6, 8, 10], 0.85)
        .build()
    }
  ),
  createStyle(
    '87',
    'Love Song',
    'BALLAD',
    75,
    [4, 4],
    'Nastrojowy miłosny song w stylu lat 80/90 z clapem i shakerem.',
    'Shaker, clap na 2 i 4, ciepła stopa.',
    'Romantyczny charakter i subtelność każdego uderzenia.',
    {
      mainA: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.5)
        .add('clap', [4, 12], 0.8)
        .add('rimshot', [4, 12], 0.7)
        .add('kick', [0, 7, 10], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.55)
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .add('clap', [4, 12], 0.9)
        .add('snare', [4, 12], 0.8)
        .add('kick', [0, 3, 6, 8, 10, 14], 0.85)
        .build()
    }
  ),
  createStyle(
    '88',
    'Power Ballad',
    'BALLAD',
    70,
    [4, 4],
    'Epicka power ballada rockowa (Scorpions, Aerosmith, Bon Jovi).',
    'Potężny snare z crashami, dzwonek ride’a, ciężka stopa.',
    'Maksymalna dynamika i budowanie potęgi brzmieniowej w refrenie.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 6, 8, 10], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .add('crash', [0, 8], 0.95)
        .add('ride_bell', [0, 2, 4, 6, 8, 10, 12, 14], 0.85)
        .add('snare', [4, 12], 1.0)
        .add('kick', [0, 2, 6, 8, 10, 14], 1.0)
        .build()
    }
  ),
  createStyle(
    '89',
    'Orchestral Ballad',
    'BALLAD',
    64,
    [4, 4],
    'Szeroka ballada filmowo-orkiestrowa z głębokimi tomami.',
    'Tomy floor tom zamiast ride’a, side-stick i potężne kotły.',
    'Dramaturgia kinowa i przestrzenność.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.5)
        .add('rimshot', [4, 12], 0.8)
        .add('tom_low', [0, 8], 0.7)
        .add('kick', [0, 8], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .add('tom_low', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [4, 12], 0.95)
        .add('crash', [0], 0.9)
        .add('kick', [0, 6, 8, 10], 0.95)
        .build()
    }
  )
];
