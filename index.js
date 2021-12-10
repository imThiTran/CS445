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

// app.post('/pay',function(req,res){
//   var create_payment_json = {
//     "intent": "sale",
//     "payer": {
//         "payment_method": "paypal"
//     },
//     "redirect_urls": {
//         "return_url": "http://localhost:3000",
//         "cancel_url": "http://localhost:3000/cancle"
//     },
//     "transactions": [{
//         "item_list": {
//             "items": [{
//                 "name": "item",
//                 "sku": "item",
//                 "price": "1.00",
//                 "currency": "USD",
//                 "quantity": 1
//             }]
//         },
//         "amount": {
//             "currency": "USD",
//             "total": "1.00"
//         },
//         "description": "This is the payment description."
//     }]
// };


// paypal.payment.create(create_payment_json, function (error, payment) {
//     if (error) {
//         throw error;
//     } else {
//         for(let i=0;i<payment.links.length;i++){
//             if(payment.links[i].rel==='approval_url'){
//                 res.redirect(payment.links[i].href);
//             }
//         }
//     }
// });
// })
var auth = require('./routes/auth');
var site = require('./routes/sites');
var film = require('./routes/film');
var adminFilm = require('./routes/admin-film');
var adminShowtime = require('./routes/admin-showtime');
var order = require('./routes/order');
var adminSnack=require('./routes/admin-snack');

var checkUser = require('./middleware/checkUser.middleware');
var checkShowtime = require('./middleware/checkShowtime.middleware')

app.use('/auth',auth);
app.use('/film',checkShowtime,checkUser,film);
app.use('/order',checkShowtime,checkUser,order);
app.use('/admin/film',checkShowtime,checkUser,adminFilm);
app.use('/admin/showtime',checkShowtime,checkUser,adminShowtime);
app.use('/admin/snack',checkShowtime,checkUser,adminSnack);
app.use('/',checkShowtime,checkUser,site);


