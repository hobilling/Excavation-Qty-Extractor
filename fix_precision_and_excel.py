import re

with open('index.html', 'r') as f:
    content = f.read()

# === PRECISION UPDATES ===
# 1. UI Table Volumes
content = content.replace('c.cutQty > 0 ? c.cutQty.toFixed(2) : \'-\'', 'c.cutQty > 0 ? Math.round(c.cutQty) : \'-\'')
content = content.replace('c.fillQty > 0 ? c.fillQty.toFixed(2) : \'-\'', 'c.fillQty > 0 ? Math.round(c.fillQty) : \'-\'')
content = content.replace('sheet.totalCut.toFixed(2)', 'Math.round(sheet.totalCut)')
content = content.replace('sheet.totalFill.toFixed(2)', 'Math.round(sheet.totalFill)')
content = content.replace('(sheet.totalFill - sheet.totalCut).toFixed(2)', 'Math.round(sheet.totalFill - sheet.totalCut)')
content = content.replace('sheet.area.toFixed(3)', 'sheet.area.toFixed(2)')

# 2. DXF Legends Volumes
content = content.replace('c.cutQty.toFixed(2)', 'Math.round(c.cutQty)')
content = content.replace('c.fillQty.toFixed(2)', 'Math.round(c.fillQty)')
content = content.replace('s.area.toFixed(3)', 's.area.toFixed(2)')

# === EXCEL GENERATION ===
# Let's replace the whole Excel generation block to carefully manage everything
# We will use regex to find the wb.addWorksheet("Executive Summary") up to the end of the workbook generation.

excel_code_pattern = re.compile(r'let wb = new ExcelJS\.Workbook\(\);.*?const buffer = await wb\.xlsx\.writeBuffer\(\);', re.DOTALL)

new_excel_code = """let wb = new ExcelJS.Workbook();
        let bArea = (PIPELINE.polygonBounds && PIPELINE.polygonBounds.length > 0) ? computePolygonArea(PIPELINE.polygonBounds) : 0;

        let wsSummary = wb.addWorksheet("Executive Summary");
        wsSummary.columns = [
            { width: 22 }, { width: 25 }, { width: 18 }, { width: 18 }, { width: 15 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }
        ];
        
        wsSummary.addRow(["Excavation Quantity Extractor - Report Summary"]);
        wsSummary.getCell('A1').font = { size: 14, bold: true };
        wsSummary.addRow(["Export Timestamp", new Date().toLocaleString()]);
        wsSummary.addRow(["Grid Modulus Box Size (m)", PIPELINE.gridSize]);
        wsSummary.addRow(["Active Site Boundary Layer", PIPELINE.activeBoundsLayer]);
        wsSummary.addRow(["Outer Site Area (m²)", Number(bArea.toFixed(2))]);
        wsSummary.addRow([]);
        
        let headerRow = wsSummary.addRow(["Sequence Sheet Key", "Custom Soil Type", "Base Layer", "Target Layer", "Area (m²)", "Avg. Depth Cut (m)", "Total Cut (m³)", "Avg. Depth Fill (m)", "Total Fill (m³)"]);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell(c => { 
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
            c.border = { top: {style:'medium', color: {argb:'FF000000'}}, left: {style:'thin', color: {argb:'FF64748B'}}, bottom: {style:'medium', color: {argb:'FF000000'}}, right: {style:'thin', color: {argb:'FF64748B'}} };
        });
        
        Object.keys(PIPELINE.sheets).forEach(k => {
            let s = PIPELINE.sheets[k];
            let avgCutDepth = s.totalCut / Math.max(1, s.area);
            let avgFillDepth = s.totalFill / Math.max(1, s.area);
            let row = wsSummary.addRow([k, s.remark || '-', s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(avgCutDepth.toFixed(3)), Math.round(s.totalCut), Number(avgFillDepth.toFixed(3)), Math.round(s.totalFill)]);
            row.eachCell(c => c.border = { top: {style:'thin', color: {argb:'FF64748B'}}, left: {style:'thin', color: {argb:'FF64748B'}}, bottom: {style:'thin', color: {argb:'FF64748B'}}, right: {style:'thin', color: {argb:'FF64748B'}} });
            row.getCell(6).font = { color: { argb: 'FFDC2626' } };
            row.getCell(7).font = { color: { argb: 'FFDC2626' }, bold: true }; // Cut
            row.getCell(8).font = { color: { argb: 'FF16A34A' } };
            row.getCell(9).font = { color: { argb: 'FF16A34A' }, bold: true }; // Fill
        });

        Object.keys(PIPELINE.sheets).forEach(k => {
            let s = PIPELINE.sheets[k];
            let validSheetName = k.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 31);
            let ws = wb.addWorksheet(validSheetName);
            
            ws.columns = [
                { width: 10 }, { width: 18 },
                { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 15 },
                { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 15 },
                { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }
            ];

            let titleRow1 = ws.addRow([`Takeoff Stage: ${s.roleA} ➔ ${s.roleB}  |  Soil Type: ${s.remark || 'N/A'}  |  Boundary Area: ${Number(s.area.toFixed(2))} m²`]);
            titleRow1.font = { bold: true };
            ws.mergeCells('A1:P1');
            
            let titleRow2 = ws.addRow([`Base Layer: ${s.lyrA}  |  Target Layer: ${s.lyrB}  |  Total Cut: ${Math.round(s.totalCut)} m³  |  Total Fill: ${Math.round(s.totalFill)} m³`]);
            titleRow2.font = { bold: true };
            ws.mergeCells('A2:P2');
            
            let row1 = ws.addRow(["Grid ID", "Clipped Area (m²)", `Level A: ${s.roleA} (${s.lyrA})`, "", "", "", "", `Level B: ${s.roleB} (${s.lyrB})`, "", "", "", "", "Cutting Details", "", "Filling Details", ""]);
            let rowOffset = 3;
            ws.mergeCells(`A${rowOffset}:A${rowOffset+1}`); ws.mergeCells(`B${rowOffset}:B${rowOffset+1}`);
            ws.mergeCells(`C${rowOffset}:G${rowOffset}`); ws.mergeCells(`H${rowOffset}:L${rowOffset}`);
            ws.mergeCells(`M${rowOffset}:N${rowOffset}`); ws.mergeCells(`O${rowOffset}:P${rowOffset}`);
            
            let row2 = ws.addRow(["", "", "SW RL", "SE RL", "NE RL", "NW RL", "Mean RL", "SW RL", "SE RL", "NE RL", "NW RL", "Mean RL", "Avg. Depth (m)", "Volume (m³)", "Avg. Depth (m)", "Volume (m³)"]);
            
            [row1, row2].forEach(r => {
                r.font = { bold: true, color: { argb: 'FF000000' } };
                r.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                r.eachCell(c => c.border = { top: {style:'medium', color:{argb:'FF000000'}}, left: {style:'thin', color:{argb:'FF64748B'}}, bottom: {style:'medium', color:{argb:'FF000000'}}, right: {style:'thin', color:{argb:'FF64748B'}} });
            });
            // Outer verticals
            [row1, row2].forEach(r => {
                [3, 8, 13, 15].forEach(colIdx => {
                    let b = r.getCell(colIdx).border || {};
                    r.getCell(colIdx).border = { ...b, left: {style:'medium', color:{argb:'FF000000'}} };
                });
                [7, 12, 14, 16].forEach(colIdx => {
                    let b = r.getCell(colIdx).border || {};
                    r.getCell(colIdx).border = { ...b, right: {style:'medium', color:{argb:'FF000000'}} };
                });
                r.getCell(1).border = { ...r.getCell(1).border, left: {style:'medium', color:{argb:'FF000000'}}, right: {style:'medium', color:{argb:'FF000000'}} };
                r.getCell(2).border = { ...r.getCell(2).border, right: {style:'medium', color:{argb:'FF000000'}} };
            });

            row1.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
            row1.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } };
            row1.getCell(13).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
            row1.getCell(15).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
            
            row2.eachCell(c => {
                if(!c.fill || c.fill.type !== 'pattern') {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
                }
            });
            
            // Freeze panes
            ws.views = [{ state: 'frozen', xSplit: 1, ySplit: 4 }];
            
            s.cells.forEach(c => {
                let r = ws.addRow([
                    c.boxId, Number(c.area.toFixed(2)),
                    Number(c.a1.toFixed(3)), Number(c.a2.toFixed(3)), Number(c.a3.toFixed(3)), Number(c.a4.toFixed(3)), Number(c.avgA.toFixed(3)),
                    Number(c.b1.toFixed(3)), Number(c.b2.toFixed(3)), Number(c.b3.toFixed(3)), Number(c.b4.toFixed(3)), Number(c.avgB.toFixed(3)),
                    c.cutDepth > 0 ? Number(c.cutDepth.toFixed(3)) : 0, c.cutQty > 0 ? Math.round(c.cutQty) : 0,
                    c.fillDepth > 0 ? Number(c.fillDepth.toFixed(3)) : 0, c.fillQty > 0 ? Math.round(c.fillQty) : 0
                ]);
                r.getCell(13).font = { color: { argb: 'FFDC2626' } }; r.getCell(14).font = { color: { argb: 'FFDC2626' }, bold: true };
                r.getCell(15).font = { color: { argb: 'FF16A34A' } }; r.getCell(16).font = { color: { argb: 'FF16A34A' }, bold: true };
                r.eachCell(cell => { cell.border = { top: {style:'thin', color:{argb:'FF9CA3AF'}}, left: {style:'thin', color:{argb:'FF9CA3AF'}}, bottom: {style:'thin', color:{argb:'FF9CA3AF'}}, right: {style:'thin', color:{argb:'FF9CA3AF'}} }; });
            });
        });

        const buffer = await wb.xlsx.writeBuffer();"""

content = excel_code_pattern.sub(new_excel_code, content)

with open('index.html', 'w') as f:
    f.write(content)
