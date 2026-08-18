import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const oldBounds = `        computeWorldBounds: function() {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            
            if (PIPELINE.polygonBounds && PIPELINE.polygonBounds.length > 0) {
                PIPELINE.polygonBounds.forEach(pt => {
                    if (pt[0] < minX) minX = pt[0]; if (pt[0] > maxX) maxX = pt[0];
                    if (pt[1] < minY) minY = pt[1]; if (pt[1] > maxY) maxY = pt[1];
                });
            }
            
            Object.keys(PIPELINE.points).forEach(lyr => {
                PIPELINE.points[lyr].forEach(p => {
                    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
                    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
                });
            });

            if (minX === Infinity) { minX = 0; maxX = 100; minY = 0; maxY = 100; }
            this.bounds = { minX, maxX, minY, maxY };
        },`;

const newBounds = `        computeWorldBounds: function() {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            
            if (PIPELINE.polygonBounds && PIPELINE.polygonBounds.length > 0) {
                PIPELINE.polygonBounds.forEach(pt => {
                    if (pt[0] < minX) minX = pt[0]; if (pt[0] > maxX) maxX = pt[0];
                    if (pt[1] < minY) minY = pt[1]; if (pt[1] > maxY) maxY = pt[1];
                });
            } else {
                Object.keys(PIPELINE.points).forEach(lyr => {
                    PIPELINE.points[lyr].forEach(p => {
                        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
                        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
                    });
                });
            }

            if (minX === Infinity) { minX = 0; maxX = 100; minY = 0; maxY = 100; }
            this.bounds = { minX, maxX, minY, maxY };
        },`;

html = html.replace(oldBounds, newBounds);
fs.writeFileSync('index.html', html);
