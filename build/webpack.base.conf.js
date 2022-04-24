const path = require('path');
const webpack = require('webpack');
const utils = require('./utils');
const config = require('../config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');

const projectRoot = path.resolve(__dirname, '../');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        // path: 表示生成文件的根目录
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath

    },
    resolve: {
        extensions: ['.js', 'jsx', 'json'],
        alias: {
            common: path.resolve(__dirname, '../src/common'),
            pgx: path.resolve(__dirname, '../src/pgx'),
            pgi: path.resolve(__dirname, '../src/pgi'),
            static: path.resolve(__dirname, '../static')
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [resolve('src')]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.worker\.js$/,
                loader: 'worker-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new LodashWebpackPlugin({cloning: true, paths: true}),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh-cn/),
        new webpack.ProvidePlugin({
            _: 'common/lib/lodash-local',
            Jt: 'common/util/jt',
            request: 'common/util/request'
        })
    ]
};
