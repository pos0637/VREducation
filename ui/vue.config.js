const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    devServer: {
        port: 8081
    },
    chainWebpack: config => {
        config.entry('main').add('babel-polyfill');
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            new CopyPlugin([
                {
                    from: path.resolve(__dirname, './node_modules/blockly/media'),
                    to: path.resolve(__dirname, './public/media')
                }
            ]),
            new webpack.ProvidePlugin({
                introJs: ['intro.js']
            })
        ]
    },
    publicPath: './'
};
