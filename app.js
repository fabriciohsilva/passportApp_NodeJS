//requisitando componentes que serão usados no app
var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');


//criando rotas para as páginas (controler)
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


//views engine
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');


//set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//express session middleware
app.use(session({
    secret: 'secret'
,   saveUninitialized: true
,   resave: true
}));//end app.use-session


//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));//end app.use-expressValidator


//connect-flash middleware
app.use(flash());
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});//end app.use(function(req, res, next)


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//definindo rotas
app.use('/', routes);
app.use('/users', users);

app.listen(3000);
console.log('Servidor iniciado na porta 3000');