import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldBoundaryJs = `    function buildInterfaceLayerControls() {
        boundarySelect.innerHTML = '<option value="">-- Choose Perimeter Boundary Layer --</option>';

        let allLayersSet = new Set([
            ...Object.keys(PIPELINE.boundaries),
            ...Array.from(PIPELINE.layers),
            ...Object.keys(PIPELINE.points)
        ]);

        let sortedLayers = Array.from(allLayersSet).sort();

        sortedLayers.forEach(lyr => {
            if (!lyr) return;
            let opt = document.createElement('option');
            opt.value = lyr;
            let bPts = PIPELINE.boundaries[lyr] ? PIPELINE.boundaries[lyr].length : 0;
            let pPts = PIPELINE.points[lyr] ? PIPELINE.points[lyr].length : 0;
            let desc = bPts >= 3 ? \`\${bPts} polyline nodes\` : (pPts > 0 ? \`\${pPts} survey pts\` : \`CAD Layer\`);
            opt.innerText = \`\${lyr} (\${desc})\`;
            boundarySelect.appendChild(opt);
        });

        boundarySelect.disabled = false;

        let defaultBound = sortedLayers.find(l => {
            let u = l.toUpperCase();
            return u.includes('BOUND') || u.includes('PERIMETER') || u.includes('SITE') || u.includes('LIMIT') || u.includes('OUTLINE') || u.includes('PROP');
        }) || (sortedLayers.length > 0 ? sortedLayers[0] : '');

        if (defaultBound) {
            boundarySelect.value = defaultBound;
            PIPELINE.activeBoundsLayer = defaultBound;
            if (!PIPELINE.boundaries[defaultBound] || PIPELINE.boundaries[defaultBound].length < 3) {
                PIPELINE.boundaries[defaultBound] = deriveBoundaryPolylineForLayer(defaultBound);
            }
            PIPELINE.polygonBounds = PIPELINE.boundaries[defaultBound];
        }`;

const newBoundaryJs = `    function buildInterfaceLayerControls() {
        const boundaryBtn = document.getElementById('boundaryLayerSelectBtn');
        const boundaryText = document.getElementById('boundaryLayerSelectText');
        const boundaryOptionsContainer = document.getElementById('boundaryOptionsContainer');
        
        boundaryOptionsContainer.innerHTML = '<li><a class="dropdown-item text-muted" href="#" data-value="">-- Choose Perimeter Boundary Layer --</a></li>';

        let allLayersSet = new Set([
            ...Object.keys(PIPELINE.boundaries),
            ...Array.from(PIPELINE.layers),
            ...Object.keys(PIPELINE.points)
        ]);

        let sortedLayers = Array.from(allLayersSet).sort();

        sortedLayers.forEach(lyr => {
            if (!lyr) return;
            let bPts = PIPELINE.boundaries[lyr] ? PIPELINE.boundaries[lyr].length : 0;
            let pPts = PIPELINE.points[lyr] ? PIPELINE.points[lyr].length : 0;
            let desc = bPts >= 3 ? \`\${bPts} polyline nodes\` : (pPts > 0 ? \`\${pPts} survey pts\` : \`CAD Layer\`);
            
            let li = document.createElement('li');
            li.innerHTML = \`<a class="dropdown-item boundary-opt" href="#" data-value="\${lyr}">\${lyr} (\${desc})</a>\`;
            boundaryOptionsContainer.appendChild(li);
        });

        boundaryBtn.disabled = false;

        let defaultBound = sortedLayers.find(l => {
            let u = l.toUpperCase();
            return u.includes('BOUND') || u.includes('PERIMETER') || u.includes('SITE') || u.includes('LIMIT') || u.includes('OUTLINE') || u.includes('PROP');
        }) || (sortedLayers.length > 0 ? sortedLayers[0] : '');

        if (defaultBound) {
            boundaryText.innerText = defaultBound;
            PIPELINE.activeBoundsLayer = defaultBound;
            if (!PIPELINE.boundaries[defaultBound] || PIPELINE.boundaries[defaultBound].length < 3) {
                PIPELINE.boundaries[defaultBound] = deriveBoundaryPolylineForLayer(defaultBound);
            }
            PIPELINE.polygonBounds = PIPELINE.boundaries[defaultBound];
        }`;

html = html.replace(oldBoundaryJs, newBoundaryJs);
fs.writeFileSync('index.html', html);
