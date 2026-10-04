import { listGrooves, inspectGroove } from '../.runtime/groove-api.mjs';
const [command = 'list', id, json = '{}', bpm] = process.argv.slice(2);
try {
  if (!['list', 'inspect'].includes(command)) throw new Error('Usage: npm run cli -- list | inspect <00..11> [controls JSON] [BPM]');
  const result = command === 'list' ? listGrooves() : inspectGroove(id, JSON.parse(json), bpm === undefined ? undefined : Number(bpm));
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch (error) { console.error(error.message); process.exitCode = 1; }
