import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const broken = `    /**
     * EXACT SUTHERLAND-HODGMAN POLYGON CLIPPING ENGINE
     * Clips the arbitrary site boundary against the strictly convex Grid Box 
     */
 - p1[0]) >= -1e-9;
    }`;

const fixed = `    /**
     * EXACT SUTHERLAND-HODGMAN POLYGON CLIPPING ENGINE
     * Clips the arbitrary site boundary against the strictly convex Grid Box 
     */
    function isInsideEdge(pt, p1, p2) {
        return (p2[0] - p1[0]) * (pt[1] - p1[1]) - (p2[1] - p1[1]) * (pt[0] - p1[0]) >= -1e-9;
    }`;

html = html.replace(broken, fixed);
fs.writeFileSync('index.html', html);
