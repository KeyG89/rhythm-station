import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Spacja', desc: 'Start / Stop odtwarzania rytmu' },
    { key: 'F', desc: 'Wyzwolenie przejścia perkusyjnego (Fill-In A / B)' },
    { key: 'V', desc: 'Przełączenie wariacji (Main A ↔ Main B)' },
    { key: 'T', desc: 'Wstukanie tempa (Tap Tempo)' },
    { key: 'M', desc: 'Włączenie / Wyłączenie metronomu' },
    { key: 'C', desc: 'Start z 1-taktowym odliczaniem (Count-In)' },
    { key: '↑ / ↓', desc: 'Zwiększenie / Zmniejszenie tempa (+/- 1 BPM)' },
    { key: 'Shift + ↑ / ↓', desc: 'Szybka zmiana tempa (+/- 5 BPM)' },
    { key: 'Esc', desc: 'Natychmiastowe zatrzymanie odtwarzania' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1c1e24] border-2 border-gray-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-gray-800">
          <Keyboard className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-gray-100">
            Skróty Klawiszowe (Keyboard Shortcuts)
          </h2>
        </div>

        <div className="space-y-2.5 mb-6">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-[#14161a] border border-gray-800"
            >
              <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono font-bold text-amber-300 shadow">
                {sc.key}
              </kbd>
              <span className="text-xs text-gray-300 text-right">{sc.desc}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition-colors"
        >
          Rozumiem, zamknij pomoc
        </button>
      </div>
    </div>
  );
};
