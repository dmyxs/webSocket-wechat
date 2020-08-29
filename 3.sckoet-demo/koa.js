const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const fs = require('fs')
const server = require('http').Server(app.callback())
const io = require('socket.io')(server)

// 首页路由
let router = new Router()
router.get('/', (ctx) => {
    ctx.response.type = 'html'
    ctx.response.body = fs.createReadStream('./index.html')
})
app.use(router.routes())

server.listen(8081, () => {
    console.log('app is running at port 8081')
})

io.on('connection', (socket) => {
    console.log('新用户链接了')
    socket.emit('send', { name: 'zs' })

    socket.on('client', (data) => {
        console.log(data)
        socket.emit('send', data)
    })
})
