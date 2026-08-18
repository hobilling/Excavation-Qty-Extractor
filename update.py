import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Fix Table View Headers CSS (remove gaps)
css_old = """.table-responsive thead tr:nth-child(2) th { top: 30px; }"""
css_new = """.table-responsive thead tr:first-child th { height: 32px; padding-top: 4px; padding-bottom: 4px; box-sizing: border-box; border-bottom: none !important; }
        .table-responsive thead tr:nth-child(2) th { top: 31px; border-top: 1px solid #dee2e6 !important; }"""
content = content.replace(css_old, css_new)

# 2. Fix Excel Output Color Coding in Detailed Report Top Summary
# Also applying it to titleRow2 using richText instead of a single string
excel_summary_old = """            let titleRow2 = ws.addRow([`Base Layer: ${s.lyrA}  |  Target Layer: ${s.lyrB}  |  Total Cut: ${s.totalCut.toFixed(2)} m³  |  Total Fill: ${s.totalFill.toFixed(2)} m³`]);
            titleRow2.font = { bold: true };"""
excel_summary_new = """            let titleRow2 = ws.addRow(['']);
            titleRow2.getCell(1).value = {
                richText: [
                    { font: { bold: true, color: { argb: 'FF000000' } }, text: `Base Layer: ${s.lyrA}  |  Target Layer: ${s.lyrB}  |  Total Cut: ` },
                    { font: { bold: true, color: { argb: 'FFDC2626' } }, text: `${s.totalCut.toFixed(2)} m³` },
                    { font: { bold: true, color: { argb: 'FF000000' } }, text: `  |  Total Fill: ` },
                    { font: { bold: true, color: { argb: 'FF16A34A' } }, text: `${s.totalFill.toFixed(2)} m³` }
                ]
            };"""
content = content.replace(excel_summary_old, excel_summary_new)

# 3. Add Vertical Borders to Records
excel_border_old = """                r.eachCell(cell => { cell.border = { top: {style:'thin', color:{argb:'FF9CA3AF'}}, left: {style:'thin', color:{argb:'FF9CA3AF'}}, bottom: {style:'thin', color:{argb:'FF9CA3AF'}}, right: {style:'thin', color:{argb:'FF9CA3AF'}} }; });
            });"""
excel_border_new = """                r.eachCell(cell => { cell.border = { top: {style:'thin', color:{argb:'FF9CA3AF'}}, left: {style:'thin', color:{argb:'FF9CA3AF'}}, bottom: {style:'thin', color:{argb:'FF9CA3AF'}}, right: {style:'thin', color:{argb:'FF9CA3AF'}} }; });
                // Enforce outer vertical medium black borders matching headers
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
            });"""
content = content.replace(excel_border_old, excel_border_new)

with open('index.html', 'w') as f:
    f.write(content)
