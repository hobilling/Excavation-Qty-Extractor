import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    "let possibleKeys = ['text', 'text_raw', 'value', 'content', 'label', 'string'];",
    "let possibleKeys = ['text', 'text_raw', 'value', 'content', 'label', 'string', 'elevation', 'z_elevation'];"
);

fs.writeFileSync('index.html', html);
