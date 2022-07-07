
module.exports=(server)=>{
  const socketIo = require('socket.io')
  // 创建 sokcet
const io = socketIo(server, {
  allowEIO3: true,
  cors: {
    origin: "*", // from the screenshot you provided
    methods: ["GET", "POST"]
  }
})
// 保存用户
let userIds = {}
// 当客户端连接时
io.on('connection', socket => {
  socket.on('userInfo',(res)=>{
    userIds[res.userInfo.userId]=socket.id
    socket.skId=res.userInfo.userId
    console.log(userIds)
  })
  socket.on('sendMsg',(res)=>{
    console.log()
    socket.to(userIds[res.toId]).emit('getMsg',res.msgData)
    // socket.broadcast.emit('getMsg',res.msgData)
  })
  // socket.on('disconnect', (reason) => {
  //   delete userIds.reason.skId
  //   console.log(reason,'断开连接')
  // });
  console.log('客户端已经连接')
  
})
}