
// const io = require('socket.io-client')
let socket = window.io.connect()
let client_con = $('.connect')
let roleName = $('.role input')
let send = $('.inp')
let client_room = $('.room')
// $('.promat').show()
client_con[0].addEventListener('click', ()=>{
    let room = client_room.val()
    if(room !== ''){
        console.log('clinet Joining room ' + room)
        socket.emit('create or join', room)  
    }
})

socket.on('message', (data) =>{
    console.log('服务端发来的消息---', data)
    $('.oUl').append('<li>'+data+'</li>')
})

socket.on('created', (num)=>{
    console.log('服务端创建了房间', num)
})

socket.on('empty', function (data) {
    console.log('收到服务端发来的消息---empty', data)
})

socket.on('full', function (data) {
    console.log('收到服务端发来的消息---full', data)
})

socket.on('join', (room) => {
    console.log('收到服务端发来的消息---join' + room)
})




$('.but')[0].addEventListener('click', ()=>{
    socket.emit('message',`${roleName.val()}: ${send.val()}`)
    $('.inp').val('')
})