import { RhythmStyle } from '../../types/rhythm';
import { PatternBuilder, createStyle } from '../patternBuilder';

export const STYLES_LATIN: RhythmStyle[] = [
  createStyle(
    '60',
    'Bossa Nova 1',
    'LATIN',
    130,
    [4, 4],
    'Klasyczna brazylijska Bossa Nova (Antonio Carlos Jobim style) z clave na obręczy.',
    'Prawa ręka: proste ósemki na hi-hacie. Lewa ręka: clave bossa na rimshocie (kroki 0, 6, 10, 12). Stopa: brazylijskie ostinato na 1, 2-i, 3, 4-i.',
    'Święty Graal koordynacji: ostinato stopy z brazylijską klawą na obręczy werbla.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('rimshot', [0, 6, 10, 12], 0.85) // bossa clave
        .add('kick', [0, 6, 8, 14], 0.8) // surdo ostinato
        .add('shaker', [1, 3, 5, 7, 9, 11, 13, 15], 0.4)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('hihat_pedal', [4, 12], 0.5)
        .add('rimshot', [0, 6, 10, 12], 0.9)
        .add('kick', [0, 6, 8, 14], 0.85)
        .addEvery('shaker', 1, 0, 0.45)
        .build()
    }
  ),
  createStyle(
    '61',
    'Bossa Nova 2',
    'LATIN',
    140,
    [4, 4],
    'Szybsza bossa nova z otwartym hi-hatem i odwróconą klawą 3:2.',
    'Bossa clave 3:2, shaker, hi-hat otwierany lewą nogą.',
    'Płynność i miękkość brzmienia bez sztywności w rękach.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 8, 10, 12], 0.65)
        .add('hihat_open', [6, 14], 0.7)
        .add('rimshot', [0, 6, 10, 12], 0.85)
        .add('kick', [0, 6, 8, 14], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('rimshot', [0, 6, 10, 14], 0.85)
        .add('kick', [0, 6, 8, 14], 0.85)
        .add('conga_high', [4, 11, 12], 0.65)
        .build()
    }
  ),
  createStyle(
    '62',
    'Samba 1',
    'LATIN',
    100,
    [2, 4],
    'Prawdziwa brazylijska Samba z rytmem surdo na stopie i tamborimem na werblu.',
    'Stopa: akcentowane "dwa i" (surdo). Werbel: szesnastki sambowe z akcentami. Shaker/hi-hat.',
    'Opanowanie szybkiego pulsu samby i akcentów na werblu.',
    {
      mainA: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.5)
        .add('rimshot', [0, 3, 6, 8, 11, 14], 0.8)
        .add('kick', [0, 6, 8, 14], 0.9)
        .add('conga_high', [4, 12], 0.7)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.55)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('snare', [0, 3, 6, 8, 11, 12, 14], 0.85)
        .add('kick', [0, 6, 8, 14], 0.95)
        .add('cowbell', [0, 4, 8, 12], 0.65)
        .build()
    }
  ),
  createStyle(
    '63',
    'Samba 2',
    'LATIN',
    115,
    [2, 4],
    'Szybka karnawałowa Batucada Samba (Rio de Janeiro).',
    'Gęste perkusjonalia: tamburyn, cowbell, congi, potężne surdo.',
    'Karnawałowa energia i nieustanny napęd rytmiczny.',
    {
      mainA: new PatternBuilder()
        .addEvery('tambourine', 1, 0, 0.6)
        .add('cowbell', [0, 3, 6, 8, 11, 14], 0.75)
        .add('conga_high', [2, 6, 10, 14], 0.7)
        .add('kick', [0, 6, 8, 14], 0.95)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('tambourine', 1, 0, 0.7)
        .add('cowbell', [0, 3, 6, 8, 11, 14], 0.85)
        .add('snare', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('conga_high', [2, 6, 10, 14], 0.8)
        .add('conga_low', [4, 12], 0.8)
        .add('kick', [0, 6, 8, 14], 1.0)
        .build()
    }
  ),
  createStyle(
    '64',
    'Salsa',
    'LATIN',
    180,
    [4, 4],
    'Kubańska Salsa z rytmem Cascará na ride/obręczy i Conga Tumbao.',
    'Cascará pattern na bębnie lub ride, conga tumbao (slap + open tones), clave.',
    'Rozumienie klawy 2:3 oraz 3:2 w muzyce afrokubańskiej.',
    {
      mainA: new PatternBuilder()
        .add('cowbell', [0, 2, 4, 6, 7, 10, 12, 14], 0.75) // Cascara
        .add('conga_high', [4, 11, 12], 0.8) // Tumbao slap & open
        .add('conga_low', [14, 15], 0.8)
        .add('rimshot', [0, 6, 10], 0.85)
        .add('kick', [6, 14], 0.8) // Ponche/Bombo kick
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 2, 4, 6, 7, 10, 12, 14], 0.85)
        .add('cowbell', [0, 4, 8, 12], 0.8)
        .add('conga_high', [4, 11, 12], 0.85)
        .add('conga_low', [14, 15], 0.85)
        .add('snare', [6, 14], 0.85)
        .add('kick', [6, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '65',
    'Mambo',
    'LATIN',
    190,
    [4, 4],
    'Energetyczne Mambo z dzwonkami mambo bell i gęstą sekcją rytmiczną (Tito Puente).',
    'Dzwonek mambo na talerzu/cowbellu, congi, akcenty sekcji dętej.',
    'Artykulacja na cowbellu (otwarta część vs czubek pałki).',
    {
      mainA: new PatternBuilder()
        .add('cowbell', [0, 2, 4, 6, 8, 10, 12, 14], 0.8)
        .add('conga_high', [4, 11, 12], 0.8)
        .add('rimshot', [0, 6, 10], 0.85)
        .add('kick', [6, 14], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('ride_bell', [0, 2, 4, 6, 8, 10, 12, 14], 0.9)
        .add('cowbell', [0, 4, 8, 12], 0.85)
        .add('snare', [4, 12], 0.9)
        .add('conga_high', [2, 4, 10, 12], 0.85)
        .add('kick', [0, 6, 8, 14], 0.9)
        .build()
    }
  ),
  createStyle(
    '66',
    'Cha-Cha',
    'LATIN',
    124,
    [4, 4],
    'Klasyczny Cha-Cha-Cha z charakterystycznym krokiem "raz, dwa, cha-cha-cha" (ćwierć, ćwierć, 2 ósemki, ćwierć).',
    'Cowbell cha-cha: 1, 2, 3-i-4. Guiro/shaker, stopa na 1 i 3.',
    'Czyste i punktualne granie figury "cha-cha-cha" (kroki 8, 10, 12).',
    {
      mainA: new PatternBuilder()
        .add('cowbell', [0, 4, 8, 10, 12], 0.8) // 1, 2, 3-&-4
        .add('shaker', [0, 2, 4, 6, 8, 10, 12, 14], 0.5)
        .add('conga_high', [4, 11, 12], 0.75)
        .add('rimshot', [4, 12], 0.8)
        .add('kick', [0, 8], 0.85)
        .build(),
      mainB: new PatternBuilder()
        .add('cowbell', [0, 4, 8, 10, 12], 0.9)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('conga_high', [4, 8, 10, 12], 0.8)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 6, 8, 14], 0.85)
        .build()
    }
  ),
  createStyle(
    '67',
    'Rumba',
    'LATIN',
    108,
    [4, 4],
    'Romantyczna Rumba z ciepłym shakerem i subtelną klawą.',
    'Shaker, side-stick na 4 miarę, miękka stopa, congi.',
    'Delikatność i subtelna dynamika.',
    {
      mainA: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.5)
        .add('rimshot', [0, 6, 12], 0.8)
        .add('conga_high', [4, 10], 0.7)
        .add('kick', [0, 8], 0.75)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.6)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('rimshot', [0, 6, 10, 12], 0.85)
        .add('conga_high', [4, 10, 14], 0.75)
        .add('kick', [0, 6, 8], 0.8)
        .build()
    }
  ),
  createStyle(
    '68',
    'Beguine',
    'LATIN',
    116,
    [4, 4],
    'Karaibska Beguina (Cole Porter style) z synkopowaną figurą basową.',
    'Stopa: długa nuta z synkopą na "trzy i", shaker, rimshot.',
    'Precyzyjna synkopa stopy bez gubienia regularnego hi-hatu.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('rimshot', [4, 12], 0.8)
        .add('kick', [0, 6, 10], 0.85)
        .add('conga_high', [2, 6, 14], 0.65)
        .build(),
      mainB: new PatternBuilder()
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 6, 8, 10, 14], 0.85)
        .addEvery('shaker', 1, 0, 0.5)
        .build()
    }
  ),
  createStyle(
    '69',
    'Reggae',
    'LATIN',
    76,
    [4, 4],
    'Klasyczne jamajskie Reggae One Drop (Bob Marley / Carlton Barrett style).',
    'One Drop: stopa i werbel (rimshot) uderzają TYLKO na 3 miarę taktu (krok 8)! Brak stopy na 1.',
    'Najważniejszy rytm reggae: dyscyplina niegrania stopy na "raz" (One Drop).',
    {
      mainA: new PatternBuilder({ swing: 0.35 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('hihat_open', [6, 14], 0.75)
        .add('rimshot', [8], 0.95) // The classic "One Drop" on beat 3
        .add('kick', [8], 0.95) // Bass drum on beat 3 together with snare
        .build(),
      mainB: new PatternBuilder({ swing: 0.35 })
        .addEvery('hihat_closed', 1, 0, 0.6)
        .add('hihat_open', [2, 6, 10, 14], 0.8)
        .add('snare', [8], 1.0)
        .add('kick', [8, 14], 0.95)
        .add('cowbell', [4, 12], 0.7)
        .build()
    }
  ),
  createStyle(
    '70',
    'Reggae Rockers',
    'LATIN',
    80,
    [4, 4],
    'Jamajski styl "Rockers" (Sly Dunbar style) ze stopą na 4 ćwierćnuty i werblem na 3.',
    'Four-on-the-floor kick, werbel na 3 miarę, synkopowany hi-hat.',
    'Potężny groove roots reggae ze stabilną stopą.',
    {
      mainA: new PatternBuilder({ swing: 0.35 })
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('hihat_open', [6, 14], 0.8)
        .add('snare', [8], 1.0)
        .add('kick', [0, 4, 8, 12], 0.9) // 4-on-the-floor
        .build(),
      mainB: new PatternBuilder({ swing: 0.35 })
        .addEvery('hihat_closed', 1, 0, 0.7)
        .add('snare', [8], 1.0)
        .add('snare', [11, 15], 0.4)
        .add('kick', [0, 4, 8, 12], 0.95)
        .add('tom_high', [14], 0.75)
        .build()
    }
  ),
  createStyle(
    '71',
    'Calypso',
    'LATIN',
    128,
    [4, 4],
    'Słoneczne karaibskie Calypso / Soca z Trynidadu i Tobago.',
    'Stopa na 1, 2-i, 3-i, cowbell, energiczny shaker.',
    'Karaibska polirytmia i wysokie tempo.',
    {
      mainA: new PatternBuilder()
        .add('cowbell', [0, 3, 6, 8, 11, 14], 0.8)
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('snare', [4, 12], 0.85)
        .add('kick', [0, 6, 10], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('cowbell', [0, 3, 6, 8, 11, 14], 0.85)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.75)
        .add('conga_high', [2, 6, 10, 14], 0.75)
        .add('snare', [4, 12], 0.9)
        .add('kick', [0, 4, 6, 10, 12], 0.95)
        .build()
    }
  ),
  createStyle(
    '72',
    'Guajira',
    'LATIN',
    102,
    [4, 4],
    'Spokojna tradycyjna Guajira kubańska (np. Guantanamera).',
    'Ciepły shaker, congi, side-stick na słabe części taktu.',
    'Akustyczna równowaga i miękkość uderzeń.',
    {
      mainA: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.45)
        .add('rimshot', [6, 14], 0.8)
        .add('conga_high', [4, 12], 0.7)
        .add('kick', [0, 8], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.5)
        .add('ride', [0, 2, 4, 6, 8, 10, 12, 14], 0.65)
        .add('rimshot', [0, 6, 10, 14], 0.85)
        .add('conga_high', [4, 12], 0.75)
        .add('kick', [0, 6, 8, 14], 0.85)
        .build()
    }
  ),
  createStyle(
    '73',
    'Tango',
    'LATIN',
    120,
    [4, 4],
    'Dramatyczne argentyńskie Tango z charakterystycznym akcentem na 4 miarę.',
    'Dramatyczny rytm habanera: stopa z kropką, ósemka, dwie ćwierćnuty.',
    'Dramaturgia i ostre, wyraziste cięcie kończące takt.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 6, 8, 12], 0.7)
        .add('snare', [12], 0.9)
        .add('rimshot', [0, 6, 8], 0.8)
        .add('kick', [0, 6, 8, 12], 0.9)
        .build(),
      mainB: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.7)
        .add('snare', [0, 6, 8, 12, 14], 0.9)
        .add('kick', [0, 6, 8, 12], 0.95)
        .add('crash', [0], 0.85)
        .build()
    }
  ),
  createStyle(
    '74',
    'Bolero',
    'LATIN',
    90,
    [4, 4],
    'Romantyczne latynoskie Bolero z tremolowanym werblem i congi.',
    'Rytm werblowy bolero (triola na 1, ósemki na 2, 3, 4), congi, stopa.',
    'Precyzyjne granie trioli na werblu w wolnym tempie.',
    {
      mainA: new PatternBuilder()
        .add('hihat_closed', [0, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .add('snare', [0, 1, 2, 4, 6, 8, 10, 12, 14], 0.5)
        .add('rimshot', [4, 12], 0.8)
        .add('kick', [0, 8], 0.8)
        .build(),
      mainB: new PatternBuilder()
        .addEvery('shaker', 1, 0, 0.45)
        .add('snare', [0, 1, 2, 4, 6, 8, 10, 12, 14], 0.6)
        .add('conga_high', [4, 12], 0.75)
        .add('kick', [0, 6, 8], 0.85)
        .build()
    }
  )
];
