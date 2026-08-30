import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_JAZZ_SWING: RhythmStyle[] = [
  createStyle(
    '50',
    'Fast Swing',
    'JAZZ_SWING',
    180,
    [4, 4],
    'Szybki jazzowy swing z klasycznym schematem ride’a (ding-ding-a-ding) i stopą "feathering".',
    'Ride: raz, dwa i, trzy, cztery i (triolowy swing). Hi-hat lewą nogą (pedal) na 2 i 4. Stopa cicho na 4 ćwierćnuty (feathering).',
    'Lekkość prawej ręki na ride i precyzyjny hi-hat nogą na 2 i 4 bez spinki.',
    {
      mainA: new PatternBuilder({ swing: 0.65 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.8)
        .add('hihat_pedal', [4, 12], 0.7)
        .add('snare', [10], 0.35)
        .add('kick', [0, 4, 8, 12], 0.35) // subtle feathering
        .build(),
      mainB: new PatternBuilder({ swing: 0.65 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.85)
        .add('hihat_pedal', [4, 12], 0.75)
        .add('snare', [2, 7, 10, 14], 0.4)
        .add('snare', [12], 0.8)
        .add('kick', [0, 6, 8, 14], 0.6)
        .build()
    }
  ),
  createStyle(
    '51',
    'Medium Swing',
    'JAZZ_SWING',
    128,
    [4, 4],
    'Średni swing standardowy (Miles Davis, Count Basie).',
    'Czysty ride pattern, werbel akompaniujący (comping) na nieregularne miary.',
    'Jazzowe comping lewą ręką na werblu przy niezależnym ride.',
    {
      mainA: new PatternBuilder({ swing: 0.62 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.75)
        .add('hihat_pedal', [4, 12], 0.7)
        .add('rimshot', [6, 14], 0.6)
        .add('kick', [0, 4, 8, 12], 0.3)
        .build(),
      mainB: new PatternBuilder({ swing: 0.62 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.8)
        .add('hihat_pedal', [4, 12], 0.7)
        .add('snare', [4, 10, 14], 0.6)
        .add('kick', [0, 6, 10], 0.5)
        .build()
    }
  ),
  createStyle(
    '52',
    'Bebop',
    'JAZZ_SWING',
    210,
    [4, 4],
    'Bardzo szybki, wirtuozerski bebop (Charlie Parker, Max Roach).',
    'Pędzący ride, punktowe wybuchy na werblu i stopie ("dropping bombs").',
    'Szybkość palcowa na pałce oraz akcenty "bombs" stopą na niespodziewane miary.',
    {
      mainA: new PatternBuilder({ swing: 0.6 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.85)
        .add('hihat_pedal', [4, 12], 0.8)
        .add('snare', [6, 14], 0.5)
        .add('kick', [0, 10], 0.6)
        .build(),
      mainB: new PatternBuilder({ swing: 0.6 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.9)
        .add('hihat_pedal', [4, 12], 0.8)
        .add('snare', [2, 6, 10, 14], 0.75)
        .add('kick', [0, 4, 9, 12], 0.8)
        .build()
    }
  ),
  createStyle(
    '53',
    'Big Band Fast',
    'JAZZ_SWING',
    160,
    [4, 4],
    'Potężny swing orkiestrowy (Duke Ellington, Buddy Rich).',
    'Ride z dzwonkiem, werbel akcentujący uderzenia sekcji dętej, crash.',
    'Akcentowanie tutti i dynamiczne prowadzenie całego zespołu.',
    {
      mainA: new PatternBuilder({ swing: 0.65 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.8)
        .add('hihat_pedal', [4, 12], 0.75)
        .add('snare', [4, 12], 0.85)
        .add('snare', [6, 14], 0.4)
        .add('kick', [0, 4, 8, 12], 0.5)
        .build(),
      mainB: new PatternBuilder({ swing: 0.65 })
        .add('crash', [0], 0.9)
        .add('ride', [0, 4, 6, 8, 12, 14], 0.85)
        .add('hihat_pedal', [4, 12], 0.8)
        .add('snare', [4, 6, 10, 12, 14], 0.85)
        .add('kick', [0, 6, 8, 14], 0.85)
        .build()
    }
  ),
  createStyle(
    '54',
    'Big Band Medium',
    'JAZZ_SWING',
    115,
    [4, 4],
    'Dostojny, głęboki big band swing w średnim tempie.',
    'Ride, hi-hat pedal na 2 i 4, ciepły werbel i stopa.',
    'Osadzenie w tempie i szerokie brzmienie talerzy.',
    {
      mainA: new PatternBuilder({ swing: 0.65 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.75)
        .add('hihat_pedal', [4, 12], 0.7)
        .add('snare', [4, 12], 0.75)
        .add('kick', [0, 4, 8, 12], 0.4)
        .build(),
      mainB: new PatternBuilder({ swing: 0.65 })
        .add('ride', [0, 4, 6, 8, 12, 14], 0.8)
        .add('snare', [2, 4, 10, 12], 0.8)
        .add('kick', [0, 6, 8, 10], 0.7)
        .build()
    }
  ),
  createStyle(
    '55',
    'Dixieland',
    'JAZZ_SWING',
    195,
    [4, 4],
    'Tradycyjny jazz nowoorleański (Louis Armstrong style) z werblem marszowym.',
    'Werbel z press rollami i akcentami na 2 i 4, woodblock/rimshot, stopa 1 & 3.',
    'Press rolle (dociskane tremolo) i lekki, marszowy charakter werbla.',
    {
      mainA: new PatternBuilder({ swing: 0.55 })
        .add('hihat_closed', [0, 4, 6, 8, 12, 14], 0.7)
        .add('snare', [0, 2, 4, 6, 8, 10, 12, 14], 0.45)
        .add('snare', [4, 12], 0.85) // akcenty
        .add('kick', [0, 8], 0.75)
        .build(),
      mainB: new PatternBuilder({ swing: 0.55 })
        .add('cowbell', [0, 4, 6, 8, 12, 14], 0.75)
        .add('snare', [0, 2, 4, 6, 8, 10, 12, 14], 0.5)
        .add('snare', [4, 12], 0.95)
        .add('kick', [0, 4, 8, 12], 0.8)
        .build()
    }
  ),
  createStyle(
    '56',
    'Jazz Waltz',
    'JAZZ_SWING',
    140,
    [3, 4],
    'Swingujący walc jazzowy w metrum 3/4 (Bill Evans, John Coltrane).',
    'Ride w metrum 3/4 (raz, dwa-i, trzy-i), hi-hat nogą na 2 i 3, werbel comping.',
    'Poczucie swingu w metrum nieparzystym 3/4.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4], swing: 0.6 })
        .add('ride', [0, 4, 6, 8, 10], 0.75)
        .add('hihat_pedal', [4, 8], 0.65)
        .add('snare', [6, 10], 0.4)
        .add('kick', [0], 0.6)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 4, timeSignature: [3, 4], swing: 0.6 })
        .add('ride', [0, 4, 6, 8, 10], 0.8)
        .add('hihat_pedal', [4, 8], 0.7)
        .add('snare', [2, 6, 8], 0.65)
        .add('kick', [0, 6], 0.7)
        .build()
    }
  ),
  createStyle(
    '57',
    'Ragtime',
    'JAZZ_SWING',
    100,
    [2, 4],
    'Fortepianowy ragtime z początku XX wieku (Scott Joplin style).',
    'Klasyczny "boom-chick": stopa na 1, werbel/rimshot na 2.',
    'Równomierny marszowy puls i synchronizacja rąk.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 8], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.9)
        .add('snare', [2, 6, 10, 14], 0.35)
        .add('kick', [0, 6, 8, 14], 0.85)
        .build()
    }
  ),
  createStyle(
    '58',
    'Fusion Swing',
    'JAZZ_SWING',
    135,
    [4, 4],
    'Nowoczesny swing fusion z ostinatowym ride’em i gęstą pracą stóp.',
    'Ride z dzwonkiem, otwarty hi-hat lewą nogą, polirytmiczny werbel.',
    'Rozbicie schematycznego myślenia i koordynacja wielorytmiczna.',
    {
      mainA: new PatternBuilder({ swing: 0.62 })
        .add('ride_bell', [0, 6, 12], 0.85)
        .add('ride', [4, 8, 14], 0.75)
        .add('hihat_pedal', [4, 12], 0.7)
        .add('snare', [4, 10, 14], 0.7)
        .add('kick', [0, 6, 10], 0.75)
        .build(),
      mainB: new PatternBuilder({ swing: 0.62 })
        .add('ride_bell', [0, 4, 6, 8, 12, 14], 0.9)
        .add('snare', [2, 4, 8, 10, 14], 0.8)
        .add('kick', [0, 4, 7, 10, 14], 0.85)
        .build()
    }
  ),
  createStyle(
    '59',
    'Afro Jazz',
    'JAZZ_SWING',
    125,
    [6, 8],
    'Afrokubański jazz 6/8 z charakterystycznym dzwonkiem (bembe bell pattern).',
    'Dzwonek ride (bembe 6/8: 1, 3, 5, 6, 8, 10, 11), congi, werbel.',
    'Opanowanie afrykańskiego wzorca 6/8 / 12/8 bell pattern.',
    {
      mainA: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('cowbell', [0, 2, 4, 5, 7, 9, 10], 0.8)
        .add('conga_high', [2, 5, 8, 11], 0.75)
        .add('snare', [4, 10], 0.7)
        .add('kick', [0, 6], 0.85)
        .build(),
      mainB: new PatternBuilder({ stepsCount: 12, stepsPerBeat: 2, timeSignature: [6, 8] })
        .add('cowbell', [0, 2, 4, 5, 7, 9, 10], 0.85)
        .add('conga_high', [1, 2, 5, 7, 8, 11], 0.8)
        .add('conga_low', [0, 6], 0.75)
        .add('snare', [4, 10], 0.85)
        .add('kick', [0, 3, 6, 9], 0.9)
        .build()
    }
  )
];
