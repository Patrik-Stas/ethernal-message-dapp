const path = require('path');
const helpers = require('./helpers'),
    DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
    entry: ["babel-polyfill", helpers.root('/src/index.js')],
    output: {
        path: helpers.root('/dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    // output: {
    //     path: path.resolve(__dirname, 'dist'),
    //     filename: 'bundle.js'
    // },
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
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
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: helpers.root("/public/index.html"),
            filename: "./index.html"
        }),
        new DefinePlugin({
            'process.env': require('./rinkeby')
        }),
    ]
};