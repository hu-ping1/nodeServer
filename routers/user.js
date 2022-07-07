const express = require('express')
const userRouter=express.Router()
const sqlConfig=require('../common/sqlConfig')
let mysql = require("mysql");
let sendCode=require('../module/email')
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
let {token} =require('../common/token')



//邮件验证码
userRouter.get('/code',(req,res)=>{
    sendCode(req.query.email).then(item=>{
        if(item.info.rejected.length<1){
			res.send(
			    {
					code:200,
					data:{
						emailCode:item.emailCode
					},
					msg:"验证码发送成功"
				}
			)
		}else{
			res.send(
			    {
					code:201,
					msg:"验证码发送失败"
				}
			)
		}
    })

   
})

//登录
userRouter.post('/login',(req,res)=>{
    let {userName,passWord} =req.body
   let connect= mysql.createConnection(sqlConfig);
   let sql='select * from user where userName=? and passWord=?'
   let value=[userName,passWord]
   connect.query(sql,value,(err,result)=>{
	   if(err){
		   console.log(err)
		   res.send({
			code:201,
			msg:"操作失败"
		})
		   return;
	   }else{
		   if(result.length<1){
			   res.send({
				   code:201,
				   msg:"账号或密码错误"
			   })
		   }else{
			res.send({
				code:200,
				token:token,
				userInfo:{
					userId:result[0].userId,
					userName:result[0].userName,
					headImg:result[0].headImg,
					email:result[0].email,
					phone:result[0].phone,
				},
				msg:"登录成功"
			})
		   }
	   }
   });
//    connect.end();
})



//注册
userRouter.post('/sign',(req,res)=>{
	let {userName,passWord,email}=req.body
    let sql='select userName from user where userName=?'
   let connect= mysql.createConnection(sqlConfig);
   connect.query(sql,userName,(err,result)=>{
       if(err){
		   console.log(err)
		   res.send({
			code:201,
			msg:"操作失败"
		})
		   return;
	   }else{
		   if(result.length==0){
			   let sqls = 'insert into user set userId=?, username=? , password=?,email=?,headImg=?,phone=?'
			   	let values = [uuidv4(),userName,passWord,email,'','']
				connect.query(sqls,values,(error,results)=>{
					if(error){
						console.log(error)
						return;
					}else{
						res.send({
							code:200,
							msg:'注册成功'
						})
					}
				})
		   }else{
			   res.send({
				   code:203,
				   msg:'此用户名已被注册'
			   })
		   }
	   }
	   connect.end();
   });
  
})


//添加好友---搜索好友
userRouter.get('/userList',(req,res)=>{
     let userId=req.headers.userid
	var {keyWord,pageNum,pageSzie}=req.query
	var connect = mysql.createConnection(sqlConfig)
	let frendIds=[]//根据userId查询的好友数据
	let userDatas=[]//筛选返回的数据
	connect.connect()
	var name = "%" + keyWord + "%";
	let sql = "select * from user where userName like ?";
	connect.query(sql,name,(error,results)=>{
		if(error){
			res.send({
				code:201,
				msg:'操作失败'
			})
		}else{
			var connects = mysql.createConnection(sqlConfig)
	connects.connect()
	let sqls = "select * from frend where userId=?";
	connects.query(sqls,[userId],(err,ress)=>{
		if(err){
			res.send({
				code:201,
				msg:"操作失败"
			})
		}else{
			frendIds=ress
			userDatas=results.map(items=>{
				items.status=findFrendStatus(userId,frendIds)
				return items;
			})
			
			res.send({
				code:200,
				data:userDatas
			})
		}
		
	})
	connects.end()
		}
	})
	connect.end()
})
//根据userId查询好友状态
function findFrendStatus(userId,arrays){
	let state=null
	arrays.forEach(element => {
		if(userId==element.userId){
			state=element.status
		}else{
			state=null
		}
	});
	return state;
}


//好友列表

userRouter.get('/frendList',(req,res)=>{
    let userId =req.headers.userid
   let connect= mysql.createConnection(sqlConfig);
   let sql='select frend.nickName,user.* from frend,user where frend.frendId=user.userId'
//    let sql='select * from frend where userId=?'
   let value=[userId]
   connect.query(sql,value,(err,result)=>{
	   if(err){
		   console.log(err)
		   res.send({
			   code:201,
			   msg:"操作失败"
		   })
	   }else{
		   let data=result.filter(items=>{
			   if(items.userId!=userId){
				   return items;
			   }
		   })
		res.send({
			code:200,
			data:data
		})
	   }
   });
//    connect.end();
})







module.exports=userRouter