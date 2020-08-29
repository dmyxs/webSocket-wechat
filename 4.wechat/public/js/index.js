const socket = io('http://localhost:8081')
var userName, avatar

//登录功能：不能使用箭头函数，否则this是window
$('#login-avatar li').on('click', function () {
    $(this).addClass('now').siblings().removeClass('now')
})

//点击登录
$('#login').on('click', function () {
    const userName = $('#input').val().trim()
    if (!userName) {
        alert('请输入用户名')
        return
    }
    let avatar = $('#login-avatar li.now img').attr('src')

    socket.emit('login', {
        userName: userName,
        avatar: avatar,
    })
})

//监听登录失败的请求
socket.on('loginError', (data) => {
    alert(data.msg)
})

//登录成功
socket.on('loginSuccess', (data) => {
    //显示聊天窗口
    $('#login-box').fadeOut()
    //隐藏登录窗口
    $('#container-box').css('visibility', 'visible')

    //设置头像
    $('.user-avatar .img').attr('src', data.avatar)
    //设置用户名
    $('.username').text(data.userName)

    userName = data.userName
    avatar = data.avatar
})

//展示信息
socket.on('showInfo', (data) => {
    //系统信息：加入群里
    $('.show-info').append(`
        <div class='system'>
            <p class="message">
                <span>${data.data.userName} 加入群聊</span>
            </p>
        </div>
    `)

    scrollIntoView()

    //动态显示群聊人数
    $('.talk-box .title h3').text(`前端学习交流群 (${data.users.length})`)

    //动态渲染头像
    $('.user-list .user').html('') //先清空
    data.users.forEach((u) => {
        $('.user-list .user').append(`
            <li>
                <img src="${u.avatar}" alt="">
                <p>${u.userName}</p>
            </li>
        `)
    })
})

//退出群聊
socket.on('delUser', (data) => {
    console.log(data)
    //系统信息：加入群里
    $('.show-info').append(`
        <div class='system'>
            <p class="message">
                <span>${data.userName} 退出群聊</span>
            </p>
        </div>
    `)

    scrollIntoView()

    //动态显示群聊人数
    $('.talk-info .title h3').text(`前端学习交流群 (${data.users.length})`)

    //动态渲染头像
    $('.user-list .user').html('') //先清空
    data.users.forEach((u) => {
        $('.user-list .user').append(`
            <li>
                <img src="${u.avatar}" alt="">
                <p>${u.userName}</p>
            </li>
        `)
    })
})

//聊天功能
$('.btn-send').on('click', () => {
    //获取到聊天的内容
    let content = $('.text').html().trim()
    $('.text').html('')
    if (!content) return alert('请输入内容')

    socket.emit('sendMessage', {
        msg: content,
        userName: userName,
        avatar: avatar,
    })
})

socket.on('receiveMessage', (data) => {
    if (data.userName === userName) {
        $('.show-info').append(`
            <div class='message-box'>
                <div class="wrapper">
                    <div class="self">
                        <img class="imgs" src="${data.avatar}" alt="">
                        <div class="content">
                            <div class="bubble_cont">${data.msg}</div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    } else {
        $('.show-info').append(`
            <div class="message-box">
                <div class="other">
                    <img class="imgs" src="${data.avatar}" alt="">
                    <div class="content">
                        <p>${data.userName}</p>
                        <div class="bubble_cont">${data.msg}</div>
                    </div>
                </div>
            </div>
        `)
    }

    //滚动条滚到最下方，找到最后的子元素
    scrollIntoView()
})

// 表情
$('.face').on('click', () => {
    // 初始化表情
    $('.input-info .content').emoji({
        button: '.face',
        showTab: false,
        // animation: 'slide',
        position: 'TopRight',
        icons: [
            {
                name: 'QQ表情',
                path: '../lib/img/qq/',
                maxNum: 91,
                excludeNums: [41, 45, 54],
                file: '.gif',
            },
        ],
    })
})

//发送图片功能
$('#file').on('change', function () {
    let file = this.files[0]

    //把文件发生到服务器，借助H5 的 FileReader
    let fr = new FileReader()
    fr.readAsDataURL(file) //转成base64编码
    fr.onload = function () {
        socket.emit('sendImage', {
            userName: userName,
            avatar: avatar,
            img: fr.result,
        })
    }
})

socket.on('receiveImage', (data) => {
    if (data.userName === userName) {
        $('.show-info').append(`
            <div class='message-box'>
                <div class="wrapper">
                    <div class="self">
                        <img class="imgs" src="${data.avatar}" alt="">
                        <div class="content">
                            <img class="pic" src="${data.img}" >
                        </div>
                    </div>
                </div>
            </div>
        `)
    } else {
        $('.show-info').append(`
            <div class="message-box">
                <div class="other">
                    <img class="imgs" src="${data.avatar}" alt="">
                    <div class="content">
                        <p>${data.userName}</p>
                        <img class="pic" src="${data.img}" >
                    </div>
                </div>
            </div>
        `)
    }

    //等待图片加载完成
    $('.show-info img:last').on('load', () => {
        scrollIntoView()
    })
})

//截图功能
$('.input-info .cut').on('click', () => {
    alert('该功能正在实现中...')
})

function scrollIntoView() {
    return $('.show-info').children(':last').get(0).scrollIntoView(false)
}
