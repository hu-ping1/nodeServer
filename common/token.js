var jwt = require('jsonwebtoken');

let privetKey='bar '
let content='kloidbjl'

exports.token= jwt.sign({foo:content}, privetKey, { expiresIn: 60*60*1 });// 1小时过期

exports.verifyToken=(token)=>{
  return  jwt.verify(token, privetKey, function (err, decode) {
    if (err) {  //  时间失效的时候/ 伪造的token          
        return false            
    } else {
        return true
    }
})
}