import * as path from 'path';
import * as webpack from 'webpack';
const nodeExternals = require('webpack-node-externals');

const dist = path.join(__dirname, 'dist');

const rules: webpack.Rule[] = [
    {
        test: /(\.ts|\.tsx)$/,
        loaders: [
            'react-hot-loader/webpack',
            'ts-loader',
        ],
        include: __dirname,
    },
    {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
    },
];

const resolve: webpack.Resolve = {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
};

interface Configuration extends webpack.Configuration {
    name: string;
}

export const clientConfig: Configuration = {
    name: 'client',
    target: 'web',
    entry: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        './client',
    ],
    resolve,
    module: { rules },
    output: {
        path: dist,
        filename: 'client.js',
        publicPath: '/assets/'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // new webpack.NoErrorsPlugin(),
    ]
};

const serverConfig: Configuration = {
    name: 'server',
    target: 'node',
    entry: './server',
    resolve,
    module: { rules, },
    // externals: [nodeExternals()],
    output: {
        path: dist,
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
};

export default [
    clientConfig,
    serverConfig,
];
