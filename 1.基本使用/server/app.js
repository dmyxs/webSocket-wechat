// 1.导入nodejs-websocket包
const ws = require('nodejs-websocket')
const PORT = 8081

// 2.创建一个server
// 2.1如何处理用户发送的请求
// 每次只要有用户链接，函数就会被执行，会给当前连接的用户创建一个connect对象
const server = ws.createServer((connect) => {
    console.log('有用户链接上来了')
    connect.on('text', (data) => {
        console.log(data)

        //响应：给用户发送数据
        connect.sendText(data)
    })

    //只要websocket断开，close事件就会执行
    connect.on('close', () => {
        console.log('连接断开')
    })

    //注册error事件，用来处理错误信息
    connect.on('error', () => {
        console.log('用户链接异常')
    })
})

//监听端口
server.listen(PORT, () => {
    console.log(`app is running at port ${PORT}`)
})
