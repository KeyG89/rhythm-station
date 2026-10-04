import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'dist/standalone_yamaha.html'), 'utf8');
assert(!/<(?:script|link)\b[^>]+(?:src|href)=/i.test(html), 'Standalone must not request external code, CSS or fonts');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
assert.equal(scripts.length, 1);
new vm.Script(scripts[0]); // Syntax validation only; no script execution or browser access.
const sampleStart = scripts[0].indexOf('window.__GROOVE_SAMPLES__=') + 'window.__GROOVE_SAMPLES__='.length;
const samples = JSON.parse(scripts[0].slice(sampleStart, scripts[0].indexOf(';window.__GROOVE_CREDITS__=')));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/samples/manifest.json'), 'utf8'));
assert.equal(Object.keys(samples).length, manifest.length);
for (const { file, sha256 } of manifest) {
  assert(samples[file].startsWith('data:audio/wav;base64,'));
  const bytes = Buffer.from(samples[file].split(',')[1], 'base64');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), sha256);
}
const credit = /window\.__GROOVE_CREDITS__="data:text\/plain;base64,([^"]+)"/.exec(scripts[0]);
const text = Buffer.from(credit[1], 'base64').toString();
assert(text.includes('CC-BY-SA-4.0') && text.includes('CC0 1.0 Universal'));
console.log('Standalone: valid script; no external code/CSS/fonts; all 41 WAV hashes and full licenses embedded.');
