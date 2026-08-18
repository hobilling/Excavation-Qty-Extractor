import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// Replace xlsx with exceljs
html = html.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"></script>');
html = html.replace("if (typeof XLSX === 'undefined')", "if (typeof ExcelJS === 'undefined')");

const oldExcelXlsx = `    function exportTablesToExcelFormatXlsx() {
        if (typeof ExcelJS === 'undefined') {
            exportTablesToExcelFormatCsv();
            return;
        }
        let wb = XLSX.utils.book_new();
        let bArea = (PIPELINE.polygonBounds && PIPELINE.polygonBounds.length > 0) ? computePolygonArea(PIPELINE.polygonBounds) : 0;

        let summaryRows = [
            ["CivilEngine Pro - Earthwork Takeoff Report Summary"],
            ["Export Timestamp", new Date().toLocaleString()],
            ["Grid Modulus Box Size (m)", PIPELINE.gridSize],
            ["Active Site Boundary Layer", PIPELINE.activeBoundsLayer],
            ["Outer Site Area (m²)", Number(bArea.toFixed(3))],
            [],
            ["Sequence Sheet Key", "Base Ground Layer", "Design Target Layer", "Exact Area (m²)", "Total Cut Volume (m³)", "Total Fill Volume (m³)", "Net Balance Volume (m³)"]
        ];

        Object.keys(PIPELINE.sheets).forEach(k => {
            let s = PIPELINE.sheets[k];
            let net = s.totalFill - s.totalCut;
            summaryRows.push([k, s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(s.totalCut.toFixed(3)), Number(s.totalFill.toFixed(3)), Number(net.toFixed(3))]);
        });

        let wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Executive Summary");

        Object.keys(PIPELINE.sheets).forEach(k => {
            let s = PIPELINE.sheets[k];
            let detailRows = [
                ["Box No", "Clipped Area (m²)", 
                 \`\${s.roleA} SW RL\`, \`\${s.roleA} SE RL\`, \`\${s.roleA} NE RL\`, \`\${s.roleA} NW RL\`, \`\${s.roleA} Mean RL\`, 
                 \`\${s.roleB} SW RL\`, \`\${s.roleB} SE RL\`, \`\${s.roleB} NE RL\`, \`\${s.roleB} NW RL\`, \`\${s.roleB} Mean RL\`, 
                 "Cut Depth (m)", "Cut Volume (m³)", "Fill Depth (m)", "Fill Volume (m³)"]
            ];
            s.cells.forEach(c => {
                detailRows.push([
                    c.boxId, Number(c.area.toFixed(4)),
                    Number(c.a1.toFixed(3)), Number(c.a2.toFixed(3)), Number(c.a3.toFixed(3)), Number(c.a4.toFixed(3)), Number(c.avgA.toFixed(3)),
                    Number(c.b1.toFixed(3)), Number(c.b2.toFixed(3)), Number(c.b3.toFixed(3)), Number(c.b4.toFixed(3)), Number(c.avgB.toFixed(3)),
                    Number(c.cutDepth.toFixed(3)), Number(c.cutQty.toFixed(3)),
                    Number(c.fillDepth.toFixed(3)), Number(c.fillQty.toFixed(3))
                ]);
            });
            let wsDetail = XLSX.utils.aoa_to_sheet(detailRows);
            let validSheetName = k.replace(/[^a-zA-Z0-9_\\-]/g, '_').substring(0, 31);
            XLSX.utils.book_append_sheet(wb, wsDetail, validSheetName);
        });

        XLSX.writeFile(wb, "CivilEngine_Earthwork_Takeoff_Ledger.xlsx");
    }`;

const newExcelXlsx = `    async function exportTablesToExcelFormatXlsx() {
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

// Replace function
if (html.includes('XLSX.utils.book_new')) {
    html = html.replace(oldExcelXlsx, newExcelXlsx);
} else {
    // try a regex fallback if spacing differs
    html = html.replace(/function exportTablesToExcelFormatXlsx\(\) \{[\s\S]*?XLSX\.writeFile\(wb,\s*"CivilEngine_Earthwork_Takeoff_Ledger\.xlsx"\);\s*\}/, newExcelXlsx);
}

// 7. Remove Earthwork Takeoff Audit Report card (the top banner inside reportContainer)
// It looks like:
// <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 bg-white p-3 rounded border shadow-sm">
// ...
// </div>
// Actually, I can just regex it out.
html = html.replace(/<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 bg-white p-3 rounded border shadow-sm">[\s\S]*?🖨️ Print \/ Save PDF[\s\S]*?<\/div>\s*<\/div>/, '');

fs.writeFileSync('index.html', html);
