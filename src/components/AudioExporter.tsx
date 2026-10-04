import React from 'react';
import { Radio, Download, Disc } from 'lucide-react';

interface AudioExporterProps {
  isRecording: boolean;
  recordedAudioUrl: string | null;
  recordedAudioType?: string;
  currentStyleName: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const AudioExporter: React.FC<AudioExporterProps> = ({
  isRecording,
  recordedAudioUrl,
  recordedAudioType = 'audio/webm',
  currentStyleName,
  onStartRecording,
  onStopRecording
}) => {
  return (
    <div className="bg-[#1c1e24] border-2 border-[#2b2f38] rounded-lg p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-base font-medium text-gray-100 flex items-center space-x-2">
            <Disc className="w-5 h-5 text-red-400" />
            <span>Nagraj sesję</span>
          </h2>
          <p className="text-xs text-gray-400">
            Zapisz słyszalny podkład do pliku audio. Rejestrator nagrywa dźwięk aplikacji.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Record / Stop Button */}
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase flex items-center space-x-2 transition-all shadow ${
              isRecording
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-600/40 ring-2 ring-red-400'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
            }`}
          >
            <Radio className={`w-4 h-4 ${isRecording ? 'fill-white' : 'text-red-400'}`} />
            <span>{isRecording ? 'ZATRZYMAJ NAGRYWANIE' : 'NAGRAJ PĘTLĘ'}</span>
          </button>

          {/* Download Button */}
          {recordedAudioUrl && (
            <a
              href={recordedAudioUrl}
              download={`Yamaha_${currentStyleName.replace(/\s+/g, '_')}_Loop.${recordedAudioType.includes('mp4') ? 'm4a' : recordedAudioType.includes('ogg') ? 'ogg' : 'webm'}`}
              className="px-4 py-2 rounded-md text-xs font-bold uppercase bg-[#a1b4ff] hover:bg-[#b9c6ff] text-[#12182b] flex items-center space-x-2  transition-all"
            >
              <Download className="w-4 h-4" />
              <span>POBIERZ PLIK AUDIO</span>
            </a>
          )}
        </div>
      </div>
      {recordedAudioUrl && <audio className="mt-4 w-full" aria-label="Odsłuch nagranej sesji" controls src={recordedAudioUrl} />}
    </div>
  );
};
