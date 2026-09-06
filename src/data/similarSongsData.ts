import { SimilarSong } from '../types/rhythm';

export const SIMILAR_SONGS_MAP: Record<string, SimilarSong[]> = {
  // ── 00–09: 8-Beat & Pop Standards ──────────────────────────────────────────
  '00': [
    { title: 'Billie Jean', artist: 'Michael Jackson', year: '1982', vibeDescription: 'Kultowy, prosty podział 8-beat z krystalicznym hi-hatem i werblem na 2 i 4' },
    { title: 'Every Breath You Take', artist: 'The Police', year: '1983', vibeDescription: 'Równy, precyzyjny rytm ósemkowy podtrzymujący melodię gitary' },
    { title: 'Africa', artist: 'Toto', year: '1982', vibeDescription: 'Solidny popowy groove 8-beat napędzany motywem perkusyjnym Jeffa Porcaro' }
  ],
  '01': [
    { title: 'What\'s Going On', artist: 'Marvin Gaye', year: '1971', vibeDescription: 'Gładki pop-soul z synkopowaną stopą między uderzeniami werbla' },
    { title: 'Just the Way You Are', artist: 'Billy Joel', year: '1977', vibeDescription: 'Umiarkowane tempo z synkopą stopy po drugim uderzeniu' },
    { title: 'September', artist: 'Earth, Wind & Fire', year: '1978', vibeDescription: 'Taneczny pop 8-beat z pulsującą stopą' }
  ],
  '02': [
    { title: 'Stayin\' Alive', artist: 'Bee Gees', year: '1977', vibeDescription: 'Metronomiczny, standardowy beat ósemkowy z wyraźnym akcentem' },
    { title: 'Radio Ga Ga', artist: 'Queen', year: '1984', vibeDescription: 'Klasyczny, mocny 8-beat podtrzymujący hymnowy refren' },
    { title: 'Dancing in the Dark', artist: 'Bruce Springsteen', year: '1984', vibeDescription: 'Energetyczny, prosty podział pop-rockowy' }
  ],
  '03': [
    { title: 'Wake Me Up Before You Go-Go', artist: 'Wham!', year: '1984', vibeDescription: 'Szybki, radosny 8-beat upbeat z klaskaniem i skocznym werblem' },
    { title: 'Footloose', artist: 'Kenny Loggins', year: '1984', vibeDescription: 'Szybkie tempo, dynamiczny hi-hat i napędzający puls' },
    { title: 'Maniac', artist: 'Michael Sembello', year: '1983', vibeDescription: 'Pędzący, motywujący rytm w stylu soundtracku z lat 80.' }
  ],
  '04': [
    { title: 'Careless Whisper', artist: 'George Michael', year: '1984', vibeDescription: 'Łagodna ballada popowa z ciepłym brzmieniem werbla i rimshotem' },
    { title: 'Right Here Waiting', artist: 'Richard Marx', year: '1989', vibeDescription: 'Subtelny puls perkusyjny nieprzykrywający fortepianu' },
    { title: 'Time After Time', artist: 'Cyndi Lauper', year: '1983', vibeDescription: 'Przestrzenny, nastrojowy podział balladowy' }
  ],
  '05': [
    { title: 'Ain\'t No Sunshine', artist: 'Bill Withers', year: '1971', vibeDescription: 'Spokojne, średnie tempo z oszczędnym werblem i stopą' },
    { title: 'Easy', artist: 'Commodores', year: '1977', vibeDescription: 'Zrelaksowany, płynny groove popowo-soulowy' },
    { title: 'Dreams', artist: 'Fleetwood Mac', year: '1977', vibeDescription: 'Hipotetyczny, leniwie kołyszący 8-beat Micka Fleetwooda' }
  ],
  '06': [
    { title: 'Eye of the Tiger', artist: 'Survivor', year: '1982', vibeDescription: 'Mocna stopa i ciężki, wyrazisty werbel o stadionowym charakterze' },
    { title: 'We Will Rock You', artist: 'Queen', year: '1977', vibeDescription: 'Ciężki puls stopa-stopa-werbel' },
    { title: 'Beat It', artist: 'Michael Jackson', year: '1982', vibeDescription: 'Mocny, rockowo-popowy groove z przesterowaną gitarą i solidnym beatem' }
  ],
  '07': [
    { title: 'Take Me Home, Country Roads', artist: 'John Denver', year: '1971', vibeDescription: 'Ciepły, folkowy rytm akustyczny z tamburynem' },
    { title: 'Heart of Gold', artist: 'Neil Young', year: '1972', vibeDescription: 'Naturalny, organiczny folk-rockowy podział' },
    { title: 'Father and Son', artist: 'Cat Stevens', year: '1970', vibeDescription: 'Łagodny rytm z delikatnym hi-hatem i stopą' }
  ],
  '08': [
    { title: 'I Want to Hold Your Hand', artist: 'The Beatles', year: '1963', vibeDescription: 'Ringo Starr style – klasyczny brytyjski 8-beat lat 60. z otwartym hi-hatem' },
    { title: 'You Really Got Me', artist: 'The Kinks', year: '1964', vibeDescription: 'Surowy beat garażowego rocka lat 60.' },
    { title: 'Help!', artist: 'The Beatles', year: '1965', vibeDescription: 'Zwiewny, energetyczny 8-beat z tamburynem' }
  ],
  '09': [
    { title: 'Shape of You', artist: 'Ed Sheeran', year: '2017', vibeDescription: 'Współczesny, oszczędny popowy groove z mocnym naciskiem na rimshot i stopę' },
    { title: 'Blinding Lights', artist: 'The Weeknd', year: '2019', vibeDescription: 'Nowoczesny synth-pop z motorycznym, nieustannym beatem' },
    { title: 'Levitating', artist: 'Dua Lipa', year: '2020', vibeDescription: 'Świeży, radiowy 8-beat z podbitym basem' }
  ],

  // ── 10–19: 16-Beat & Modern Grooves ────────────────────────────────────────
  '10': [
    { title: 'Waiting in Vain', artist: 'Bob Marley', year: '1977', vibeDescription: 'Delikatny podział szesnastkowy z miękką dynamiką' },
    { title: 'Georgy Porgy', artist: 'Toto', year: '1978', vibeDescription: 'Precyzyjny 16-beat Jeffa Porcaro z wysublimowanym hi-hatem' },
    { title: 'Just the Two of Us', artist: 'Bill Withers & Grover Washington Jr.', year: '1981', vibeDescription: 'Jedwabisty 16-beat soul-jazzowy' }
  ],
  '11': [
    { title: 'Give Me the Night', artist: 'George Benson', year: '1980', vibeDescription: 'Szybki, wirtuozerski 16-beat z synkopowaną stopą' },
    { title: 'Rock with You', artist: 'Michael Jackson', year: '1979', vibeDescription: 'Perfekcyjny groove J.R. Robinsona z płynnymi szesnastkami na hi-hacie' },
    { title: 'Ain\'t Nobody', artist: 'Chaka Khan', year: '1983', vibeDescription: 'Zaawansowany szesnastkowy puls R&B' }
  ],
  '12': [
    { title: 'Chameleon', artist: 'Herbie Hancock', year: '1973', vibeDescription: 'Funkowy, gęsty 16-beat Harveya Masona z duszkami (ghost notes)' },
    { title: 'Cissy Strut', artist: 'The Meters', year: '1969', vibeDescription: 'Zigaboo Modeliste – mistrzostwo nowoorleańskiego synkopowanego 16-beatu' },
    { title: 'Pick Up the Pieces', artist: 'Average White Band', year: '1974', vibeDescription: 'Czysty, energetyczny funk szesnastkowy' }
  ],
  '13': [
    { title: 'Saving All My Love for You', artist: 'Whitney Houston', year: '1985', vibeDescription: 'Klasyczna ballada szesnastkowa z subtelnym talerzem ride' },
    { title: 'Greatest Love of All', artist: 'Whitney Houston', year: '1985', vibeDescription: 'Przestrzenny, powolny 16-beat balladowy' },
    { title: 'Hard to Say I\'m Sorry', artist: 'Chicago', year: '1982', vibeDescription: 'Czysty balladowy groove z budującym dynamikę wejściem perkusji' }
  ],
  '14': [
    { title: 'Rosanna', artist: 'Toto', year: '1982', vibeDescription: 'Kultowy, legendarny Purdie / Porcaro half-time shuffle z duszkami na werblu' },
    { title: 'Babylon Sisters', artist: 'Steely Dan', year: '1980', vibeDescription: 'Oryginalny Purdie Shuffle zagrany osobiście przez Bernarda Purdie' },
    { title: 'Fool in the Rain', artist: 'Led Zeppelin', year: '1979', vibeDescription: 'Genialna interpretacja half-time shuffle w wykonaniu Johna Bonhama' }
  ],
  '15': [
    { title: 'Spain', artist: 'Al Jarreau / Chick Corea', year: '1980', vibeDescription: 'Wirtuozerski fusion z bogatą polirytmią i szybkimi figurami' },
    { title: 'Birdland', artist: 'Weather Report', year: '1977', vibeDescription: 'Porywający jazz-rock fusion z dynamicznymi akcentami' },
    { title: 'Morning Dance', artist: 'Spyro Gyra', year: '1979', vibeDescription: 'Lekki, słoneczny smooth-jazz fusion' }
  ],
  '16': [
    { title: 'No Scrubs', artist: 'TLC', year: '1999', vibeDescription: 'Minimalistyczny urban 16-beat z precyzyjną stopą i ostrym rimshotem' },
    { title: 'Ignition (Remix)', artist: 'R. Kelly', year: '2002', vibeDescription: 'Płynny, kołyszący rytm R&B z lat 2000' },
    { title: 'Yeah!', artist: 'Usher', year: '2004', vibeDescription: 'Chrupiący urban groove z syntetycznym rimshotem' }
  ],
  '17': [
    { title: 'Treasure', artist: 'Bruno Mars', year: '2012', vibeDescription: 'Współczesny powrót do szesnastkowego disco-funku z żywą perkusją' },
    { title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell', year: '2013', vibeDescription: 'Idealny, organiczny szesnastkowy podział Omara Hakima' },
    { title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', year: '2016', vibeDescription: 'Nowoczesny, radosny 16-beat popowy' }
  ],
  '18': [
    { title: 'Blue Monday', artist: 'New Order', year: '1983', vibeDescription: 'Precyzyjny automat szesnastkowy z pulsującą stopą i werblem' },
    { title: 'Enjoy the Silence', artist: 'Depeche Mode', year: '1990', vibeDescription: 'Elektroniczny 16-beat z głęboką przestrzenią' },
    { title: 'Sweet Dreams', artist: 'Eurythmics', year: '1983', vibeDescription: 'Hipotetyczny, mechaniczny puls perkusyjny' }
  ],
  '19': [
    { title: 'Superstition', artist: 'Stevie Wonder', year: '1972', vibeDescription: 'Surowy, organiczny soul 16-beat zagrany na perkusji przez samego Steviego' },
    { title: 'Let\'s Stay Together', artist: 'Al Green', year: '1971', vibeDescription: 'Al Jackson Jr. – legendarny, wyluzowany soul groove z Memphis' },
    { title: 'I Got You (I Feel Good)', artist: 'James Brown', year: '1965', vibeDescription: 'Eksplozywny podział funk-soulowy z akcentem na "raz"' }
  ],

  // ── 20–29: Rock, Metal & Blues ─────────────────────────────────────────────
  '20': [
    { title: 'Back in Black', artist: 'AC/DC', year: '1980', vibeDescription: 'Phil Rudd – niezniszczalny, monumentalny rockowy fundament bez zbędnych nut' },
    { title: 'Highway to Hell', artist: 'AC/DC', year: '1979', vibeDescription: 'Żelazny timing, prosta stopa i potężny strzał w werbel' },
    { title: 'You Shook Me All Night Long', artist: 'AC/DC', year: '1980', vibeDescription: 'Wzorzec klasycznego hard-rockowego timingu' }
  ],
  '21': [
    { title: 'Painkiller', artist: 'Judas Priest', year: '1990', vibeDescription: 'Błyskawiczna podwójna stopa Scotta Travisa i agresywny werbel' },
    { title: 'Overkill', artist: 'Motörhead', year: '1979', vibeDescription: 'Nieustający motor podwójnego bębna basowego Philthy Animal Taylora' },
    { title: 'Master of Puppets', artist: 'Metallica', year: '1986', vibeDescription: 'Precyzyjny, ciężki thrash-metalowy groove Larsa Ulricha' }
  ],
  '22': [
    { title: 'Johnny B. Goode', artist: 'Chuck Berry', year: '1958', vibeDescription: 'Pionierski rock and rollowy beat z energicznym werblem i akcentami' },
    { title: 'Jailhouse Rock', artist: 'Elvis Presley', year: '1957', vibeDescription: 'Stop-time i pędzący rock\'n\'roll z lat 50.' },
    { title: 'Roll Over Beethoven', artist: 'Chuck Berry', year: '1956', vibeDescription: 'Klasyczny swingujący podział wczesnego rocka' }
  ],
  '23': [
    { title: 'Since I\'ve Been Loving You', artist: 'Led Zeppelin', year: '1970', vibeDescription: 'John Bonham – głęboki, pełen pasji i dynamiki blues-rock w 12/8' },
    { title: 'Texas Flood', artist: 'Stevie Ray Vaughan', year: '1983', vibeDescription: 'Chris Layton – ociekający emocjami, powolny shuffle bluesowy' },
    { title: 'The Thrill Is Gone', artist: 'B.B. King', year: '1969', vibeDescription: 'Aksamitny, głęboki groove slow-rockowy' }
  ],
  '24': [
    { title: 'Pride and Joy', artist: 'Stevie Ray Vaughan', year: '1983', vibeDescription: 'Teksaski shuffle z nieubłaganą pracą prawej ręki na talerzu ride' },
    { title: 'Sweet Home Chicago', artist: 'The Blues Brothers', year: '1980', vibeDescription: 'Porywający, skoczny Chicago blues shuffle' },
    { title: 'Crossroads', artist: 'Cream', year: '1968', vibeDescription: 'Ginger Baker – ognisty, szybki shuffle bluesowy' }
  ],
  '25': [
    { title: 'Tush', artist: 'ZZ Top', year: '1975', vibeDescription: 'Frank Beard – kołyszący, motoryczny boogie woogie beat z Teksasu' },
    { title: 'La Grange', artist: 'ZZ Top', year: '1973', vibeDescription: 'Kultowy wstęp na obręczy werbla przechodzący w tłuste boogie' },
    { title: 'Status Quo - Rockin\' All Over the World', artist: 'Status Quo', year: '1977', vibeDescription: 'Czysty, energetyczny boogie rock' }
  ],
  '26': [
    { title: 'Kashmir', artist: 'Led Zeppelin', year: '1975', vibeDescription: 'Monumentalny, ciężki beat Bonhama z potężnym pogłosem sali' },
    { title: 'Smoke on the Water', artist: 'Deep Purple', year: '1972', vibeDescription: 'Ian Paice – perfekcyjny, przestrzenny rock lat 70.' },
    { title: 'Walk This Way', artist: 'Aerosmith', year: '1975', vibeDescription: 'Joey Kramer – jeden z najsłynniejszych beatów perkusyjnych w historii rocka' }
  ],
  '27': [
    { title: 'Blitzkrieg Bop', artist: 'Ramones', year: '1976', vibeDescription: 'Tommy Ramone – superszybki, bezkompromisowy punk rock z prostym ósemkowym hi-hatem' },
    { title: 'Anarchy in the U.K.', artist: 'Sex Pistols', year: '1976', vibeDescription: 'Agresywny, surowy punkowy podział perkusyjny' },
    { title: 'Basket Case', artist: 'Green Day', year: '1994', vibeDescription: 'Tré Cool – dynamiczny, energiczny pop-punk z błyskawicznymi przejściami' }
  ],
  '28': [
    { title: 'Smells Like Teen Spirit', artist: 'Nirvana', year: '1991', vibeDescription: 'Dave Grohl – potężna dynamika cicho/głośno z agresywnym flashem na crashu' },
    { title: 'Alive', artist: 'Pearl Jam', year: '1991', vibeDescription: 'Mocny, organiczny grunge z bogatą pracą na talerzu ride' },
    { title: 'Man in the Box', artist: 'Alice in Chains', year: '1990', vibeDescription: 'Ciężki, ociężały i hipnotyzujący podział perkusyjny' }
  ],
  '29': [
    { title: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', year: '1974', vibeDescription: 'Kołyszący southern rock z subtelnymi akcentami na hi-hacie i krowim dzwonku' },
    { title: 'Ramblin\' Man', artist: 'The Allman Brothers Band', year: '1973', vibeDescription: 'Płynny, melodyjny rock z południa USA' },
    { title: 'Simple Man', artist: 'Lynyrd Skynyrd', year: '1973', vibeDescription: 'Ciężki, powolny i dostojny southern rockowy groove' }
  ],

  // ── 30–39: Disco, Eurobeat & Dance ─────────────────────────────────────────
  '30': [
    { title: 'Running in the 90s', artist: 'Maurizio De Jorio', year: '1998', vibeDescription: 'Błyskawiczny eurobeat 155 BPM z gęstym hi-hatem i stopą four-on-the-floor' },
    { title: 'Deja Vu', artist: 'Dave Rodgers', year: '1999', vibeDescription: 'Ekstremalnie szybki, pędzący podział Initial D' },
    { title: 'Night of Fire', artist: 'Niko', year: '1999', vibeDescription: 'Klasyczny, porywający eurodance lat 90.' }
  ],
  '31': [
    { title: 'Disco Inferno', artist: 'The Trammps', year: '1976', vibeDescription: 'Klasyczne disco lat 70.: stopa na 4 ćwierćnuty i otwierany hi-hat na "i"' },
    { title: 'Le Freak', artist: 'CHIC', year: '1978', vibeDescription: 'Tony Thompson – najdokładniejszy, najbardziej wyrazisty disco groove w historii' },
    { title: 'Don\'t Stop \'Til You Get Enough', artist: 'Michael Jackson', year: '1979', vibeDescription: 'Gęsty, perkusyjny disco groove z shakerem i krowim dzwonkiem' }
  ],
  '32': [
    { title: 'Boogie Wonderland', artist: 'Earth, Wind & Fire', year: '1979', vibeDescription: 'Radosne połączenie disco ze skomplikowaną sekcją dętą i żywą perkusją' },
    { title: 'Get Down Tonight', artist: 'KC and the Sunshine Band', year: '1975', vibeDescription: 'Czysty, energetyczny disco-funk z pulsującą stopą' },
    { title: 'Celebration', artist: 'Kool & The Gang', year: '1980', vibeDescription: 'Świętujący, optymistyczny rytm imprezowy' }
  ],
  '33': [
    { title: 'Pump Up the Jam', artist: 'Technotronic', year: '1989', vibeDescription: 'Rytm four-on-the-floor z mocną stopą 909 i klaskaniem na 2 i 4' },
    { title: 'Sandstorm', artist: 'Darude', year: '1999', vibeDescription: 'Motoryczny, klubowy beat elektroniczny napędzający syntezatory' },
    { title: 'Children', artist: 'Robert Miles', year: '1995', vibeDescription: 'Transowy, klubowy beat z melodyjnym fortepianem' }
  ],
  '34': [
    { title: 'Gypsy Woman (She\'s Homeless)', artist: 'Crystal Waters', year: '1991', vibeDescription: 'Lekko swingujący house z charakterystycznym hi-hatem na "i"' },
    { title: 'Show Me Love', artist: 'Robin S.', year: '1993', vibeDescription: 'Klasyczny deep-house z mocnym akcentem werbla i organowym basem' },
    { title: 'Finally', artist: 'CeCe Peniston', year: '1991', vibeDescription: 'Świeży, swingujący rytm klubowy lat 90.' }
  ],
  '35': [
    { title: 'Take On Me', artist: 'A-ha', year: '1985', vibeDescription: 'Klasyczny synth-popowy beat perkusyjny z charakterystycznymi przejściami na tomach' },
    { title: 'Blue Monday', artist: 'New Order', year: '1983', vibeDescription: 'Słynny zsamplowany beat automatów perkusyjnych z lat 80.' },
    { title: 'Don\'t You Want Me', artist: 'The Human League', year: '1981', vibeDescription: 'Mechaniczny, przestrzenny synth-pop' }
  ],
  '36': [
    { title: 'Juicy', artist: 'The Notorious B.I.G.', year: '1994', vibeDescription: 'Klasyczny boom-bap z lat 90. oparty na samplu z Mtume - Juicy Fruit' },
    { title: 'Shook Ones, Pt. II', artist: 'Mobb Deep', year: '1995', vibeDescription: 'Surowy, ciężki podział hip-hopowy z mocną stopą i chrupiącym werblem' },
    { title: 'C.R.E.A.M.', artist: 'Wu-Tang Clan', year: '1993', vibeDescription: 'Leniwy, hipnotyzujący boom-bap z organicznym brzmieniem winyla' }
  ],
  '37': [
    { title: 'Adagio for Strings', artist: 'Tiësto', year: '2005', vibeDescription: 'Hymnowy, euforyczny trance z pompującą stopą i talerzem crash na dropie' },
    { title: 'For an Angel', artist: 'Paul van Dyk', year: '1998', vibeDescription: 'Progresywny, przestrzenny beat transowy 138 BPM' },
    { title: 'Silence (DJ Tiësto Remix)', artist: 'Delerium', year: '2000', vibeDescription: 'Potężny, klubowy beat wokalnego trance\'u' }
  ],
  '38': [
    { title: 'Around the World', artist: 'Daft Punk', year: '1997', vibeDescription: 'Mechaniczny, filtrowany electro funk z syntetyczną stopą i clapem' },
    { title: 'Planet Rock', artist: 'Afrika Bambaataa', year: '1982', vibeDescription: 'Pionierski electro beat Rolanda TR-808, który zmienił historię muzyki' },
    { title: 'One More Time', artist: 'Daft Punk', year: '2000', vibeDescription: 'Pompujący, skompresowany francuski electro house' }
  ],
  '39': [
    { title: 'Rhythm Is a Dancer', artist: 'Snap!', year: '1992', vibeDescription: 'Mocny, eurodance\'owy beat klubowy z charakterystycznym synkopowanym clapem' },
    { title: 'What Is Love', artist: 'Haddaway', year: '1993', vibeDescription: 'Klasyk klubowych parkietów z nieustającą stopą na 4 miary' },
    { title: 'Better Off Alone', artist: 'Alice Deejay', year: '1998', vibeDescription: 'Energetyczny, wpadający w ucho club dance przełomu tysiącleci' }
  ],

  // ── 40–49: Funk, R&B & Soul ────────────────────────────────────────────────
  '40': [
    { title: 'Give It Away', artist: 'Red Hot Chili Peppers', year: '1991', vibeDescription: 'Chad Smith – surowy, rockowo-funkowy cios ze sprężystym werblem' },
    { title: 'Suck My Kiss', artist: 'Red Hot Chili Peppers', year: '1991', vibeDescription: 'Ciężki funk z agresywną pracą hi-hatu i stopy' },
    { title: 'Fame', artist: 'David Bowie', year: '1975', vibeDescription: 'Czysty, nowojorski funk rock we współpracy z Johnem Lennonem' }
  ],
  '41': [
    { title: 'Use Me', artist: 'Bill Withers', year: '1972', vibeDescription: 'Spokojny, wyluzowany funk z wybitną dynamiką na hi-hacie i stopie' },
    { title: 'Pusherman', artist: 'Curtis Mayfield', year: '1972', vibeDescription: 'Wytrawny, kinowy funk z tamburynem i conga' },
    { title: 'Shining Star', artist: 'Earth, Wind & Fire', year: '1975', vibeDescription: 'Precyzyjny, rześki cool funk z bogatą sekcją rytmiczną' }
  ],
  '42': [
    { title: 'Hold On, I\'m Comin\'', artist: 'Sam & Dave', year: '1966', vibeDescription: 'Al Jackson Jr. – legendarny Stax soul groove ze zwięzłą stopą i werblem' },
    { title: 'Soul Man', artist: 'Sam & Dave', year: '1967', vibeDescription: 'Energiczny, klasyczny soul z południa Stanów' },
    { title: 'In the Midnight Hour', artist: 'Wilson Pickett', year: '1965', vibeDescription: 'Rytm, który zdefiniował opóźniony backbeat w muzyce soul' }
  ],
  '43': [
    { title: 'Oh Happy Day', artist: 'The Edwin Hawkins Singers', year: '1967', vibeDescription: 'Porywający gospel z klaskaniem, tamburynem i narastającym tempem' },
    { title: 'Shackles (Praise You)', artist: 'Mary Mary', year: '2000', vibeDescription: 'Współczesny, taneczny gospel R&B z pulsującym beatem' },
    { title: 'I Smile', artist: 'Kirk Franklin', year: '2011', vibeDescription: 'Radosny gospel funk z dynamicznymi przejściami' }
  ],
  '44': [
    { title: 'My Girl', artist: 'The Temptations', year: '1964', vibeDescription: 'Benny Benjamin (The Funk Brothers) – niezapomniany, prosty wstęp stopy i werbla' },
    { title: 'I Heard It Through the Grapevine', artist: 'Marvin Gaye', year: '1968', vibeDescription: 'Niezwykle sugestywny puls Motown z tamburynem na każdą miarę' },
    { title: 'Ain\'t Too Proud to Beg', artist: 'The Temptations', year: '1966', vibeDescription: 'Słynne otwarcie perkusyjne i napędzający beat z Detroit' }
  ],
  '45': [
    { title: 'Rock Your Body', artist: 'Justin Timberlake', year: '2002', vibeDescription: 'Produkcja The Neptunes – suchy, minimalistyczny beat z beatboxowym posmakiem' },
    { title: 'Burn', artist: 'Usher', year: '2004', vibeDescription: 'Gładki, współczesny rytm pościelowego R&B' },
    { title: 'Say My Name', artist: 'Destiny\'s Child', year: '1999', vibeDescription: 'Szybkie szesnastki na hi-hacie i synkopowane cięcia stopy' }
  ],
  '46': [
    { title: 'Thank You (Falettinme Be Mice Elf Agin)', artist: 'Sly & The Family Stone', year: '1969', vibeDescription: 'Larry Graham wynalazł slap bass, a perkusja trzymała ten bezlitosny groove' },
    { title: 'Higher Ground', artist: 'Stevie Wonder', year: '1973', vibeDescription: 'Zadziorny, sprężysty funk napędzany clavinetem i ostrym werblem' },
    { title: 'Brick House', artist: 'Commodores', year: '1977', vibeDescription: 'Potężny, slapowy funk z ciężką stopą i otwartym hi-hatem' }
  ],
  '47': [
    { title: 'A Change Is Gonna Come', artist: 'Sam Cooke', year: '1964', vibeDescription: 'Dostojna, poruszająca ballada soul z delikatnymi uderzeniami kotłów i werbla' },
    { title: 'Stand by Me', artist: 'Ben E. King', year: '1961', vibeDescription: 'Rytm oparty na trójkącie, basie i subtelnej szczotce/werblu' },
    { title: 'People Get Ready', artist: 'The Impressions', year: '1965', vibeDescription: 'Liryczny, powolny gospel soul z kołyszącym hi-hatem' }
  ],
  '48': [
    { title: 'Untitled (How Does It Feel)', artist: 'D\'Angelo', year: '2000', vibeDescription: 'Questlove – legendarny styl "behind the beat", celowo opóźniony werbel i pijany timing' },
    { title: 'Didn\'t Cha Know', artist: 'Erykah Badu', year: '2000', vibeDescription: 'Organiczny, leniwy neo-soul groove o ciepłym analogowym brzmieniu' },
    { title: 'Brown Sugar', artist: 'D\'Angelo', year: '1995', vibeDescription: 'Głęboki, powolny soul ze zrelaksowaną stopą' }
  ],
  '49': [
    { title: 'Watermelon Man', artist: 'Herbie Hancock (The Headhunters)', year: '1973', vibeDescription: 'Mike Clark – skomplikowany, wybitny podział funk-fusion z polirytmią' },
    { title: 'Actual Proof', artist: 'Herbie Hancock', year: '1974', vibeDescription: 'Jeden z najtrudniejszych i najbardziej podziwianych groove\'ów perkusyjnych świata' },
    { title: 'The Chicken', artist: 'Jaco Pastorius', year: '1981', vibeDescription: 'Porywający funk jazzowy z nieustanną wariacją na werblu' }
  ],

  // ── 50–59: Jazz, Swing & Big Band ──────────────────────────────────────────
  '50': [
    { title: 'Cherokee', artist: 'Clifford Brown & Max Roach', year: '1955', vibeDescription: 'Max Roach – zawrotne tempo, wirtuozerski talerz ride i lewa ręka akcentująca werbel' },
    { title: 'A Night in Tunisia', artist: 'Dizzy Gillespie', year: '1946', vibeDescription: 'Błyskawiczne przejścia z rytmu afro-kubańskiego w ognisty swing' },
    { title: 'Ko-Ko', artist: 'Charlie Parker', year: '1945', vibeDescription: 'Ekwilibrystyczny bebopowy swing na krawędzi możliwości' }
  ],
  '51': [
    { title: 'Autumn Leaves', artist: 'Cannonball Adderley & Miles Davis', year: '1958', vibeDescription: 'Art Blakey – wzorcowy medium swing z czystym uderzeniem ride\'a na 2 i 4' },
    { title: 'So What', artist: 'Miles Davis', year: '1959', vibeDescription: 'Jimmy Cobb – przestronny, zrelaksowany jazzowy swing z albumu Kind of Blue' },
    { title: 'Take the "A" Train', artist: 'Duke Ellington', year: '1941', vibeDescription: 'Ponadczasowy standard swingowy o idealnym pulsie' }
  ],
  '52': [
    { title: 'Salt Peanuts', artist: 'Dizzy Gillespie & Kenny Clarke', year: '1945', vibeDescription: 'Kenny Clarke – twórca bebopowej perkusji, zrzucanie "bomb" stopą i werblem' },
    { title: 'Anthropology', artist: 'Charlie Parker', year: '1946', vibeDescription: 'Bebopowa swoboda rytmiczna i nieregularne akcenty perkusyjne' },
    { title: 'Scrapple from the Apple', artist: 'Charlie Parker', year: '1947', vibeDescription: 'Klasyczny styl bopowy z dynamiczną pracą stopy' }
  ],
  '53': [
    { title: 'Sing, Sing, Sing', artist: 'Benny Goodman (Gene Krupa)', year: '1937', vibeDescription: 'Gene Krupa – najsłynniejszy tom-tomowy beat w dziejach muzyki swingowej' },
    { title: 'In the Mood', artist: 'Glenn Miller', year: '1939', vibeDescription: 'Porywający, skoczny swing orkiestrowy z głośnymi wejściami sekcji dętej' },
    { title: 'Jumpin\' at the Woodside', artist: 'Count Basie', year: '1938', vibeDescription: 'Jo Jones – rewolucyjne przeniesienie pulsu z bębna basowego na hi-hat' }
  ],
  '54': [
    { title: 'Corner Pocket', artist: 'Count Basie Orchestra', year: '1955', vibeDescription: 'Sonny Payne – esencja swingu big-bandowego w średnim tempie z potężnymi uderzeniami' },
    { title: 'Shiny Stockings', artist: 'Count Basie', year: '1956', vibeDescription: 'Niezwykle elegancki, kołyszący podział orkiestry jazzowej' },
    { title: 'Fly Me to the Moon', artist: 'Frank Sinatra & Count Basie', year: '1964', vibeDescription: 'Wzorcowy swing wokalny z perfekcyjnym akompaniamentem perkusji' }
  ],
  '55': [
    { title: 'When the Saints Go Marching In', artist: 'Louis Armstrong', year: '1938', vibeDescription: 'Zutty Singleton – nowoorleański tradycyjny styl z werblem marszowo-rollowym' },
    { title: 'Tiger Rag', artist: 'Original Dixieland Jass Band', year: '1917', vibeDescription: 'Korzenie jazzu: synkopy, krowie dzwonki i dźwięk deski rimshota' },
    { title: 'Basin Street Blues', artist: 'Louis Armstrong', year: '1928', vibeDescription: 'Leniwy, tradycyjny blues-jazz z Nowego Orleanu' }
  ],
  '56': [
    { title: 'Someday My Prince Will Come', artist: 'Miles Davis', year: '1961', vibeDescription: 'Jimmy Cobb – poetycki walc jazzowy w metrum 3/4 z hi-hatem na 2 i 3' },
    { title: 'Waltz for Debby', artist: 'Bill Evans Trio', year: '1961', vibeDescription: 'Paul Motian – malowanie szczotkami po werblu w metrum trójdzielnym' },
    { title: 'Up Jumped Spring', artist: 'Freddie Hubbard', year: '1962', vibeDescription: 'Wiosenny, melodyjny walc jazzowy z bogatą fakturą ride\'a' }
  ],
  '57': [
    { title: 'The Entertainer', artist: 'Scott Joplin', year: '1902', vibeDescription: 'Radosny, synkopowany rytm ragtime\'owy z początku XX wieku' },
    { title: 'Maple Leaf Rag', artist: 'Scott Joplin', year: '1899', vibeDescription: 'Klasyczna synkopa fortepianowa zaadaptowana na perkusję tradycyjną' },
    { title: 'Alexander\'s Ragtime Band', artist: 'Irving Berlin', year: '1911', vibeDescription: 'Marszowo-synkopowany protoplasta muzyki jazzowej' }
  ],
  '58': [
    { title: 'Captain Marvel', artist: 'Chick Corea & Return to Forever', year: '1972', vibeDescription: 'Airto Moreira – fuzja jazzowego swingu z latynoską polirytmią' },
    { title: 'Got a Match?', artist: 'Chick Corea Elektric Band', year: '1986', vibeDescription: 'Dave Weckl – techniczny majstersztyk fuzji nowoczesnej perkusji ze swingiem' },
    { title: 'Donna Lee', artist: 'Jaco Pastorius', year: '1976', vibeDescription: 'Bebop zagrany na basie bezprogowym z precyzyjną perkusją fusion' }
  ],
  '59': [
    { title: 'Afro Blue', artist: 'John Coltrane (Elvin Jones)', year: '1963', vibeDescription: 'Elvin Jones – polirytmiczny trans 6/8 z głęboką polifonią i afrykańskim pulsem' },
    { title: 'Footprints', artist: 'Wayne Shorter', year: '1966', vibeDescription: 'Joe Chambers – hipnotyzujący afro-jazz w podziale 6/8' },
    { title: 'Caravan', artist: 'Duke Ellington / Art Blakey', year: '1962', vibeDescription: 'Egzotyczny rytm afro-kubański przeplatany swingiem' }
  ],

  // ── 60–74: Latin, Bossa & Caribbean ────────────────────────────────────────
  '60': [
    { title: 'The Girl from Ipanema', artist: 'Stan Getz & Astrud Gilberto', year: '1964', vibeDescription: 'Milton Banana – twórca bossa novy na perkusji: cross-stick na werblu i cichy hi-hat' },
    { title: 'Desafinado', artist: 'Stan Getz & João Gilberto', year: '1962', vibeDescription: 'Czysty, relaksujący rytm bossa nova prosto z plaż Rio de Janeiro' },
    { title: 'Corcovado (Quiet Nights of Quiet Stars)', artist: 'Antônio Carlos Jobim', year: '1963', vibeDescription: 'Liryczna bossa z subtelnym uderzeniem miotełki i krawędzi werbla' }
  ],
  '61': [
    { title: 'Wave', artist: 'Antônio Carlos Jobim', year: '1967', vibeDescription: 'Płynna bossa nova z nieco szybszą, falującą partią talerza ride' },
    { title: 'Waters of March (Águas de Março)', artist: 'Elis Regina & Tom Jobim', year: '1974', vibeDescription: 'Genialny, wciągający puls z nieprzerwanym szesnastkowym pulsem' },
    { title: 'Chega de Saudade', artist: 'João Gilberto', year: '1958', vibeDescription: 'Pierwsza w historii nagrana bossa nova o nienagannej elegancji' }
  ],
  '62': [
    { title: 'Mas Que Nada', artist: 'Jorge Ben Jor / Sérgio Mendes', year: '1966', vibeDescription: 'Płonąca energia karnawału w Rio: bębny surdo, pandeiro, agogô i tamborim' },
    { title: 'Aquarela do Brasil (Brazil)', artist: 'Ary Barroso', year: '1939', vibeDescription: 'Hymn brazylijskiej samby batucada z potężną polirytmią sekcji' },
    { title: 'Magalenha', artist: 'Sérgio Mendes & Carlinhos Brown', year: '1992', vibeDescription: 'Eksplozywna samba afro-brazylijska z ciężkim basowym surdo' }
  ],
  '63': [
    { title: 'Samba de Uma Nota Só (One Note Samba)', artist: 'Stan Getz', year: '1962', vibeDescription: 'Szybka samba miejska grana na zestawie perkusyjnym z użyciem szczotek' },
    { title: 'Tristeza', artist: 'Astrud Gilberto', year: '1965', vibeDescription: 'Radosna, szybka samba z bogatą pracą talerza ride i cross-sticka' },
    { title: 'Só Danço Samba', artist: 'João Gilberto', year: '1962', vibeDescription: 'Klasyczna samba z Rio – czysty taniec i precyzyjny beat stopy na 1 i 2' }
  ],
  '64': [
    { title: 'Oye Como Va', artist: 'Santana / Tito Puente', year: '1970', vibeDescription: 'Rytm cascará na korpusie timbalesów, conga tumbao i charakterystyczny cha-cha-cha' },
    { title: 'Pedro Navaja', artist: 'Rubén Blades & Willie Colón', year: '1978', vibeDescription: 'Monumentalna salsa narracyjna z narastającą energią bębnów bongo i conga' },
    { title: 'Vivir Mi Vida', artist: 'Marc Anthony', year: '2013', vibeDescription: 'Współczesna, porywająca salsa z wyrazistym dzwonkiem bongo i klawesem 2-3' }
  ],
  '65': [
    { title: 'Mambo No. 5', artist: 'Pérez Prado', year: '1949', vibeDescription: 'Królewski mambo bell, akcenty sekcji dętej i potężny kubański drive' },
    { title: 'Ran Kan Kan', artist: 'Tito Puente', year: '1956', vibeDescription: 'Wirtuozerskie solo na timbalesach i dzwonki mambo rozpalające parkiet' },
    { title: 'Tequila', artist: 'The Champs', year: '1958', vibeDescription: 'Słynny rock-mambo beat z wyrazistym krowim dzwonkiem' }
  ],
  '66': [
    { title: 'Guantanamera', artist: 'Celia Cruz', year: '1966', vibeDescription: 'Umiarkowane tempo cha-cha z charakterystycznym podwójnym uderzeniem na 4-i' },
    { title: 'Smooth', artist: 'Santana ft. Rob Thomas', year: '1999', vibeDescription: 'Latynoski pop-rock oparty na pulsie cha-cha-cha z timbalesami' },
    { title: 'Sway (Quién Será)', artist: 'Dean Martin / Michael Bublé', year: '1954', vibeDescription: 'Zmysłowe cha-cha z marakasami i rytmicznym werblem' }
  ],
  '67': [
    { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', year: '1940', vibeDescription: 'Zmysłowa rumba bolero z miękką pracą conga i delikatnym shakerem' },
    { title: 'Quizás, Quizás, Quizás', artist: 'Nat King Cole', year: '1958', vibeDescription: 'Klasyczna kubańska rumba z wyraźnym klawesem' },
    { title: 'Perfidia', artist: 'Alberto Domínguez', year: '1939', vibeDescription: 'Tradycyjny latynoski rytm rumba-bolero' }
  ],
  '68': [
    { title: 'Begin the Beguine', artist: 'Artie Shaw', year: '1938', vibeDescription: 'Przebój epoki swingu oparty na rytmie beguine z Martyniki' },
    { title: 'Night and Day', artist: 'Cole Porter', year: '1932', vibeDescription: 'Egzotyczny puls beguine nadający utworowi niepowtarzalny nastrój' },
    { title: 'Volare', artist: 'Gipsy Kings', year: '1989', vibeDescription: 'Karaibsko-śródziemnomorski taneczny podział perkusyjny' }
  ],
  '69': [
    { title: 'One Drop', artist: 'Bob Marley & The Wailers', year: '1979', vibeDescription: 'Carlton Barrett – definicja one-drop: stopa i rimshot uderzają RAZEM wyłącznie na 3' },
    { title: 'No Woman, No Cry', artist: 'Bob Marley', year: '1974', vibeDescription: 'Uduchowiony, spokojny roots reggae beat z pustą miarą "raz"' },
    { title: 'Three Little Birds', artist: 'Bob Marley', year: '1977', vibeDescription: 'Optymistyczny, słoneczny one-drop z charakterystycznym hi-hatem' }
  ],
  '70': [
    { title: 'Sly & Robbie - Taxi Connection', artist: 'Sly & Robbie', year: '1981', vibeDescription: 'Sly Dunbar – styl rockers z motoryczną stopą na 4 miary i twardym werblem na 3' },
    { title: 'Police & Thieves', artist: 'Junior Murvin', year: '1976', vibeDescription: 'Klasyczny rockers reggae z przenikliwym werblem' },
    { title: 'Redemption Song (Band Version)', artist: 'Bob Marley', year: '1980', vibeDescription: 'Dostojny, marszowy puls rockers' }
  ],
  '71': [
    { title: 'Day-O (The Banana Boat Song)', artist: 'Harry Belafonte', year: '1956', vibeDescription: 'Trinidad calypso: synkopowane akcenty, bębny stalowe i radosny puls' },
    { title: 'Jump in the Line', artist: 'Harry Belafonte', year: '1961', vibeDescription: 'Żywiołowy karnawałowy rytm calypso porywający do korowodu' },
    { title: 'Hot Hot Hot', artist: 'Arrow / Buster Poindexter', year: '1982', vibeDescription: 'Soczyste calypso-soca z potężną sekcją perkusjonaliów' }
  ],
  '72': [
    { title: 'Chan Chan', artist: 'Buena Vista Social Club', year: '1997', vibeDescription: 'Kubański son-guajira: zrelaksowany puls bongo, marakasów i gitary tres' },
    { title: 'El Carretero', artist: 'Buena Vista Social Club', year: '1997', vibeDescription: 'Tradycyjna wiejska guajira z kołyszącym rytmem' },
    { title: 'Guajira Guantanamera', artist: 'Joseíto Fernández', year: '1929', vibeDescription: 'Pieśń kubańskich chłopów z naturalnym podziałem perkusyjnym' }
  ],
  '73': [
    { title: 'La Cumparsita', artist: 'Gerardo Matos Rodríguez', year: '1916', vibeDescription: 'Argentyńskie tango: dramatyczne akcenty habanery, ostre cięcia i pauzy' },
    { title: 'Por Una Cabeza', artist: 'Carlos Gardel', year: '1935', vibeDescription: 'Zmysłowe, pełne napięcia tango z filmu "Zapach Kobiety"' },
    { title: 'Libertango', artist: 'Astor Piazzolla', year: '1974', vibeDescription: 'Nowoczesne tango nuevo z pulsującym, motorycznym podziałem 3+3+2' }
  ],
  '74': [
    { title: 'Historia de un Amor', artist: 'Lucho Gatica / Carlos Eleta Almarán', year: '1955', vibeDescription: 'Przejmujący bolero z subtelnym uderzeniem conga i miotełką na werblu' },
    { title: 'Solamente Una Vez', artist: 'Agustín Lara', year: '1941', vibeDescription: 'Romantyczne meksykańskie bolero w umiarkowanym tempie' },
    { title: 'Somos Novios (It\'s Impossible)', artist: 'Armando Manzanero', year: '1968', vibeDescription: 'Klasyczny rytm bolero balladowego' }
  ],

  // ── 75–79: Country, Folk & Bluegrass ───────────────────────────────────────
  '75': [
    { title: 'Folsom Prison Blues', artist: 'Johnny Cash', year: '1955', vibeDescription: 'W.S. Holland – słynny country train beat imitujący koła pędzącego parowozu' },
    { title: 'Ring of Fire', artist: 'Johnny Cash', year: '1963', vibeDescription: 'Klasyczny train beat z mariachi trąbkami i miotełkami na werblu' },
    { title: 'Orange Blossom Special', artist: 'Johnny Cash', year: '1965', vibeDescription: 'Błyskawiczny pociąg perkusyjny z nieustannym staccato na werblu' }
  ],
  '76': [
    { title: 'I Will Always Love You', artist: 'Dolly Parton', year: '1974', vibeDescription: 'Ciepła, akustyczna ballada country z delikatnym rimshotem i stopą' },
    { title: 'Crazy', artist: 'Patsy Cline', year: '1961', vibeDescription: 'Spokojny podział country z subtelną gitarą steel i szczotką' },
    { title: 'Always on My Mind', artist: 'Willie Nelson', year: '1982', vibeDescription: 'Wzruszający, organiczny rytm balladowy z Nashville' }
  ],
  '77': [
    { title: 'On the Road Again', artist: 'Willie Nelson', year: '1980', vibeDescription: 'Kołyszący country shuffle idealny do jazdy samochodem autostradą' },
    { title: 'Guitars, Cadillacs', artist: 'Dwight Yoakam', year: '1986', vibeDescription: 'Honky-tonk shuffle z ostrym uderzeniem werbla i basowym pulsem' },
    { title: 'Boot Scootin\' Boogie', artist: 'Brooks & Dunn', year: '1991', vibeDescription: 'Line dance shuffle z nieustanną pracą prawej ręki' }
  ],
  '78': [
    { title: 'Foggy Mountain Breakdown', artist: 'Flatt & Scruggs', year: '1949', vibeDescription: 'Ekspresowy bluegrass: precyzyjne banjo i tamburynowo-werblowy napęd' },
    { title: 'Dueling Banjos', artist: 'Eric Weissberg & Steve Mandell', year: '1972', vibeDescription: 'Szybki, tradycyjny rytm appalaski' },
    { title: 'Man of Constant Sorrow', artist: 'The Soggy Bottom Boys', year: '2000', vibeDescription: 'Surowy, pędzący bluegrass z filmu "Bracie, gdzie jesteś?"' }
  ],
  '79': [
    { title: 'Take It Easy', artist: 'Eagles', year: '1972', vibeDescription: 'Don Henley – wzorzec country rocka z potężnym, równym beatem i tamburynem' },
    { title: 'Bad Moon Rising', artist: 'Creedence Clearwater Revival', year: '1969', vibeDescription: 'Doug Clifford – zwarty, skoczny swamp-country rock' },
    { title: 'Lyin\' Eyes', artist: 'Eagles', year: '1975', vibeDescription: 'Płynny, akustyczny country rock o doskonałym timingu' }
  ],

  // ── 80–89: Ballads & Compound Meters (6/8 & 12/8) ──────────────────────────
  '80': [
    { title: 'Your Song', artist: 'Elton John', year: '1970', vibeDescription: 'Liryczna ballada fortepianowa z delikatnym, aksamitnym wejściem zestawu' },
    { title: 'Bridge over Troubled Water', artist: 'Simon & Garfunkel', year: '1970', vibeDescription: 'Hal Blaine – budowanie napięcia od ciszy do monumentalnego finału' },
    { title: 'Imagine', artist: 'John Lennon', year: '1971', vibeDescription: 'Alan White – minimalistyczny, oszczędny podział podtrzymujący wokal' }
  ],
  '81': [
    { title: 'We Are the Champions', artist: 'Queen', year: '1977', vibeDescription: 'Hymnowa ballada 6/8 Rogera Taylora z potężnym wejściem na refrenie' },
    { title: 'Hallelujah', artist: 'Jeff Buckley / Leonard Cohen', year: '1994', vibeDescription: 'Kołyszące metrum 6/8 z intymnym uderzeniem werbla i talerzy' },
    { title: 'If I Ain\'t Got You', artist: 'Alicia Keys', year: '2003', vibeDescription: 'Nowoczesna ballada 6/8 z soulowym pulsem na ride' }
  ],
  '82': [
    { title: 'Nothing Else Matters', artist: 'Metallica', year: '1991', vibeDescription: 'Kultowa rockowa ballada 6/8: Lars Ulrich i potężny strzał werbla na 4. ósemkę' },
    { title: 'Everybody Hurts', artist: 'R.E.M.', year: '1992', vibeDescription: 'Czyste metrum 6/8 z powtarzalną, kojącą figurą na hi-hacie' },
    { title: 'A Whiter Shade of Pale', artist: 'Procol Harum', year: '1967', vibeDescription: 'B.J. Wilson – jedna z najwspanialszych partii perkusyjnych w balladzie rockowej' }
  ],
  '83': [
    { title: 'Iris', artist: 'Goo Goo Dolls', year: '1998', vibeDescription: 'Potężna gitarowa ballada 6/8 z dynamicznymi przejściami na tomach' },
    { title: 'Bed of Roses', artist: 'Bon Jovi', year: '1992', vibeDescription: 'Klasyczny power ballad w podziale 6/8 z ciężkim werblem' },
    { title: 'I\'d Do Anything for Love', artist: 'Meat Loaf', year: '1993', vibeDescription: 'Operowy slow rock z potężną orkiestracją i perkusją' }
  ],
  '84': [
    { title: 'I\'d Rather Go Blind', artist: 'Etta James', year: '1968', vibeDescription: 'Wzorzec bluesowej ballady w 12/8 z głęboką stopą i rozległym werblem' },
    { title: 'Red House', artist: 'Jimi Hendrix (Mitch Mitchell)', year: '1967', vibeDescription: 'Mitch Mitchell – pełen finezji, swingujący blues w podziale 12/8' },
    { title: 'Damn Right, I\'ve Got the Blues', artist: 'Buddy Guy', year: '1991', vibeDescription: 'Elektryczny blues 12/8 z soczystym rimshotem i talerzem ride' }
  ],
  '85': [
    { title: 'Hello', artist: 'Lionel Richie', year: '1984', vibeDescription: 'Elegancki szesnastkowy puls balladowy z lat 80. z bogatym pogłosem' },
    { title: 'Against All Odds', artist: 'Phil Collins', year: '1984', vibeDescription: 'Słynne, dramatyczne wejście tomów Phila Collinsa w połowie ballady' },
    { title: 'Endless Love', artist: 'Lionel Richie & Diana Ross', year: '1981', vibeDescription: 'Szczytowe osiągnięcie ballady pop 16-beat' }
  ],
  '86': [
    { title: 'Tears in Heaven', artist: 'Eric Clapton', year: '1992', vibeDescription: 'Akustyczny groove z ciepłym shakerem, trójkątem i lekką stopą' },
    { title: 'More Than Words', artist: 'Extreme', year: '1990', vibeDescription: 'Akustyczny puls perkusyjny oparty na stuknięciu w pudło gitary' },
    { title: 'Landslide', artist: 'Fleetwood Mac', year: '1975', vibeDescription: 'Niezwykle delikatna podstawa rytmiczna ballady akustycznej' }
  ],
  '87': [
    { title: 'I Will Always Love You', artist: 'Whitney Houston', year: '1992', vibeDescription: 'Słynne, eksplodujące wejście werbla przed finałowym refrenem' },
    { title: 'My Heart Will Go On', artist: 'Celine Dion', year: '1997', vibeDescription: 'Kinowa ballada z potężną budową dynamiki i wojskowym werblem' },
    { title: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', year: '1961', vibeDescription: 'Kołysząca ballada miłosna z podziałem triolowym 6/8' }
  ],
  '88': [
    { title: 'Still Loving You', artist: 'Scorpions', year: '1984', vibeDescription: 'Herman Rarebell – klasyczny power ballad: cichy wstęp i potężny rockowy refren' },
    { title: 'Is This Love', artist: 'Whitesnake', year: '1987', vibeDescription: 'Tommy Aldridge – soczysty, przestrzenny werbel z lat 80.' },
    { title: 'Don\'t Cry', artist: 'Guns N\' Roses', year: '1991', vibeDescription: 'Matt Sorum – wyrazisty, ciężki beat napędzający rockową balladę' }
  ],
  '89': [
    { title: 'Con Te Partirò (Time to Say Goodbye)', artist: 'Andrea Bocelli', year: '1995', vibeDescription: 'Majestatyczny podział perkusyjny wspierający orkiestrę symfoniczną' },
    { title: 'Now We Are Free', artist: 'Hans Zimmer (Gladiator)', year: '2000', vibeDescription: 'Filmowe bębny orkiestrowe połączone z etnicznym pulsem' },
    { title: 'Nessun Dorma', artist: 'Luciano Pavarotti', year: '1990', vibeDescription: 'Orkiestrowe kotły i talerze budujące finałową kulminację' }
  ],

  // ── 90–99: Traditional, March & Waltz ──────────────────────────────────────
  '90': [
    { title: 'The Stars and Stripes Forever', artist: 'John Philip Sousa', year: '1896', vibeDescription: 'Amerykański marsz narodowy: dynamiczny werbel wojskowy i talerz crash na raz' },
    { title: 'Washington Post March', artist: 'John Philip Sousa', year: '1889', vibeDescription: 'Precyzyjny marsz orkiestrowy w metrum 2/4' },
    { title: 'Semper Fidelis', artist: 'John Philip Sousa', year: '1888', vibeDescription: 'Oficjalny marsz piechoty morskiej USA o niezłomnym timingu' }
  ],
  '91': [
    { title: 'Radetzky March', artist: 'Johann Strauss I', year: '1848', vibeDescription: 'Słynny wiedeński marsz wojskowy 6/8 grany z oklaskami publiczności' },
    { title: 'The Liberty Bell', artist: 'John Philip Sousa (Monty Python Theme)', year: '1893', vibeDescription: 'Sprężysty marsz 6/8 z charakterystycznym dzwonkiem' },
    { title: 'Colonel Bogey March', artist: 'F. J. Ricketts (Most na rzece Kwai)', year: '1914', vibeDescription: 'Słynny gwizdany marsz wojskowy z rytmicznym werblem' }
  ],
  '92': [
    { title: 'Beer Barrel Polka (Roll Out the Barrel)', artist: 'Jaromír Vejvoda', year: '1927', vibeDescription: 'Tradycyjna polka bawarska z energiczną stopą na 1 i werblem na 2' },
    { title: 'In Heaven There Is No Beer', artist: 'Cleanhead Gimmler', year: '1956', vibeDescription: 'Biesiadna polka oktoberfestowa z akcentami talerza crash' },
    { title: 'Clarinet Polka', artist: 'Karol Namysłowski', year: '1900', vibeDescription: 'Wirtuozerska, skoczna polka ludowa' }
  ],
  '93': [
    { title: 'Tritsch-Tratsch-Polka', artist: 'Johann Strauss II', year: '1858', vibeDescription: 'Błyskawiczna, zawrotna polka koncertowa pełna humoru i dynamiki' },
    { title: 'Unter Donner und Blitz (Thunder and Lightning)', artist: 'Johann Strauss II', year: '1868', vibeDescription: 'Eksplozywna szybka polka z efektami grzmotu na bębnie basowym' },
    { title: 'Pizzicato Polka', artist: 'Johann Strauss II & Josef Strauss', year: '1869', vibeDescription: 'Lekka, subtelna polka grana z precyzją zegarmistrza' }
  ],
  '94': [
    { title: 'The Blue Danube (Nad pięknym modrym Dunajem)', artist: 'Johann Strauss II', year: '1866', vibeDescription: 'Definicja wiedeńskiego walca 3/4: charakterystyczne lekkie przyspieszenie 2. miary' },
    { title: 'Tales from the Vienna Woods', artist: 'Johann Strauss II', year: '1868', vibeDescription: 'Romantyczny walc cesarskiego Wiednia o arystokratycznym wdzięku' },
    { title: 'Voices of Spring (Frühlingsstimmen)', artist: 'Johann Strauss II', year: '1882', vibeDescription: 'Radosny, wirujący walc wiedeński pełen lekkości' }
  ],
  '95': [
    { title: 'Sous le ciel de Paris', artist: 'Édith Piaf', year: '1954', vibeDescription: 'Paryski walc akordeonowy z nastrojowym podziałem perkusyjnym na 3/4' },
    { title: 'La Foule', artist: 'Édith Piaf', year: '1957', vibeDescription: 'Porywający, wirowy walc musette w szybkim tempie' },
    { title: 'Valse d\'Amélie', artist: 'Yann Tiersen (Amélie)', year: '2001', vibeDescription: 'Współczesny, melancholijny walc francuski z dzwonkami i akordeonem' }
  ],
  '96': [
    { title: 'Moon River', artist: 'Henry Mancini / Audrey Hepburn', year: '1961', vibeDescription: 'Wolny, powabny walc angielski o relaksującym, zrównoważonym pulsie' },
    { title: 'The Godfather Waltz', artist: 'Nino Rota', year: '1972', vibeDescription: 'Mroczny, nostalgiczny walc filmowy o powolnym tempie' },
    { title: 'Tennessee Waltz', artist: 'Patti Page', year: '1950', vibeDescription: 'Ciepły, klasyczny powolny walc taneczny' }
  ],
  '97': [
    { title: 'España Cañí', artist: 'Pascual Marquina Narro', year: '1923', vibeDescription: 'Tradycyjne hiszpańskie pasodoble: kastaniety, rytm walki byków i dramatyczne fanfary' },
    { title: 'El Gato Montés', artist: 'Manuel Penella', year: '1916', vibeDescription: 'Porywające pasodoble z aren korridy z marszowym werblem' },
    { title: 'En Er Mundo', artist: 'Jesús Fernández Lorenzo', year: '1930', vibeDescription: 'Żywiołowy rytm hiszpański pełen dumy i energii' }
  ],
  '98': [
    { title: 'Minuet in G major', artist: 'J.S. Bach / Christian Petzold', year: '1725', vibeDescription: 'Klasyczny barokowy menuet w dostojnym metrum trójdzielnym 3/4' },
    { title: 'Water Music: Alla Hornpipe', artist: 'George Frideric Handel', year: '1717', vibeDescription: 'Dworska muzyka barokowa z rytmicznym taktem na 3/2 i 3/4' },
    { title: 'Canon in D (Triple variation)', artist: 'Johann Pachelbel', year: '1680', vibeDescription: 'Dostojny, arystokratyczny puls dawnych tańców europejskich' }
  ],
  '99': [
    { title: 'Que Sera, Sera (Whatever Will Be, Will Be)', artist: 'Doris Day', year: '1956', vibeDescription: 'Słynny popowy walczyk 3/4 o radosnym, beztroskim charakterze' },
    { title: 'Piano Man', artist: 'Billy Joel', year: '1973', vibeDescription: 'Kultowy pop-rockowy walc w 3/4 (lub 6/8) z harmonijką i biesiadnym werblem' },
    { title: 'Breakaway', artist: 'Kelly Clarkson', year: '2004', vibeDescription: 'Nowoczesny radiowy pop w metrum 3/4 z wyrazistą perkusją' }
  ]
};
