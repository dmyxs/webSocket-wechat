// 1.导入nodejs-websocket包
const ws = require('nodejs-websocket')
const PORT = 8081

//用于记录当前的用户数
let users = 0
const server = ws.createServer((connect) => {
    console.log('有用户链接上来了')
    users++
    connect.userName = `用户${users}`
    //1.告诉所有用户，有人加入了聊天室
    broadcast(`${connect.userName}进入了聊天室`)

    connect.on('text', (data) => {
        //2.当我们接收到某个用户的信息的时候，告诉所有用户，发送的消息内容是什么？
        broadcast(data)
        // connect.send(data)
    })

    connect.on('close', () => {
        users--
        //3.如果有人离开了，告诉所有用户
        broadcast(`${connect.userName}离开了聊天室`)
    })

    connect.on('error', () => {
        console.log('用户链接异常')
    })
})

//广播：给所有的用户发送信息
function broadcast(msg) {
    server.connections.forEach((u) => {
        u.send(msg)
    })
}

server.listen(PORT, () => {
    console.log(`app is running at port ${PORT}`)
})
