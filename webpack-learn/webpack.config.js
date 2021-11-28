const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    //插件 这个机制原理是作用于webpack整个打包周期的
    plugins: [new CleanWebpackPlugin()],
}