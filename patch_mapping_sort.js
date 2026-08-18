import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldLoop = `        Array.from(PIPELINE.layers).sort().forEach(lyr => {`;
const newLoop = `        Array.from(PIPELINE.layers).sort((a, b) => {
            let countA = PIPELINE.points[a] ? PIPELINE.points[a].length : 0;
            let countB = PIPELINE.points[b] ? PIPELINE.points[b].length : 0;
            return countB - countA;
        }).forEach(lyr => {`;

html = html.replace(oldLoop, newLoop);
fs.writeFileSync('index.html', html);
