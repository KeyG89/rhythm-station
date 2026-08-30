# 🥁 Yamaha PSR-220 / PSR-230 Drum Rhythm Station & Practice Workstation

Kompletna, w 100% działająca w przeglądarce stacja symulacji **100 klasycznych rytmów perkusyjnych** inspirowana legendarnymi keyboardami **Yamaha PSR-220 / PSR-230** (z lat 90.), zaprojektowana jako nowoczesne i funkcjonalne narzędzie do **nauki i doskonalenia gry na perkusji**.

---

## 🎯 Dlaczego ten projekt powstał?
Często nauczyciele perkusji rekomendują zakup taniego keyboardu (np. Yamaha PSR-220/230 za ~100 zł), aby początkujący perkusista mógł osłuchać się z różnorodnymi stylami muzycznymi, zrozumieć podziały rytmiczne (8-beat, 16-beat, shuffle, bossa nova, walce, rytmy 6/8) oraz ćwiczyć timing.

Ta aplikacja stanowi **bezpłatną, nowoczesną alternatywę end-to-end**, która daje znacznie większe możliwości niż fizyczny keyboard:
- **Wyciszanie stopy (Mute Kick)**: keyboard gra cały groove, a Ty grasz stopę na żywo.
- **Wyciszanie werbla (Mute Snare)**: ćwiczenie precyzyjnego backbeatu i ghost notes.
- **Siatka sekwencera na żywo (Drum Grid)**: widzisz dokładnie każdy krok, szesnastkę i akcent.
- **Speed Trainer (Akcelerator)**: automatyczne podnoszenie tempa o np. +2 BPM co 4 takty.
- **Podpowiedzi Trenera (Practice Coach)**: natychmiastowe wyjaśnienie pracy rąk i nóg dla każdego stylu.
- **Eksport Audio**: nagrywanie pętli i sesji do formatu WebM/WAV.

---

## 🎹 Pełny Katalog 100 Rytmów (00–99)

Aplikacja zawiera wszystkie 100 stylów podzielonych na 10 kategorii:

1. **00–09: 8-Beat Pop & Standard** (Pop 1, Pop 2, Standard, Upbeat, Ballad, Medium, Heavy, Folk, 60s 8Beat, Modern)
2. **10–19: 16-Beat & Modern Groove** (Pop 16-1, Pop 16-2, Funk 16, Ballad 16, Purdie Shuffle, Fusion, Urban R&B, Modern, Synth, Soul)
3. **20–29: Rock, Metal & Blues** (Hard Rock, Heavy Metal Double-Bass, Rock & Roll, Slow Rock, Blues Shuffle, Boogie Woogie, 70s Rock, Punk Rock, Grunge, Southern Rock)
4. **30–39: Disco, Eurobeat & Dance** (Eurobeat 90s, Disco 70s, Disco Funk, Techno 4x4, House Swing, 80s Synth Pop, Boom Bap Hip-Hop, Trance, Electro, Club Dance)
5. **40–49: Funk, R&B & Gospel** (Funk Rock, Cool Funk, Soul Groove, Gospel Fast, Motown Detroit, Modern R&B, Slap Funk, Gospel Slow, Neo Soul, Funk Fusion)
6. **50–59: Jazz, Swing & Big Band** (Fast Swing, Medium Swing, Bebop Bombs, Big Band Fast, Big Band Medium, Dixieland Press Roll, Jazz Waltz 3/4, Ragtime, Fusion Swing, Afro Jazz 6/8)
7. **60–74: Latin, Bossa & Caribbean** (Bossa Nova 1, Bossa Nova 2, Samba Batucada, Samba Rio, Salsa Cascará, Mambo Bell, Cha-Cha-Cha, Rumba, Beguine, Reggae One-Drop, Reggae Rockers, Calypso, Guajira, Tango Habanera, Bolero)
8. **75–79: Country, Folk & Bluegrass** (Country Train Beat 2/4, Country Ballad, Country Shuffle, Bluegrass Fast, Country Rock)
9. **80–89: Ballady & Metrum 6/8 / 12/8** (Piano Ballad, 6/8 Pop Ballad, 6/8 Slow Rock 1, 6/8 Slow Rock 2, 12/8 Blues Ballad, Pop Ballad 16, Acoustic Ballad, Love Song, Power Ballad, Orchestral)
10. **90–99: Traditional, March & Waltz** (Marsz orkiestrowy 2/4, Marsz wojskowy 6/8, Polka bawarska, Szybka polka, Walc wiedeński 3/4, Walc francuski, Walc angielski, Pasodoble, Barok 3/4, Pop Waltz)

Każdy styl posiada 6 zaprogramowanych sekcji:
- `Intro` (wstęp)
- `Main A` (podstawowy groove)
- `Main B` (bogatsza wariacja / refren)
- `Fill-In A` (przejście perkusyjne)
- `Fill-In B` (intensywne przejście perkusyjne)
- `Ending` (zakończenie frazy)

---

## ⚡ Skróty Klawiszowe

| Klawisz | Akcja |
|---|---|
| **Spacja** | Start / Stop odtwarzania |
| **F** | Wyzwolenie przejścia perkusyjnego (*Fill-In*) |
| **V** | Przełączenie wariacji (*Main A ↔ Main B*) |
| **T** | Wstukanie tempa (*Tap Tempo*) |
| **M** | Włączenie / Wyłączenie metronomu (*Metronome*) |
| **C** | Start z 1-taktowym odliczaniem (*Count-In*) |
| **↑ / ↓** | Zmiana tempa (+/- 1 BPM) |
| **Shift + ↑ / ↓** | Szybka zmiana tempa (+/- 5 BPM) |
| **Esc** | Zatrzymanie |

---

## 🚀 Uruchomienie Projektu

### Wymagania:
- Node.js (wersja 18+)
- npm

### Krok 1: Instalacja zależności
```bash
npm install
```

### Krok 2: Uruchomienie serwera deweloperskiego
```bash
npm run dev
```
Aplikacja uruchomi się pod adresem: `http://localhost:3000`

### Krok 3: Uruchomienie testów automatycznych
```bash
npm run test
```

### Krok 4: Budowanie wersji produkcyjnej
```bash
npm run build
```

---

## 🏗️ Architektura Kodu

```
src/
├── audio/
│   ├── DrumSynthesizer.ts   # 18-instrumentowy syntezator perkusyjny Web Audio API
│   ├── AudioScheduler.ts    # Zegar lookahead o zerowym jitterze z obsługą swingu i sekcji
│   └── AudioRecorder.ts     # Nagrywarka pętli audio do WAV/WebM
├── types/
│   ├── rhythm.ts            # Definicje struktur stylów, taktów, uderzeń i instrumentów
│   └── audio.ts             # Typy miksera, stanów sekwencera i speed trainera
├── data/
│   ├── patternBuilder.ts    # Fluentyczny builder uderzeń i schematów perkusyjnych
│   ├── styles/              # 10 modułów zawierających 100 kompletnych stylów
│   └── index.ts             # Główny rejestr z wyszukiwarką i filtrowaniem
├── components/
│   ├── RetroDisplay.tsx     # Wyświetlacz LCD z podświetleniem (Cyan, Green, Amber)
│   ├── TransportBar.tsx     # Panel przycisków w stylu fizycznego keyboardu
│   ├── DrumMatrix.tsx       # Siatka sekwencera z podglądem na żywo i padami
│   ├── DrumMixer.tsx        # Mikser z regulacją głośności, panoramy, Solo i Mute
│   ├── SpeedTrainer.tsx     # Automatyczny akcelerator tempa
│   ├── StyleBrowser.tsx     # Wyszukiwarka i przeglądarka 100 rytmów
│   ├── PracticeCoach.tsx    # Wirtualny trener perkusyjny z poradami
│   ├── AudioExporter.tsx    # Eksport i rejestracja pętli
│   └── KeyboardHelpModal.tsx# Pomoc ze skrótami klawiszowymi
├── hooks/
│   ├── useDrumEngine.ts     # Integracja Web Audio API z cyklem życia Reacta
│   └── useKeyboardShortcuts.ts
└── App.tsx
```

---

## 🥁 Jak ćwiczyć na perkusji z tą aplikacją?

1. **Wybierz styl** z katalogu (np. `00: 8Beat Pop 1` lub `60: Bossa Nova 1`).
2. **Włącz metronom** lub **Count-In**, aby wejść idealnie w tempo.
3. **Przejdź do zakładki "Mikser"**:
   - Kliknij *Wycisz Stopę* – słyszysz hi-hat i werbel, a stopę grasz na swoim zestawie/padzie.
   - Kliknij *Wycisz Werbel* – ćwiczysz precyzyjny backbeat na 2 i 4 oraz ciche duszki (*ghost notes*).
4. **Włącz "Speed Trainer"**:
   - Ustaw tempo startowe na 80 BPM, docelowe na 140 BPM ze wzrostem o +2 BPM co 4 takty.
   - Graj bez zatrzymywania, budując płynność i swobodę ruchu.
5. **Wciskaj klawisz `F`** pod koniec frazy, aby przećwiczyć płynne przejście (*fill-in*) i powrót na "raz" z talerzem *crash*.
