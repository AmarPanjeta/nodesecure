var jwt = require('jsonwebtoken');

function getUser(req,res,next){
    var token = req.cookies.ts_token;

    if(token!==undefined && token!=""){
        jwt.verify(token,'biggestsecret',(err,decoded)=>{
            if (err){
                res.locals.user=null;
            }
            else{
                res.locals.user=decoded.user;
            }
        })
    }
    else res.locals.user=null;
    next();
}

module.exports=getUser;