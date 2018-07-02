const {resolve: resolvePath} = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const API_DIR = 'api';
const PORT = 8881;

module.exports = {
    entry: [
        'babel-polyfill',
        'webpack/hot/only-dev-server',
        './src/index.js'
    ],
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            app: resolvePath(__dirname, './src/app')
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
    },
    devServer: {
        port: PORT,
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true,
        before(app) {
            app.use(bodyParser.json());

            app.all('/api', (req, res) => {
                const {path, params = {}} = req.body;

                const filePath = resolvePath(__dirname, API_DIR + path + '.js');
                if (!fs.existsSync(filePath)) {
                    throw new Error('没有对应的api mock处理文件' + './api' + path);
                }
                const handler = require(filePath);
                handler(params).then(mock => {
                    delete require.cache[filePath];
                    res.json(mock);
                });
            });
        }
    }
};
