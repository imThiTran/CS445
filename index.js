var express = require('express');
var path= require('path');
var config = require('./config/database')
var mongoose = require('mongoose');

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
var port = 3000;
app.listen(port,function(){
    console.log('Server started on port '+ port);
})


var auth = require('./routes/auth');
var site = require('./routes/sites')

app.use('/auth',auth);
app.use('/',site);