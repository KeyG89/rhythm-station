import { listGrooves, inspectGroove, inspectDraft } from '../.runtime/groove-api.mjs';
const [command = 'list', id, json = '{}', bpm, options = '{}', mix = '{}'] = process.argv.slice(2);
try {
  if (!['list', 'inspect', 'draft'].includes(command)) throw new Error('Usage: npm run cli -- list | inspect <00..11> [controls JSON] [BPM] [options JSON] [mix JSON] | draft <draft JSON>');
  const result = command === 'list' ? listGrooves() : command === 'draft' ? inspectDraft(JSON.parse(id)) : inspectGroove(id, JSON.parse(json), bpm === undefined ? undefined : Number(bpm), JSON.parse(options), JSON.parse(mix));
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch (error) { console.error(error.message); process.exitCode = 1; }
