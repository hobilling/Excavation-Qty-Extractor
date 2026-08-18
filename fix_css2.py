import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('top: 31px; /* approximate height of first row */', 'top: 30px;')
# Also ensure box-shadow for table-responsive to hide gaps
content = content.replace('.table-responsive thead th { position: sticky; top: 0; z-index: 10; background-color: #f8fafc !important; }', '.table-responsive thead th { position: sticky; top: 0; z-index: 10; background-color: #f8fafc !important; outline: 1px solid #dee2e6; outline-offset: -1px; }')

with open('index.html', 'w') as f:
    f.write(content)
