const { data } = require('jquery')

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

//记录所有已经登录过的用户
const users = []

app.use(require('express').static('public'))

app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html')
    res.redirect('index.html')
})

server.listen(8081, () => {
    console.log('app is running at port 8081')
})

//登录功能
io.on('connection', (socket) => {
    console.log('新用户链接了')

    //登录聊天室
    socket.on('login', (data) => {
        let user = users.find((item) => item.userName === data.userName)
        if (!user) {
            users.push(data)
            socket.emit('loginSuccess', data)

            //广播事件
            //显示系统信息，群里数量，有哪些人
            io.emit('showInfo', {
                data: data,
                users: users,
            })

            //登录成功的用户和头像存储起来
            socket.userName = data.userName
            socket.avatar = data.avatar
        } else {
            socket.emit('loginError', { msg: '用户已登录' })
        }
    })

    //退出聊天室功能
    socket.on('disconnect', () => {
        let idx = users.findIndex((item) => item.userName === socket.userName)
        users.splice(idx, 1)
        io.emit('delUser', {
            userName: socket.userName,
            avatar: socket.avatar,
            users: users,
        })
    })

    //监听聊天信息，接收信息，广播信息
    socket.on('sendMessage', (data) => {
        //广播给所有用户
        io.emit('receiveMessage', data)
    })

    //接收图片信息
    socket.on('sendImage', (data) => {
        //广播给所有用户
        io.emit('receiveImage', data)
    })
})
