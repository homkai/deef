const webpack = require('webpack');

const config = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
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
    plugins: []
};

if(process.env.NODE_ENV === 'production') {
    config.output.filename = config.output.filename.replace(/^(.+).js$/, '$1.min.js');
    config.devtool = undefined;
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = config;