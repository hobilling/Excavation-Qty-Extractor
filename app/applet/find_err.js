const fs = require('fs');
const vm = require('vm');
let html = fs.readFileSync('index.html', 'utf8');
const s1 = html.indexOf('<script>');
const s2 = html.lastIndexOf('</script>');
const scriptContent = html.substring(s1 + 8, s2);
const lines = scriptContent.split('\n');

for (let i = 1145; i < Math.min(1170, lines.length); i++) {
    console.log(`${i+1}: ${lines[i]}`);
}

for (let i = 1; i <= lines.length; i++) {
    let snippet = lines.slice(0, i).join('\n');
    try {
        new vm.Script(snippet);
    } catch (e) {
        if (!e.message.includes('Unexpected end of input')) {
            console.log('First error at line ' + i + ': ' + e.message);
            console.log('Line ' + i + ': ' + lines[i-1]);
            for (let j = Math.max(0, i - 10); j < i; j++) {
                console.log(`${j+1}: ${lines[j]}`);
            }
            break;
        }
    }
}
