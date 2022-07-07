const nodemailer = require('nodemailer');
// 创建可重用邮件传输器
const transporter = nodemailer.createTransport({
       service: 'qq',
       host: "smtp.qq.com", // qq的邮件地址
        port: 465, // 端口
        secureConnection: false, // use SSL
        auth: {
            "user": '2641637789@qq.com', // 邮箱账号
            "pass": 'ssvhstpnutazdhhg' // 邮箱的授权码
        }
    });
    
   module.exports = (emailNum) => {
    return new Promise((resolve,reject)=>{
       
        let emailCode = (1000 + Math.round(Math.random() * 10000 - 1000)) //验证码为4位随机数，这个自己用random（）写就行
        let email = {
            title: '邮箱验证码',
            html: '<p>您好，欢迎注册,您的验证码是：'+emailCode+',此验证码将在5分钟内有效</p>'
           }
    let mailOptions = {
            from: '2641637789@qq.com', // 发件人地址
            to: emailNum, // 收件人地址，多个收件人可以使用逗号分隔
            subject: email.title, // 邮件标题
            html: email.html // 邮件内容
        };
        transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            reject(error)
            return console.log(error);
            }
        else{
            resolve({info,emailCode:emailCode})
        }
            
          });
         })
        
        }
