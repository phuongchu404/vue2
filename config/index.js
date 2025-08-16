// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../../api/src/main/resources/static/index.html'),
        assetsRoot: path.resolve(__dirname, '../../api/src/main/resources/static'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 17002,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                target: 'http://localhost:16003',
                secure: false
            },
            '/stylesheets': {
                target: 'http://localhost:16003',
                secure: false
            },
            '/javascripts': {
                target: 'http://localhost:16003',
                secure: false
            },
            '/images': {
                target: 'http://localhost:16003',
                secure: false
            },
            '/moc': {
                target: 'http://localhost:16002',
                secure: false
            },
            '/card': {
                target: 'http://localhost:16002',
                secure: false
            }
        },
        cssSourceMap: false
    }
}
