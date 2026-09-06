import React from 'react';
import { RhythmSection, RhythmStyle } from '../types/rhythm';
import { FillType } from '../types/audio';
import { Play, Square, RotateCcw, Volume2, Sparkles, Timer } from 'lucide-react';

interface TransportBarProps {
  isPlaying: boolean;
  currentSection: RhythmSection;
  nextSection: RhythmSection | null;
  activeFillType: FillType | null;
  currentStyle: RhythmStyle;
  bpm: number;
  metronomeEnabled: boolean;
  onTogglePlay: () => void;
  onStartWithCountIn: (bars: number) => void;
  onTriggerSection: (section: RhythmSection) => void;
  onSetBpm: (bpm: number) => void;
  onTapTempo: () => void;
  onToggleMetronome: () => void;
}

export const TransportBar: React.FC<TransportBarProps> = ({
  isPlaying,
  currentSection,
  nextSection,
  activeFillType,
  currentStyle,
  bpm,
  metronomeEnabled,
  onTogglePlay,
  onStartWithCountIn,
  onTriggerSection,
  onSetBpm,
  onTapTempo,
  onToggleMetronome
}) => {
  return (
    <div className="bg-[#1e2127] border-2 border-[#2f343e] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Big Main Play/Stop & Count-in buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onTogglePlay}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-bold text-lg tracking-wide uppercase shadow-lg transition-all transform active:scale-95 ${
              isPlaying
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-900/40 ring-2 ring-red-400/50'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-900/40 ring-2 ring-emerald-400/50'
            }`}
            title="Spacja: Start/Stop"
          >
            {isPlaying ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span>STOP</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>START</span>
              </>
            )}
          </button>

          {/* Count In Buttons */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => onStartWithCountIn(1)}
              disabled={isPlaying}
              className="px-3 py-1.5 rounded-lg bg-[#2b2f38] hover:bg-[#373c47] disabled:opacity-40 text-xs font-semibold text-amber-400 border border-amber-500/20 transition-all flex items-center space-x-1"
              title="Klawisz C: Odlicz 1 takt przed startem"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>1-BAR COUNT</span>
            </button>
            <button
              onClick={() => onStartWithCountIn(2)}
              disabled={isPlaying}
              className="px-3 py-1.5 rounded-lg bg-[#2b2f38] hover:bg-[#373c47] disabled:opacity-40 text-xs font-semibold text-amber-400 border border-amber-500/20 transition-all flex items-center space-x-1"
              title="Odlicz 2 takty przed startem"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>2-BAR COUNT</span>
            </button>
          </div>
        </div>

        {/* Center: Vintage Style Section Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[#16181d] p-2 rounded-xl border border-gray-800">
          {/* INTRO */}
          <button
            onClick={() => onTriggerSection('intro')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'intro'
                ? 'bg-amber-500 text-black ring-2 ring-amber-300'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300'
            }`}
          >
            Intro
          </button>

          {/* MAIN A - clicking same section = micro fill */}
          <div className="relative">
            <button
              onClick={() => onTriggerSection('mainA')}
              className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
                currentSection === 'mainA' && !activeFillType
                  ? 'bg-emerald-500 text-black ring-2 ring-emerald-300'
                  : nextSection === 'mainA'
                  ? 'bg-emerald-800 text-emerald-200 animate-pulse'
                  : 'bg-[#262932] hover:bg-[#313540] text-gray-300'
              }`}
              title="Jeśli grasz Main A → Micro-fill (1 miara). Jeśli grasz Main B → Medium-fill (2 miary), a potem Main A."
            >
              Main A
            </button>
            {currentSection === 'mainA' && activeFillType && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1 py-0.5 rounded-full bg-orange-500 text-white shadow-sm">
                {activeFillType === 'micro' ? 'μ' : activeFillType === 'medium' ? '½' : '→'}
              </span>
            )}
          </div>

          {/* FILL IN A – full 1-bar fill */}
          <button
            onClick={() => onTriggerSection('fillA')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'fillA'
                ? 'bg-cyan-500 text-black ring-2 ring-cyan-300'
                : nextSection === 'fillA'
                ? 'bg-cyan-800 text-cyan-200 animate-pulse'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300 border border-cyan-500/20'
            }`}
            title="Pełny 1-taktowy Fill-In A"
          >
            Fill A
          </button>

          {/* MAIN B - clicking same section = micro fill */}
          <div className="relative">
            <button
              onClick={() => onTriggerSection('mainB')}
              className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
                currentSection === 'mainB' && !activeFillType
                  ? 'bg-emerald-500 text-black ring-2 ring-emerald-300'
                  : nextSection === 'mainB'
                  ? 'bg-emerald-800 text-emerald-200 animate-pulse'
                  : 'bg-[#262932] hover:bg-[#313540] text-gray-300'
              }`}
              title="Jeśli grasz Main B → Micro-fill (1 miara). Jeśli grasz Main A → Medium-fill (2 miary), a potem Main B."
            >
              Main B
            </button>
            {currentSection === 'mainB' && activeFillType && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1 py-0.5 rounded-full bg-orange-500 text-white shadow-sm">
                {activeFillType === 'micro' ? 'μ' : activeFillType === 'medium' ? '½' : '→'}
              </span>
            )}
          </div>

          {/* FILL IN B – full 1-bar fill */}
          <button
            onClick={() => onTriggerSection('fillB')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'fillB'
                ? 'bg-cyan-500 text-black ring-2 ring-cyan-300'
                : nextSection === 'fillB'
                ? 'bg-cyan-800 text-cyan-200 animate-pulse'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300 border border-cyan-500/20'
            }`}
            title="Pełny 1-taktowy Fill-In B"
          >
            Fill B
          </button>

          {/* ENDING */}
          <button
            onClick={() => onTriggerSection('ending')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'ending'
                ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300'
            }`}
          >
            Ending
          </button>
        </div>

        {/* Fill type indicator strip */}
        {activeFillType && (
          <div className="w-full flex items-center justify-center">
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
              activeFillType === 'micro'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : activeFillType === 'medium'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              <span>{activeFillType === 'micro' ? '⚡ Micro-Fill (1 miara)' : activeFillType === 'medium' ? '⚡⚡ Medium-Fill (2 miary)' : '⚡⚡⚡ Full Fill (1 takt)'}</span>
            </div>
          </div>
        )}

        {/* Right: Tempo & Metronome controls */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {/* Tap Tempo Button */}
          <button
            onClick={onTapTempo}
            className="px-3.5 py-2.5 rounded-xl bg-[#262a33] hover:bg-[#333845] active:bg-amber-500 active:text-black text-xs font-bold text-gray-200 border border-gray-700 shadow flex items-center space-x-1.5 transition-all"
            title="Klawisz T: Wstukaj tempo (Tap Tempo)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TAP (T)</span>
          </button>

          {/* Metronome Toggle */}
          <button
            onClick={onToggleMetronome}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border shadow flex items-center space-x-1.5 transition-all ${
              metronomeEnabled
                ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-amber-500/30'
                : 'bg-[#262a33] hover:bg-[#333845] text-gray-300 border-gray-700'
            }`}
            title="Klawisz M: Włącz/Wyłącz metronom"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>METRO (M)</span>
          </button>

          {/* BPM Steppers & Slider */}
          <div className="flex items-center space-x-1.5 bg-[#16181d] px-3 py-1.5 rounded-xl border border-gray-800">
            <button
              onClick={() => onSetBpm(bpm - 1)}
              className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 text-sm font-bold text-gray-200 flex items-center justify-center active:scale-95"
              title="Strzałka w dół: -1 BPM"
            >
              -
            </button>

            <input
              type="range"
              min="40"
              max="260"
              value={bpm}
              onChange={(e) => onSetBpm(Number(e.target.value))}
              className="w-20 sm:w-28 accent-amber-500 cursor-pointer"
            />

            <button
              onClick={() => onSetBpm(bpm + 1)}
              className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 text-sm font-bold text-gray-200 flex items-center justify-center active:scale-95"
              title="Strzałka w górę: +1 BPM"
            >
              +
            </button>

            <button
              onClick={() => onSetBpm(currentStyle.defaultBpm)}
              className="p-1 text-gray-400 hover:text-amber-400 text-xs ml-1"
              title={`Zresetuj do domyślnego tempa (${currentStyle.defaultBpm} BPM)`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
