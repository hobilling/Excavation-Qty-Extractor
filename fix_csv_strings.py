import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('Number(s.totalCut.toFixed(2))', 's.totalCut.toFixed(2)')
content = content.replace('Number(s.totalFill.toFixed(2))', 's.totalFill.toFixed(2)')
content = content.replace('Number(c.cutQty.toFixed(2))', 'c.cutQty.toFixed(2)')
content = content.replace('Number(c.fillQty.toFixed(2))', 'c.fillQty.toFixed(2)')

# Bring back Number() for ExcelJS where needed (which I just replaced again)
content = content.replace(
    'row = wsSummary.addRow([k, s.remark || \'-\', s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(avgCutDepth.toFixed(3)), s.totalCut.toFixed(2), Number(avgFillDepth.toFixed(3)), s.totalFill.toFixed(2)]);',
    'row = wsSummary.addRow([k, s.remark || \'-\', s.lyrA, s.lyrB, Number(s.area.toFixed(2)), Number(avgCutDepth.toFixed(3)), Number(s.totalCut.toFixed(2)), Number(avgFillDepth.toFixed(3)), Number(s.totalFill.toFixed(2))]);'
)

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
