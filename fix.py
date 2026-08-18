import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. App name
content = content.replace("CivilEngine Ultimate Pro - Precision Earthwork Takeoff", "Excavation Quantity Extractor")
content = content.replace("CivilEngine Pro: Earthwork Takeoff & Grid Inspector", "Excavation Quantity Extractor")
content = content.replace("CivilEngine Pro - Earthwork Takeoff Report Summary", "Excavation Quantity Extractor - Report Summary")
content = content.replace("CivilEngine_Earthwork_Takeoff_Ledger", "Excavation_Quantity_Extractor_Ledger")

# 2. Header layout
# We want to put status notification right after the brand name.
header_html = """        <a class="navbar-brand fw-bold text-dark d-flex align-items-center gap-2 mb-0 py-0" href="#" style="font-size: 1.05rem;">
            📐 Excavation Quantity Extractor
        </a>
        <div id="headerStatusWrapper" class="d-flex align-items-center gap-2 py-1 px-3 bg-light border rounded shadow-sm" style="max-width: 650px;">"""
content = re.sub(r'<a class="navbar-brand[^>]+>.*?</a>\s*<div id="headerStatusWrapper"[^>]+>', header_html, content, flags=re.DOTALL)

# 3. Cards Custom Soil Type
# Remove ${soilTitle} from the flex div and put it below
# Original:
# <span style="color: ${colHexB};">▪ ${sheet.roleB}</span>
# ${soilTitle}
# </div>
content = re.sub(r'(<span style="color: \$\{colHexB\};">▪ \$\{sheet\.roleB\}</span>)\s*\$\{soilTitle\}\s*(</div>)', r'\1\n                                \2\n                            <div class="mt-1">${soilTitle}</div>', content)
# And update soilTitle definition
content = content.replace(
    "let soilTitle = (sheet.remark && sheet.remark.trim() !== '') ? `<span class=\"text-secondary fw-normal ms-1\">(${sheet.remark.trim()})</span>` : '';",
    "let soilTitle = (sheet.remark && sheet.remark.trim() !== '') ? `<span class=\"text-secondary fw-normal small\">Custom Soil Type: ${sheet.remark.trim()}</span>` : '';"
)

# 4. Table view freeze top headers
# We'll just add the CSS class
css_addition = """
        .table-responsive thead { position: sticky; top: 0; z-index: 10; }
        .table-responsive thead th { position: sticky; top: 0; z-index: 10; background-color: #f8fafc !important; }
        .table-responsive thead tr:nth-child(2) th { top: 32px; }
"""
content = content.replace('.table-responsive { max-height: 450px; overflow-y: auto; font-size: 0.82rem; }', 
                          '.table-responsive { max-height: 450px; overflow-y: auto; font-size: 0.82rem; }\n' + css_addition)

with open('index.html', 'w') as f:
    f.write(content)
