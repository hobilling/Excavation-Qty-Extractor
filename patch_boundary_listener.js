import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldListener = `    boundarySelect.addEventListener('change', function() {
        PIPELINE.activeBoundsLayer = this.value;
        if (this.value) {
            if (!PIPELINE.boundaries[this.value] || PIPELINE.boundaries[this.value].length < 3) {
                PIPELINE.boundaries[this.value] = deriveBoundaryPolylineForLayer(this.value);
            }
            PIPELINE.polygonBounds = PIPELINE.boundaries[this.value];
            syncMappingCombinationsDropdowns();
            if (typeof CANVAS_ENGINE !== 'undefined') CANVAS_ENGINE.fitView();
        }
        resetRightOutput("Active boundary layer changed. Click 'Compute Mathematical Intersections' to re-calculate.");
    });`;

const newListener = `    document.getElementById('boundaryOptionsContainer')?.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const val = e.target.getAttribute('data-value');
            const txt = e.target.innerText;
            document.getElementById('boundaryLayerSelectText').innerText = val ? txt : '-- Choose Perimeter Boundary Layer --';
            
            PIPELINE.activeBoundsLayer = val;
            if (val) {
                if (!PIPELINE.boundaries[val] || PIPELINE.boundaries[val].length < 3) {
                    PIPELINE.boundaries[val] = deriveBoundaryPolylineForLayer(val);
                }
                PIPELINE.polygonBounds = PIPELINE.boundaries[val];
                syncMappingCombinationsDropdowns();
                if (typeof CANVAS_ENGINE !== 'undefined') CANVAS_ENGINE.fitView();
            } else {
                PIPELINE.polygonBounds = [];
                syncMappingCombinationsDropdowns();
            }
            resetRightOutput("Active boundary layer changed. Click 'Compute Mathematical Intersections' to re-calculate.");
        }
    });

    document.getElementById('boundarySearchInput')?.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const items = document.querySelectorAll('#boundaryOptionsContainer li');
        items.forEach(li => {
            const txt = li.innerText.toLowerCase();
            if (txt.includes(term) || !term) {
                li.style.display = 'block';
            } else {
                li.style.display = 'none';
            }
        });
    });`;

html = html.replace(oldListener, newListener);
fs.writeFileSync('index.html', html);
