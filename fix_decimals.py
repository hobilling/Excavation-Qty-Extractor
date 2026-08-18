import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace Math.round(...) with Number(...toFixed(2))
# For variables like sheet.totalCut
content = content.replace('Math.round(sheet.totalCut)', 'Number(sheet.totalCut.toFixed(2))')
content = content.replace('Math.round(sheet.totalFill)', 'Number(sheet.totalFill.toFixed(2))')
content = content.replace('Math.round(sheet.totalFill - sheet.totalCut)', 'Number((sheet.totalFill - sheet.totalCut).toFixed(2))')
content = content.replace('Math.round(c.cutQty)', 'Number(c.cutQty.toFixed(2))')
content = content.replace('Math.round(c.fillQty)', 'Number(c.fillQty.toFixed(2))')
content = content.replace('Math.round(s.totalCut)', 'Number(s.totalCut.toFixed(2))')
content = content.replace('Math.round(s.totalFill)', 'Number(s.totalFill.toFixed(2))')

with open('index.html', 'w') as f:
    f.write(content)
