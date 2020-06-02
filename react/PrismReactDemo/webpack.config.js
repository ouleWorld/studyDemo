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
                // 匹配 js 文件
                test: /\.js$/,
                // 排除 node_modules 里的文件
                exclude: /(node_modules)/,
                use: {
                    // 通过 babel-loader 来处理 js 文件
                    loader: 'babel-loader',
                    options: {
                        // 该插件用于处理组件中的箭头函数
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    mode: 'development'
}