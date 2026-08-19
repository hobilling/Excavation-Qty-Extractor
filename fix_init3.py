import re

with open('index.html', 'r') as f:
    content = f.read()

# Make sure we don't block the UI execution entirely if the DWG to DXF engine didn't load.
# We also updated vite.config.ts to use `base: './'` so that WASM assets will load correctly on github pages.

