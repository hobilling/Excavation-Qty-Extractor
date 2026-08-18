import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

// I will insert a debug output into the DWG parsing that shows the properties of the first feature that is a Point.
const debugPatch = `
                    let firstText = null;
                    geojson.features.forEach(f => {
                        if (!firstText && f.geometry.type === 'Point' && f.properties) {
                            let propKeys = Object.keys(f.properties).filter(k => k.includes('text') || k.includes('val') || k.includes('str') || typeof f.properties[k] === 'string');
                            if (propKeys.length > 0) {
                                firstText = JSON.stringify(f.properties);
                            }
                        }
                        
                        let lyr = f.properties.layer || '0';
`;

html = html.replace('geojson.features.forEach(f => {\\n                        let lyr = f.properties.layer', debugPatch);
// Actually it's easier to just alert or display it.
