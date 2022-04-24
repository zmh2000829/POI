const path = require('path');

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        //assetsPublicPath: 'https://www.pgx-lab.com/knowledge/',
        assetsPublicPath: '/dist/',
        productionSourceMap: false,
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: true
    },
    dev: {
        env: require('./dev.env'),
        port: 8088,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: require('./dev.proxy'),
        // proxyTable: false,
        cssSourceMap: false
    }
};
