import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<body>', '<body class="vh-100 overflow-hidden d-flex flex-column bg-light">');
html = html.replace('<nav class="navbar navbar-expand-lg navbar-light bg-white py-3">', '<nav class="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom shadow-sm flex-shrink-0">');
html = html.replace('<div class="container-fluid py-4">', '<div class="container-fluid py-4 flex-grow-1 overflow-hidden">');
html = html.replace('<div class="row g-3">', '<div class="row g-3 h-100">');
html = html.replace('<div class="col-xl-4 col-lg-5 transition-all" id="leftPanel">', '<div class="col-xl-4 col-lg-5 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar" id="leftPanel">');
html = html.replace('<div class="col-xl-8 col-lg-7 transition-all" id="rightPanel">', '<div class="col-xl-8 col-lg-7 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar d-flex flex-column" id="rightPanel">');

fs.writeFileSync('index.html', html);
