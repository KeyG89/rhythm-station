import { listGrooves, inspectGroove, inspectDraft, listSongMaps, inspectSongMap, cycleCell, inspectPracticePlan, compareDrafts } from '../.runtime/groove-api.mjs';
const [command = 'list', id, json = '{}', bpm, options = '{}', mix = '{}'] = process.argv.slice(2);
try {
  let result;
  switch(command) {
    case 'list': result=listGrooves(); break;
    case 'songs': result=listSongMaps(id); break;
    case 'song': result=inspectSongMap(id,JSON.parse(json),bpm === undefined ? undefined : Number(bpm),JSON.parse(options)); break;
    case 'inspect': result=inspectGroove(id,JSON.parse(json),bpm === undefined ? undefined : Number(bpm),JSON.parse(options),JSON.parse(mix)); break;
    case 'draft': result=inspectDraft(JSON.parse(id)); break;
    case 'cell': result=cycleCell(JSON.parse(id),json === '{}' ? undefined : JSON.parse(json),.65,bpm === undefined ? undefined : Number(bpm)); break;
    case 'lab': { const v=JSON.parse(id ?? '{}'); result=inspectPracticePlan(v.config,v.start,v.max,v.phrases); break; }
    case 'compare': result=compareDrafts(JSON.parse(id),JSON.parse(json)); break;
    default: throw new Error('Usage: list | inspect <00..14> [controls JSON] [BPM] [options JSON] [mix JSON] | draft <draft JSON> | songs [00..14] | song <preset ID> [controls JSON] [BPM] [options JSON] | cell <cell JSON> [hit JSON] [click count] | lab [plan JSON] | compare <A draft JSON> <B draft JSON>');
  }
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch (error) { console.error(error.message); process.exitCode = 1; }
