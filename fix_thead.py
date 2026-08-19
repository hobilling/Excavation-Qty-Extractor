import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace all table-responsive sticky css
css_old = """.table-responsive thead { position: sticky; top: 0; z-index: 10; }
        .table-responsive thead th { position: sticky; top: 0; z-index: 10; background-color: #f8fafc !important; outline: 1px solid #dee2e6; outline-offset: -1px; }
        .table-responsive thead tr:first-child th { height: 32px; padding-top: 4px; padding-bottom: 4px; box-sizing: border-box; border-bottom: none !important; }
        .table-responsive thead tr:nth-child(2) th { top: 31px; border-top: 1px solid #dee2e6 !important; }"""

css_new = """.table-responsive thead { position: sticky; top: 0; z-index: 10; }
        .table-responsive thead th { background-color: #f8fafc !important; outline: 1px solid #dee2e6; outline-offset: -1px; padding-top: 4px; padding-bottom: 4px; }
        .table-responsive thead tr:nth-child(2) th { border-top: none !important; }"""

content = content.replace(css_old, css_new)

with open('index.html', 'w') as f:
    f.write(content)
