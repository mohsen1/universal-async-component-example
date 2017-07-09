const express = require('express');
const path = require('path');
const fs = require('fs');

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
		publicPath: clientConfig.output.publicPath
	});

	app.use(devMiddleware);
	app.use(webpackHotMiddleWare(clientCompiler));
	app.use(webpackHotServerMiddleware(compiler));

} else {

	const serveStatic = require('serve-static');
	const index = fs.readFileSync(path.join(__dirname, 'dist', 'index.html')).toString();
	app.use('/assets', serveStatic(path.join(__dirname, 'dist')))
	app.get('*', (_, res) => res.send(index));
}

const port = process.env.PORT || 3000;
app.listen(port, (error) => {
	if (error) { throw error; }
	console.log(`Server started: http://localhost:${port}/`);
});
