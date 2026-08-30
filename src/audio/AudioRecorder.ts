/**
 * Web Audio WAV Recorder & Exporter
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private destNode: MediaStreamAudioDestinationNode | null = null;

  constructor(private audioContext: AudioContext, private sourceNode: AudioNode) {}

  public startRecording() {
    if (this.isRecording) return;
    this.audioChunks = [];

    if (!this.destNode) {
      this.destNode = this.audioContext.createMediaStreamDestination();
      this.sourceNode.connect(this.destNode);
    }

    try {
      this.mediaRecorder = new MediaRecorder(this.destNode.stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      this.mediaRecorder.start(100);
      this.isRecording = true;
    } catch (e) {
      console.error('MediaRecorder not supported in this browser environment', e);
    }
  }

  public stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.isRecording || !this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
