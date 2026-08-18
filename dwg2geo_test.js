import { readFile } from 'node:fs/promises';
import init, { convert } from 'dwg2geo';

async function run() {
    const wasm = await readFile('./node_modules/dwg2geo/dwg2geo_wasm_bg.wasm');
    await init({ module_or_path: wasm });
    console.log("dwg2geo loaded successfully!");
}
run();
