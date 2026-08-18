import re

with open('index.html', 'r') as f:
    content = f.read()

# Revert all global replacements
content = content.replace('justify-content-start align-items-center gap-3', 'justify-content-between align-items-center gap-2')

# Now specifically target the navbar
navbar_html_old = """<nav class="navbar navbar-expand-lg navbar-light bg-white py-2 px-3 border-bottom shadow-sm flex-shrink-0">
    <div class="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-2">"""

navbar_html_new = """<nav class="navbar navbar-expand-lg navbar-light bg-white py-2 px-3 border-bottom shadow-sm flex-shrink-0">
    <div class="container-fluid d-flex flex-wrap justify-content-start align-items-center gap-3">"""

content = content.replace(navbar_html_old, navbar_html_new)

with open('index.html', 'w') as f:
    f.write(content)
