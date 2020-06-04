const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/a.js',
    output: {
        filename: "a_[chunkhash:8].js",
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'devServer Demo',
            filename: 'index.html',
            template: path.resolve(__dirname, 'a.html')
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        open: true,
        proxy: {
            '/api': 'http://localhost:2300'
        }
    },
    mode: 'development',
    devtool: 'inline-source-map'
}