import { useState } from 'react';
import { useDrumEngine } from './hooks/useDrumEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { RetroDisplay } from './components/RetroDisplay';
import { TransportBar } from './components/TransportBar';
import { DrumMatrix } from './components/DrumMatrix';
import { DrumTablature } from './components/DrumTablature';
import { DrumKitStudio } from './components/DrumKitStudio';
import { DrumMixer } from './components/DrumMixer';
import { SpeedTrainer } from './components/SpeedTrainer';
import { StyleBrowser } from './components/StyleBrowser';
import { PracticeCoach } from './components/PracticeCoach';
import { AudioExporter } from './components/AudioExporter';
import { KeyboardHelpModal } from './components/KeyboardHelpModal';
import { Sliders, Music, Zap, GraduationCap, Keyboard, Disc, BookOpen, Drum } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'tablature' | 'kit' | 'styles' | 'mixer' | 'trainer' | 'coach' | 'export'>('styles');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const engine = useDrumEngine();

  // Bind keyboard shortcuts
  useKeyboardShortcuts({
    togglePlay: engine.togglePlay,
    triggerSection: engine.triggerSection,
    currentSection: engine.currentSection,
    tapTempo: engine.tapTempo,
    toggleMetronome: engine.toggleMetronome,
    setBpm: engine.setBpm,
    bpm: engine.bpm,
    startWithCountIn: (bars) => engine.start(bars),
    stop: engine.stop
  });

  return (
    <div className="min-h-screen bg-[#111317] text-gray-100 pb-16 font-sans">
      {/* Top Navbar */}
      <header className="border-b border-gray-800 bg-[#16181e]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-orange-500/20">
              Y
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center space-x-2">
                <span>YAMAHA PSR-220 / PSR-230</span>
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                  100 RHYTHMS DRUM SIMULATOR
                </span>
              </h1>
              <p className="text-[11px] text-gray-400">
                Wirtualna stacja rytmów perkusyjnych do nauki gry i ćwiczeń timingowych
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 border border-gray-700 flex items-center space-x-1.5 transition-colors shadow"
              title="Zobacz skróty klawiszowe"
            >
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Skróty Klawiszowe</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className={`${activeTab === 'matrix' ? 'max-w-[98%] px-2 sm:px-4' : 'max-w-7xl px-4 sm:px-6'} mx-auto pt-6 space-y-6 transition-all`}>
        {/* Top: Authentic Retro Yamaha LCD Display */}
        <RetroDisplay
          currentStyle={engine.currentStyle}
          currentSection={engine.currentSection}
          nextSection={engine.nextSection}
          bpm={engine.bpm}
          isPlaying={engine.isPlaying}
          currentStep={engine.currentStep}
          currentBar={engine.currentBar}
          totalBars={engine.totalBars}
          activeHits={engine.activeHits}
          countInActive={engine.countInActive}
          countInBeat={engine.countInBeat}
          metronomeEnabled={engine.metronomeEnabled}
          speedTrainerEnabled={engine.speedTrainer.enabled}
          isRecording={engine.isRecording}
        />

        {/* Transport & Playback Control Bar */}
        <TransportBar
          isPlaying={engine.isPlaying}
          currentSection={engine.currentSection}
          nextSection={engine.nextSection}
          activeFillType={engine.activeFillType}
          currentStyle={engine.currentStyle}
          bpm={engine.bpm}
          metronomeEnabled={engine.metronomeEnabled}
          onTogglePlay={engine.togglePlay}
          onStartWithCountIn={(bars) => engine.start(bars)}
          onTriggerSection={engine.triggerSection}
          onSetBpm={engine.setBpm}
          onTapTempo={engine.tapTempo}
          onToggleMetronome={engine.toggleMetronome}
        />

        {/* Navigation Tabs for Workstation Modules */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-gray-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('styles')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'styles'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Katalog 100 Rytmów (00-99)</span>
          </button>

          <button
            onClick={() => setActiveTab('tablature')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'tablature'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300 border border-amber-500/30 text-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tabulatura & Zapis</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'matrix'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Siatka Rytmu (100% Szerokości)</span>
          </button>

          <button
            onClick={() => setActiveTab('kit')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'kit'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300 border border-emerald-500/30 text-emerald-300'
            }`}
          >
            <Drum className="w-4 h-4" />
            <span>Zestaw & Presety Brzmień</span>
          </button>

          <button
            onClick={() => setActiveTab('mixer')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'mixer'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Mikser & Solo / Mute</span>
          </button>

          <button
            onClick={() => setActiveTab('trainer')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'trainer'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Speed Trainer</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'coach'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Trener Perkusyjny</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'export'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-[#1a1c22] hover:bg-[#252830] text-gray-300'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>Eksport Audio</span>
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'styles' && (
          <div className="space-y-6">
            <StyleBrowser
              currentStyle={engine.currentStyle}
              onSelectStyle={engine.selectStyle}
            />
            <PracticeCoach
              currentStyle={engine.currentStyle}
              onApplyPreset={engine.applyMixerPreset}
            />
          </div>
        )}

        {activeTab === 'tablature' && (
          <DrumTablature
            currentStyle={engine.currentStyle}
            currentSection={engine.currentSection}
            currentStep={engine.currentStep}
            isPlaying={engine.isPlaying}
            onSelectSection={(sec) => engine.triggerSection(sec, true)}
            onTriggerInstrument={engine.triggerInstrument}
          />
        )}

        {activeTab === 'matrix' && (
          <div className="w-full">
            <DrumMatrix
              currentStyle={engine.currentStyle}
              currentSection={engine.currentSection}
              currentStep={engine.currentStep}
              isPlaying={engine.isPlaying}
              mixerState={engine.mixerState}
              onTriggerInstrument={engine.triggerInstrument}
              onToggleMute={engine.toggleChannelMute}
              onToggleSolo={engine.toggleChannelSolo}
            />
          </div>
        )}

        {activeTab === 'kit' && (
          <DrumKitStudio
            soundParams={engine.soundParams}
            currentPreset={engine.currentKitPreset}
            onSoundParamChange={engine.setSoundParam}
            onApplyPreset={engine.applyKitPreset}
            onSaveCustomPreset={engine.saveCustomPreset}
            onDeleteCustomPreset={engine.deleteCustomPreset}
            customPresets={engine.customKitPresets}
            onTriggerInstrument={engine.triggerInstrument}
          />
        )}

        {activeTab === 'mixer' && (
          <DrumMixer
            mixerState={engine.mixerState}
            masterVolume={engine.masterVolume}
            onSetVolume={engine.setChannelVolume}
            onSetPan={engine.setChannelPan}
            onToggleMute={engine.toggleChannelMute}
            onToggleSolo={engine.toggleChannelSolo}
            onApplyPreset={engine.applyMixerPreset}
            onSetMasterVolume={engine.setMasterVolume}
          />
        )}

        {activeTab === 'trainer' && (
          <SpeedTrainer
            config={engine.speedTrainer}
            currentBpm={engine.bpm}
            totalBars={engine.totalBars}
            isPlaying={engine.isPlaying}
            onUpdateConfig={engine.setSpeedTrainer}
          />
        )}

        {activeTab === 'coach' && (
          <PracticeCoach
            currentStyle={engine.currentStyle}
            onApplyPreset={engine.applyMixerPreset}
          />
        )}

        {activeTab === 'export' && (
          <AudioExporter
            isRecording={engine.isRecording}
            recordedAudioUrl={engine.recordedAudioUrl}
            currentStyleName={engine.currentStyle.name}
            onStartRecording={engine.startRecording}
            onStopRecording={engine.stopRecording}
          />
        )}
      </main>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
