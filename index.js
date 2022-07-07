const express = require('express')
const app = express()
var mysql = require("mysql");
var bodyParser =require('body-parser')
let userRoute=require('./routers/user')//用户接口
let frendRouter=require('./routers/frend')//朋友接口
let server=app.listen(8789)
const expressJWT = require('express-jwt')
// //引入socket
let sk=require('./module/socket')


//验证token
let whiteList=['/code','/login','/sign']//接口白名单
let {verifyToken} =require('./common/token')
app.use(function(req, res, next) {
  if(whiteList.includes(req.url)){
    next()
  }else{
    var token = req.headers['authorization'];
    let msg=verifyToken(token)
    if(!msg){
      res.status(200).send({
        code:401
      })
    }
    next()
  }

  
});
sk(server)//socket

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRoute)
app.use(frendRouter)


app.listen(3005,()=>{
  console.log('服务器已经启动')
})
