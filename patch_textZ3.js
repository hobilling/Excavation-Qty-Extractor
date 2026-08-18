import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldTextZ = `                        let textZ = null;
                        if (f.properties) {
                            // Try likely text keys first
                            let possibleKeys = ['text', 'text_raw', 'value', 'content', 'label', 'string', 'elevation', 'z_elevation'];
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

const newTextZ = `                        let textZ = null;
                        if (f.properties) {
                            let possibleKeys = ['text', 'text_raw', 'value', 'content', 'label', 'string', 'elevation', 'z_elevation'];
                            for (let k of possibleKeys) {
                                let val = f.properties[k];
                                if (val !== undefined && val !== null) {
                                    let parsed = typeof val === 'string' ? parseFloat(val) : (typeof val === 'number' ? val : NaN);
                                    if (!isNaN(parsed)) {
                                        textZ = parsed;
                                        break;
                                    }
                                }
                            }
                            
                            if (textZ === null) {
                                for (let k in f.properties) {
                                    if (k === 'layer' || k === 'linetype' || k === 'handle' || k.includes('color')) continue;
                                    let val = f.properties[k];
                                    if (val !== undefined && val !== null) {
                                        let parsed = typeof val === 'string' ? parseFloat(val) : (typeof val === 'number' ? val : NaN);
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
