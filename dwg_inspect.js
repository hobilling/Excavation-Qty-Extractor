import { readFile } from 'node:fs/promises';
import init, { convert } from 'dwg2geo';

async function run() {
    const wasm = await readFile('./node_modules/dwg2geo/dwg2geo_wasm_bg.wasm');
    await init({ module_or_path: wasm });
    
    // read drawing.dwg if we have one
    // wait, do we have a drawing.dwg uploaded by user in the environment?
    // let's check
}
run();
