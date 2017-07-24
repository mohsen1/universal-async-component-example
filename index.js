const express = require('express');

const app = express();

if (process.env.NODE_ENV === 'development') {
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleWare = require('webpack-hot-middleware');
	const webpackHotServerMiddleware = require('webpack-hot-server-middleware');

	require('ts-node/register');
	const { default: configs, clientConfig } = require('./webpack.config');

	const compiler = webpack(configs);
	const clientCompiler = compiler.compilers.find(({ name }) => name === 'client');

	const devMiddleware = webpackDevMiddleware(compiler, {
		noInfo: true,
		publicPath: clientConfig.output.publicPath,
		serverSideRender: true,
	});

	app.use(devMiddleware);
	app.use(webpackHotMiddleWare(clientCompiler));
	app.use(webpackHotServerMiddleware(compiler, {serverRendererOptions: {
		// Send client compiler FS for reading index.html for emitted assets
		fileSystem: clientCompiler.outputFileSystem,
		// Helps with finding the output folder in memory-fs
		currentDirectory: __dirname,
	}}));

} else {

	const serveStatic = require('serve-static');
	const serverRenderer = require('./dist/server.js').default;
	const clientStats = require('./dist/client-stats.json');
	app.use('/assets', serveStatic('dist'));
	app.use(serverRenderer({ clientStats }))
}

const port = process.env.PORT || 3000;
app.listen(port, (error) => {
	if (error) { throw error; }
	console.log(`Server started: http://localhost:${port}/`);
});
