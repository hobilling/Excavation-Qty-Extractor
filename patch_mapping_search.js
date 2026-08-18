import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const searchJs = `
    document.getElementById('layerMappingSearch')?.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('#layerMappingContainer .layer-item-card');
        cards.forEach(card => {
            const txt = card.querySelector('.layer-title-span')?.innerText.toLowerCase() || '';
            if (txt.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
`;

html = html.replace('function buildInterfaceLayerControls() {', searchJs + '\n    function buildInterfaceLayerControls() {');
fs.writeFileSync('index.html', html);
