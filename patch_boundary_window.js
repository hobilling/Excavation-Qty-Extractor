import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('id="boundaryLayerSelectBtn" data-bs-toggle="dropdown"', 'id="boundaryLayerSelectBtn" data-bs-toggle="dropdown" data-bs-boundary="window"');
fs.writeFileSync('index.html', html);
