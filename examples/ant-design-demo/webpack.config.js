var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devtool: 'inline-source-map',
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
                loader: "babel-loader",
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
                        loader: 'less-loader',
                        options: {//覆盖ant design默认样式
                          modifyVars: {
                            "@border-radius-base": '3px',
                            "@border-radius-sm": '2px',
                            "@shadow-color": 'rgba(0,0,0,0.05)',
                            "@shadow-1-down": '4px 4px 40px @shadow-color',
                            "@border-color-split": '#f4f4f4',
                            "@border-color-base": '#e5e5e5',
                            "@menu-dark-bg": '#3e3e3e',
                            "@text-color": '#666',
                            "@font-family": '"AvenirNext-Regular", "Helvetica Neue", "lucida grande", "PingFangHK-Light", "STHeiti", "Heiti SC", "Hiragino Sans GB", "Microsoft JhengHei", "Microsoft Yahei", SimHei, "WenQuanYi Micro Hei", "Droid Sans", "Roboto", Helvetica, Tahoma, Arial, "sans-serif"',
                            "@icon-url": "/antd/iconfont",
                            "@primary-color":' #948aec',
                            "@link-color": '#948aec',
                          }
                        },
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
