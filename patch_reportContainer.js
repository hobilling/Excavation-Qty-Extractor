import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<ul class="nav nav-pills mb-3 border-bottom pb-2" id="reportTabs" role="tablist">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newHTML = `
                <div class="card">
                    <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2 bg-white border-bottom">
                        <span class="fw-bold">Analytical Quantity Takeoff Audit Ledger</span>
                        <div class="d-flex align-items-center gap-3">
                            <div class="d-flex align-items-center border rounded p-1">
                                <div class="form-check form-check-inline mb-0 ms-2">
                                    <input class="form-check-input" type="radio" name="excelFormat" id="fmtXlsx" value="xlsx" checked>
                                    <label class="form-check-label small fw-bold" for="fmtXlsx">Excel</label>
                                </div>
                                <div class="form-check form-check-inline mb-0">
                                    <input class="form-check-input" type="radio" name="excelFormat" id="fmtCsv" value="csv">
                                    <label class="form-check-label small fw-bold" for="fmtCsv">CSV</label>
                                </div>
                                <button class="btn btn-sm btn-success ms-2 px-3 fw-semibold" id="downloadExcelActionBtn">📊 Export Table</button>
                            </div>
                            
                            <div class="d-flex align-items-center border rounded p-1">
                                <div class="form-check form-check-inline mb-0 ms-2">
                                    <input class="form-check-input" type="radio" name="cadFormat" id="fmtDwg" value="dwg" checked>
                                    <label class="form-check-label small fw-bold" for="fmtDwg">DWG</label>
                                </div>
                                <div class="form-check form-check-inline mb-0">
                                    <input class="form-check-input" type="radio" name="cadFormat" id="fmtDxf" value="dxf">
                                    <label class="form-check-label small fw-bold" for="fmtDxf">DXF</label>
                                </div>
                                <button class="btn btn-sm btn-primary ms-2 px-3 fw-semibold" id="downloadDxfRealBtn">📐 Export CAD</button>
                            </div>
                            
                            <button class="btn btn-outline-dark btn-sm fw-bold px-3" id="btnPrintReportBtn" type="button" title="Print or save detailed PDF report">🖨️ Print</button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <ul class="nav nav-tabs px-3 pt-2 bg-light" id="sheetTabs" role="tablist"></ul>
                        <div class="tab-content" id="sheetTabsContent"></div>
                    </div>
                </div>
`;

html = html.replace(regex, newHTML);

// Fix JavaScript code that referenced old buttons:
// 1. Rename Sheet to Output in renderOutputLedgerSheets
html = html.replace(/Sheet \$\{key\}/g, 'Output ${key}');
html = html.replace(/Sheet \$\{key\} \(/g, 'Output ${key} (');

// 2. Link canvas to active tab
const tabSwitchRegex = /li\.innerHTML = \`<button class="nav-link \$\{activeClass\}" id="t_\$\{key\}-tab" data-bs-toggle="tab" data-bs-target="#p_\$\{key\}" type="button">Output \$\{key\}<\/button>\`;/;
html = html.replace(tabSwitchRegex, (m) => m + `
            li.querySelector('button').addEventListener('show.bs.tab', function (e) {
                if (typeof CANVAS_ENGINE !== 'undefined') {
                    CANVAS_ENGINE.activeSheetKey = key;
                    CANVAS_ENGINE.draw();
                    CANVAS_ENGINE.updateInspector(null);
                }
            });
`);

// 3. Fix download listeners
// downloadExcelXlsxTabBtn and downloadExcelMockBtn are removed, let's replace their event listeners with the new ones.
const evListRegex = /document\.getElementById\('downloadExcelXlsxBtn'\)\?\.addEventListener\('click', exportTablesToExcelFormatXlsx\);\s*document\.getElementById\('downloadExcelXlsxTabBtn'\)\?\.addEventListener\('click', exportTablesToExcelFormatXlsx\);\s*document\.getElementById\('downloadExcelCsvBtn'\)\?\.addEventListener\('click', exportTablesToExcelFormatCsv\);\s*document\.getElementById\('quickDxfExportBtn'\)\?\.addEventListener\([\s\S]*?\}\);/;
const newEvList = `
    document.getElementById('downloadExcelActionBtn')?.addEventListener('click', () => {
        if (document.getElementById('fmtXlsx').checked) exportTablesToExcelFormatXlsx();
        else exportTablesToExcelFormatCsv();
    });
`;
html = html.replace(evListRegex, newEvList);

fs.writeFileSync('index.html', html);
