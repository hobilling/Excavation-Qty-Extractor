import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove canvasSheetSelect dropdown
html = html.replace(/<select class="form-select form-select-sm" id="canvasSheetSelect" style="width: auto;">[\s\S]*?<\/select>/, '');

// 2. Change reportContainer structure: remove the two reportTabs (Data vs CAD), keep sheetTabs (rename Sheet to Output), and add toggles.
// First, find and replace the whole block from <ul class="nav nav-pills mb-3 border-bottom pb-2" id="reportTabs" role="tablist"> to the end of <div class="tab-pane fade" id="tab-cad" role="tabpanel">...</div>
const oldTabsStart = html.indexOf('<ul class="nav nav-pills mb-3 border-bottom pb-2" id="reportTabs" role="tablist">');
const oldTabsEndStr = '<div class="tab-pane fade" id="tab-cad" role="tabpanel">';
// Wait, regex might be easier or just replace the inner HTML. Let's build a new report section structure.
