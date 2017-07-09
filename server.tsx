import * as React from 'react';
import * as express from 'express';
import * as webpack from 'webpack';
import { renderToString } from 'react-dom/server';

import App from './components/App';

interface ServerRendererArguments {
    clientStats: webpack.Stats;
    serverStats: webpack.Stats;
    foo: string; // TODO
}

/**
 * Universal render function in development mode
 */
export default function serverRenderer({ clientStats, serverStats, foo }: ServerRendererArguments) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

