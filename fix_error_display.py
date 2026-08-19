import re

with open('index.html', 'r') as f:
    content = f.read()

# Pass the error string into the fallback parser
old_call1 = "heuristicDwgFallbackParser(buffer, dwgVersionName);"
new_call1 = "heuristicDwgFallbackParser(buffer, dwgVersionName, 'Result=False');"

old_call2 = "heuristicDwgFallbackParser(buffer, dwgVersionName);"
new_call2 = "heuristicDwgFallbackParser(buffer, dwgVersionName, innerErr.message || innerErr.toString());"

old_call3 = "heuristicDwgFallbackParser(buffer, dwgVersionName);"
new_call3 = "heuristicDwgFallbackParser(buffer, dwgVersionName, errorMsg);"

# It's better to just regex replace the function signature and add a parameter
old_sig = "function heuristicDwgFallbackParser(buffer, dwgVersionName) {"
new_sig = "function heuristicDwgFallbackParser(buffer, dwgVersionName, engineError = '') {"

old_status = 'setStatus(`DWG native parsing failed. Extracted ${totalPts} points via binary heuristic fallback across ${PIPELINE.layers.size} exact drawing layers.`, "warning");'
new_status = 'setStatus(`DWG native parsing failed (${engineError}). Extracted ${totalPts} points via binary heuristic fallback across ${PIPELINE.layers.size} exact drawing layers.`, "warning");'

content = content.replace(old_sig, new_sig)
content = content.replace(old_status, new_status)

# Now fix the calls
content = content.replace("""setStatus(`Failed to read DWG structure natively (Result=False). Format: ${dwgVersionName}. Attempting heuristic fallback extraction...`, "warning");
                    heuristicDwgFallbackParser(buffer, dwgVersionName);""", """setStatus(`Failed to read DWG structure natively (Result=False). Format: ${dwgVersionName}. Attempting heuristic fallback extraction...`, "warning");
                    heuristicDwgFallbackParser(buffer, dwgVersionName, 'Read returned false');""")

content = content.replace("""alert(`NATIVE ENGINE CRASHED: ` + (innerErr.message || innerErr.toString()));
                    throw innerErr;""", """heuristicDwgFallbackParser(buffer, dwgVersionName, 'Crash: ' + (innerErr.message || innerErr.toString()));""")

content = content.replace("""alert(`NATIVE ENGINE LOAD ERROR: ` + errorMsg);
                setStatus(`DWG engine error: ${errorMsg}. Attempting heuristic fallback...`, "warning");
                heuristicDwgFallbackParser(buffer, dwgVersionName);""", """setStatus(`DWG engine error: ${errorMsg}. Attempting heuristic fallback...`, "warning");
                heuristicDwgFallbackParser(buffer, dwgVersionName, 'Load Error: ' + errorMsg);""")

with open('index.html', 'w') as f:
    f.write(content)
