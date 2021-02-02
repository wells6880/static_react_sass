const path = require('path');
const HappyPack = require('happypack');
const {
    srcPath,
    distPath
} = require('./paths');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: path.join(srcPath, 'index.jsx'),
    output: {
        path: distPath,
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@': srcPath
        }
    },
    module: {
        rules: [{
                test: /\.js|jsx$/,
                use: ['happypack/loader?id=babel'],
                include: srcPath,
                exclude: /node_modules/
            }, 
            {
                test: /\.css$/,
                use: ['happypack/loader?id=css'],
                include: srcPath
            }, 
            // question in use happypack and miniCssExtractPlugin
            // {
            //     test: /\.(sass|scss)$/,
            //     use: ['happypack/loader?id=sass'],
            //     include: srcPath
            // }, 
            // 图片配置 (由于HappyPack 对file-loader、url-loader 支持的不友好，所以不建议对该loader使用)
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 8192,
                        name: 'static/img/[name].[ext]'
                    }
                }],
            },
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 8192,
                        name: 'static/iconfont/[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        // happyPack 开启多进程打包
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: ['babel-loader?cacheDirectory']
        }),
    ]
}