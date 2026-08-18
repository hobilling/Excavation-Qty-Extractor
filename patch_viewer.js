import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<div class="card mb-4" id="viewerCard"', '<div class="card mb-4 flex-shrink-0" id="viewerCard"');
fs.writeFileSync('index.html', html);
