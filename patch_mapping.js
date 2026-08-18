import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldHeader = `            <div class="card mb-3" id="mappingCard" style="display:none;">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span data-bs-toggle="collapse" data-bs-target="#card2Body" style="cursor: pointer;" class="fw-semibold">2. Profile Sequence Assignment</span>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-primary py-0 px-2 fw-semibold" id="btnAddProposedLevelBtn" type="button" title="Add another proposed profile level (e.g. PG4, PG5)">
                            + Add Level
                        </button>
                        <span class="small text-muted" data-bs-toggle="collapse" data-bs-target="#card2Body" style="cursor: pointer;">▼</span>
                    </div>
                </div>
                <div class="collapse show" id="card2Body">
                    <div class="card-body">
                        <p class="text-muted small mb-3">Map drawing point groups to timeline parameters. Original layer color indexes are automatically preserved by the parser.</p>
                        <div id="layerMappingContainer"></div>`;

const newHeader = `            <div class="card mb-3" id="mappingCard" style="display:none;">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span data-bs-toggle="collapse" data-bs-target="#card2Body" style="cursor: pointer;" class="fw-semibold">2. Profile Sequence Assignment</span>
                    <div class="d-flex align-items-center gap-2">
                        <span class="small text-muted" data-bs-toggle="collapse" data-bs-target="#card2Body" style="cursor: pointer;">▼</span>
                    </div>
                </div>
                <div class="collapse show" id="card2Body">
                    <div class="card-body">
                        <p class="text-muted small mb-2">Map drawing point groups to timeline parameters.</p>
                        <input type="text" id="layerMappingSearch" class="form-control form-control-sm mb-3" placeholder="Search layers...">
                        <div id="layerMappingContainer"></div>`;

html = html.replace(oldHeader, newHeader);
fs.writeFileSync('index.html', html);
