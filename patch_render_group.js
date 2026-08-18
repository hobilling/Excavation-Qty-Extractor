import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldRender = `    function renderOutputLedgerSheets() {
        const ribbon = document.getElementById('metricSummaryRibbon'); ribbon.innerHTML = '';
        const sTabs = document.getElementById('sheetTabs'); sTabs.innerHTML = '';
        const sContent = document.getElementById('sheetTabsContent'); sContent.innerHTML = '';

        let seqHeader = document.createElement('div');
        seqHeader.className = "col-12 mt-0 mb-1";
        seqHeader.innerHTML = '<h6 class="small fw-bold text-primary border-bottom pb-1">Sequential Stages</h6>';
        ribbon.appendChild(seqHeader);

        let nonSeqHeader = document.createElement('div');
        nonSeqHeader.className = "col-12 mt-3 mb-1";
        nonSeqHeader.innerHTML = '<h6 class="small fw-bold text-secondary border-bottom pb-1">Cumulative Stages</h6>';
        let nonSeqAdded = false;
        
        let rolesArr = Object.keys(PIPELINE.roles);
        rolesArr.sort((a, b) => {
            if (a === 'OGL') return -1;
            if (b === 'OGL') return 1;
            return a.localeCompare(b);
        });

        Object.keys(PIPELINE.sheets).forEach((key, idx) => {
            let sheet = PIPELINE.sheets[key];
            let activeClass = idx === 0 ? 'active' : '';

            let isSeq = false;
            let idxA = rolesArr.indexOf(sheet.roleA);
            let idxB = rolesArr.indexOf(sheet.roleB);
            if (idxA !== -1 && idxB !== -1 && Math.abs(idxA - idxB) === 1) {
                isSeq = true;
            }

            if (!isSeq && !nonSeqAdded) {
                ribbon.appendChild(nonSeqHeader);
                nonSeqAdded = true;
            }

            let card = document.createElement('div');
            card.className = "col-md-4";
            card.innerHTML = \`
                <div class="metric-card">
                    <span class="text-muted d-block small font-monospace fw-bold">\${sheet.roleA} ➔ \${sheet.roleB}</span>
                    <div class="small text-danger fw-semibold">Exact Cut Qty: \${sheet.totalCut.toLocaleString(undefined, {maximumFractionDigits:3})} m³</div>
                    <div class="small text-success fw-semibold">Exact Fill Qty: \${sheet.totalFill.toLocaleString(undefined, {maximumFractionDigits:3})} m³</div>
                    <div class="small text-dark fw-bold">Footprint: \${sheet.area.toFixed(3)} m²</div>
                </div>
            \`;
            ribbon.appendChild(card);`;

const newRender = `    function renderOutputLedgerSheets() {
        const ribbon = document.getElementById('metricSummaryRibbon'); ribbon.innerHTML = '';
        const sTabs = document.getElementById('sheetTabs'); sTabs.innerHTML = '';
        const sContent = document.getElementById('sheetTabsContent'); sContent.innerHTML = '';

        let rolesArr = Object.keys(PIPELINE.roles);
        rolesArr.sort((a, b) => {
            if (a === 'OGL') return -1;
            if (b === 'OGL') return 1;
            return a.localeCompare(b);
        });

        let seqCards = [];
        let nonSeqCards = [];
        
        Object.keys(PIPELINE.sheets).forEach((key, idx) => {
            let sheet = PIPELINE.sheets[key];
            let activeClass = idx === 0 ? 'active' : '';

            let isSeq = false;
            let idxA = rolesArr.indexOf(sheet.roleA);
            let idxB = rolesArr.indexOf(sheet.roleB);
            if (idxA !== -1 && idxB !== -1 && Math.abs(idxA - idxB) === 1) {
                isSeq = true;
            }

            let cardHtml = \`
                <div class="col-md-4">
                    <div class="metric-card">
                        <span class="text-muted d-block small font-monospace fw-bold">\${sheet.roleA} ➔ \${sheet.roleB}</span>
                        <div class="small text-danger fw-semibold">Exact Cut Qty: \${sheet.totalCut.toLocaleString(undefined, {maximumFractionDigits:3})} m³</div>
                        <div class="small text-success fw-semibold">Exact Fill Qty: \${sheet.totalFill.toLocaleString(undefined, {maximumFractionDigits:3})} m³</div>
                        <div class="small text-dark fw-bold">Footprint: \${sheet.area.toFixed(3)} m²</div>
                    </div>
                </div>
            \`;
            
            if (isSeq) seqCards.push(cardHtml);
            else nonSeqCards.push(cardHtml);`;

html = html.replace(oldRender, newRender);
fs.writeFileSync('index.html', html);
