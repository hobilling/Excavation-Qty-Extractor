import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<div class="card mb-3">', '<div class="card mb-3" style="z-index: 1050; position: relative;">');

fs.writeFileSync('index.html', html);
