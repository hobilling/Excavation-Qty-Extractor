import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('.table-responsive thead tr:nth-child(2) th { top: 32px; }', '.table-responsive thead tr:nth-child(2) th { top: 30px; }')

with open('index.html', 'w') as f:
    f.write(content)
