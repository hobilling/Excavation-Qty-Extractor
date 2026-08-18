import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const freezeCSS = `
        /* Sticky Table Headers and Columns */
        .table-responsive { max-height: 450px; overflow: auto; position: relative; }
        .table-freeze thead th { position: sticky; top: 0; z-index: 10; background-color: #f8fafc; box-shadow: inset 0 -1px 0 #cbd5e1, inset 0 1px 0 #cbd5e1; }
        .table-freeze thead tr:nth-child(2) th { top: 31px; /* approximate height of first row */ }
        .table-freeze tbody td:nth-child(1),
        .table-freeze tbody td:nth-child(2),
        .table-freeze thead th:nth-child(1),
        .table-freeze thead th:nth-child(2) {
            position: sticky;
            left: 0;
            background-color: #fff;
            z-index: 11;
            box-shadow: inset -1px 0 0 #cbd5e1;
        }
        .table-freeze thead th:nth-child(1),
        .table-freeze thead th:nth-child(2) {
            z-index: 12;
            background-color: #f8fafc;
        }
`;

html = html.replace('</style>', freezeCSS + '</style>');
html = html.replace('<table class="table table-bordered text-center align-middle m-0">', '<table class="table table-bordered text-center align-middle m-0 table-freeze">');

fs.writeFileSync('index.html', html);
