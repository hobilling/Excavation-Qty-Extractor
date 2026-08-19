import re

with open('index.html', 'r') as f:
    content = f.read()

old_code = """const resolvedDxfWasm = new URL(wasmUrl, import.meta.url).href;
const resolvedDwg2GeoWasm = new URL(dwg2geoWasmUrl, import.meta.url).href;

window.convertDwg2Geo = convertDwg2Geo;
initDwg2Geo({ module_or_path: resolvedDwg2GeoWasm }).then(() => {
    window.dwg2geoLoaded = true;
}).catch(e => console.error("dwg2geo init error:", e));

window.createLibDxfRwModule = async (options = {}) => {
    return createModule({
        locateFile: (path) => {
            if (path.endsWith('.wasm')) {
                return resolvedDxfWasm;
            }
            return path;
        },
        ...options
    });
};"""

new_code = """window.convertDwg2Geo = convertDwg2Geo;
initDwg2Geo({ module_or_path: dwg2geoWasmUrl }).then(() => {
    window.dwg2geoLoaded = true;
}).catch(e => console.error("dwg2geo init error:", e));

window.createLibDxfRwModule = async (options = {}) => {
    return createModule({
        locateFile: (path) => {
            if (path.endsWith('.wasm')) {
                return wasmUrl;
            }
            return path;
        },
        ...options
    });
};"""

content = content.replace(old_code, new_code)

with open('index.html', 'w') as f:
    f.write(content)
