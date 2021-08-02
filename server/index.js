let https = require('https')
let http  = require('http')
let fs = require('fs')
let path = require('path')

let Koa = require('koa')
let router = require('koa-route')
const serve = require('koa-static')
let express = require('express')
let serverIndex = require('serve-index')

const app = new Koa()
let _mkdir = 'callVideo'
let _path = path.join(path.resolve(__dirname) +'/../' + _mkdir)
// let _path = 'D:/Downloads/API-Examples-Web-main/API-Examples-Web-main/Demo'
console.log(_path);
console.log('路径1----', path.resolve(__dirname));
const main = serve(_path);
app.use(main)

app.use(router.get('/', ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(_path+'/index.html')
}))
app.listen(3000)



// https server
let options = {
    key: fs.readFileSync(path.resolve() +'/ssl/privatekey.pem'),
    cert: fs.readFileSync(path.resolve() +'/ssl/certificate.pem')
}
https.createServer(options, app.callback()).listen(443)