import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<div class="card mb-3" id="mappingCard" style="display:none;">', '<div class="card mb-3" id="mappingCard" style="display:none; position:relative; z-index:1040;">');
html = html.replace('<div class="card mb-3" id="combinationsCard" style="display:none;">', '<div class="card mb-3" id="combinationsCard" style="display:none; position:relative; z-index:1030;">');

fs.writeFileSync('index.html', html);
