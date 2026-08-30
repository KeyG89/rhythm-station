import React, { useState } from 'react';
import { RhythmStyle, RhythmSection, DrumHit } from '../types/rhythm';
import { Play, Volume2, FastForward, Radio } from 'lucide-react';

interface RetroDisplayProps {
  currentStyle: RhythmStyle;
  currentSection: RhythmSection;
  nextSection: RhythmSection | null;
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  currentBar: number;
  totalBars: number;
  activeHits: DrumHit[];
  countInActive: boolean;
  countInBeat: { current: number; total: number } | null;
  metronomeEnabled: boolean;
  speedTrainerEnabled: boolean;
  isRecording: boolean;
}

export type LcdTheme = 'green' | 'cyan' | 'amber';

export const RetroDisplay: React.FC<RetroDisplayProps> = ({
  currentStyle,
  currentSection,
  nextSection,
  bpm,
  isPlaying,
  currentStep,
  currentBar,
  totalBars,
  activeHits,
  countInActive,
  countInBeat,
  metronomeEnabled,
  speedTrainerEnabled,
  isRecording
}) => {
  const [theme, setTheme] = useState<LcdTheme>('cyan');

  // Calculate current beat in bar
  const stepsPerBeat = currentStyle.sections[currentSection]?.stepsPerBeat || 4;
  const beatsInBar = currentStyle.timeSignature[0];
  const currentBeatInBar = Math.floor(currentStep / stepsPerBeat) % beatsInBar;

  const themeStyles = {
    green: {
      bg: 'bg-[#70845a] border-[#556943]',
      innerGlow: 'shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]',
      text: 'text-[#12200d]',
      textDim: 'text-[#566a45]',
      accentText: 'text-[#0a1506]',
      border: 'border-[#4a5e37]'
    },
    cyan: {
      bg: 'bg-[#0f242d] border-[#071318]',
      innerGlow: 'shadow-[inset_0_0_25px_rgba(0,0,0,0.8)]',
      text: 'text-[#4deeea]',
      textDim: 'text-[#1c4e57]',
      accentText: 'text-[#74fffb]',
      border: 'border-[#153f49]'
    },
    amber: {
      bg: 'bg-[#2b1e0d] border-[#1a1207]',
      innerGlow: 'shadow-[inset_0_0_25px_rgba(0,0,0,0.8)]',
      text: 'text-[#ffb703]',
      textDim: 'text-[#5c4015]',
      accentText: 'text-[#ffe066]',
      border: 'border-[#4e3612]'
    }
  }[theme];

  return (
    <div className="relative rounded-2xl p-4 sm:p-5 bg-[#181a1f] border-4 border-[#2d3139] shadow-2xl">
      {/* Theme Switcher and vintage badges */}
      <div className="flex justify-between items-center mb-2 px-1 text-xs font-mono text-gray-400">
        <div className="flex items-center space-x-2">
          <span className="font-bold tracking-widest text-amber-500 uppercase">YAMAHA PSR-220/230 RHYTHM STATION</span>
          <span className="hidden md:inline-block px-1.5 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400 border border-gray-700">100 STYLES SYSTEM</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-gray-400">LCD Backlight:</span>
          <button
            onClick={() => setTheme('cyan')}
            className={`w-4 h-4 rounded-full bg-cyan-400 transition-transform ${theme === 'cyan' ? 'scale-125 ring-2 ring-white' : 'opacity-60'}`}
            title="Cyan Blue LCD"
          />
          <button
            onClick={() => setTheme('green')}
            className={`w-4 h-4 rounded-full bg-lime-500 transition-transform ${theme === 'green' ? 'scale-125 ring-2 ring-white' : 'opacity-60'}`}
            title="Classic Green LCD"
          />
          <button
            onClick={() => setTheme('amber')}
            className={`w-4 h-4 rounded-full bg-amber-500 transition-transform ${theme === 'amber' ? 'scale-125 ring-2 ring-white' : 'opacity-60'}`}
            title="Vintage Amber LCD"
          />
        </div>
      </div>

      {/* Main LCD Panel */}
      <div className={`relative rounded-xl p-4 sm:p-6 ${themeStyles.bg} ${themeStyles.innerGlow} border-2 ${themeStyles.border} font-mono select-none transition-colors duration-300`}>
        {/* Top Status Flags Strip */}
        <div className={`flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b ${themeStyles.border} text-xs font-bold`}>
          <div className="flex items-center space-x-3">
            <span className={`flex items-center space-x-1 ${isPlaying ? themeStyles.accentText + ' animate-pulse' : themeStyles.textDim}`}>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPlaying ? 'PLAYING' : 'STOP'}</span>
            </span>

            {countInActive && (
              <span className={`px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 animate-bounce font-bold`}>
                COUNT-IN: {countInBeat ? `${countInBeat.current}/${countInBeat.total}` : 'READY'}
              </span>
            )}

            <span className={`flex items-center space-x-1 ${metronomeEnabled ? themeStyles.accentText : themeStyles.textDim}`}>
              <Volume2 className="w-3.5 h-3.5" />
              <span>METRO</span>
            </span>

            {speedTrainerEnabled && (
              <span className={`flex items-center space-x-1 text-orange-400 animate-pulse`}>
                <FastForward className="w-3.5 h-3.5" />
                <span>SPEED TRAINER</span>
              </span>
            )}

            {isRecording && (
              <span className="flex items-center space-x-1 text-red-400 font-bold animate-pulse">
                <Radio className="w-3.5 h-3.5 fill-current" />
                <span>REC</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className={themeStyles.text}>TS: <b className="text-base">{currentStyle.timeSignature[0]}/{currentStyle.timeSignature[1]}</b></span>
            <span className={themeStyles.text}>BAR: <b className="text-base">{String(currentBar).padStart(2, '0')}</b></span>
            <span className={themeStyles.textDim}>TOT: {String(totalBars).padStart(3, '0')}</span>
          </div>
        </div>

        {/* Central Display: Style Number + Name + BPM + Beat Counter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Style ID & Name */}
          <div className="md:col-span-7 flex flex-col">
            <div className="flex items-baseline space-x-3">
              <span className={`text-4xl sm:text-5xl font-black tracking-tighter ${themeStyles.accentText} drop-shadow-sm`}>
                {currentStyle.id}
              </span>
              <div className="flex flex-col">
                <span className={`text-lg sm:text-2xl font-extrabold tracking-tight uppercase truncate ${themeStyles.accentText}`}>
                  {currentStyle.name}
                </span>
                <span className={`text-xs uppercase font-medium tracking-wide ${themeStyles.text}`}>
                  {currentStyle.category.replace('_', ' ')}
                </span>
              </div>
            </div>
            {/* Rhythmic description hint */}
            <p className={`mt-2 text-xs italic ${themeStyles.text} opacity-90 line-clamp-1`}>
              &quot;{currentStyle.description}&quot;
            </p>
          </div>

          {/* BPM Large Display & Beat LED Counter */}
          <div className="md:col-span-5 flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 border-opacity-30 border-current">
            {/* Beat Dots */}
            <div className="flex flex-col items-center">
              <span className={`text-[10px] uppercase font-bold mb-1 ${themeStyles.textDim}`}>BEAT</span>
              <div className="flex space-x-1.5">
                {Array.from({ length: beatsInBar }).map((_, idx) => {
                  const isCurrentBeat = isPlaying && currentBeatInBar === idx;
                  const isBeat1 = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold transition-all duration-75 ${
                        isCurrentBeat
                          ? isBeat1
                            ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/50'
                            : 'bg-yellow-400 text-black scale-110 shadow-lg shadow-yellow-400/50'
                          : `${themeStyles.bg} border ${themeStyles.border} ${themeStyles.textDim}`
                      }`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Big BPM Digit */}
            <div className="flex flex-col items-end">
              <span className={`text-[10px] uppercase font-bold ${themeStyles.textDim}`}>TEMPO</span>
              <div className="flex items-baseline space-x-1">
                <span className={`text-4xl sm:text-5xl font-black ${themeStyles.accentText} tracking-tight`}>
                  {bpm}
                </span>
                <span className={`text-xs font-bold ${themeStyles.textDim}`}>BPM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Indicators Strip */}
        <div className={`mt-4 pt-3 border-t ${themeStyles.border} flex flex-wrap items-center justify-between gap-1.5`}>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] uppercase mr-1 font-bold ${themeStyles.textDim}`}>SECTION:</span>
            {(['intro', 'mainA', 'mainB', 'fillA', 'fillB', 'ending'] as RhythmSection[]).map((sec) => {
              const isActive = currentSection === sec;
              const isQueued = nextSection === sec;
              const labels: Record<RhythmSection, string> = {
                intro: 'INTRO',
                mainA: 'MAIN A',
                mainB: 'MAIN B',
                fillA: 'FILL A',
                fillB: 'FILL B',
                ending: 'ENDING'
              };

              return (
                <span
                  key={sec}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-md font-extrabold scale-105'
                      : isQueued
                      ? 'bg-amber-400 text-black animate-pulse font-extrabold'
                      : `${themeStyles.textDim} opacity-50`
                  }`}
                >
                  {labels[sec]} {isQueued && '(NEXT)'}
                </span>
              );
            })}
          </div>

          {/* Active instruments triggered indicator */}
          <div className="flex items-center space-x-1 overflow-hidden">
            {activeHits.length > 0 ? (
              activeHits.map((h, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono font-bold text-white shadow-inner uppercase animate-ping-once"
                >
                  {h.instrument.slice(0, 4)}
                </span>
              ))
            ) : (
              <span className={`text-[10px] ${themeStyles.textDim}`}>IDLE</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
