import * as path from 'path';
import * as webpack from 'webpack';
import * as _ from 'lodash';
import * as htmlWebpackPlugin from 'html-webpack-plugin';
const nodeExternals = require('webpack-node-externals');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const dist = path.join(__dirname, 'dist');

const rules: webpack.Rule[] = [
    {
        test: /(\.ts|\.tsx)$/,
        get loaders() {
            const loaders = ['ts-loader'];
            if (process.env.NODE_ENV === 'development') {
                loaders.unshift('react-hot-loader/webpack');
            }
            return loaders;
        },
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

const htmlMinifyConfig: htmlWebpackPlugin.MinifyConfig = {
    minifyCSS: true,
    minifyJS: false,
    removeComments: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
}

interface Configuration extends webpack.Configuration {
    name: string;
}

export const clientConfig: Configuration = {
    name: 'client',
    target: 'web',
    get entry() {
        if (process.env.NODE_ENV === 'development') {
            return [
                'react-hot-loader/patch',
                'webpack-hot-middleware/client',
                './client',
            ];
        }
        return './client';
    },
    resolve,
    module: { rules },
    output: {
        path: dist,
        filename: 'client.js',
        publicPath: '/assets/', // TODO: use process.env.PUBLIC_PATH or something
    },
    devtool: 'source-map',
    get plugins() {
        const basePlugins = [
            new htmlWebpackPlugin({
                template: './index.html',
                inject: 'body',
                minify: process.env.NODE_ENV === 'production' ? htmlMinifyConfig : false,
                hash: false,
                showErrors: process.env.NODE_ENV === 'development',
            }),

            new StatsWriterPlugin({ filename: 'client-stats.json' }),

            // new webpack.ProvidePlugin({
            //     'process.env': JSON.stringify(_.pick(process.env, ['NODE_ENV'])),
            // }),
        ];
        if (process.env.NODE_ENV === 'development') {
            return [
                ...basePlugins,
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NamedModulesPlugin(),
                // new webpack.NoErrorsPlugin(),
            ];
        }
        return basePlugins;
    },
};

const serverConfig: Configuration = {
    name: 'server',
    target: 'node',
    entry: './server',
    resolve,
    module: { rules, },
    externals: [nodeExternals()],
    output: {
        path: dist,
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    plugins: [new StatsWriterPlugin({ filename: 'server-stats.json' })],
};

export default [
    clientConfig,
    serverConfig,
];
