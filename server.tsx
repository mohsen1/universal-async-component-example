import * as React from 'react';
import { renderToString } from 'react-dom/server';

import App from './components/App';

export default function serverRenderer({ clientStats, serverStats, foo }) {
    return (req, res, next) => {
        res.status(200).send(`
            <!doctype html>
            <html>
            <head>
                <title>${foo}</title>
            </head>
            <body>
                <div id="root">${renderToString(<App />)}</div>
                <script src="/assets/client.js"></script>
            </body>
            </html>
        `);
    };
}

