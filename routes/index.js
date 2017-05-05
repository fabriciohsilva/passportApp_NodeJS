var express = require('express');
var router = express.Router();


router.get('/', ensureAuthenticated, function(req, res ){
    console.log('entrou no get');
    res.render('index.ejs');
});//end router.get('/', function(req, res )


function ensureAuthenticated(req, res, next){
    console.log('entrou no ensureAuthenticated');
    if(req.isAuthenticated()){
        console.log('entrou no ensureAuthenticated1');
        return next();
    }//end if(req.isAutenticated())

    res.redirect('/users/login');

}//end function ensureAuthentication()

module.exports = router;