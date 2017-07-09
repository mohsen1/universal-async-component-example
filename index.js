const express = require('express');
const app = express();

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

app.listen(6060, () => {
	console.log('Server started: http://localhost:6060/');
});
