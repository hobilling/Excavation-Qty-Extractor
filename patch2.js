import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// Task 2: Rename "Raw DXF Survey Layout" -> "Input DWG or DXF file"
// When parsing file, it handles both. We can just say "Input DWG/DXF File" or change it dynamically.
// I'll dynamically change it where it's hardcoded. 
html = html.replace(/Raw DXF Survey Layout/g, 'Input DWG/DXF Survey Layout');
// Actually, I can hook into handleFileUpload
const uploadRegex = /document\.getElementById\('fileInput'\)\.addEventListener\('change', async \(e\) => \{[\s\S]*?const file = e\.target\.files\[0\];/;
html = html.replace(uploadRegex, (match) => match + `
        if (file.name.toLowerCase().endsWith('.dwg')) {
            window.uploadedFileType = 'DWG';
        } else {
            window.uploadedFileType = 'DXF';
        }
`);
html = html.replace(/'RAW_DXF'/g, "'RAW_FILE'");
html = html.replace(/"RAW_DXF"/g, '"RAW_FILE"');
html = html.replace(/>Input DWG\/DXF Survey Layout</g, `>Input \${window.uploadedFileType || 'DXF/DWG'} Survey Layout<`); // will fix logic below

const sheetSelRegex = /sheetSel\.innerHTML = '<option value="RAW_FILE">Input DWG\/DXF Survey Layout<\/option>';/g;
html = html.replace(sheetSelRegex, "sheetSel.innerHTML = `<option value=\"RAW_FILE\">Input ${window.uploadedFileType || 'DWG/DXF'} Survey Layout</option>`;");


// Task 3: Hide 0 qty cards and rename footprint
const cardHtmlRegex = /let cardHtml = \`[\s\S]*?<div class="col-md-4">[\s\S]*?Footprint: \$\{sheet\.area\.toFixed\(3\)\} m²<\/div>[\s\S]*?<\/div>[\s\S]*?\`;/g;
const newCardHtml = `
            let cardHtml = \`
                <div class="col-md-4">
                    <div class="metric-card">
                        <span class="text-muted d-block small font-monospace fw-bold">\${sheet.roleA} ➔ \${sheet.roleB}</span>
                        \${sheet.totalCut > 0 ? \`<div class="small text-danger fw-semibold">Exact Cut Qty: \${sheet.totalCut.toLocaleString(undefined, {maximumFractionDigits:3})} m³</div>\` : ''}
                        \${sheet.totalFill > 0 ? \`<div class="small text-success fw-semibold">Exact Fill Qty: \${sheet.totalFill.toLocaleString(undefined, {maximumFractionDigits:3})} m³</div>\` : ''}
                        <div class="small text-dark fw-bold">Boundary Area: \${sheet.area.toFixed(3)} m²</div>
                    </div>
                </div>
            \`;`;
html = html.replace(cardHtmlRegex, newCardHtml);

// Task 4: Remove canvasInspectorReadout
html = html.replace(/<div class="mt-2 p-2 bg-light border rounded" id="canvasInspectorReadout">[\s\S]*?<\/div>/, '');

fs.writeFileSync('index.html', html);
