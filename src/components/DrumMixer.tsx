import React from 'react';
import { DrumInstrument, DRUM_INSTRUMENTS_META } from '../types/rhythm';
import { DrumMixerState } from '../types/audio';
import { Sliders, Volume2, Sparkles } from 'lucide-react';

interface DrumMixerProps {
  mixerState: DrumMixerState;
  masterVolume: number;
  onSetVolume: (instrument: DrumInstrument, volume: number) => void;
  onSetPan: (instrument: DrumInstrument, pan: number) => void;
  onToggleMute: (instrument: DrumInstrument) => void;
  onToggleSolo: (instrument: DrumInstrument) => void;
  onApplyPreset: (preset: 'all' | 'mute_kick' | 'mute_snare' | 'mute_hihat' | 'cymbals_only' | 'kick_snare_only') => void;
  onSetMasterVolume: (vol: number) => void;
}

export const DrumMixer: React.FC<DrumMixerProps> = ({
  mixerState,
  masterVolume,
  onSetVolume,
  onSetPan,
  onToggleMute,
  onToggleSolo,
  onApplyPreset,
  onSetMasterVolume
}) => {
  const instruments = Object.keys(mixerState) as DrumInstrument[];

  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Mixer Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 pb-3 border-b border-gray-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-100 flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>MIKSER PERKUSYJNY & FUNKCJE TRENINGOWE (MUTE / SOLO)</span>
          </h2>
          <p className="text-xs text-gray-400">
            Wycisz poszczególne elementy zestawu, aby zagrać je samodzielnie na żywo.
          </p>
        </div>

        {/* Master Volume */}
        <div className="flex items-center space-x-2 bg-[#121316] px-3.5 py-1.5 rounded-xl border border-gray-800">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-gray-300">MASTER:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => onSetMasterVolume(parseFloat(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
          <span className="text-xs font-mono text-gray-400 w-8">{Math.round(masterVolume * 100)}%</span>
        </div>
      </div>

      {/* Practice Presets Buttons */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase mr-1 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Szybkie Presety Treningowe:</span>
        </span>

        <button
          onClick={() => onApplyPreset('all')}
          className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 border border-gray-700 transition-colors"
        >
          Wszystkie Włączone
        </button>

        <button
          onClick={() => onApplyPreset('mute_kick')}
          className="px-3 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-xs font-semibold text-red-300 border border-red-800/50 transition-colors"
        >
          🚫 Wycisz Stopę (Graj własną nogą)
        </button>

        <button
          onClick={() => onApplyPreset('mute_snare')}
          className="px-3 py-1 rounded-lg bg-orange-950/60 hover:bg-orange-900/60 text-xs font-semibold text-orange-300 border border-orange-800/50 transition-colors"
        >
          🚫 Wycisz Werbel (Graj własny werbel)
        </button>

        <button
          onClick={() => onApplyPreset('mute_hihat')}
          className="px-3 py-1 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 text-xs font-semibold text-teal-300 border border-teal-800/50 transition-colors"
        >
          🚫 Wycisz Hi-Hat
        </button>

        <button
          onClick={() => onApplyPreset('kick_snare_only')}
          className="px-3 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-xs font-semibold text-indigo-300 border border-indigo-800/50 transition-colors"
        >
          🥁 Tylko Stopa + Werbel
        </button>

        <button
          onClick={() => onApplyPreset('cymbals_only')}
          className="px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-xs font-semibold text-cyan-300 border border-cyan-800/50 transition-colors"
        >
          🔔 Tylko Talerze
        </button>
      </div>

      {/* Mixer Channel Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2.5">
        {instruments.map((inst) => {
          const meta = DRUM_INSTRUMENTS_META[inst];
          const channel = mixerState[inst];
          if (!meta || !channel) return null;

          return (
            <div
              key={inst}
              className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                channel.isMuted
                  ? 'bg-[#15171a] border-gray-800 opacity-60'
                  : channel.isSolo
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-[#22252c] border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Instrument Icon / Label */}
              <div className="w-full flex items-center justify-between mb-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="text-[11px] font-bold text-gray-200 truncate uppercase" title={meta.name}>
                  {meta.shortName}
                </span>
                <span className="text-[9px] font-mono text-gray-400">
                  {Math.round(channel.volume * 100)}%
                </span>
              </div>

              {/* Volume Slider (Vertical style) */}
              <div className="h-28 flex items-center justify-center my-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={channel.volume}
                  onChange={(e) => onSetVolume(inst, parseFloat(e.target.value))}
                  className="h-24 w-2 accent-amber-500 cursor-pointer -rotate-90"
                />
              </div>

              {/* Pan Slider */}
              <div className="w-full flex items-center justify-between text-[9px] font-mono text-gray-400 px-1 mb-1">
                <span>L</span>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={channel.pan}
                  onChange={(e) => onSetPan(inst, parseFloat(e.target.value))}
                  className="w-10 h-1 accent-cyan-500 cursor-pointer"
                  title={`Pan: ${channel.pan > 0 ? `R${Math.round(channel.pan * 100)}` : channel.pan < 0 ? `L${Math.round(Math.abs(channel.pan) * 100)}` : 'Center'}`}
                />
                <span>R</span>
              </div>

              {/* Solo & Mute Buttons */}
              <div className="flex items-center space-x-1.5 w-full mt-1">
                <button
                  onClick={() => onToggleMute(inst)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                    channel.isMuted
                      ? 'bg-red-600 text-white font-extrabold shadow'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                  title="Wycisz"
                >
                  Mute
                </button>
                <button
                  onClick={() => onToggleSolo(inst)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                    channel.isSolo
                      ? 'bg-amber-400 text-black font-extrabold shadow'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                  title="Solo"
                >
                  Solo
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
