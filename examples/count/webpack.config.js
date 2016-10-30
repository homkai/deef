module.exports = {
    entry: "./demo.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devtool: '#inline-source-map',
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};