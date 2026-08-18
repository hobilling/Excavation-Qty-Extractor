import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace("EARTHWORK TAKEOFF LEDGER EXPORT", "EXCAVATION QUANTITY LEDGER EXPORT")
content = content.replace("Earthwork_Takeoff_Ledger", "Excavation_Quantity_Ledger")
content = content.replace("s.totalCut.toFixed(3)", "Math.round(s.totalCut)")
content = content.replace("s.totalFill.toFixed(3)", "Math.round(s.totalFill)")
content = content.replace("c.cutQty.toFixed(3)", "Math.round(c.cutQty)")
content = content.replace("c.fillQty.toFixed(3)", "Math.round(c.fillQty)")

with open('index.html', 'w') as f:
    f.write(content)
