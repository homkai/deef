var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devtool: '#inline-source-map',
    resolve: {
        alias: {
            app: path.resolve(__dirname, './src/app')
        }
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
