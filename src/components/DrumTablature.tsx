import React, { useState } from 'react';
import { RhythmStyle, RhythmSection, DrumInstrument, DRUM_INSTRUMENTS_META } from '../types/rhythm';
import { Copy, Check, BookOpen, Music, Sparkles } from 'lucide-react';

interface DrumTablatureProps {
  currentStyle: RhythmStyle;
  currentSection: RhythmSection;
  currentStep: number;
  isPlaying: boolean;
  onSelectSection: (section: RhythmSection) => void;
  onTriggerInstrument: (instrument: DrumInstrument) => void;
}

export const DrumTablature: React.FC<DrumTablatureProps> = ({
  currentStyle,
  currentSection,
  currentStep,
  isPlaying,
  onSelectSection,
  onTriggerInstrument
}) => {
  const [selectedSec, setSelectedSec] = useState<RhythmSection>(currentSection);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync with current section if playing
  const activeSection = isPlaying ? currentSection : selectedSec;
  const pattern = currentStyle.sections[activeSection] || currentStyle.sections.mainA;
  const totalSteps = pattern.steps.length;
  const stepsPerBeat = pattern.stepsPerBeat || 4;

  // Drum Tab lines configuration in standard drum notation order
  const tabLinesConfig: Array<{ inst: DrumInstrument; lineCode: string; label: string }> = [
    { inst: 'crash', lineCode: 'CC', label: 'Crash Cymbal' },
    { inst: 'ride', lineCode: 'RC', label: 'Ride Cymbal' },
    { inst: 'ride_bell', lineCode: 'RB', label: 'Ride Bell' },
    { inst: 'hihat_open', lineCode: 'HH', label: 'Hi-Hat (Open)' },
    { inst: 'hihat_closed', lineCode: 'HH', label: 'Hi-Hat (Closed)' },
    { inst: 'tom_high', lineCode: 'HT', label: 'High Tom' },
    { inst: 'tom_mid', lineCode: 'MT', label: 'Mid Tom' },
    { inst: 'snare', lineCode: 'SD', label: 'Snare Drum' },
    { inst: 'rimshot', lineCode: 'SS', label: 'Side Stick' },
    { inst: 'tom_low', lineCode: 'LT', label: 'Low/Floor Tom' },
    { inst: 'kick', lineCode: 'BD', label: 'Bass Drum' },
    { inst: 'hihat_pedal', lineCode: 'HF', label: 'Hi-Hat Foot' },
    { inst: 'tambourine', lineCode: 'TM', label: 'Tambourine' },
    { inst: 'cowbell', lineCode: 'CB', label: 'Cowbell' },
    { inst: 'conga_high', lineCode: 'CG', label: 'Conga High' },
    { inst: 'conga_low', lineCode: 'CG', label: 'Conga Low' },
    { inst: 'shaker', lineCode: 'SK', label: 'Shaker' }
  ];

  // Filter only lines that have hits in this pattern (or core BD/SD/HH)
  const activeInstruments = new Set(
    pattern.steps.flatMap((step) => step.map((hit) => hit.instrument))
  );

  const visibleLines = tabLinesConfig.filter(
    (line) => activeInstruments.has(line.inst) || ['kick', 'snare', 'hihat_closed'].includes(line.inst)
  );

  // Generate beat headers
  const getBeatHeader = () => {
    if (stepsPerBeat === 4) {
      // 1 e & a 2 e & a ...
      const counts = ['1', 'e', '&', 'a', '2', 'e', '&', 'a', '3', 'e', '&', 'a', '4', 'e', '&', 'a'];
      return counts.slice(0, totalSteps);
    } else if (stepsPerBeat === 3) {
      // 1 & a 2 & a 3 & a ... (triplets/12/8)
      const counts = ['1', '&', 'a', '2', '&', 'a', '3', '&', 'a', '4', '&', 'a'];
      return counts.slice(0, totalSteps);
    } else {
      // 1 & 2 & 3 & 4 &
      const counts = ['1', '&', '2', '&', '3', '&', '4', '&', '5', '&', '6', '&'];
      return counts.slice(0, totalSteps);
    }
  };

  const beatHeaders = getBeatHeader();

  // Convert pattern to ASCII Tab string for clipboard
  const generateAsciiTab = () => {
    let output = `Yamaha PSR Drum Tab: ${currentStyle.name} [${currentStyle.id}] - ${activeSection.toUpperCase()}\n`;
    output += `Tempo: ${currentStyle.defaultBpm} BPM | Metrum: ${currentStyle.timeSignature[0]}/${currentStyle.timeSignature[1]}\n`;
    if (currentStyle.similarSongs && currentStyle.similarSongs.length > 0) {
      output += `Vibe: ${currentStyle.similarSongs.map(s => `"${s.title}" (${s.artist})`).join(', ')}\n`;
    }
    output += `\n`;

    // Count header
    output += `Count |` + beatHeaders.map(b => b.padEnd(2, ' ')).join('') + `|\n`;
    output += `------|` + '-'.repeat(beatHeaders.length * 2) + `|\n`;

    visibleLines.forEach((line) => {
      let lineStr = `${line.lineCode.padEnd(5, ' ')}|`;
      pattern.steps.forEach((stepHits) => {
        const hit = stepHits.find((h) => h.instrument === line.inst);
        if (!hit) {
          lineStr += '- ';
        } else {
          if (['kick', 'snare', 'tom_high', 'tom_mid', 'tom_low'].includes(line.inst)) {
            lineStr += hit.velocity > 0.9 ? 'O ' : hit.velocity < 0.4 ? 'g ' : 'o ';
          } else if (line.inst === 'hihat_open') {
            lineStr += 'o ';
          } else {
            lineStr += hit.velocity > 0.9 ? 'X ' : 'x ';
          }
        }
      });
      lineStr += `|\n`;
      output += lineStr;
    });

    return output;
  };

  const handleCopyTab = () => {
    const text = generateAsciiTab();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header with Title and Section Switcher */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4 pb-3 border-b border-gray-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-100 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>TABULATURA PERKUSYJNA & ZAPIS RYTMU</span>
          </h2>
          <p className="text-xs text-gray-400">
            Standardowa tabulatura perkusyjna dla stylu: <b className="text-amber-400">{currentStyle.name}</b>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Section selector pills */}
          <div className="flex items-center bg-[#121316] p-1 rounded-xl border border-gray-800">
            {(['mainA', 'mainB', 'fillA', 'fillB', 'intro', 'ending'] as RhythmSection[]).map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setSelectedSec(sec);
                  onSelectSection(sec);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeSection === sec
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {sec.replace('main', 'Main ').replace('fill', 'Fill ')}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyTab}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 border border-gray-700 flex items-center space-x-1.5 transition-colors shadow"
            title="Kopiuj tekst tabulatury do schowka"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Skopiowano!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-400" />
                <span>Kopiuj Tab</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid: Tablature Canvas (Left) + Side Legend (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 cols: Interactive Drum Tablature View */}
        <div className="lg:col-span-8 bg-[#121418] p-4 sm:p-5 rounded-xl border border-gray-800 overflow-x-auto font-mono">
          <div className="min-w-[500px]">
            {/* Beat counting numbers header */}
            <div className="grid grid-cols-[64px_repeat(auto-fit,minmax(20px,1fr))] items-center gap-1 mb-2 text-xs font-bold text-gray-400 pb-1.5 border-b border-gray-800">
              <div className="text-gray-400">COUNT</div>
              <div className="col-span-1 grid grid-flow-col auto-cols-fr gap-1">
                {beatHeaders.map((b, idx) => {
                  const isCurrent = isPlaying && currentStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`text-center py-0.5 rounded ${
                        isCurrent
                          ? 'bg-amber-400 text-black font-black shadow'
                          : b === '1' || b === '2' || b === '3' || b === '4'
                          ? 'text-amber-400 font-extrabold'
                          : 'text-gray-400'
                      }`}
                    >
                      {b}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tab lines */}
            <div className="space-y-1.5">
              {visibleLines.map((line) => {
                const meta = DRUM_INSTRUMENTS_META[line.inst];

                return (
                  <div
                    key={line.inst}
                    className="grid grid-cols-[64px_repeat(auto-fit,minmax(20px,1fr))] items-center gap-1 text-xs"
                  >
                    <button
                      onClick={() => onTriggerInstrument(line.inst)}
                      className="font-bold text-left px-1.5 py-0.5 rounded bg-[#1a1c22] hover:bg-gray-800 text-gray-300 hover:text-amber-400 flex items-center space-x-1.5 transition-colors border border-gray-800"
                      title={`Kliknij aby zagrać: ${line.label}`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span>{line.lineCode}</span>
                    </button>

                    <div className="col-span-1 grid grid-flow-col auto-cols-fr gap-1">
                      {pattern.steps.map((stepHits, stepIdx) => {
                        const hit = stepHits.find((h) => h.instrument === line.inst);
                        const isCurrent = isPlaying && currentStep === stepIdx;

                        let char = '-';
                        let symbolClass = 'text-gray-600';

                        if (hit) {
                          if (['kick', 'snare', 'tom_high', 'tom_mid', 'tom_low'].includes(line.inst)) {
                            if (hit.velocity > 0.9) {
                              char = 'O';
                              symbolClass = 'text-red-400 font-black';
                            } else if (hit.velocity < 0.4) {
                              char = 'g';
                              symbolClass = 'text-gray-400 italic';
                            } else {
                              char = 'o';
                              symbolClass = 'text-amber-300 font-bold';
                            }
                          } else if (line.inst === 'hihat_open') {
                            char = 'o';
                            symbolClass = 'text-cyan-300 font-bold';
                          } else {
                            if (hit.velocity > 0.9) {
                              char = 'X';
                              symbolClass = 'text-emerald-300 font-black';
                            } else {
                              char = 'x';
                              symbolClass = 'text-emerald-400 font-bold';
                            }
                          }
                        }

                        return (
                          <div
                            key={stepIdx}
                            onClick={() => onTriggerInstrument(line.inst)}
                            className={`h-7 rounded flex items-center justify-center cursor-pointer select-none transition-all ${
                              isCurrent
                                ? 'bg-amber-400/30 ring-1 ring-amber-400'
                                : 'hover:bg-gray-800/60'
                            }`}
                          >
                            <span className={symbolClass}>{char}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reference Songs Footer in Tablature */}
          {currentStyle.similarSongs && currentStyle.similarSongs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-800 text-xs">
              <span className="text-gray-400 font-sans flex items-center space-x-1.5 mb-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-gray-300">Piosenki o podobnym rytmie i klimacie (Vibe):</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {currentStyle.similarSongs.map((song, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#1a1d24] text-amber-300 border border-gray-700/80 rounded-lg font-sans text-xs flex items-center space-x-1"
                  >
                    <span>🎵 <b>{song.title}</b> – {song.artist}</span>
                    {song.year && <span className="text-[10px] text-gray-400">({song.year})</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 cols: Side Legend (Legenda z boku) */}
        <div className="lg:col-span-4 bg-[#15171b] p-4 rounded-xl border border-gray-800 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Legenda Tabulatury</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Oznaczenia literowe linii i uderzeń zgodne z międzynarodowym standardem zapisu perkusyjnego.
            </p>
          </div>

          {/* Symbol meanings */}
          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-gray-300 uppercase text-[11px] mb-1">Symbole Artykulacji:</div>
            <div className="flex items-center space-x-2 bg-[#1e2127] p-1.5 rounded">
              <code className="px-1.5 py-0.5 rounded bg-gray-800 text-emerald-400 font-bold">x</code>
              <span className="text-gray-300">Uderzenie w talerz / hi-hat zamknięty</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#1e2127] p-1.5 rounded">
              <code className="px-1.5 py-0.5 rounded bg-gray-800 text-cyan-300 font-bold">o</code>
              <span className="text-gray-300">Uderzenie w bęben / hi-hat otwarty</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#1e2127] p-1.5 rounded">
              <code className="px-1.5 py-0.5 rounded bg-gray-800 text-red-400 font-black">O / X</code>
              <span className="text-gray-300">Mocny akcent dynamiczny (Accent)</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#1e2127] p-1.5 rounded">
              <code className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 italic">g</code>
              <span className="text-gray-300">Ghost note (cichy &quot;duszek&quot; na werblu)</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#1e2127] p-1.5 rounded">
              <code className="px-1.5 py-0.5 rounded bg-gray-800 text-amber-400 font-bold">SS</code>
              <span className="text-gray-300">Side-stick (uderzenie o samą obręcz)</span>
            </div>
          </div>

          {/* Lines explanation */}
          <div className="pt-2 border-t border-gray-800 space-y-1 text-xs">
            <div className="font-bold text-gray-300 uppercase text-[11px] mb-1">Skróty Linii Instrumentów:</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-gray-300">
              <div><b className="text-amber-400">CC:</b> Crash Cymbal</div>
              <div><b className="text-amber-400">RC:</b> Ride Cymbal</div>
              <div><b className="text-amber-400">HH:</b> Hi-Hat</div>
              <div><b className="text-amber-400">SD:</b> Snare Drum</div>
              <div><b className="text-amber-400">BD:</b> Bass Drum (Stopa)</div>
              <div><b className="text-amber-400">HT:</b> High Tom</div>
              <div><b className="text-amber-400">MT:</b> Mid Tom</div>
              <div><b className="text-amber-400">LT:</b> Low / Floor Tom</div>
              <div><b className="text-amber-400">CB:</b> Cowbell</div>
              <div><b className="text-amber-400">TM:</b> Tambourine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
