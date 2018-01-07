var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
    res.status(200).send("Cookie should be set now.");
});

router.get('/clear',function(req,res){
    res.clearCookie('cookieName');
    res.status(200).send("No cookie here!");
})


module.exports = router;