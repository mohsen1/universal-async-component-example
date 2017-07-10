import * as path from 'path';
import * as fs from 'fs';
import * as React from 'react';
import * as express from 'express';
import * as webpack from 'webpack';
import * as cheerio from 'cheerio';
// import * as MemoryFileSystem from 'memory-fs';
import { renderToString } from 'react-dom/server';


import App from './components/App';

interface ServerRendererArguments {
    clientStats: webpack.Stats;
    serverStats: webpack.Stats;
    fileSystem: any; // MemoryFileSystem; // See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/17889
    currentDirectory: string;
}

/**
 * Universal render function in development mode
 */
export default function serverRenderer({ clientStats, serverStats, fileSystem, currentDirectory }: ServerRendererArguments) {
    let html = '';
    if (process.env.NODE_ENV === 'production') {
        html = fs.readFileSync('./dist/index.html').toString();
    }

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {

        if (process.env.NODE_ENV === 'development') {
            const indexPath = path.join(currentDirectory, 'dist', 'index.html');
            html = fileSystem.readFileSync(indexPath).toString();
        }

        const $ = cheerio.load(html);

        // populate the app content...
        $('#root').html(renderToString(<App />));

        res.status(200).send($.html());
    };
}
