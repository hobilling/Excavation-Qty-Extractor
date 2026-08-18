import re

with open('index.html', 'r') as f:
    content = f.read()

# Fix the ExcelJS lines that were just broken by the string replacement
# Executive Summary row:
# row = wsSummary.addRow([k, s.remark || '-', s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(avgCutDepth.toFixed(3)), s.totalCut.toFixed(2), Number(avgFillDepth.toFixed(3)), s.totalFill.toFixed(2)]);
# Needs to be wrapped in Number() again.
content = content.replace(
    'row = wsSummary.addRow([k, s.remark || \'-\', s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(avgCutDepth.toFixed(3)), s.totalCut.toFixed(2), Number(avgFillDepth.toFixed(3)), s.totalFill.toFixed(2)]);',
    'row = wsSummary.addRow([k, s.remark || \'-\', s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(avgCutDepth.toFixed(3)), Number(s.totalCut.toFixed(2)), Number(avgFillDepth.toFixed(3)), Number(s.totalFill.toFixed(2))]);'
)

# Detailed title row 2:
# let titleRow2 = ws.addRow([`Base Layer: ${s.lyrA}  |  Target Layer: ${s.lyrB}  |  Total Cut: ${s.totalCut.toFixed(2)} m³  |  Total Fill: ${s.totalFill.toFixed(2)} m³`]);
# This is a string literal anyway, so s.totalCut.toFixed(2) is perfect.

# Detailed sheet rows:
# c.cutDepth > 0 ? Number(c.cutDepth.toFixed(3)) : 0, c.cutQty > 0 ? c.cutQty.toFixed(2) : 0,
# c.fillDepth > 0 ? Number(c.fillDepth.toFixed(3)) : 0, c.fillQty > 0 ? c.fillQty.toFixed(2) : 0
content = content.replace(
    'c.cutDepth > 0 ? Number(c.cutDepth.toFixed(3)) : 0, c.cutQty > 0 ? c.cutQty.toFixed(2) : 0,',
    'c.cutDepth > 0 ? Number(c.cutDepth.toFixed(3)) : 0, c.cutQty > 0 ? Number(c.cutQty.toFixed(2)) : 0,'
)
content = content.replace(
    'c.fillDepth > 0 ? Number(c.fillDepth.toFixed(3)) : 0, c.fillQty > 0 ? c.fillQty.toFixed(2) : 0',
    'c.fillDepth > 0 ? Number(c.fillDepth.toFixed(3)) : 0, c.fillQty > 0 ? Number(c.fillQty.toFixed(2)) : 0'
)

with open('index.html', 'w') as f:
    f.write(content)
