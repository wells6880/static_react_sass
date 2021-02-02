const path = require('path');
const webpackCommonConf = require('./webpack.common')
const {
    smart
} = require('webpack-merge')
const {
    distPath,
    vendorPath,
    srcPath
} = require('./paths')
const {
    devCss,
    devSass,
    devHtmlTemplate
} = require('./utils')
const HappyPack = require('happypack');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = smart(webpackCommonConf, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    output: {
        filename: 'static/js/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: devSass,
                include: srcPath
            }
        ]
    },
    plugins: [
        devHtmlTemplate,
        // happyPack 开启多进程打包
        new HappyPack({
            id: 'css',
            loaders: devCss
        }),
        // new HappyPack({
        //     id: 'sass',
        //     loaders: devSass
        // }),
        new DllReferencePlugin({
            // 描述 react 动态链接库的文件内容
            manifest: require(path.join(vendorPath, 'react.manifest.json')),
        }),
    ],
    devServer: {
        port: 8686,
        progress: true, // 显示打包的进度条
        contentBase: distPath, // 根目录
        open: true, // 自动打开浏览器
        compress: true, // 启动 gzip 压缩
    }
})