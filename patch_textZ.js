import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldTextZ = `                        let textZ = null;
                        if (f.properties && typeof f.properties.text === 'string') {
                            let parsed = parseFloat(f.properties.text);
                            if (!isNaN(parsed)) textZ = parsed;
                        } else if (f.properties && typeof f.properties.value === 'string') {
                            let parsed = parseFloat(f.properties.value);
                            if (!isNaN(parsed)) textZ = parsed;
                        }`;

const newTextZ = `                        let textZ = null;
                        if (f.properties) {
                            // Try likely text keys first
                            let possibleKeys = ['text', 'text_raw', 'value', 'content', 'label', 'string'];
                            for (let k of possibleKeys) {
                                if (typeof f.properties[k] === 'string') {
                                    let parsed = parseFloat(f.properties[k]);
                                    if (!isNaN(parsed)) {
                                        textZ = parsed;
                                        break;
                                    }
                                }
                            }
                            
                            // If still not found, search all properties except layer-related
                            if (textZ === null) {
                                for (let k in f.properties) {
                                    if (k === 'layer' || k === 'linetype' || k === 'handle' || k.includes('color')) continue;
                                    let val = f.properties[k];
                                    if (typeof val === 'string') {
                                        let parsed = parseFloat(val);
                                        if (!isNaN(parsed)) {
                                            textZ = parsed;
                                            break;
                                        }
                                    }
                                }
                            }
                        }`;

html = html.replace(oldTextZ, newTextZ);
fs.writeFileSync('index.html', html);
