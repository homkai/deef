const webpack = require('webpack');
const InlineEnviromentVariablesPlugin = require('inline-environment-variables-webpack-plugin');

const config = {
    entry: "./src/index.js",
    output: {
        path: __dirname + '/dist/',
        filename: "index.js",
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    devtool: '#inline-source-map',
    externals: [
        'react',
        'react-dom'
    ],
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
    ]
};

// if(true) {//process.env.NODE_ENV === 'production'
if(false) {
    config.output.filename = config.output.filename.replace(/^(.+).js$/, '$1.min.js');
    config.devtool = undefined;
    config.plugins.push(new InlineEnviromentVariablesPlugin({ NODE_ENV: 'production' }, { warnings: false }));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = config;