import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldCollapse = `            rightPanel.className = 'col-12 transition-all';`;
const newCollapse = `            rightPanel.className = 'col-12 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar d-flex flex-column';`;

const oldExpand = `            rightPanel.className = 'col-xl-8 col-lg-7 transition-all';`;
const newExpand = `            rightPanel.className = 'col-xl-8 col-lg-7 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar d-flex flex-column';`;

html = html.replace(oldCollapse, newCollapse);
html = html.replace(oldExpand, newExpand);
fs.writeFileSync('index.html', html);
