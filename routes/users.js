var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('passportapp', ['users']);
var bcrypt = require('bcryptjs');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


router.get('/login', function(req, res ){
    res.render('login.ejs');
});//end router.get('/login', function(req, res )

router.get('/register', function(req, res ){
    res.render('register.ejs');
});//end router.get('/register', function(req, res )


//registro - post
router.post('/register', function(req, res ){

//obtendo valores pela requisição post
    var name      = req.body.name;
    var email     = req.body.email;
    var username  = req.body.username;
    var password  = req.body.password;
    var password2 = req.body.password2;

//validação
    req.checkBody('name', 'Name field is required.').notEmpty();
    
    req.checkBody('email', 'Email field is required.').notEmpty();
    req.checkBody('email', 'Please use a valid email address.').isEmail();

    req.checkBody('username', 'Username field is required.').notEmpty();

    req.checkBody('password', 'Password field is required.').notEmpty();
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

//verificando erros
    var errors = req.validationErrors();

    if(errors){
        console.log('Form has errors.');
        res.render('register.ejs', {
            errors: errors
        ,   name: name
        ,   email: email
        ,   username: username
        ,   password: password
        ,   password2: password2
        });//end res.render('register', {
        
    }else{

        var newUser = {
            name: name
        ,   email: email
        ,   username: username
        ,   password: password }

        bcrypt.genSalt(10, function(err, salt){

            bcrypt.hash(newUser.password, salt, function(err, hash){

                newUser.password = hash;

                db.users.insert(newUser, function(err, doc){
            
                if(err){
                    res.send(err);
                }else{
                    console.log('User Added...');
                }//end if(err)

                //mensagem de sucesso
                req.flash('success', 'You are registred and now you can log in.');

                //redirecionando
                res.location('/');
                res.redirect('/');

        });//end db.users.insert(newUser, function(err, doc)



            });//end bcrypt.hash(newUser.password, salt, function(err, hash)

        });//end bcrypt.genSalt(10, function(err, salt)        

    }//end if(errors)


});//end router.post('/register', function(req, res )


passport.serializeUser(function(user, done){
  done(null, user._id);
});//end passport.serializeUser(function(user, done)


passport.deserializeUser(function(id, done){

  db.users.findOne({_id: mongojs.ObjectId(id)}, function(err, user){
    done(err, user);
  });

});//end passport.deserializeUser(function(id, done)


passport.use(new localStrategy(

    function(username, password, done){

        db.users.findOne({username: username}, function(err, user){

            if(err){
                return done(err);
            }//end if(err)
            if(!user){
                return done(null, false, {message: 'Incorrect Username'});
            }//end if(!user)

            bcrypt.compare(password, user.password, function(err, isMatch){

                if(err){
                    return done(err);
                }//end if(err)

                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Incorrect Password'});
                }
            
            });

        });

    }//end function(username, password, done)
));

//login - Post
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid Username or Password' })
  , function(req, res){
        console.log('Auth Successfull');
        res.redirect('/');
});//end function(req, res)

router.get('/logout', function(req, res){

    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');


});//end router.get('/logout', function(req, res)


module.exports = router;