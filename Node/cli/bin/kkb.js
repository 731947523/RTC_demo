#!/usr/bin/env  node
// https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
const program = require('commander')

const { welecome, init } = require('./../lib/init')

program.version(require('../package').version)
program
  .option('-c, --cheese <type>', '我是命令行选项1')
  .option('-s, --select', '我是命令行选项2, 主抓选项')
  .option('-only, --only', '我是命令行选项3')
program.parse()

console.log('cheese:', program.opts())


// program.command('install [name]', 'install one or more packages').parse(process.argv)
// 方式一
// program.command('init <name>').description('我是描述').action(name => {
//     console.log('我想看下name是什么：', name)
// }).parse(process.argv)
// 方式二
// program.command('install <name>').description('我是描述').action(name => {
//     console.log('我想看下name是什么：', name)
// }).parse(process.argv)

program.command('init <name>').description('init project').action(init)
program.command('wel <name>').description('init project').action(welecome)
program.parse(process.argv)

    // program
//     .command('init <name>')
//     .description('init project').action(name => {
//     console.log('init name:----',name)
// }).parse(process.argv)
// program.parse(process.argv)

