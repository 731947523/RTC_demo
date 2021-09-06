
const path = require('path')
const koa = require('koa')
const static  = require('koa-static')
const app = new koa()

let staticPath = './public'
app.use(static(path.join(__dirname, staticPath)))

// app.use((ctx) => {
//   ctx.body = '苏策'
// })
app.listen(3000, () => {
  console.log('[demo] static-use-middleware is starting at port 3000')
})