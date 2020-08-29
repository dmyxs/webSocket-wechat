const http = require('http')
const fs = require('fs')
const app = http.createServer()

app.on('request', (req, res) => {
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
            res.writeHead(500)
            return res.end('error loading index.html')
        }
        res.writeHead(200)
        res.end(data)
    })
})

app.listen(8081, () => {
    console.log('app is running at port 8081')
})

const io = require('socket.io')(app)

//socket表示用户的连接
//socket.emit 表示触发某个事件，给浏览器发送数据
//socket.on 表示注册某个事件，获取浏览器的数据
io.on('connection', (socket) => {
    console.log('新用户链接了')

    //给浏览器发送数据
    //参数1：事件的名字
    socket.emit('send', { name: 'zs' })

    //获取浏览器的数据
    socket.on('client', (data) => {
        console.log(data)
        socket.emit('send', data)
    })
})
