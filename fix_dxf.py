import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. DXF layers setup
setup_old = """        // Establish output primitive layers
        let layersSetupMap = [
            { name: '0', color: 7 },
            { name: 'SITE_BOUNDARY', color: boundaryColorIndex },
            { name: 'GRID_CUT_BOXES', color: 1 },  // Red boxes for Cut lines
            { name: 'GRID_FILL_BOXES', color: 3 }, // Green boxes for Fill lines
            { name: 'TEXT_METRICS_LABELS', color: 2 } 
        ];

        layersSetupMap.forEach(lyr => {"""

setup_new = """        // Establish output primitive layers
        let layersSetupMap = [
            { name: '0', color: 7 },
            { name: PIPELINE.activeBoundsLayer || 'SITE_BOUNDARY', color: boundaryColorIndex },
            { name: 'GRID_CUT_BOXES', color: 1 },  // Red boxes for Cut lines
            { name: 'GRID_FILL_BOXES', color: 3 }, // Green boxes for Fill lines
            { name: 'TEXT_METRICS_LABELS', color: 2 } 
        ];
        
        if (PIPELINE.sheets) {
            Object.keys(PIPELINE.sheets).forEach(k => {
                let s = PIPELINE.sheets[k];
                if (s.lyrA && !layersSetupMap.find(l => l.name === s.lyrA)) {
                    layersSetupMap.push({ name: s.lyrA, color: PIPELINE.layerColors[s.lyrA] || 7 });
                }
                if (s.lyrB && !layersSetupMap.find(l => l.name === s.lyrB)) {
                    layersSetupMap.push({ name: s.lyrB, color: PIPELINE.layerColors[s.lyrB] || 4 });
                }
            });
        }

        layersSetupMap.forEach(lyr => {"""
content = content.replace(setup_old, setup_new)

# 2. Site boundary polyline layer
boundary_old = """        stream += `  0\\nLWPOLYLINE\\n  8\\nSITE_BOUNDARY\\n 90\\n${PIPELINE.polygonBounds.length}\\n 70\\n1\\n 43\\n${globalBoundaryWidth}\\n 370\\n100\\n`;"""
boundary_new = """        stream += `  0\\nLWPOLYLINE\\n  8\\n${PIPELINE.activeBoundsLayer || 'SITE_BOUNDARY'}\\n 90\\n${PIPELINE.polygonBounds.length}\\n 70\\n1\\n 43\\n${globalBoundaryWidth}\\n 370\\n100\\n`;"""
content = content.replace(boundary_old, boundary_new)

# 3. Legend layer names logic update
legend_old = """            // Site Boundary Box
            stream += `  0\\nLWPOLYLINE\\n  8\\nTEXT_METRICS_LABELS\\n 90\\n4\\n 70\\n1\\n 62\\n${boundaryColorIndex}\\n`;
            stream += ` 10\\n${tbMinX + 1.5}\\n 20\\n${curY - 0.75}\\n 10\\n${tbMinX + 3.0}\\n 20\\n${curY - 0.75}\\n 10\\n${tbMinX + 3.0}\\n 20\\n${curY + 0.75}\\n 10\\n${tbMinX + 1.5}\\n 20\\n${curY + 0.75}\\n`;
            stream += `  0\\nTEXT\\n  8\\nTEXT_METRICS_LABELS\\n 62\\n7\\n 10\\n${tbMinX + 4.5}\\n 20\\n${curY - 0.3}\\n 40\\n0.6\\n  1\\nSite Perimeter Boundary\\n`; curY -= lnStep;"""
legend_new = """            // Site Boundary Box
            stream += `  0\\nLWPOLYLINE\\n  8\\nTEXT_METRICS_LABELS\\n 90\\n4\\n 70\\n1\\n 62\\n${boundaryColorIndex}\\n`;
            stream += ` 10\\n${tbMinX + 1.5}\\n 20\\n${curY - 0.75}\\n 10\\n${tbMinX + 3.0}\\n 20\\n${curY - 0.75}\\n 10\\n${tbMinX + 3.0}\\n 20\\n${curY + 0.75}\\n 10\\n${tbMinX + 1.5}\\n 20\\n${curY + 0.75}\\n`;
            stream += `  0\\nTEXT\\n  8\\nTEXT_METRICS_LABELS\\n 62\\n7\\n 10\\n${tbMinX + 4.5}\\n 20\\n${curY - 0.3}\\n 40\\n0.6\\n  1\\nSite Perimeter Boundary (${PIPELINE.activeBoundsLayer})\\n`; curY -= lnStep;"""
content = content.replace(legend_old, legend_new)

# 4. Text generation in loops for levels
text_old = """            // 2. Draw 4 Corner dual levels (Top/Bottom independently colored) ONE TIME PER VERTEX
            uniqueDxfNodes.forEach(cn => {
                let posX = cn.alignRight ? cn.x - 1.1 : cn.x + 0.1;
                stream += `  0\\nTEXT\\n  8\\nTEXT_METRICS_LABELS\\n 62\\n${colA}\\n 10\\n${posX}\\n 20\\n${cn.y + 0.1}\\n 40\\n0.12\\n  1\\n${cn.a.toFixed(3)}\\n`;
                stream += `  0\\nTEXT\\n  8\\nTEXT_METRICS_LABELS\\n 62\\n${colB}\\n 10\\n${posX}\\n 20\\n${cn.y - 0.08}\\n 40\\n0.12\\n  1\\n${cn.b.toFixed(3)}\\n`;
            });"""
text_new = """            // 2. Draw 4 Corner dual levels (Top/Bottom independently colored) ONE TIME PER VERTEX
            uniqueDxfNodes.forEach(cn => {
                let posX = cn.alignRight ? cn.x - 0.8 : cn.x + 0.08;
                stream += `  0\\nTEXT\\n  8\\n${s.lyrA}\\n 62\\n${colA}\\n 10\\n${posX}\\n 20\\n${cn.y + 0.08}\\n 40\\n0.12\\n  1\\n${cn.a.toFixed(3)}\\n`;
                stream += `  0\\nTEXT\\n  8\\n${s.lyrB}\\n 62\\n${colB}\\n 10\\n${posX}\\n 20\\n${cn.y - 0.20}\\n 40\\n0.12\\n  1\\n${cn.b.toFixed(3)}\\n`;
            });"""
content = content.replace(text_old, text_new)

with open('index.html', 'w') as f:
    f.write(content)
