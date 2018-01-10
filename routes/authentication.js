var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var zxcvbn = require('zxcvbn');
var connection = require('../queries/connection');
var users = require('../queries/userQueries');

router.get('/register',function(req,res){
    if(res.locals.user!=null) res.redirect('/nemoze');
    res.render('registerForm');
});

router.post('/register',function(req,res){
    let password = req.body.password;
    
    //check for whitespaces
    if(req.body.name.length == 0 || req.body.surname.length == 0 || req.body.username.length == 0 || req.body.password.length == 0 || req.body.password_confirm.length ==0){
        res.render('registerForm',{err:"Sva polja moraju biti popunjena!"});
    }
    else if(password.indexOf(' ')!=-1 || password.length<8){
        res.render('registerForm',{err:"Sifra ne smije sadrzavati razmake i mora imati barem 8 znakova!"});
    }
    else if(password.search(/\d/)==-1 || password.search(/[A-Z]/)==-1){
        res.render('registerForm',{err:"Sifra mora sadrzavati bar jedan broj i jedno veliko slovo!"});
    }
    else if(password!= req.body.password_confirm){
        res.render('registerForm',{err:"Ukucane sifre se ne podudaraju"});
    }
    else if(zxcvbn(password).score<3){
        res.render('registerForm',{err:"Ukucana sifra nije dovoljno sigurna"});
    }
    else{
        connection.query('select count(*) as number from reg_user where username =?',[req.body.username],(err,results,fields)=>{
            if(err) {
                console.log(err);
                res.render('forbidden',{error:'Greska prilikom pristupa bazi'});
            }
            if(results[0].number>0) res.render('registerForm',{err:"Korisnicko ime je zauzeto"});
            else {
                //check user provided data 

                // save user 
                
                var user = {
                    username:req.body.username,
                    name:req.body.name,
                    surname:req.body.surname,
                    password:req.body.password
                }

                users.saveUser(user,(err,results,fields)=>{
                    if(err) res.render('forbidden');
                    else{
                        res.render('okRegistration');
                    }
                });                
            }
        });
        
    }
});

router.get('/login',function(req,res){
    if(res.locals.user!=null) res.redirect('/nemoze');
    res.render('loginForm');
});

router.post('/login',function(req,res){
    console.log(req.body);
    //check user
    var user = null;

    users.findUserByUsername(req.body.username,(err,result,fields)=>{
        if(err) console.log(err);
        console.log(req.body.username);
        console.log(result,result.length);
        if(result.length!=1){
            //ovdje treba bolji hendling
            res.locals.err = "korisnik ne postoji";
            res.render('loginForm');
        }
        else {
            var okPassword = bcrypt.compareSync(req.body.password,result[0].password);
            if (okPassword){
                user = {

                    name:result[0].name,
                    surname:result[0].surname,
                    username:result[0].username,
                    type:result[0].type,
                    id:result[0].id,
                    store_id:result[0].store_id
                }
                var token = jwt.sign({user:user},'biggestsecret',{
                    expiresIn:86400
                });
                res.cookie('ts_token', token, { maxAge: 900000, httpOnly: true })
                res.redirect(302,'/');
                }
            else {
                res.locals.err = "pogresan password";
                //res.render('forbidden');
                res.render('loginForm');
            }
        }
    });
    /*
    if(req.body.username=="user" && req.body.password=="user"){
        user = {username:req.body.username,password:req.body.password};
        var token = jwt.sign({user:user},'biggestsecret',{
            expiresIn:86400
        });
        res.cookie('ts_token', token, { maxAge: 900000, httpOnly: true, secure: true, })
        //.status(200).send("uspjesan login");
        res.redirect(302,'/auth/registration');
        //ßres.send("uspjesan login");
    }
    else res.status(404).send("no no");*/
});

router.get('/logout',function(req,res){
    //res.clearCookie('ts_token');
    res.cookie('ts_token','');
    res.redirect(302,'/');
})

module.exports = router;