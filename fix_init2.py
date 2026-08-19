import re

with open('index.html', 'r') as f:
    content = f.read()

# Make sure we assign the variables properly at the top of the file before usage
# Wait, they are exported via vite module bundler in a `<script type="module">`.
# If vite finishes parsing, `window.createLibDxfRwModule` is added.
# In GitHub pages, the base URL for the wasm paths might be broken causing the module script to fail or stall.
# Let's inspect vite.config.ts if it exists.
