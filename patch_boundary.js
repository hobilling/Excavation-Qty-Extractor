import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldBoundary = `                        <div class="mb-3">
                            <label for="boundaryLayerSelect" class="form-label">Active Outer Site Boundary Layer</label>
                            <select class="form-select" id="boundaryLayerSelect" disabled>
                                <option value="">-- Awaiting Drawing Upload --</option>
                            </select>
                        </div>`;

const newBoundary = `                        <div class="mb-3">
                            <label class="form-label">Active Outer Site Boundary Layer</label>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center" type="button" id="boundaryLayerSelectBtn" data-bs-toggle="dropdown" aria-expanded="false" disabled>
                                    <span id="boundaryLayerSelectText" class="text-truncate">-- Awaiting Drawing Upload --</span>
                                </button>
                                <ul class="dropdown-menu w-100 shadow-sm" aria-labelledby="boundaryLayerSelectBtn">
                                    <li class="px-2 py-1"><input type="text" class="form-control form-control-sm" id="boundarySearchInput" placeholder="Search boundary layers..."></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <div id="boundaryOptionsContainer" style="max-height: 250px; overflow-y: auto;">
                                    </div>
                                </ul>
                            </div>
                        </div>`;

html = html.replace(oldBoundary, newBoundary);
fs.writeFileSync('index.html', html);
