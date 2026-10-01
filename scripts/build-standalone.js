import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find CSS file in assets
const assetsDir = path.join(distDir, 'assets');
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (cssFile && jsFile) {
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');

  // Replace <link rel="stylesheet" ...> with <style>...</style>
  html = html.replace(/<link rel="stylesheet"[^>]*>/i, `<style>\n${cssContent}\n</style>`);

  // Replace <script type="module"[^>]*><\/script> with <script>...</script>
  html = html.replace(/<script type="module"[^>]*><\/script>/i, `<script>\n${jsContent}\n</script>`);

  const standalonePath = path.join(distDir, 'standalone_yamaha.html');
  fs.writeFileSync(standalonePath, html, 'utf8');
  console.log(`Created standalone single-file HTML at: ${standalonePath} (${(html.length / 1024).toFixed(1)} KB)`);
} else {
  console.error('Could not find CSS or JS bundle in assets folder.');
}
