import re

with open('index.html', 'r') as f:
    content = f.read()

old_code = """                    if (database) { database.delete(); database = null; }
                    if (fileHandler) { fileHandler.delete(); fileHandler = null; }
                    setStatus(`Failed to read DWG structure natively. Format: ${dwgVersionName}. Attempting heuristic fallback extraction...`, "warning");
                    heuristicDwgFallbackParser(buffer, dwgVersionName);
                } catch (innerErr) {
                    if (dwg) { try { dwg.delete(); } catch(e){} }
                    if (database) { try { database.delete(); } catch(e){} }
                    if (fileHandler) { try { fileHandler.delete(); } catch(e){} }
                    throw innerErr;
                }
            }).catch(e => {
                console.error("DWG to DXF error:", e);
                setStatus(`Error in native DWG conversion engine. Attempting heuristic fallback extraction...`, "warning");
                heuristicDwgFallbackParser(buffer, dwgVersionName);
            });"""

new_code = """                    if (database) { database.delete(); database = null; }
                    if (fileHandler) { fileHandler.delete(); fileHandler = null; }
                    setStatus(`Failed to read DWG structure natively (Result=False). Format: ${dwgVersionName}. Attempting heuristic fallback extraction...`, "warning");
                    heuristicDwgFallbackParser(buffer, dwgVersionName);
                } catch (innerErr) {
                    if (dwg) { try { dwg.delete(); } catch(e){} }
                    if (database) { try { database.delete(); } catch(e){} }
                    if (fileHandler) { try { fileHandler.delete(); } catch(e){} }
                    throw innerErr;
                }
            }).catch(e => {
                console.error("DWG to DXF error:", e);
                let errorMsg = e ? (e.message || e.toString()) : "Unknown error";
                setStatus(`DWG engine error: ${errorMsg}. Attempting heuristic fallback...`, "warning");
                heuristicDwgFallbackParser(buffer, dwgVersionName);
            });"""

content = content.replace(old_code, new_code)

with open('index.html', 'w') as f:
    f.write(content)
