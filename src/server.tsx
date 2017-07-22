import * as path from 'path';
import * as fs from 'fs';
import * as React from 'react';
import * as express from 'express';
import * as webpack from 'webpack';
import * as cheerio from 'cheerio';
import MemoryFileSystem from 'memory-fs';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './components/App';

interface ServerRendererArguments {
    clientStats: webpack.Stats;
    serverStats: webpack.Stats;
    fileSystem: MemoryFileSystem;
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
        const context: { url?: string; } = {};
        const originalRequire = __webpack_require__;
        const chunksToInclude: number[] = [];
        (global as any).reportModule = function (moduleId: number) {
            (clientStats as any).chunks.forEach((chunk: any) => {
                chunk.modules.forEach((module: any) => {
                    if (module.id === moduleId) {
                        chunksToInclude.push(chunk.id);
                    }
                });
            });
        }
        const app = (
            <StaticRouter context={context} location={req.url}>
                <App />
            </StaticRouter>
        );

        if (context.url) {
            return res.redirect(301, context.url);
        }

        if (process.env.NODE_ENV === 'development') {
            const indexPath = path.join(currentDirectory, 'dist', 'index.html');
            html = fileSystem.readFileSync(indexPath).toString();
        }

        if (html === '') {
            throw new ReferenceError('Could not find index.html to render');
        }

        // populate the app content...
        const $ = cheerio.load(html);
        $('#root').html(renderToString(app));
        chunksToInclude.forEach(chunksId => {
            $('script[src="/assets/bootstrap.js"]').after(
                $(`<script type="text/javascript" src="assets/${chunksId}.bundle.js"></script>`)
            )
        })

        res.status(200).send($.html());
    };
}
