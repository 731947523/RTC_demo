const {promisify} = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')

const { clone } = require('./download')

const log = content => console.log(chalk.green(content))
clear()
module.exports.welecome = async () => {
    const data = await figlet('Welcome Cxs')
    log(data)
    return data
}
module.exports.init = async (name) => {
    log('开始Clone项目', 'name 为项目文件')
    await clone('github:su37josephxia/vue-template', name)
}