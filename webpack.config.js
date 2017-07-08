const path = require('path');
const webpack = require('webpack');

const dist = path.join(__dirname, 'dist');

/** @type {Array<webpack.Configuration>} */
module.exports = [
    {
        name: 'client',
        target: 'web',
        entry: [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client',
            './client',
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    loaders: ['react-hot-loader/webpack', 'ts-loader']
                }
            ]
        },
        output: {
            path: dist,
            filename: 'client.js',
            publicPath: '/assets/'
        },
        devtool: 'source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoErrorsPlugin(),
        ]
    }, {
        name: 'server',
        target: 'node',
        entry: './server',
        output: {
            path: dist,
            filename: 'server.js',
            libraryTarget: 'commonjs2'
        },
        devtool: 'source-map',
    }
];
