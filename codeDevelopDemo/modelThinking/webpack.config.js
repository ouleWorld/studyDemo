const path = require('path')

module.exports = {
    entry: './src/a.js',
    output: {
        filename: 'a.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
    mode: 'development'
}