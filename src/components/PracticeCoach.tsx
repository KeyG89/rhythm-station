import React from 'react';
import { RhythmStyle } from '../types/rhythm';
import { GraduationCap, Footprints, Hand, Sparkles, CheckSquare, Target, Lightbulb } from 'lucide-react';

interface PracticeCoachProps {
  currentStyle: RhythmStyle;
  onApplyPreset: (preset: 'all' | 'mute_kick' | 'mute_snare' | 'mute_hihat' | 'cymbals_only' | 'kick_snare_only') => void;
}

export const PracticeCoach: React.FC<PracticeCoachProps> = ({
  currentStyle,
  onApplyPreset
}) => {
  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-gray-800">
        <GraduationCap className="w-6 h-6 text-amber-400" />
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-100">
            DRUM PRACTICE COACH (TRENER PERKUSYJNY)
          </h2>
          <p className="text-xs text-gray-400">
            Praktyczny przewodnik edukacyjny do nauki rytmu: <b className="text-amber-400">{currentStyle.name}</b>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: What is happening in the groove */}
        <div className="bg-[#15171b] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>Analiza Rytmiczna</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-mono mb-3 bg-[#1e2127] p-2.5 rounded-lg border border-gray-800">
              {currentStyle.drumPatternDescription}
            </p>
          </div>

          <div className="pt-2 border-t border-gray-800/80 text-[11px] text-gray-400">
            Metrum: <b className="text-gray-200">{currentStyle.timeSignature[0]}/{currentStyle.timeSignature[1]}</b> | Domyślne tempo: <b className="text-gray-200">{currentStyle.defaultBpm} BPM</b>
          </div>
        </div>

        {/* Center Column: Practice Focus & Limbs Coordination */}
        <div className="bg-[#15171b] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase mb-2">
              <Target className="w-4 h-4" />
              <span>Cel Treningowy (Co ćwiczyć)</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              {currentStyle.practiceFocus}
            </p>
          </div>

          <div className="bg-[#1e2127] p-2 rounded-lg text-[11px] text-gray-300 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-300">
              <Hand className="w-3.5 h-3.5" />
              <span>Ręce: Naprzemienna kontrola dynamiki i akcentu</span>
            </div>
            <div className="flex items-center space-x-1.5 text-orange-300">
              <Footprints className="w-3.5 h-3.5" />
              <span>Nogi: Niezależność stopy od stałego pulsu</span>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-step Learning Plan */}
        <div className="bg-[#15171b] p-4 rounded-xl border border-gray-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase mb-2">
            <CheckSquare className="w-4 h-4" />
            <span>3 Kroki do Opanowania</span>
          </div>

          <div className="space-y-2 text-xs text-gray-300">
            {/* Step 1 */}
            <div className="flex items-start space-x-2 bg-[#1e2127] p-2 rounded-lg">
              <span className="font-bold text-amber-400">1.</span>
              <div>
                <p className="font-semibold text-gray-200">Wycisz stopę:</p>
                <button
                  onClick={() => onApplyPreset('mute_kick')}
                  className="mt-1 text-[10px] bg-red-900/60 hover:bg-red-800 text-red-200 px-2 py-0.5 rounded transition-colors"
                >
                  Włącz tryb &quot;Mute Kick&quot; & graj nogą
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-2 bg-[#1e2127] p-2 rounded-lg">
              <span className="font-bold text-amber-400">2.</span>
              <div>
                <p className="font-semibold text-gray-200">Wycisz werbel:</p>
                <button
                  onClick={() => onApplyPreset('mute_snare')}
                  className="mt-1 text-[10px] bg-orange-900/60 hover:bg-orange-800 text-orange-200 px-2 py-0.5 rounded transition-colors"
                >
                  Włącz tryb &quot;Mute Snare&quot; & ćwicz backbeat
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-2 bg-[#1e2127] p-2 rounded-lg">
              <span className="font-bold text-amber-400">3.</span>
              <div>
                <p className="font-semibold text-gray-200">Graj przejścia:</p>
                <p className="text-[11px] text-gray-400">Wciskaj klawisz <b className="text-gray-200 font-mono">F</b> pod koniec 4. taktu na fill-in.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
