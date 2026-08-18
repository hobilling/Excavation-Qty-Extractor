import re

with open('index.html', 'r') as f:
    content = f.read()

# Left panel classes
content = content.replace('col-xl-4 col-lg-5 transition-all', 'col-xl-4 col-lg-5 col-md-5 col-12 transition-all')

# Right panel classes
content = content.replace('col-xl-8 col-lg-7 col-12 transition-all', 'col-xl-8 col-lg-7 col-md-7 col-12 transition-all')
content = content.replace("rightPanel.className = 'col-xl-8 col-lg-7 transition-all", "rightPanel.className = 'col-xl-8 col-lg-7 col-md-7 col-12 transition-all")

# Toggle bar visibility
content = content.replace('class="d-none d-lg-flex align-items-center', 'class="d-none d-md-flex align-items-center')

# Toggle bar JS logic
js_logic_old = """    window.addEventListener('resize', () => {
        const toggleBar = document.getElementById('verticalToggleBar');
        if (toggleBar && !isLeftPanelCollapsed) {
            if (window.innerWidth >= 1200) toggleBar.style.left = '33.333%';
            else toggleBar.style.left = '41.666%';
        }
    });"""
js_logic_new = """    window.addEventListener('resize', () => {
        const toggleBar = document.getElementById('verticalToggleBar');
        if (toggleBar && !isLeftPanelCollapsed) {
            if (window.innerWidth >= 1200) toggleBar.style.left = '33.333%';
            else if (window.innerWidth >= 768) toggleBar.style.left = '41.666%';
        }
    });"""
content = content.replace(js_logic_old, js_logic_new)

with open('index.html', 'w') as f:
    f.write(content)
