import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldClear = `        boundarySelect.innerHTML = '<option value="">-- Awaiting Drawing Upload --</option>';
        boundarySelect.disabled = true;`;

const newClear = `        document.getElementById('boundaryOptionsContainer').innerHTML = '';
        document.getElementById('boundaryLayerSelectText').innerText = '-- Awaiting Drawing Upload --';
        document.getElementById('boundaryLayerSelectBtn').disabled = true;`;

html = html.replace(oldClear, newClear);
html = html.replace("const boundarySelect = document.getElementById('boundaryLayerSelect');", "");
fs.writeFileSync('index.html', html);
