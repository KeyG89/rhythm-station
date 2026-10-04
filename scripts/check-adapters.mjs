import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { inspectGroove, listGrooves } from '../.runtime/groove-api.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const controls = { complexity: 3, ghostNotes: 3, kickDensity: 3, hihatDensity: 3, swing: 70, humanize: 12 };
const client = new Client({ name: 'groove-lab-diagnostic', version: '2.0.0' });
const transport = new StdioClientTransport({ command: process.execPath, args: [path.join(root, 'scripts/groove-mcp.mjs')], cwd: root });
await client.connect(transport);
try {
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map(t => t.name), ['list_grooves', 'inspect_groove']);
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
  const invalid = await client.callTool({ name: 'inspect_groove', arguments: { id: '99' } });
  assert.equal(invalid.isError, true);
  console.log('CLI and real MCP stdio transport match the shared domain for all 12 grooves.');
} finally { await client.close(); }
