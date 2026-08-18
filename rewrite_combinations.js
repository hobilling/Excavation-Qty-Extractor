import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('    function syncMappingCombinationsDropdowns() {');
const endIdx = html.indexOf('    function isInsideEdge(pt, p1, p2) {');

if (startIdx !== -1 && endIdx !== -1) {
    const newFunc = `    function syncMappingCombinationsDropdowns() {
        PIPELINE.roles = {};
        document.querySelectorAll('.mapping-select-node').forEach(sel => {
            if (sel.value !== 'SKIP') PIPELINE.roles[sel.value] = sel.getAttribute('data-layer');
        });

        if (typeof CANVAS_ENGINE !== 'undefined') {
            CANVAS_ENGINE.draw();
        }

        let rolesArr = Object.keys(PIPELINE.roles);
        rolesArr.sort((a, b) => {
            if (a === 'OGL') return -1;
            if (b === 'OGL') return 1;
            return a.localeCompare(b);
        });

        const container = document.getElementById('combinationsContainer');
        container.innerHTML = '';

        if (!PIPELINE.activeBoundsLayer) {
            document.getElementById('combinationsCard').style.display = 'none';
            return;
        }

        if (rolesArr.length < 2) {
            container.innerHTML = '<span class="text-danger small font-monospace">Please register at least two terrain baseline levels to run comparative sheets.</span>';
            document.getElementById('combinationsCard').style.display = 'block';
            processBtn.disabled = true;
            return;
        }

        let seqContainer = document.createElement('div');
        seqContainer.innerHTML = '<h6 class="small fw-bold text-primary mb-2">Sequential Stages</h6>';
        let nonSeqContainer = document.createElement('div');
        nonSeqContainer.innerHTML = '<h6 class="small fw-bold text-secondary mt-3 mb-2">Cumulative Stages</h6>';
        
        let nonSeqCount = 0;

        for (let i = 0; i < rolesArr.length; i++) {
            for (let j = i + 1; j < rolesArr.length; j++) {
                let key = \`\${rolesArr[i]}-\${rolesArr[j]}\`;
                let isSeq = (j === i + 1);

                let div = document.createElement('div');
                div.className = "form-check font-monospace small mb-1";
                div.innerHTML = \`
                    <input class="form-check-input combination-checker-box" type="checkbox" value="\${key}" id="cb_\${key}" \${isSeq ? 'checked' : ''}>
                    <label class="form-check-label" for="cb_\${key}">\${rolesArr[i]} ➔ \${rolesArr[j]}</label>
                \`;

                if (isSeq) {
                    seqContainer.appendChild(div);
                } else if (nonSeqCount < 3) {
                    nonSeqContainer.appendChild(div);
                    nonSeqCount++;
                }
            }
        }

        container.appendChild(seqContainer);
        container.appendChild(nonSeqContainer);

        // Add custom combo UI
        let customUi = document.createElement('div');
        customUi.className = "d-flex align-items-center gap-2 mt-3 p-2 bg-light border rounded flex-wrap";
        
        let opts = rolesArr.map(r => \`<option value="\${r}">\${r}</option>\`).join('');
        customUi.innerHTML = \`
            <span class="small fw-semibold me-2">+ Add Option:</span>
            <select id="customComboFrom" class="form-select form-select-sm" style="width: auto;">\${opts}</select>
            <span class="small text-muted fw-bold">➔</span>
            <select id="customComboTo" class="form-select form-select-sm" style="width: auto;">\${opts}</select>
            <button class="btn btn-sm btn-outline-primary" id="btnAddCustomCombo" type="button">Add</button>
        \`;
        
        container.appendChild(customUi);

        document.getElementById('btnAddCustomCombo').addEventListener('click', () => {
            let from = document.getElementById('customComboFrom').value;
            let to = document.getElementById('customComboTo').value;
            if (from === to) return;
            
            let key = \`\${from}-\${to}\`;
            // Check if exists
            if (!document.getElementById('cb_' + key)) {
                let div = document.createElement('div');
                div.className = "form-check font-monospace small mb-1";
                div.innerHTML = \`
                    <input class="form-check-input combination-checker-box" type="checkbox" value="\${key}" id="cb_\${key}" checked>
                    <label class="form-check-label" for="cb_\${key}">\${from} ➔ \${to}</label>
                \`;
                nonSeqContainer.appendChild(div);
            } else {
                document.getElementById('cb_' + key).checked = true;
            }
        });

        document.getElementById('combinationsCard').style.display = 'block';
        processBtn.disabled = false;
    }

    /**
     * EXACT SUTHERLAND-HODGMAN POLYGON CLIPPING ENGINE
     * Clips the arbitrary site boundary against the strictly convex Grid Box 
     */
`;
    html = html.substring(0, startIdx) + newFunc + html.substring(endIdx + 115);
    fs.writeFileSync('index.html', html);
    console.log("Success");
} else {
    console.log("Indexes not found", startIdx, endIdx);
}
