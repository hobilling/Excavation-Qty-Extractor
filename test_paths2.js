import fs from 'fs';
const indexJs = fs.readdirSync('dist/assets').find(f => f.endsWith('.js') && f.startsWith('index'));
const content = fs.readFileSync(`dist/assets/${indexJs}`, 'utf8');

const matches = content.match(/[^"'\s]*\.wasm/g);
console.log(matches);
