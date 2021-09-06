const https = require('https')
const http  = require('http')
const fs = require('fs')
const path = require('path')
const express = require('express')
const serverIndex = require('serve-index')


const app = new express()
const staticPath = './../'
let endPath = path.join(__dirname, staticPath)
app.use(serverIndex(endPath))
app.use(express.static(endPath))



// http server
const http_server = http.createServer(app)
http_server.listen(3000)

// https server
let options = {
    key: fs.readFileSync(endPath +'/ssl/private.pem'),
    cert: fs.readFileSync(endPath +'/ssl/file.crt')
}
https.createServer(options, app).listen(3001)