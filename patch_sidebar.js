import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// Remove collapse buttons
html = html.replace(/<button[^>]+id="collapseSidebarBtn"[^>]*>[\s\S]*?<\/button>/g, '');
html = html.replace(/<button[^>]+class="[^"]*expand-sidebar-btn[^"]*"[^>]*>[\s\S]*?<\/button>/g, '');

// Insert vertical collapse bar before rightPanel
const rpTarget = '<div class="col-xl-8 col-lg-7 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar d-flex flex-column" id="rightPanel">';
const toggleBarHTML = `
        <div id="verticalToggleBar" class="d-none d-lg-flex align-items-center justify-content-center bg-white border shadow-sm transition-all" style="width: 24px; cursor: pointer; z-index: 1060; border-radius: 4px; position: absolute; left: 33.333%; top: 50%; transform: translateY(-50%); height: 120px;" onclick="toggleSidebar()">
            <span id="verticalToggleText" style="writing-mode: vertical-rl; text-orientation: mixed; font-size: 0.75rem; font-weight: bold; color: #475569; user-select: none; letter-spacing: 2px;">◀ COLLAPSE</span>
        </div>
        <div class="col-xl-8 col-lg-7 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar d-flex flex-column" id="rightPanel">
`;
html = html.replace(rpTarget, toggleBarHTML);

// Update logic
const setSidebarCollapsedRegex = /function setSidebarCollapsed[\s\S]*?\}\s*setTimeout/g;
const newSetSidebar = `
    function toggleSidebar() {
        setSidebarCollapsed(!isLeftPanelCollapsed);
    }
    function setSidebarCollapsed(collapsed) {
        isLeftPanelCollapsed = collapsed;
        const leftPanel = document.getElementById('leftPanel');
        const rightPanel = document.getElementById('rightPanel');
        const toggleBar = document.getElementById('verticalToggleBar');
        const toggleText = document.getElementById('verticalToggleText');
        if (isLeftPanelCollapsed) {
            leftPanel.classList.add('d-none');
            rightPanel.className = 'col-12 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar d-flex flex-column';
            toggleBar.style.left = '0';
            toggleText.innerText = '▶ EXPAND';
        } else {
            leftPanel.classList.remove('d-none');
            rightPanel.className = 'col-xl-8 col-lg-7 transition-all h-100 overflow-y-auto pb-5 custom-scrollbar d-flex flex-column';
            // Determine left position based on screen size: approx 33.333% on xl, 41.666% on lg. Just use a class or fixed % or we can rely on standard relative flow.
            // Let's attach the bar to the leftPanel's right edge instead of absolute. Actually, let's fix the absolute pos:
            if (window.innerWidth >= 1200) toggleBar.style.left = '33.333%';
            else toggleBar.style.left = '41.666%';
            toggleText.innerText = '◀ COLLAPSE';
        }
        setTimeout`;
html = html.replace(setSidebarCollapsedRegex, newSetSidebar);

// Also we need to fix the row to have position: relative
html = html.replace('<div class="row g-3 h-100">', '<div class="row g-3 h-100 position-relative">');

fs.writeFileSync('index.html', html);
