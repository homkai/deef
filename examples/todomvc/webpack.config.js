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
            // js babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            // less打包
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {importLoaders: 1}
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            // 支持css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
