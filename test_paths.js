import fs from 'fs';
const indexJs = fs.readdirSync('dist/assets').find(f => f.endsWith('.js') && f.startsWith('index'));
const content = fs.readFileSync(`dist/assets/${indexJs}`, 'utf8');

// Look for .wasm references in the bundled JS
const wasmMixes = content.match(/\/[a-zA-Z0-9_\-\.]+\.wasm/g);
console.log("Wasm references found in bundle:");
console.log(wasmMixes);
