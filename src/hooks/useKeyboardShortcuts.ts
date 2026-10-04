import { useEffect } from 'react';
import { RhythmSection } from '../types/rhythm';

interface KeyboardShortcutsProps {
  togglePlay: () => void;
  triggerSection: (section: RhythmSection, immediate?: boolean) => void;
  currentSection: RhythmSection;
  tapTempo: () => void;
  toggleMetronome: () => void;
  setBpm: (bpm: number) => void;
  bpm: number;
  startWithCountIn: (bars: number) => void;
  stop: () => void;
}

export function useKeyboardShortcuts({
  togglePlay,
  triggerSection,
  currentSection,
  tapTempo,
  toggleMetronome,
  setBpm,
  bpm,
  startWithCountIn,
  stop
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing inside an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLButtonElement && [' ', 'enter'].includes(e.key.toLowerCase()))
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;

        case 'f':
          e.preventDefault();
          // Trigger corresponding fill
          triggerSection(currentSection === 'mainB' ? 'fillB' : 'fillA');
          break;

        case 'v':
          e.preventDefault();
          // Switch between Main A and Main B
          triggerSection(currentSection === 'mainA' ? 'mainB' : 'mainA');
          break;

        case 't':
          e.preventDefault();
          tapTempo();
          break;

        case 'm':
          e.preventDefault();
          toggleMetronome();
          break;

        case 'c':
          e.preventDefault();
          startWithCountIn(1);
          break;

        case 'escape':
          e.preventDefault();
          stop();
          break;

        case 'arrowup':
          e.preventDefault();
          setBpm(bpm + (e.shiftKey ? 5 : 1));
          break;

        case 'arrowdown':
          e.preventDefault();
          setBpm(bpm - (e.shiftKey ? 5 : 1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, triggerSection, currentSection, tapTempo, toggleMetronome, setBpm, bpm, startWithCountIn, stop]);
}
