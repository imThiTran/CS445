var express = require('express');
var path= require('path');
var config = require('./config/database')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var paypal= require('paypal-rest-sdk');

mongoose.connect(config.database);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('connected to mongodb')
});

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AcvQ4vyhZF0I1bw3q52XUxCXlYjfMFHDFyiskavEazQvZcgggUiVCVoXQjVCf8Kz7AwKeWhkkUb2rmSi',
  'client_secret': 'EBNrKHPqA6g-cfyRukheStWEnTicCBdeV8j0hSqvkNOuxg4k-Neht5lU3umfa49ZUj4CPzM1yXBsdpBr'
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
var order = require('./routes/order');
var user= require('./routes/user');

var adminUser=require('./routes/admin-user');
var adminFilm = require('./routes/admin-film');
var adminShowtime = require('./routes/admin-showtime');
var adminSnack=require('./routes/admin-snack');
var adminStatistic=require('./routes/admin-statistic');

var checkUser = require('./middleware/checkUser.middleware');
var checkShowtime = require('./middleware/checkShowtime.middleware')
var checkopenBlock=require('./middleware/checkopenblock.middleware');
var checkBlock=require('./middleware/checkblock.middleware');
var checkLogin= require('./middleware/checklogin.middleware');
var checkAdmin = require('./middleware/checkadmin.middleware');
var checkDeleteBill = require('./middleware/checkDeleteBill.middleware');

app.use('/auth',checkDeleteBill,checkopenBlock,checkBlock,auth);
app.use('/film',checkDeleteBill,checkShowtime,checkopenBlock,checkBlock,checkUser,film);
app.use('/user',checkDeleteBill,checkShowtime,checkopenBlock,checkLogin,checkBlock,checkUser,user);
app.use('/order',checkDeleteBill,checkShowtime,checkopenBlock,checkLogin,checkBlock,checkUser,order);
app.use('/admin/user',checkDeleteBill,checkShowtime,checkopenBlock,checkLogin,checkBlock,checkAdmin,checkUser,adminUser);
app.use('/admin/statistic',checkDeleteBill,checkShowtime,checkopenBlock,checkLogin,checkBlock,checkAdmin,checkUser,adminStatistic);
app.use('/admin/film',checkDeleteBill,checkShowtime,checkopenBlock,checkLogin,checkBlock,checkAdmin,checkUser,adminFilm);
app.use('/admin/showtime',checkDeleteBill,checkShowtime,checkopenBlock,checkLogin,checkBlock,checkAdmin,checkUser,adminShowtime);
app.use('/admin/snack',checkDeleteBill,checkShowtime,checkopenBlock,checkLogin,checkBlock,checkAdmin,checkUser,adminSnack);
app.use('/',checkShowtime,checkopenBlock,checkBlock,checkUser,site);


