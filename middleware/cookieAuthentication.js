var jwt = require('jsonwebtoken');

function verifyCookieToken(req,res,next){
    var user = res.locals.user;

    if( user === null){
        res.render('forbidden');
    }
    else next();
}


module.exports = verifyCookieToken