import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { inspectGroove, listGrooves, inspectDraft, listSongMaps, inspectSongMap, cycleCell, inspectPracticePlan, compareDrafts } from '../.runtime/groove-api.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const controls = { flams:2, drags:2, triplets:2, complexity: 3, ghostNotes: 3, kickDensity: 3, hihatDensity: 3, swing: 70, humanize: 12 };
const client = new Client({ name: 'groove-lab-diagnostic', version: '2.0.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [path.join(root, 'scripts/groove-mcp.mjs')], cwd: root });
await client.connect(transport);
try {
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map(t => t.name), ['list_grooves', 'inspect_groove', 'inspect_draft', 'list_song_maps', 'inspect_song_map', 'cycle_cell', 'inspect_practice_plan', 'compare_practice_drafts']);
  const listed = await client.callTool({ name: 'list_grooves', arguments: {} });
  assert.deepEqual(JSON.parse(listed.content[0].text), listGrooves());
  for (const { id } of listGrooves()) {
    const expected = JSON.parse(JSON.stringify(inspectGroove(id, controls, 90)));
    const cli = JSON.parse(execFileSync(process.execPath, [path.join(root, 'scripts/groove-cli.mjs'), 'inspect', id, JSON.stringify(controls), '90'], { encoding: 'utf8' }));
    const mcp = await client.callTool({ name: 'inspect_groove', arguments: { id, controls, bpm: 90 } });
    assert.deepEqual(cli, expected);
    assert.deepEqual(JSON.parse(mcp.content[0].text), expected);
    assert(expected.events.every(event => event.sample?.file));
  }
  const options = { reggaeVariant: 'two-four', replacements: { clave: 'ride_bell' }, edits: [{ section: 'mainA', step: 1, instrument: 'tom_high', velocity: 0.22, rudiment:'drag' }, { section: 'mainA', step: 4, instrument: 'kick', velocity: null }] };
  const settings = { ...controls, rideDensity: 3, tomDensity: 2, floorDensity: 2 };
  const mix = { kick: { pitch: -2, volume: 0.75, decay: 0.6, brightness: 8000 } };
  const expected = JSON.parse(JSON.stringify(inspectGroove('05', settings, 80, options, mix)));
  const cli = JSON.parse(execFileSync(process.execPath, [path.join(root, 'scripts/groove-cli.mjs'), 'inspect', '05', JSON.stringify(settings), '80', JSON.stringify(options), JSON.stringify(mix)], { encoding: 'utf8' }));
  const mcp = await client.callTool({ name: 'inspect_groove', arguments: { id: '05', controls: settings, bpm: 80, options, mix } });
  assert.deepEqual(cli, expected); assert.deepEqual(JSON.parse(mcp.content[0].text), expected);
  const draft = { version: 1, id: '05', controls: settings, bpm: 80, options, mix };
  const draftExpected = JSON.parse(JSON.stringify(inspectDraft(draft)));
  const draftCli = JSON.parse(execFileSync(process.execPath, [path.join(root, 'scripts/groove-cli.mjs'), 'draft', JSON.stringify(draft)], { encoding: 'utf8' }));
  const draftMcp = await client.callTool({ name: 'inspect_draft', arguments: { draft } });
  assert.deepEqual(draftCli, draftExpected); assert.deepEqual(JSON.parse(draftMcp.content[0].text), draftExpected);
  const songList = await client.callTool({name:'list_song_maps',arguments:{grooveId:'01'}});
  const songCliList=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/groove-cli.mjs'),'songs','01'],{encoding:'utf8'}));
  assert.deepEqual(JSON.parse(songList.content[0].text),listSongMaps('01')); assert.deepEqual(songCliList,listSongMaps('01'));
  for(const song of listSongMaps()) {
    const expected=JSON.parse(JSON.stringify(inspectSongMap(song.id,{complexity:4,drags:1,triplets:1})));
    const cli=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/groove-cli.mjs'),'song',song.id,JSON.stringify({complexity:4,drags:1,triplets:1})],{encoding:'utf8'}));
    const mcp=await client.callTool({name:'inspect_song_map',arguments:{id:song.id,controls:{complexity:4,drags:1,triplets:1}}});
    assert.deepEqual(cli,expected); assert.deepEqual(JSON.parse(mcp.content[0].text),expected);
  }
  const cell={section:'mainA',step:0,instrument:'snare'};
  for(let clickCount=1;clickCount<=5;clickCount++) {
    const expected=cycleCell(cell,undefined,.65,clickCount);
    const mcp=await client.callTool({name:'cycle_cell',arguments:{cell,clickCount}});
    const cli=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/groove-cli.mjs'),'cell',JSON.stringify(cell),'{}',String(clickCount)],{encoding:'utf8'}));
    assert.deepEqual(JSON.parse(mcp.content[0].text),expected); assert.deepEqual(cli,expected);
  }
  const songDraft={version:1,id:'11',options:{songPresetId:'11-4',edits:[{section:'mainA',step:3,instrument:'tom_low',velocity:.7,rudiment:'triplet',tripletSpan:4}]}};
  const songExpected=JSON.parse(JSON.stringify(inspectDraft(songDraft)));
  assert.deepEqual(JSON.parse((await client.callTool({name:'inspect_draft',arguments:{draft:songDraft}})).content[0].text),songExpected);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/groove-cli.mjs'),'draft',JSON.stringify(songDraft)],{encoding:'utf8'})),songExpected);
  const plan={config:{enabled:true,gap:true,ladder:true,audiblePhrases:1,silentPhrases:2,phrasesPerLevel:2,targetLevel:4},start:1,max:7,phrases:12};
  const planned=inspectPracticePlan(plan.config,plan.start,plan.max,plan.phrases);
  assert.deepEqual(JSON.parse((await client.callTool({name:'inspect_practice_plan',arguments:plan})).content[0].text),planned);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/groove-cli.mjs'),'lab',JSON.stringify(plan)],{encoding:'utf8'})),planned);
  const a={version:1,id:'14',options:{secondTom:true,songPresetId:'14-1'},controls:{complexity:0},mix:{tom_mid:{pitch:-1}}};
  const b={...a,controls:{complexity:4}};
  const compared=compareDrafts(a,b);
  assert.deepEqual(JSON.parse((await client.callTool({name:'compare_practice_drafts',arguments:{a,b}})).content[0].text),compared);
  assert.deepEqual(JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/groove-cli.mjs'),'compare',JSON.stringify(a),JSON.stringify(b)],{encoding:'utf8'})),compared);
  const tomExpected=JSON.parse(JSON.stringify(inspectGroove('14',{midTomDensity:3},120,{secondTom:true})));
  assert.deepEqual(JSON.parse((await client.callTool({name:'inspect_groove',arguments:{id:'14',controls:{midTomDensity:3},bpm:120,options:{secondTom:true}}})).content[0].text),tomExpected);
  const invalid = await client.callTool({ name: 'inspect_groove', arguments: { id: '99' } });
  assert.equal(invalid.isError, true);
  console.log('CLI and real MCP stdio transport match the shared domain for all 15 grooves, 75 song maps, five-state cell transitions, timed rudiments, personal-kit mapping and tuned local drafts.');
} finally { await client.close(); }
