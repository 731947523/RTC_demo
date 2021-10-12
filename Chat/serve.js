const http  = require('http')
const path = require('path')
const express = require('express')
const serverIndex = require('serve-index')

const app = new express()
const staticPath = './../'

const io = require('socket.io')

let endPath = path.join(__dirname, staticPath)
app.use(serverIndex(endPath))
app.use(express.static(endPath))



// http server
const http_server = http.createServer(app)
let serverClient = io(http_server)

serverClient.on('connection', socket => {
    console.log('当前的服务端信息---', socket)
    socket.broadcast.emit('news', { hello: 'world' })
    socket.on('my other event', function (data) {
        console.log(data)
    })
    socket.on('client-send', (e)=>{
        console.log('监听到客户端发过来的消息--', e)
    })
})
http_server.listen(3000)


