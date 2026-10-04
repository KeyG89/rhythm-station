import { listGrooves, inspectGroove, inspectDraft, listSongMaps, inspectSongMap, cycleCell } from '../.runtime/groove-api.mjs';
const [command = 'list', id, json = '{}', bpm, options = '{}', mix = '{}'] = process.argv.slice(2);
try {
  if (!['list', 'inspect', 'draft', 'songs', 'song', 'cell'].includes(command)) throw new Error('Usage: npm run cli -- list | inspect <00..11> [controls JSON] [BPM] [options JSON] [mix JSON] | draft <draft JSON> | songs [00..11] | song <preset ID> [controls JSON] [BPM] [options JSON] | cell <cell JSON> [hit JSON] [click count]');
  const result = command === 'list' ? listGrooves() : command === 'songs' ? listSongMaps(id) : command === 'song' ? inspectSongMap(id,JSON.parse(json),bpm === undefined ? undefined : Number(bpm),JSON.parse(options)) : command === 'cell' ? cycleCell(JSON.parse(id),json === '{}' ? undefined : JSON.parse(json),.65,bpm === undefined ? undefined : Number(bpm)) : command === 'draft' ? inspectDraft(JSON.parse(id)) : inspectGroove(id, JSON.parse(json), bpm === undefined ? undefined : Number(bpm), JSON.parse(options), JSON.parse(mix));
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch (error) { console.error(error.message); process.exitCode = 1; }
