import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace Excel function
const excelStart = '    function exportTablesToExcelFormatXlsx() {';
const excelEnd = '        XLSX.writeFile(wb, "CivilEngine_Earthwork_Takeoff_Ledger.xlsx");\n    }';

const idxStart = html.indexOf(excelStart);
const idxEnd = html.indexOf(excelEnd) + excelEnd.length;

if (idxStart !== -1 && idxEnd > idxStart) {
    const newExcel = `    async function exportTablesToExcelFormatXlsx() {
        if (typeof ExcelJS === 'undefined') {
            exportTablesToExcelFormatCsv();
            return;
        }
        let wb = new ExcelJS.Workbook();
        let bArea = (PIPELINE.polygonBounds && PIPELINE.polygonBounds.length > 0) ? computePolygonArea(PIPELINE.polygonBounds) : 0;

        let wsSummary = wb.addWorksheet("Executive Summary");
        wsSummary.columns = [
            { width: 25 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 25 }
        ];
        
        wsSummary.addRow(["CivilEngine Pro - Earthwork Takeoff Report Summary"]);
        wsSummary.getCell('A1').font = { size: 14, bold: true };
        wsSummary.addRow(["Export Timestamp", new Date().toLocaleString()]);
        wsSummary.addRow(["Grid Modulus Box Size (m)", PIPELINE.gridSize]);
        wsSummary.addRow(["Active Site Boundary Layer", PIPELINE.activeBoundsLayer]);
        wsSummary.addRow(["Outer Site Area (m²)", Number(bArea.toFixed(3))]);
        wsSummary.addRow([]);
        
        let headerRow = wsSummary.addRow(["Sequence Sheet Key", "Base Ground Layer", "Design Target Layer", "Exact Area (m²)", "Total Cut Volume (m³)", "Total Fill Volume (m³)", "Net Balance Volume (m³)"]);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; });
        
        Object.keys(PIPELINE.sheets).forEach(k => {
            let s = PIPELINE.sheets[k];
            let net = s.totalFill - s.totalCut;
            let row = wsSummary.addRow([k, s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(s.totalCut.toFixed(3)), Number(s.totalFill.toFixed(3)), Number(net.toFixed(3))]);
            row.getCell(5).font = { color: { argb: 'FFDC2626' }, bold: true }; // Cut
            row.getCell(6).font = { color: { argb: 'FF16A34A' }, bold: true }; // Fill
        });

        Object.keys(PIPELINE.sheets).forEach(k => {
            let s = PIPELINE.sheets[k];
            let validSheetName = k.replace(/[^a-zA-Z0-9_\\-]/g, '_').substring(0, 31);
            let ws = wb.addWorksheet(validSheetName);
            
            ws.columns = [
                { width: 10 }, { width: 18 },
                { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 15 },
                { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 15 },
                { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }
            ];
            
            let row1 = ws.addRow(["Box No", "Clipped Area (m²)", \`\${s.roleA} Base Ground Profile\`, "", "", "", "", \`\${s.roleB} Design Target Profile\`, "", "", "", "", "Cutting Evaluation", "", "Filling Evaluation", ""]);
            ws.mergeCells('A1:A2'); ws.mergeCells('B1:B2');
            ws.mergeCells('C1:G1'); ws.mergeCells('H1:L1');
            ws.mergeCells('M1:N1'); ws.mergeCells('O1:P1');
            
            let row2 = ws.addRow(["", "", "SW RL", "SE RL", "NE RL", "NW RL", "Mean RL", "SW RL", "SE RL", "NE RL", "NW RL", "Mean RL", "Depth (m)", "Volume (m³)", "Depth (m)", "Volume (m³)"]);
            
            [row1, row2].forEach(r => {
                r.font = { bold: true };
                r.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                r.eachCell(c => c.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} });
            });
            row1.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
            row1.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
            row1.getCell(13).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
            row1.getCell(15).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
            
            s.cells.forEach(c => {
                let r = ws.addRow([
                    c.boxId, Number(c.area.toFixed(4)),
                    Number(c.a1.toFixed(3)), Number(c.a2.toFixed(3)), Number(c.a3.toFixed(3)), Number(c.a4.toFixed(3)), Number(c.avgA.toFixed(3)),
                    Number(c.b1.toFixed(3)), Number(c.b2.toFixed(3)), Number(c.b3.toFixed(3)), Number(c.b4.toFixed(3)), Number(c.avgB.toFixed(3)),
                    c.cutDepth > 0 ? Number(c.cutDepth.toFixed(3)) : null, c.cutQty > 0 ? Number(c.cutQty.toFixed(3)) : null,
                    c.fillDepth > 0 ? Number(c.fillDepth.toFixed(3)) : null, c.fillQty > 0 ? Number(c.fillQty.toFixed(3)) : null
                ]);
                r.getCell(13).font = { color: { argb: 'FFDC2626' } }; r.getCell(14).font = { color: { argb: 'FFDC2626' }, bold: true };
                r.getCell(15).font = { color: { argb: 'FF16A34A' } }; r.getCell(16).font = { color: { argb: 'FF16A34A' }, bold: true };
                r.eachCell(cell => { cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} }; });
            });
        });

        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url; anchor.download = "CivilEngine_Earthwork_Takeoff_Ledger.xlsx";
        document.body.appendChild(anchor); anchor.click();
        document.body.removeChild(anchor);
    }`;
    
    html = html.substring(0, idxStart) + newExcel + html.substring(idxEnd);
}

// 2. Fix downloadAutocadDxfStreamAction
const cadStart = '    function downloadAutocadDxfStreamAction() {';
const cadEnd = '        document.body.removeChild(anchor);\n    }';
const cIdxStart = html.indexOf(cadStart);
const cIdxEnd = html.indexOf(cadEnd) + cadEnd.length;

if (cIdxStart !== -1 && cIdxEnd > cIdxStart) {
    const newCad = `    function downloadAutocadDxfStreamAction() {
        let activeTab = document.querySelector('#sheetTabs .nav-link.active');
        let mode = 'MASTER_COMBINED';
        if (activeTab) {
            let activeId = activeTab.id; // e.g. t_OLG_PG1-tab
            let match = activeId.match(/t_(.*)-tab/);
            if (match && match[1]) {
                mode = 'SEPARATE_' + match[1];
            }
        }
        
        let fmt = 'dwg';
        if (document.getElementById('fmtDxf').checked) fmt = 'dxf';
        
        let contents = compileNativeDxfFileString(mode);
        const mimeType = fmt === 'dwg' ? 'application/acad' : 'application/dxf';
        const blob = new Blob([contents], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url; anchor.download = \`\${mode}_AnalyticalTakeoff.\${fmt}\`;
        document.body.appendChild(anchor); anchor.click();
        document.body.removeChild(anchor);
    }`;
    html = html.substring(0, cIdxStart) + newCad + html.substring(cIdxEnd);
}

// 3. Prevent CAD file export selector rehydration from overriding our button
const rehydrateStart = '    function rehydrateCadFileDownloaderList() {';
const rehydrateEnd = '        document.getElementById(\'downloadDxfRealBtn\').onclick = downloadAutocadDxfStreamAction;\n    }';
const rIdxStart = html.indexOf(rehydrateStart);
const rIdxEnd = html.indexOf(rehydrateEnd) + rehydrateEnd.length;

if (rIdxStart !== -1 && rIdxEnd > rIdxStart) {
    const newRehydrate = `    function rehydrateCadFileDownloaderList() {
        let btn = document.getElementById('downloadDxfRealBtn');
        if (btn) btn.onclick = downloadAutocadDxfStreamAction;
    }`;
    html = html.substring(0, rIdxStart) + newRehydrate + html.substring(rIdxEnd);
}

// 4. Ensure print layout behaves nicely
const printFix = `
        /* Ensure table content doesn't get squashed */
        .table th, .table td { white-space: nowrap; }
`;
html = html.replace('</style>', printFix + '</style>');


fs.writeFileSync('index.html', html);
