import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
data = json.loads((root / 'feature-parity.json').read_text())
assert data['features'], 'Empty feature registry'
for feature in data['features']:
 for surface in ['domain', 'gui', 'cli', 'mcp', 'tests', 'documentation']:
  assert feature.get(surface), f"{feature['id']}: missing {surface} evidence"
  for path in feature[surface]: assert (root / path).is_file(), f"{feature['id']}: missing file {path}"
 assert feature['status'] == 'complete'
print(f"Feature parity evidence verified for {len(data['features'])} shared v2 features.")
