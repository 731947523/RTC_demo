var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync('./privatekey.pem', 'utf8'); //密钥路径,编码
var certificate = fs.readFileSync('./certificate.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var documentRoot = './video_RTCPeerConnrction/index.html'

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 3030; //http 端口
var SSLPORT = 443; //https 端口
 
httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
 

// var server = http.createServer(function(req, res) {
//     var url = req.url
//     //客户端输入的url，例如如果输入localhost:8888/index.html
//     //那么这里的url == /index.html
//     var file = documentRoot + url
//     console.log(url)
//     fs.readFile(file, function(err, data) {
//       if (err) {
//         res.writeHeader(404, {
//           'content-type': 'text/html;charset="utf-8"'
//         })
//         res.write('<h1>404错误</h1><p>你要找的页面不存在</p>')
//         res.end()
//       } else {
//         res.writeHeader(200, {
//           'content-type': 'text/html;charset="utf-8"'
//         })
//         res.write(data) //将index.html显示在客户端
//         res.end()
//       }
//     })
//   }).listen(99)

// Welcome
app.get('/', function(req, res) {
    // if(req.protocol === 'https') {
        var url = req.url
        //客户端输入的url，例如如果输入localhost:8888/index.html
        //那么这里的url == /index.html
        var file = documentRoot + url
        console.log(url)
        fs.readFile(file, function(err, data) {
            if (err) {
                res.writeHeader(404, {
                'content-type': 'text/html;charset="utf-8"'
                })
                res.write('<h1>404错误</h1><p>你要找的页面不存在</p>')
                res.end()
            } else {
                res.writeHeader(200, {
                'content-type': 'text/html;charset="utf-8"'
                })
                res.write(data) //将index.html显示在客户端
                res.end()
            }
        })
        // res.status(200).send('Welcome https!');
    // }else {
    //     res.status(200).send('Welcome http!');
    // }
});