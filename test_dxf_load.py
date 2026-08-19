import re

with open('index.html', 'r') as f:
    content = f.read()

print("Original imports block:")
print(content[content.find('<script type="module">'):content.find('<script type="module">')+300])

