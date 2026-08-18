import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('<span class="text-secondary fw-normal small">Custom Soil Type: ${sheet.remark.trim()}</span>', '<span class="text-secondary fw-normal small">${sheet.remark.trim()}</span>')

with open('index.html', 'w') as f:
    f.write(content)
