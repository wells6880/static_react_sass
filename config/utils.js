const path = require('path');
const {
    publicPath
} = require('./paths')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PostcssPresetEnv = require('postcss-preset-env');

const getStyleLoaders = (isDev, isSass = false) => {
    const loaders = [
        !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
        {
            loader: 'css-loader',
            options: {
                sourceMap: isDev
            }
        },
        isSass && 'sass-loader',
        {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                PostcssPresetEnv()
              ]
            }
        }
    ].filter(Boolean);
    // if (isSass) {
    //     loaders.splice(2, 0, {
    //             loader: 'resolve-url-loader', // less,sass在使用css module时，对url的解析存在冲突，可以用resolve-url-loader进行解决
    //             options: {
    //                 sourceMap: isDev
    //             }
    //         },
    //         'sass-loader')
    // }
    return loaders
}

const getHtmlTemplate = (isDev) => (new HtmlWebpackPlugin({
    inject: true, // 是否将js放在body的末尾
    template: path.join(publicPath, 'index.html'),
    filename: 'index.html',
    templateParameters: {
        ReactDllSlot: isDev ? `<script src="/vendor/react.dll.js"></script>` : ''
    },
}))

module.exports = {
    devCss: getStyleLoaders(true),
    devSass: getStyleLoaders(true, true),
    prodCss: getStyleLoaders(false),
    prodSass: getStyleLoaders(false, true),
    devHtmlTemplate: getHtmlTemplate(true),
    prodHtmlTemplate: getHtmlTemplate(false),
}