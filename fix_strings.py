import re

with open('index.html', 'r') as f:
    content = f.read()

# UI Table Volumes
content = content.replace('Number(c.cutQty.toFixed(2))', 'c.cutQty.toFixed(2)')
content = content.replace('Number(c.fillQty.toFixed(2))', 'c.fillQty.toFixed(2)')
content = content.replace('Number(sheet.totalCut.toFixed(2))', 'sheet.totalCut.toFixed(2)')
content = content.replace('Number(sheet.totalFill.toFixed(2))', 'sheet.totalFill.toFixed(2)')
content = content.replace('Number((sheet.totalFill - sheet.totalCut).toFixed(2))', '(sheet.totalFill - sheet.totalCut).toFixed(2)')

# DXF Legends Volumes (already replaced in the above pass if they were exactly matching)
content = content.replace('Number(s.totalCut.toFixed(2))', 's.totalCut.toFixed(2)')
content = content.replace('Number(s.totalFill.toFixed(2))', 's.totalFill.toFixed(2)')
# Wait, s.totalCut.toFixed(2) in Excel is now a string! 
# We need to ensure Excel gets Numbers. Let's fix that next.

with open('index.html', 'w') as f:
    f.write(content)
