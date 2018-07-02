const webpack = require('webpack');

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
    ]
};

if(true) {//process.env.NODE_ENV === 'production'
// if(false) {
    config.output.filename = config.output.filename.replace(/^(.+).js$/, '$1.min.js');
    config.devtool = undefined;
    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false
            }
        })
    ];
}

module.exports = config;