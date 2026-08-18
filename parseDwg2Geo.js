export function parseDwg2Geo(result) {
    let geojson = JSON.parse(result.geojson);
    
    PIPELINE.layers.clear();
    PIPELINE.points = {};
    PIPELINE.boundaries = {};
    
    let layerColors = {};
    
    geojson.features.forEach(f => {
        let lyr = f.properties.layer || '0';
        PIPELINE.layers.add(lyr);
        if (f.properties.color_index !== undefined) {
            layerColors[lyr] = f.properties.color_index;
        }
        
        let type = f.geometry.type;
        let coords = f.geometry.coordinates;
        
        if (!PIPELINE.points[lyr]) PIPELINE.points[lyr] = [];
        
        if (type === 'Point') {
            PIPELINE.points[lyr].push({ x: coords[0], y: coords[1], z: coords[2] || 0 });
        } else if (type === 'LineString') {
            coords.forEach(pt => {
                PIPELINE.points[lyr].push({ x: pt[0], y: pt[1], z: pt[2] || 0 });
            });
            // also consider it for boundaries if long enough
            if (!PIPELINE.boundaries[lyr] || coords.length > PIPELINE.boundaries[lyr].length) {
                PIPELINE.boundaries[lyr] = coords;
            }
        } else if (type === 'Polygon') {
            let ring = coords[0];
            ring.forEach(pt => {
                PIPELINE.points[lyr].push({ x: pt[0], y: pt[1], z: pt[2] || 0 });
            });
            if (!PIPELINE.boundaries[lyr] || ring.length > PIPELINE.boundaries[lyr].length) {
                PIPELINE.boundaries[lyr] = ring;
            }
        } else if (type === 'MultiLineString') {
            coords.forEach(line => {
                line.forEach(pt => {
                    PIPELINE.points[lyr].push({ x: pt[0], y: pt[1], z: pt[2] || 0 });
                });
                if (!PIPELINE.boundaries[lyr] || line.length > PIPELINE.boundaries[lyr].length) {
                    PIPELINE.boundaries[lyr] = line;
                }
            });
        }
    });

    PIPELINE.layerColors = layerColors;
}
