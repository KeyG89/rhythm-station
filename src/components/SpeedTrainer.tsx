import React from 'react';
import { SpeedTrainerConfig } from '../types/audio';
import { FastForward, Zap } from 'lucide-react';

interface SpeedTrainerProps {
  config: SpeedTrainerConfig;
  currentBpm: number;
  totalBars: number;
  isPlaying: boolean;
  onUpdateConfig: (config: SpeedTrainerConfig) => void;
}

export const SpeedTrainer: React.FC<SpeedTrainerProps> = ({
  config,
  currentBpm,
  totalBars,
  isPlaying,
  onUpdateConfig
}) => {
  const barsUntilNextStep = config.enabled
    ? config.barsPerStep - (totalBars % config.barsPerStep)
    : config.barsPerStep;

  const progressPercent = config.enabled && config.targetBpm > config.startBpm
    ? Math.min(100, Math.max(0, ((currentBpm - config.startBpm) / (config.targetBpm - config.startBpm)) * 100))
    : 0;

  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <FastForward className="w-5 h-5 text-orange-400" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-100">
              SPEED TRAINER (AKCELERATOR TEMPA)
            </h2>
            <p className="text-xs text-gray-400">
              Automatycznie zwiększaj tempo co określoną liczbę taktów, aby budować szybkość i wytrzymałość.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => onUpdateConfig({ ...config, enabled: !config.enabled })}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all shadow ${
            config.enabled
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-orange-500/20 ring-2 ring-orange-400'
              : 'bg-[#2b2f38] hover:bg-[#373c47] text-gray-400'
          }`}
        >
          {config.enabled ? '⚡ AKTYWNY (ON)' : 'WYŁĄCZONY (OFF)'}
        </button>
      </div>

      {/* Progress Bar */}
      {config.enabled && (
        <div className="mb-4 bg-[#121316] p-3 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-gray-400 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>POSTĘP DO TEMPA DOCELOWEGO:</span>
            </span>
            <span className="text-orange-400 font-bold">
              {currentBpm} / {config.targetBpm} BPM ({Math.round(progressPercent)}%)
            </span>
          </div>

          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1 font-mono">
            <span>START: {config.startBpm} BPM</span>
            <span>NASTĘPNE ZWIĘKSZENIE: za <b className="text-gray-200">{isPlaying ? barsUntilNextStep : config.barsPerStep}</b> taktów</span>
            <span>CEL: {config.targetBpm} BPM</span>
          </div>
        </div>
      )}

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Start BPM */}
        <div className="bg-[#16181d] p-3 rounded-xl border border-gray-800">
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Tempo Startowe (BPM)
          </label>
          <input
            type="number"
            min="40"
            max="240"
            value={config.startBpm}
            onChange={(e) => onUpdateConfig({ ...config, startBpm: Number(e.target.value) })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-200 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Target BPM */}
        <div className="bg-[#16181d] p-3 rounded-xl border border-gray-800">
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Tempo Docelowe (BPM)
          </label>
          <input
            type="number"
            min="50"
            max="280"
            value={config.targetBpm}
            onChange={(e) => onUpdateConfig({ ...config, targetBpm: Number(e.target.value) })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-200 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* BPM Step */}
        <div className="bg-[#16181d] p-3 rounded-xl border border-gray-800">
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Krok Zwiększenia
          </label>
          <select
            value={config.bpmStep}
            onChange={(e) => onUpdateConfig({ ...config, bpmStep: Number(e.target.value) })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-200 focus:outline-none focus:border-orange-500"
          >
            <option value={1}>+1 BPM</option>
            <option value={2}>+2 BPM (Płynnie)</option>
            <option value={5}>+5 BPM (Standard)</option>
            <option value={10}>+10 BPM (Szybki skok)</option>
          </select>
        </div>

        {/* Bars Per Step */}
        <div className="bg-[#16181d] p-3 rounded-xl border border-gray-800">
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Co ile taktów
          </label>
          <select
            value={config.barsPerStep}
            onChange={(e) => onUpdateConfig({ ...config, barsPerStep: Number(e.target.value) })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-200 focus:outline-none focus:border-orange-500"
          >
            <option value={2}>Co 2 takty</option>
            <option value={4}>Co 4 takty (1 fraza)</option>
            <option value={8}>Co 8 taktów (2 frazy)</option>
            <option value={16}>Co 16 taktów (Długi trening)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
