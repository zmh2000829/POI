require('./check-versions')();

const config = require('../config');
if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');

const port = process.env.PORT || config.dev.port;

const autoOpenBrowser = !!config.dev.autoOpenBrowser;

const proxyTable = config.dev.proxyTable;

const app = express();

const mock_routers = require('../mock');
app.use(...mock_routers);

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

// 生成webpack的编译器
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {},
    heartbeat: 2000
});

// 设置回调来访问编译对象
compiler.plugin('compilation', function(compilation) {
    // 设置回调来访问编辑中的步骤
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({action: 'reload'});
        cb();
    })
});

Object.keys(proxyTable).forEach(function(context) {
    const options = proxyTable[context];
    if(typeof options === 'string') {
        options = {target: options};
    }
    app.use(proxyMiddleware(context, options))
});

app.use(require('connect-history-api-fallback')());

app.use(devMiddleware);
app.use(hotMiddleware);


const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'));

module.exports = app.listen(port, function(err) {
    if(err) {
        console.log(err);
        return;
    }
    const uri = 'http://localhost:' + port;
    console.log('Listening at ' + uri + '\n');

    if(process.env.NODE_ENV !== 'testing') {
        opn(uri);
    }
});
