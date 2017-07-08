const express = require('express');
const app = express();

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleWare = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');

require('ts-node/register');
const { default: configs, clientConfig } = require('./webpack.config');

const compiler = webpack(configs);
const clientCompiler = compiler.compilers.find(compiler => compiler.name === 'client');

const devMiddleware = webpackDevMiddleware(clientCompiler, {
	// noInfo: true,
	publicPath: clientConfig.output.publicPath
});

app.use(devMiddleware);
app.use((req, res, next) => {
    devMiddleware.waitUntilValid((stats) => {
		console.log('Dev middleware is valid. hooking hot middleware');
		if (stats.hasErrors) {
			console.error(stats.toString('errors-only'));
		}
		webpackHotServerMiddleware(req, res, next);
		webpackHotMiddleWare(clientCompiler)(req, res, next);
	});
});

app.listen(6060, () => {
	console.log('Server started: http://localhost:6060/');
});
