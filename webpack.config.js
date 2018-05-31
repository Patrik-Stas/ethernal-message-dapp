const path = require('path');

DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = ethNetwork => {
    return {
        entry: ["babel-polyfill", './src/index.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        // optimization: {
        //     // We no not want to minimize our code.
        //     minimize: true
        // },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    },

                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(gif|svg|jpg|png|variables)$/,
                    loader: "file-loader",
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./public/index.html",
                filename: "./index.html"
            }),
            new DefinePlugin({
                'process.env': ( ethNetwork === "mainnet") ? require('./bundleConfig/mainnet') : require('./bundleConfig/rinkeby')
            }),
        ]
    }
};