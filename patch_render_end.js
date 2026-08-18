import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const endLoopIdx = html.indexOf('        });', html.indexOf('Object.keys(PIPELINE.sheets).forEach((key, idx) => {'));

const insertion = `
        if (seqCards.length > 0) {
            let seqHeader = document.createElement('div');
            seqHeader.className = "col-12 mt-0 mb-1";
            seqHeader.innerHTML = '<h6 class="small fw-bold text-primary border-bottom pb-1">Sequential Stages</h6>';
            ribbon.appendChild(seqHeader);
            ribbon.insertAdjacentHTML('beforeend', seqCards.join(''));
        }
        
        if (nonSeqCards.length > 0) {
            let nonSeqHeader = document.createElement('div');
            nonSeqHeader.className = "col-12 mt-3 mb-1";
            nonSeqHeader.innerHTML = '<h6 class="small fw-bold text-secondary border-bottom pb-1">Cumulative Stages</h6>';
            ribbon.appendChild(nonSeqHeader);
            ribbon.insertAdjacentHTML('beforeend', nonSeqCards.join(''));
        }
`;

html = html.substring(0, endLoopIdx + 11) + insertion + html.substring(endLoopIdx + 11);

fs.writeFileSync('index.html', html);
