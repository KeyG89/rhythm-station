import React from 'react';
import { RhythmSection, RhythmStyle } from '../types/rhythm';
import { Play, Square, RotateCcw, Volume2, Sparkles, Timer } from 'lucide-react';

interface TransportBarProps {
  isPlaying: boolean;
  currentSection: RhythmSection;
  nextSection: RhythmSection | null;
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

          {/* MAIN A */}
          <button
            onClick={() => onTriggerSection('mainA')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'mainA'
                ? 'bg-emerald-500 text-black ring-2 ring-emerald-300'
                : nextSection === 'mainA'
                ? 'bg-emerald-800 text-emerald-200 animate-pulse'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300'
            }`}
            title="Klawisz V: Przełącz Main A / Main B"
          >
            Main A
          </button>

          {/* FILL IN A */}
          <button
            onClick={() => onTriggerSection('fillA')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'fillA'
                ? 'bg-cyan-500 text-black ring-2 ring-cyan-300'
                : nextSection === 'fillA'
                ? 'bg-cyan-800 text-cyan-200 animate-pulse'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300 border border-cyan-500/20'
            }`}
            title="Klawisz F: Wyzwól przejście perkusyjne Fill-In"
          >
            Fill A
          </button>

          {/* MAIN B */}
          <button
            onClick={() => onTriggerSection('mainB')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'mainB'
                ? 'bg-emerald-500 text-black ring-2 ring-emerald-300'
                : nextSection === 'mainB'
                ? 'bg-emerald-800 text-emerald-200 animate-pulse'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300'
            }`}
            title="Klawisz V: Przełącz Main A / Main B"
          >
            Main B
          </button>

          {/* FILL IN B */}
          <button
            onClick={() => onTriggerSection('fillB')}
            className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
              currentSection === 'fillB'
                ? 'bg-cyan-500 text-black ring-2 ring-cyan-300'
                : nextSection === 'fillB'
                ? 'bg-cyan-800 text-cyan-200 animate-pulse'
                : 'bg-[#262932] hover:bg-[#313540] text-gray-300 border border-cyan-500/20'
            }`}
            title="Klawisz F: Wyzwól przejście perkusyjne Fill-In"
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
