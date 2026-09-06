import React from 'react';
import { DrumInstrument, DRUM_INSTRUMENTS_META, RhythmPattern, RhythmSection, RhythmStyle } from '../types/rhythm';
import { DrumMixerState } from '../types/audio';

interface DrumMatrixProps {
  currentStyle: RhythmStyle;
  currentSection: RhythmSection;
  currentStep: number;
  isPlaying: boolean;
  mixerState: DrumMixerState;
  onTriggerInstrument: (instrument: DrumInstrument) => void;
  onToggleMute: (instrument: DrumInstrument) => void;
  onToggleSolo: (instrument: DrumInstrument) => void;
}

export const DrumMatrix: React.FC<DrumMatrixProps> = ({
  currentStyle,
  currentSection,
  currentStep,
  isPlaying,
  mixerState,
  onTriggerInstrument,
  onToggleMute,
  onToggleSolo
}) => {
  const pattern: RhythmPattern = currentStyle.sections[currentSection] || currentStyle.sections.mainA;
  const totalSteps = pattern.steps.length;
  const stepsPerBeat = pattern.stepsPerBeat || 4;

  // Filter instruments that have at least one hit in this pattern or are standard core drums
  const activeInstrumentsInPattern = Array.from(
    new Set(
      pattern.steps.flatMap((step) => step.map((hit) => hit.instrument))
    )
  );

  // Always show core instruments + any active in the pattern
  const coreInstruments: DrumInstrument[] = ['kick', 'snare', 'hihat_closed', 'hihat_open', 'ride', 'crash', 'tom_high', 'tom_low'];
  const displayInstruments = Array.from(
    new Set([...coreInstruments, ...activeInstrumentsInPattern])
  ).filter((inst) => DRUM_INSTRUMENTS_META[inst] !== undefined);

  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-100 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>WIZUALIZACJA SIATKI RYTMICZNEJ (DRUM GRID)</span>
          </h2>
          <p className="text-xs text-gray-400">
            Podgląd uderzeń w czasie rzeczywistym. Kliknij w nazwę instrumentu, aby zagrać padem.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 bg-[#121316] px-3 py-1.5 rounded-lg border border-gray-800">
          <span>KROKÓW: <b className="text-gray-200">{totalSteps}</b></span>
          <span>•</span>
          <span>PODZIAŁ: <b className="text-gray-200">{stepsPerBeat === 4 ? '1/16' : stepsPerBeat === 3 ? '1/12 (Triola)' : '1/8'}</b></span>
        </div>
      </div>

      {/* Full-width scrollable grid */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="w-full min-w-[560px]">
          {/* Header row: Step numbers & beat markers */}
          <div className="flex items-center gap-0 mb-2 px-1 text-[11px] font-mono text-gray-400">
            {/* Instrument label column */}
            <div className="shrink-0 w-[148px] font-semibold uppercase tracking-wider text-gray-400">Instrument</div>
            {/* Steps flex-grow to fill width */}
            <div className="flex flex-1 gap-0">
              {Array.from({ length: totalSteps }).map((_, stepIdx) => {
                const beatIndex = Math.floor(stepIdx / stepsPerBeat) + 1;
                const isBeatStart = stepIdx % stepsPerBeat === 0;
                const isCurrentStep = isPlaying && currentStep === stepIdx;

                return (
                  <div
                    key={stepIdx}
                    className={`flex-1 text-center py-1 rounded mx-px transition-colors ${
                      isCurrentStep
                        ? 'bg-amber-400 text-black font-extrabold shadow'
                        : isBeatStart
                        ? 'bg-gray-800 text-amber-400 font-bold border border-gray-700'
                        : 'text-gray-400'
                    }`}
                    style={{ minWidth: '14px' }}
                  >
                    {isBeatStart ? beatIndex : '.'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instrument Rows */}
          <div className="space-y-1.5">
            {displayInstruments.map((inst) => {
              const meta = DRUM_INSTRUMENTS_META[inst];
              const channel = mixerState[inst];
              const isMuted = channel?.isMuted;
              const isSolo = channel?.isSolo;

              // Collect which step indices this instrument has hits
              const hitSteps = new Set<number>(
                pattern.steps.flatMap((stepHits, i) =>
                  stepHits.some((h) => h.instrument === inst) ? [i] : []
                )
              );
              const hitVelocities = new Map<number, number>(
                pattern.steps.flatMap((stepHits, i) => {
                  const hit = stepHits.find((h) => h.instrument === inst);
                  return hit ? [[i, hit.velocity]] : [];
                })
              );

              return (
                <div key={inst} className="flex items-center gap-0">
                  {/* Instrument button */}
                  <button
                    onClick={() => onTriggerInstrument(inst)}
                    className={`shrink-0 w-[148px] flex items-center space-x-2 px-2 py-1.5 rounded-lg transition-all text-xs font-semibold text-left ${
                      isSolo
                        ? 'bg-yellow-900/50 text-yellow-300 ring-1 ring-yellow-500/40'
                        : isMuted
                        ? 'bg-gray-900/80 text-gray-600'
                        : 'bg-[#252830] hover:bg-[#2f3340] text-gray-200'
                    }`}
                    title={`Kliknij aby zagrać: ${meta.name}. Ctrl+Click: Mute. Shift+Click: Solo.`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: isMuted ? '#444' : meta.color }}
                    />
                    <span className="truncate">{meta.name}</span>
                  </button>

                  {/* Hit cells – flex to fill remaining width */}
                  <div className="flex flex-1 gap-0">
                    {Array.from({ length: totalSteps }).map((_, stepIdx) => {
                      const hasHit = hitSteps.has(stepIdx);
                      const velocity = hitVelocities.get(stepIdx) || 0;
                      const isCurrentStep = isPlaying && currentStep === stepIdx;
                      const isBeatStart = stepIdx % stepsPerBeat === 0;
                      const isGroup = Math.floor(stepIdx / stepsPerBeat) % 2 === 0;

                      let bg = '';
                      if (hasHit && !isMuted) {
                        if (velocity > 0.85) bg = 'bg-amber-400';
                        else if (velocity > 0.55) bg = 'bg-amber-600/90';
                        else bg = 'bg-amber-800/80';
                      } else if (isGroup) {
                        bg = 'bg-[#1c1f26]';
                      } else {
                        bg = 'bg-[#181b21]';
                      }

                      return (
                        <div
                          key={stepIdx}
                          onClick={() => onTriggerInstrument(inst)}
                          style={{ minWidth: '14px' }}
                          className={`flex-1 h-9 mx-px rounded transition-all cursor-pointer flex items-center justify-center ${bg} ${
                            isCurrentStep
                              ? 'ring-2 ring-amber-300 ring-inset z-10'
                              : isBeatStart
                              ? 'border-l border-gray-700/60'
                              : ''
                          } ${isMuted ? 'opacity-30' : ''} hover:opacity-80`}
                        >
                          {hasHit && !isMuted && (
                            <span
                              className="block w-2 h-2 rounded-full shadow-sm"
                              style={{ backgroundColor: meta.color }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mute / Solo mini buttons */}
                  <div className="shrink-0 flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => onToggleMute(inst)}
                      className={`w-7 h-7 rounded text-[10px] font-extrabold transition-all ${
                        isMuted ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                      }`}
                      title="Mute"
                    >
                      M
                    </button>
                    <button
                      onClick={() => onToggleSolo(inst)}
                      className={`w-7 h-7 rounded text-[10px] font-extrabold transition-all ${
                        isSolo ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                      }`}
                      title="Solo"
                    >
                      S
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
