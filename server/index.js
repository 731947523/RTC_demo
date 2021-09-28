const https = require('https')
const http  = require('http')
const fs = require('fs')
const path = require('path')
const express = require('express')
const serverIndex = require('serve-index')

const app = new express()
// const staticPath = './../../Company/webRTC/vhall-jssdk-interaction/dist/vhallcall/latest'
const staticPath = './../'
// const io = require('socket.io')

// let endPath = path.join(__dirname, staticPath)
let endPath = path.join(__dirname, staticPath)
console.log('endPath', endPath)
app.use(serverIndex(endPath))
app.use(express.static(endPath))


// http server
const http_server = http.createServer(app)
// let serverClient = io(http_server)
/* 
    API:https://www.w3cschool.cn/socket/socket-buvk2eib.html
    io(server, opt) 
    https://www.w3cschool.cn/socket/socket-odxe2egl.html
    opt
*/

// serverClient.on('connection', socket => {
//     // console.log('当前的服务端信息---', socket)
//     socket.broadcast.emit('news', { hello: 'world' })
//     socket.on('my other event', function (data) {
//         console.log(data)
//     })
//     socket.on('client-send', (e)=>{
//         console.log('监听到客户端发过来的消息--', e)
//     })
// })
http_server.listen(3000)


// https server
let options = {
    key: fs.readFileSync(endPath +'/ssl/private.pem'),
    cert: fs.readFileSync(endPath +'/ssl/file.crt')
}
let https_server = https.createServer(options, app)
https_server.listen(3001)

// let httpsClient = io(https_server)
// console.log('httpsClient', httpsClient)
