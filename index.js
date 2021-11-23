var express = require('express');
var path= require('path');
var config = require('./config/database')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

mongoose.connect(config.database);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('connected to mongodb')
});

var app  = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(fileUpload());

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

//parse application/json
app.use(bodyParser.json())


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      secure: false,
      maxAge: 1800000
    }
  }));

var port = 3000;
app.listen(port,function(){
    console.log('Server started on port '+ port);
})


var auth = require('./routes/auth');
var site = require('./routes/sites');
var film = require('./routes/film');
var adminFilm = require('./routes/admin-film');
var adminShowtime = require('./routes/admin-showtime');
var order = require('./routes/order');

var checkUser = require('./middleware/checkUser.middleware');

app.use('/auth',auth);
app.use('/film',checkUser,film);
app.use('/order',checkUser,order);
app.use('/admin/film',checkUser,adminFilm);
app.use('/admin/showtime',checkUser,adminShowtime);
app.use('/',checkUser,site);


