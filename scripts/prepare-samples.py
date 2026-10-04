"""Rebuild the attributed browser sample subset from pinned upstream recordings."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import urllib.parse

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/samples'
DEST.mkdir(parents=True, exist_ok=True)
SONOR = 'https://raw.githubusercontent.com/sfzinstruments/SamsSonor/ef3e32058924ed1c3335e86d03094d3f310a9104/'
VSCO = 'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/440300901dfe9275fd84e0b7763af1f8443ae62e/'
# Each entry is a velocity layer (or alternating left/right recorded take).
SONOR_FILES = {
 'kick': ['KickSamples.flac', 'KickSamples#4.flac', 'KickSamples#7.flac'],
 'snare': ['SnareLeftHand.flac', 'SnareRightHand.flac', 'SnareLeftHand#4.flac', 'SnareRightHand#4.flac', 'SnareLeftHand#9.flac', 'SnareRightHand#9.flac'],
 'rimshot': ['SnareSamples#9.flac'],
 'hihat_closed': ['HHClosed#1.flac', 'HHClosed#3.flac', 'HHClosed#4.flac'],
 'hihat_open': ['HHOpenTip.flac', 'HHOpenTip#3.flac'],
 'hihat_pedal': ['HHPedal.flac', 'HHPedal#3.flac'],
 'tom_high': ['TomHigh.flac', 'TomHigh#4.flac'],
 'tom_mid': ['TomHigh.flac', 'TomHigh#4.flac'],
 'tom_low': ['TomLow.flac', 'TomLow#6.flac'],
 'crash': ['CrashTip.flac', 'CrashTip#3.flac'],
 'ride': ['Ride.flac', 'Ride#4.flac'],
 'ride_bell': ['RideBell.flac', 'RideBell#3.flac'],
}
VSCO_FILES = {
 'clave': ['Percussion/Claves1_Hit_v2_rr1_Sum.wav', 'Percussion/Claves1_Hit_v3_rr2_Sum.wav'],
 'cowbell': ['Percussion/Cowbell1_Hit_v2_rr1_Sum.wav', 'Percussion/Cowbell1_Hit_v4_rr2_Sum.wav'],
 'conga_high': ['Percussion/Conga-HitN_v1_rr2_Sum.wav', 'Percussion/Conga-HitN_v3_rr1_Sum.wav'],
 'conga_low': ['Percussion/Conga-HitN_v1_rr1_Sum.wav', 'Percussion/Conga-HitN_v2_rr2_Sum.wav'],
 'tambourine': ['VSCO 1 Percussion/varWood/tambourine_Down.wav', 'VSCO 1 Percussion/varWood/tambourine_up.wav'],
 'shaker': ["VSCO 1 Percussion/varWood/Camo's Shaker/shake1.wav", "VSCO 1 Percussion/varWood/Camo's Shaker/shake2.wav"],
}

def convert(task):
 inst, i, base, source = task
 url = base + urllib.parse.quote(source, safe='/')
 with tempfile.TemporaryDirectory() as folder:
  original = Path(folder) / ('source' + Path(source).suffix)
  subprocess.run(['curl', '-sSL', '--fail', '--retry', '2', '--max-time', '45', url, '-o', str(original)], check=True)
  output = DEST / f'{inst}-{i}.wav'
  subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(original), '-af', 'silenceremove=start_periods=1:start_duration=0.001:start_threshold=-55dB', '-t', '5', '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', str(output)], check=True)
 if output.stat().st_size < 1000: raise RuntimeError(f'Empty converted sample: {source}')
 return {**({'adaptation':'Recorded rack tom played three semitones lower for optional Tom 2; runtime rate 2**(-3/12).'} if inst == 'tom_mid' else {}), 'instrument': inst, 'layer': i, 'file': output.name, 'source': url, 'license': 'CC-BY-SA-4.0' if base == SONOR else 'CC0-1.0', 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()}

tasks = [(inst, i, base, ('Samples/' + source if base == SONOR else source)) for base, mapping in [(SONOR, SONOR_FILES), (VSCO, VSCO_FILES)] for inst, sources in mapping.items() for i, source in enumerate(sources)]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 records = list(pool.map(convert, tasks))
(DEST / 'manifest.json').write_text(json.dumps(records, indent=2) + '\n')
for base, name in [(SONOR, 'LICENSE-SamsSonor.txt'), (VSCO, 'LICENSE-VSCO.txt')]:
 subprocess.run(['curl', '-sSL', '--fail', base + 'LICENSE', '-o', str(DEST / name)], check=True)
print(f'Prepared {len(records)} recorded samples, {sum(p.stat().st_size for p in DEST.glob("*.wav"))/1024/1024:.1f} MiB')
