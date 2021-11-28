const {promisify} = require('util')
module.exports.clone = async function(repo, desc){
    const down = promisify(require('download-git-repo'))
    const ora = require('ora')

    const process = ora(`下载....${repo}`)
    process.start()
    await down(repo, desc)
    process.succeed()
}