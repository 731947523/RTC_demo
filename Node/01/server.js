const http = require('http')
const fs = require('fs')
const path = require('path')

http.createServer((request, response) => {
    let { url, method } = request
    if(url === '/' && method == 'GET'){
        fs.readFile(path.resolve(__dirname)+'/index.html', (err, data) => {
            if(err){
                response.writeHeader(500, {'Content-Type' : 'text/plain;charset=utf-8'})
                return
            }

            response.statusCode = 200
            response.setHeader('Content-Type', 'text/html')
            response.end(data)
        })
    }

}).listen(8090, ()=>{
    console.log(`http://localhost:8090`)
})