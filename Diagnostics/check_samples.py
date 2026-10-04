"""Verify the actual committed audio and its provenance, without third-party libraries."""
import hashlib
import json
from pathlib import Path
import struct
import wave
root = Path(__file__).resolve().parents[1]
folder = root / 'public/samples'
records = json.loads((folder / 'manifest.json').read_text())
assert len(records) == 41
assert {r['file'] for r in records} == {p.name for p in folder.glob('*.wav')}
for record in records:
 path = folder / record['file']
 assert hashlib.sha256(path.read_bytes()).hexdigest() == record['sha256'], path
 assert record['source'].startswith('https://raw.githubusercontent.com/'), path
 assert record['license'] in ['CC-BY-SA-4.0', 'CC0-1.0']
 with wave.open(str(path)) as wav:
  assert wav.getnchannels() == 1 and wav.getframerate() == 44100 and wav.getsampwidth() == 2, path
  assert wav.getnframes() > 500, f'Empty or truncated recording: {path}'
  samples = struct.unpack('<' + 'h' * wav.getnframes(), wav.readframes(wav.getnframes()))
  assert max(abs(s) for s in samples) > 100, f'Silent recording: {path}'
for name in ['CREDITS.md', 'LICENSE-SamsSonor.txt', 'LICENSE-VSCO.txt']:
 assert (folder / name).stat().st_size > 100
print('41 recorded WAV files: format, non-silent audio, hashes and attribution verified.')
