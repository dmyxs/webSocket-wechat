const app = require('express')()
const server = require('http').Server(app)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

server.listen(8081, () => {
    console.log('app is running at port 8081')
})

const io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log('新用户链接了')
    socket.emit('send', { name: 'zs' })

    socket.on('client', (data) => {
        console.log(data)
        socket.emit('send', data)
    })
})
