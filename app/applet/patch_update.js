import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// 1. Navbar update: separate Collapse and Expand buttons (not a toggle)
const oldNavbarDiv = `<div class="container-fluid d-flex justify-content-between align-items-center">
        <a class="navbar-brand fw-bold text-dark d-flex align-items-center gap-2 mb-0" href="#">📐 CivilEngine Pro: Earthwork Takeoff & Grid Inspector</a>
        <button class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 fw-semibold px-3" onclick="toggleSidebar()" title="Toggle Left Sidebar Expand/Collapse">
            <span>⇄</span> <span class="d-none d-sm-inline">Toggle Sidebar Panel</span>
        </button>
    </div>`;

const newNavbarDiv = `<div class="container-fluid d-flex justify-content-between align-items-center">
        <a class="navbar-brand fw-bold text-dark d-flex align-items-center gap-2 mb-0" href="#">📐 CivilEngine Ultimate Pro: Earthwork Takeoff & Grid Inspector</a>
        <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 fw-semibold px-2" onclick="setSidebarCollapsed(true)" title="Collapse Left Panel">
                <span>◀</span> <span class="d-none d-sm-inline">Collapse Panel</span>
            </button>
            <button class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 fw-semibold px-2" onclick="setSidebarCollapsed(false)" title="Expand Left Panel">
                <span>▶</span> <span class="d-none d-sm-inline">Expand Panel</span>
            </button>
        </div>
    </div>`;

if (html.includes(oldNavbarDiv)) {
    html = html.replace(oldNavbarDiv, newNavbarDiv);
} else {
    html = html.replace(
        /<button class="btn btn-sm btn-outline-secondary[^"]*"[^>]*>[\s\S]*?<\/button>/g,
        `<div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 fw-semibold px-2" onclick="setSidebarCollapsed(true)" title="Collapse Left Panel">
                <span>◀</span> <span class="d-none d-sm-inline">Collapse Panel</span>
            </button>
            <button class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 fw-semibold px-2" onclick="setSidebarCollapsed(false)" title="Expand Left Panel">
                <span>▶</span> <span class="d-none d-sm-inline">Expand Panel</span>
            </button>
        </div>`
    );
}

// 2. Remove canvas header text "Interactive CAD & Grid Boundary Canvas Inspector"
html = html.replace('<span class="fw-bold">🗺️ Interactive CAD & Grid Boundary Canvas Inspector</span>', '');

// 3. Make boundary dropdown collapse after selection
const boundaryDropdownHandlerOld = `    document.getElementById('boundaryOptionsContainer')?.addEventListener('click', function(e) {
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
    });`;

const boundaryDropdownHandlerNew = `    document.getElementById('boundaryOptionsContainer')?.addEventListener('click', function(e) {
        let aEl = e.target.closest('a');
        if (aEl) {
            e.preventDefault();
            const val = aEl.getAttribute('data-value');
            const txt = aEl.innerText;
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

            // Collapse dropdown
            const btnEl = document.getElementById('boundaryLayerSelectBtn');
            if (btnEl) {
                let bsDrop = bootstrap.Dropdown.getInstance(btnEl);
                if (bsDrop) bsDrop.hide();
            }
        }
    });`;

if (html.includes(boundaryDropdownHandlerOld)) {
    html = html.replace(boundaryDropdownHandlerOld, boundaryDropdownHandlerNew);
}

fs.writeFileSync('index.html', html);
console.log('Patch applied successfully.');
