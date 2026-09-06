import React, { useState, useCallback } from 'react';
import { DrumInstrument, DRUM_INSTRUMENTS_META } from '../types/rhythm';
import { DrumSoundParams, DrumKitPreset, DrumSoundModel } from '../types/audio';
import { DEFAULT_SOUND_PARAMS } from '../audio/DrumSynthesizer';
import { Save, RotateCcw, Trash2, Drumstick, Sliders, Plus } from 'lucide-react';

// ── Factory Presets ──────────────────────────────────────────────────────────

export const FACTORY_PRESETS: DrumKitPreset[] = [
  {
    id: 'yamaha_psr',
    name: 'Yamaha PSR Classic',
    description: 'Brzmienie oryginalne – jasne, natarczywe, idealne do ćwiczeń',
    model: 'acoustic_custom',
    params: {},
    isCustom: false
  },
  {
    id: 'vintage_warmth',
    name: 'Vintage 70s Studio',
    description: 'Ciepłe, analogowe brzmienie z lat 70. (Led Zeppelin, Bonham style)',
    model: 'vintage_warmth',
    params: {
      kick: { pitchMultiplier: 0.88, decayMultiplier: 1.5, toneFrequency: 80, snappy: 0.3, drive: 0.6 },
      snare: { pitchMultiplier: 0.92, decayMultiplier: 1.3, toneFrequency: 700, snappy: 0.5, drive: 0.5 },
      hihat_closed: { pitchMultiplier: 0.95, decayMultiplier: 0.8, toneFrequency: 6000, snappy: 0.5, drive: 0.1 }
    },
    isCustom: false
  },
  {
    id: 'rock_heavy',
    name: 'Heavy Studio Rock',
    description: 'Mocny, przebijający werbel i ciężka stopa (ACDC, Bonham)',
    model: 'rock_heavy',
    params: {
      kick: { pitchMultiplier: 0.9, decayMultiplier: 1.2, toneFrequency: 70, snappy: 0.4, drive: 0.8 },
      snare: { pitchMultiplier: 1.1, decayMultiplier: 0.8, toneFrequency: 1400, snappy: 0.9, drive: 0.7 },
      tom_high: { pitchMultiplier: 1.0, decayMultiplier: 1.4, toneFrequency: 320, snappy: 0.3, drive: 0.5 },
      tom_low: { pitchMultiplier: 0.85, decayMultiplier: 1.6, toneFrequency: 120, snappy: 0.2, drive: 0.6 }
    },
    isCustom: false
  },
  {
    id: 'gated_80s',
    name: '80s Gated Reverb',
    description: 'Phil Collins / Power Station – charakterystyczny gate na werblu z lat 80.',
    model: 'gated_80s',
    params: {
      kick: { pitchMultiplier: 1.0, decayMultiplier: 0.7, toneFrequency: 90, snappy: 0.6, drive: 0.5 },
      snare: { pitchMultiplier: 1.15, decayMultiplier: 1.8, toneFrequency: 1800, snappy: 1.0, drive: 0.6 }
    },
    isCustom: false
  },
  {
    id: 'electronic_808',
    name: 'Electronic 808/909',
    description: 'Roland TR-808 / TR-909 – głęboka elektroniczna stopa, metaliczny hi-hat',
    model: 'electronic_808',
    params: {
      kick: { pitchMultiplier: 0.7, decayMultiplier: 2.2, toneFrequency: 55, snappy: 0.2, drive: 0.9 },
      snare: { pitchMultiplier: 1.2, decayMultiplier: 0.6, toneFrequency: 900, snappy: 0.7, drive: 0.4 },
      hihat_closed: { pitchMultiplier: 1.3, decayMultiplier: 0.4, toneFrequency: 9000, snappy: 0.8, drive: 0.1 }
    },
    isCustom: false
  },
  {
    id: 'jazz_maple',
    name: 'Jazz Club Acoustic',
    description: 'Delikatne, akustyczne brzmienie jazzowe – miękka stopa, ciepły werbel szczotkowany',
    model: 'jazz_maple',
    params: {
      kick: { pitchMultiplier: 1.05, decayMultiplier: 0.7, toneFrequency: 120, snappy: 0.2, drive: 0.2 },
      snare: { pitchMultiplier: 0.95, decayMultiplier: 0.85, toneFrequency: 1200, snappy: 0.4, drive: 0.15 },
      hihat_closed: { pitchMultiplier: 0.9, decayMultiplier: 0.9, toneFrequency: 5000, snappy: 0.4, drive: 0.05 },
      ride: { pitchMultiplier: 0.95, decayMultiplier: 1.2, toneFrequency: 6000, snappy: 0.5, drive: 0.1 }
    },
    isCustom: false
  }
];

// ── Drum Kit Visual Positioning Layout ──────────────────────────────────────

const KIT_LAYOUT: Array<{ inst: DrumInstrument; label: string; x: number; y: number; w: number; h: number; shape: 'circle' | 'oval' | 'rect'; color: string }> = [
  { inst: 'crash', label: 'Crash', x: 6, y: 4, w: 10, h: 10, shape: 'oval', color: '#c9b84c' },
  { inst: 'hihat_closed', label: 'Hi-Hat', x: 18, y: 6, w: 10, h: 8, shape: 'oval', color: '#e0c060' },
  { inst: 'ride', label: 'Ride', x: 74, y: 4, w: 12, h: 10, shape: 'oval', color: '#c9b84c' },
  { inst: 'tom_high', label: 'T.High', x: 32, y: 10, w: 14, h: 13, shape: 'circle', color: '#4ab8d4' },
  { inst: 'tom_mid', label: 'T.Mid', x: 52, y: 10, w: 14, h: 13, shape: 'circle', color: '#3ea8c4' },
  { inst: 'snare', label: 'Snare', x: 20, y: 28, w: 16, h: 14, shape: 'circle', color: '#f0a040' },
  { inst: 'tom_low', label: 'Floor', x: 68, y: 28, w: 18, h: 16, shape: 'circle', color: '#4a78d4' },
  { inst: 'kick', label: 'Kick', x: 36, y: 50, w: 28, h: 24, shape: 'oval', color: '#e05050' },
  { inst: 'hihat_pedal', label: 'HH Foot', x: 16, y: 60, w: 12, h: 8, shape: 'oval', color: '#c0a020' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const PARAM_LABELS: Record<keyof DrumSoundParams, { label: string; min: number; max: number; step: number }> = {
  pitchMultiplier: { label: 'Strój (Pitch)', min: 0.5, max: 2.0, step: 0.01 },
  decayMultiplier: { label: 'Wybrzmienie (Decay)', min: 0.2, max: 3.0, step: 0.05 },
  toneFrequency: { label: 'Ton (Tone)', min: 60, max: 12000, step: 50 },
  snappy: { label: 'Jasność (Snappy)', min: 0, max: 1, step: 0.01 },
  drive: { label: 'Nacisk (Drive)', min: 0, max: 1, step: 0.01 }
};

// ── Component ────────────────────────────────────────────────────────────────

interface DrumKitStudioProps {
  soundParams: Record<DrumInstrument, DrumSoundParams>;
  currentPreset: DrumKitPreset | null;
  onSoundParamChange: (inst: DrumInstrument, key: keyof DrumSoundParams, val: number) => void;
  onApplyPreset: (preset: DrumKitPreset) => void;
  onSaveCustomPreset: (name: string, description: string) => void;
  onDeleteCustomPreset: (id: string) => void;
  customPresets: DrumKitPreset[];
  onTriggerInstrument: (inst: DrumInstrument) => void;
}

export const DrumKitStudio: React.FC<DrumKitStudioProps> = ({
  soundParams,
  currentPreset,
  onSoundParamChange,
  onApplyPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  customPresets,
  onTriggerInstrument
}) => {
  const [selectedInst, setSelectedInst] = useState<DrumInstrument>('snare');
  const [hitInst, setHitInst] = useState<DrumInstrument | null>(null);
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [newPresetDesc, setNewPresetDesc] = useState<string>('');
  const [showSaveForm, setShowSaveForm] = useState<boolean>(false);

  const handlePadClick = useCallback((inst: DrumInstrument) => {
    setSelectedInst(inst);
    setHitInst(inst);
    onTriggerInstrument(inst);
    setTimeout(() => setHitInst(null), 150);
  }, [onTriggerInstrument]);

  const currentParams = soundParams[selectedInst] || DEFAULT_SOUND_PARAMS[selectedInst];
  const selectedMeta = DRUM_INSTRUMENTS_META[selectedInst];

  const allPresets = [...FACTORY_PRESETS, ...customPresets];

  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-100 flex items-center space-x-2">
            <Drumstick className="w-5 h-5 text-amber-400" />
            <span>ZESTAW PERKUSYJNY – STUDIO BRZMIEŃ & PRESETY</span>
          </h2>
          <p className="text-xs text-gray-400">Kliknij element zestawu aby wybrać i edytować jego brzmienie. Zapisz własny preset.</p>
        </div>
        {currentPreset && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
            Preset: {currentPreset.name}
          </div>
        )}
      </div>

      {/* Top grid: Kit Visual + Param Editor side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Interactive SVG Drum Kit */}
        <div className="bg-[#13151a] rounded-xl border border-gray-800 p-3">
          <div className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Kliknij instrument → edytuj brzmienie</div>
          <div className="relative w-full" style={{ paddingBottom: '80%' }}>
            <svg
              viewBox="0 0 100 90"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stand / hardware lines */}
              <line x1="22" y1="65" x2="22" y2="82" stroke="#444" strokeWidth="0.8" />
              <line x1="38" y1="73" x2="22" y2="82" stroke="#444" strokeWidth="0.8" />
              <line x1="62" y1="73" x2="78" y2="82" stroke="#444" strokeWidth="0.8" />
              <line x1="78" y1="60" x2="78" y2="82" stroke="#444" strokeWidth="0.8" />
              {/* Hihat stand */}
              <line x1="24" y1="67" x2="24" y2="82" stroke="#555" strokeWidth="0.7" />

              {KIT_LAYOUT.map((item) => {
                const isSelected = selectedInst === item.inst;
                const isHit = hitInst === item.inst;
                const cx = item.x + item.w / 2;
                const cy = item.y + item.h / 2;
                const rx = item.w / 2;
                const ry = item.h / 2;

                return (
                  <g key={item.inst} onClick={() => handlePadClick(item.inst)} style={{ cursor: 'pointer' }}>
                    <ellipse
                      cx={cx} cy={cy} rx={rx} ry={ry}
                      fill={isHit ? '#fff' : isSelected ? item.color : '#2a2e38'}
                      stroke={isSelected ? item.color : '#555'}
                      strokeWidth={isSelected ? 0.8 : 0.5}
                      opacity={isHit ? 0.9 : 1}
                      style={{ transition: 'fill 0.1s' }}
                    />
                    <text
                      x={cx} y={cy + 0.5}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="3.2"
                      fill={isSelected ? '#000' : '#ccc'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      style={{ pointerEvents: 'none' }}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Parameter Editor */}
        <div className="bg-[#13151a] rounded-xl border border-gray-800 p-4 space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-800">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedMeta.color }} />
            <h3 className="font-bold text-gray-100 text-sm">{selectedMeta.name}</h3>
            <Sliders className="w-4 h-4 text-gray-400 ml-auto" />
            <button
              onClick={() => {
                const defaults = DEFAULT_SOUND_PARAMS[selectedInst];
                (Object.keys(defaults) as (keyof DrumSoundParams)[]).forEach((k) => {
                  onSoundParamChange(selectedInst, k, defaults[k] as number);
                });
              }}
              className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 flex items-center space-x-1 transition-colors"
              title="Zresetuj do domyślnych"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-3">
            {(Object.entries(PARAM_LABELS) as Array<[keyof DrumSoundParams, typeof PARAM_LABELS[keyof DrumSoundParams]]>).map(([key, meta]) => {
              const value = currentParams[key] as number;
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-300">{meta.label}</label>
                    <span className="text-xs font-mono text-amber-400 bg-[#1e2027] px-2 py-0.5 rounded">
                      {typeof value === 'number' ? value.toFixed(key === 'toneFrequency' ? 0 : 2) : '-'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    value={value || meta.min}
                    onChange={(e) => onSoundParamChange(selectedInst, key, Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600">
                    <span>{meta.min}</span>
                    <span>{meta.max}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handlePadClick(selectedInst)}
            className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <span>🥁</span>
            <span>Przetestuj brzmienie: {selectedMeta.name}</span>
          </button>
        </div>
      </div>

      {/* Preset Library */}
      <div className="bg-[#13151a] rounded-xl border border-gray-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-200 flex items-center space-x-2">
            <span>🎛️</span>
            <span>Biblioteka Presetów Zestawu Perkusyjnego</span>
          </h3>
          <button
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center space-x-1.5 transition-colors shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Zapisz Preset</span>
          </button>
        </div>

        {/* Save Form */}
        {showSaveForm && (
          <div className="bg-[#1a1d24] border border-gray-700 rounded-xl p-3 space-y-2">
            <p className="text-xs text-gray-400">Zapisz bieżące brzmienia jako nowy preset:</p>
            <input
              type="text"
              placeholder="Nazwa presetu (np. Mój Rock Kit)"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="w-full bg-[#121416] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Opis (opcjonalny)"
              value={newPresetDesc}
              onChange={(e) => setNewPresetDesc(e.target.value)}
              className="w-full bg-[#121416] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (newPresetName.trim()) {
                    onSaveCustomPreset(newPresetName.trim(), newPresetDesc.trim());
                    setNewPresetName('');
                    setNewPresetDesc('');
                    setShowSaveForm(false);
                  }
                }}
                disabled={!newPresetName.trim()}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold text-white flex items-center justify-center space-x-1 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Zapisz</span>
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {allPresets.map((preset) => {
            const isActive = currentPreset?.id === preset.id;
            return (
              <div
                key={preset.id}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/60 shadow shadow-amber-500/10'
                    : 'bg-[#1e2127] border-gray-800 hover:border-gray-600'
                }`}
                onClick={() => onApplyPreset(preset)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold text-xs ${isActive ? 'text-amber-400' : 'text-gray-200'}`}>
                    {preset.name}
                  </span>
                  {preset.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomPreset(preset.id);
                      }}
                      className="p-0.5 text-gray-600 hover:text-red-400 transition-colors"
                      title="Usuń preset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">{preset.description}</p>
                {isActive && (
                  <div className="mt-1.5">
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                      ✓ AKTYWNY
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Models Reference */}
      <div className="bg-[#13151a] rounded-xl border border-gray-800 p-3">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Modele Brzmieniowe:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-gray-300">
          {([
            ['acoustic_custom', 'Acoustic Custom', 'Naturalny, studyjny dźwięk akustyczny'],
            ['vintage_warmth', 'Vintage Warmth', 'Analogowe, ciepłe brzmienie z lat 70.'],
            ['rock_heavy', 'Rock Heavy', 'Mocny, przenikliwy rock studyjny'],
            ['gated_80s', 'Gated 80s', 'Gate reverb na werblu, styl lat 80.'],
            ['electronic_808', 'Electronic 808', 'Syntetyczne TR-808/909, elektronika'],
            ['jazz_maple', 'Jazz Maple', 'Delikatne, akustyczne brzmienie jazzowe']
          ] as Array<[DrumSoundModel, string, string]>).map(([id, name, desc]) => (
            <div key={id} className="bg-[#1a1d24] rounded-lg p-2 border border-gray-800">
              <div className="font-bold text-amber-400 text-[11px]">{name}</div>
              <div className="text-gray-500 text-[10px] mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
