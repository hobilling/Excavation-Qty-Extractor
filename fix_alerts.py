import re
with open('index.html', 'r') as f:
    content = f.read()

content = content.replace("alert(`NATIVE ENGINE FAILED (Result=False). Format: ${dwgVersionName}.`);", "")

with open('index.html', 'w') as f:
    f.write(content)
