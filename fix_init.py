import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace window.createLibDxfRwModule initialization check inside handleFileUpload
old_check = """            if (!window.createLibDxfRwModule) {
                setStatus("DWG to DXF engine is still loading. Please try again in a few seconds.", "warning");
                return;
            }"""

new_check = """            if (!window.createLibDxfRwModule) {
                console.warn("window.createLibDxfRwModule not found yet. Proceeding with fallback parsing...");
                setStatus("Native DWG engine is unavailable. Attempting heuristic fallback extraction...", "warning");
                heuristicDwgFallbackParser(buffer, dwgVersionName);
                return;
            }"""

content = content.replace(old_check, new_check)

with open('index.html', 'w') as f:
    f.write(content)
