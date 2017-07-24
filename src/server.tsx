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

import { CaptureChunks } from 'universal-async-component';

interface ServerRendererArguments {
    clientStats: any;
    fileSystem: MemoryFileSystem;
    currentDirectory: string;
}

/**
 * Universal render function in development mode
 */
export default function serverRenderer({ clientStats, fileSystem, currentDirectory }: ServerRendererArguments) {
    let html = '';
    if (process.env.NODE_ENV === 'production') {
        html = fs.readFileSync('./dist/index.html').toString();
    }

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const context: { url?: string; } = {};
        const additionalChunks: string[] = [];
        const app = (
            <CaptureChunks statsChunks={clientStats.chunks} additionalChunks={additionalChunks}>
                <StaticRouter context={context} location={req.url}>
                    <App />
                </StaticRouter>
            </CaptureChunks>
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

        // add additional chunk scripts
        try {
            const bootstrapScriptName = clientStats.assetsByChunkName.bootstrap
                .filter((name: string) => name.endsWith('.js'))[0];
            const bootstrapScriptSrc = clientStats.publicPath + bootstrapScriptName;
            const bootstrapScript = $(`script[src="${bootstrapScriptSrc}"]`);
            additionalChunks.forEach(chunksId => {
                const chunkName = clientStats.assets.filter((asset: any) => {
                    return asset.name.startsWith(chunksId + '-') && asset.name.endsWith('.chunk.js');
                })[0].name;
                const src = clientStats.publicPath + chunkName;
                bootstrapScript.after(
                    $(`<script type="text/javascript" src="${src}"></script>`)
                );
            })
        } catch (e) {
            console.error(e);
        }

        res.status(200).send($.html());
    };
}
