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
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl">
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

      {/* Grid Container with horizontal scroll for smaller screens */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px]">
          {/* Header row: Step numbers & beat markers */}
          <div className="grid grid-cols-[160px_repeat(auto-fill,minmax(26px,1fr))] items-center gap-1.5 mb-2 px-1 text-[11px] font-mono text-gray-400">
            <div className="font-semibold uppercase tracking-wider text-gray-400">Instrument</div>
            <div className="col-span-1 grid grid-flow-col auto-cols-fr gap-1.5">
              {Array.from({ length: totalSteps }).map((_, stepIdx) => {
                const beatIndex = Math.floor(stepIdx / stepsPerBeat) + 1;
                const isBeatStart = stepIdx % stepsPerBeat === 0;
                const isCurrentStep = isPlaying && currentStep === stepIdx;

                return (
                  <div
                    key={stepIdx}
                    className={`text-center py-1 rounded transition-colors ${
                      isCurrentStep
                        ? 'bg-amber-400 text-black font-extrabold shadow'
                        : isBeatStart
                        ? 'bg-gray-800 text-amber-400 font-bold border border-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {isBeatStart ? beatIndex : `.${(stepIdx % stepsPerBeat) + 1}`}
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

              return (
                <div
                  key={inst}
                  className={`grid grid-cols-[160px_repeat(auto-fill,minmax(26px,1fr))] items-center gap-1.5 p-1 rounded-xl transition-colors ${
                    isMuted
                      ? 'bg-[#15171b]/60 opacity-50'
                      : 'bg-[#22252c] hover:bg-[#272b33]'
                  }`}
                >
                  {/* Left Label & Solo/Mute Controls */}
                  <div className="flex items-center justify-between pr-2">
                    <button
                      onClick={() => onTriggerInstrument(inst)}
                      className="flex items-center space-x-1.5 text-left text-xs font-bold text-gray-200 hover:text-amber-400 truncate active:scale-95 transition-transform"
                      title="Kliknij aby zagrać dźwięk (Drum Pad)"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: meta.color }}
                      />
                      <span className="truncate">{meta.shortName} - {meta.name.split('(')[0]}</span>
                    </button>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => onToggleMute(inst)}
                        className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-colors ${
                          isMuted
                            ? 'bg-red-500 text-white font-extrabold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                        title={isMuted ? 'Wyciszony (Kliknij by odciszyć)' : 'Wycisz ten instrument'}
                      >
                        M
                      </button>
                      <button
                        onClick={() => onToggleSolo(inst)}
                        className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-colors ${
                          isSolo
                            ? 'bg-amber-400 text-black font-extrabold'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                        title={isSolo ? 'Tryb Solo aktywny' : 'Graj tylko ten instrument (Solo)'}
                      >
                        S
                      </button>
                    </div>
                  </div>

                  {/* Right: Step Grid Cells */}
                  <div className="col-span-1 grid grid-flow-col auto-cols-fr gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, stepIdx) => {
                      const stepHits = pattern.steps[stepIdx] || [];
                      const hit = stepHits.find((h) => h.instrument === inst);
                      const isStepHit = Boolean(hit);
                      const isCurrentPlayhead = isPlaying && currentStep === stepIdx;
                      const isBeatStart = stepIdx % stepsPerBeat === 0;

                      return (
                        <div
                          key={stepIdx}
                          onClick={() => onTriggerInstrument(inst)}
                          className={`h-7 rounded flex items-center justify-center cursor-pointer transition-all ${
                            isCurrentPlayhead
                              ? isStepHit
                                ? 'ring-2 ring-white scale-110 shadow-lg'
                                : 'ring-1 ring-amber-400/80 bg-amber-400/20'
                              : isBeatStart
                              ? 'border border-gray-700'
                              : 'border border-gray-800/60'
                          } ${
                            isStepHit
                              ? isMuted
                                ? 'bg-gray-600 opacity-40'
                                : ''
                              : 'bg-[#16181d] hover:bg-gray-800'
                          }`}
                          style={{
                            backgroundColor: isStepHit && !isMuted ? meta.color : undefined,
                            opacity: isStepHit && !isMuted ? Math.max(0.6, hit?.velocity || 0.8) : undefined
                          }}
                          title={`Krok ${stepIdx + 1} - ${isStepHit ? `Aktywne uderzenie (Dynamika: ${Math.round((hit?.velocity || 0.8) * 100)}%)` : 'Pusty krok'}`}
                        >
                          {isStepHit && (
                            <div className="w-2 h-2 rounded-full bg-white/90 shadow-sm" />
                          )}
                        </div>
                      );
                    })}
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
