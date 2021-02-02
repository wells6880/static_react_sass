const path = require('path');
const webpackCommonConf = require('./webpack.common')
const {
    smart
} = require('webpack-merge')
const {
    distPath,
    publicPath,
    srcPath
} = require('./paths')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser');
const HappyPack = require('happypack');
const {
    prodCss,
    prodSass,
    prodHtmlTemplate
} = require('./utils')

module.exports = smart(webpackCommonConf, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    output: {
        filename: 'static/js/main.[contentHash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: prodSass,
                include: srcPath
            }
        ]
    },
    plugins: [
        prodHtmlTemplate,
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/main.[contentHash:8].css',
            chunkFilename: 'css/main.[contentHash:8].chunk.css',
        }),
        // happyPack 开启多进程打包
        new HappyPack({
            id: 'css',
            loaders: prodCss
        }),
        // new HappyPack({
        //     id: 'sass',
        //     loaders: prodSass
        // }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: publicPath,
                        to: path.join(distPath, 'public'),
                        globOptions: {
                            ignore: ['index.html']
                        }
                    }
                ]
            }
        )
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true, // 多线程
                terserOptions: {
                    output: {
                        beautify: false, // 最紧凑的输出
                        comments: false, // 删除所有的注释
                    },
                    compress: {
                        // 删除所有的 `console` 语句，可以兼容ie浏览器
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true,
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    map: false
                }
            })
        ],
        // 分割代码块
        splitChunks: {
            chunks: 'all',
            /**
             * initial 入口chunk，对于异步导入的文件不处理
                async 异步chunk，只对异步导入的文件处理
                all 全部chunk
             */

            // 分组
            cacheGroups: {
                // 第三方模块
                vendor: {
                    name: 'vendor', // chunk 名称
                    priority: 1, // 权限更高，优先抽离，重要！！！
                    test: /node_modules/,
                    minSize: 0, // 大小限制
                    minChunks: 1 // 最少复用过几次
                },

                // 公共的模块
                common: {
                    name: 'common', // chunk 名称
                    priority: 0, // 优先级
                    minSize: 0, // 公共模块的大小限制
                    minChunks: 2 // 公共模块最少复用过几次
                }
            }
        }
    }
})