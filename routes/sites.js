var express = require('express')
var router = express.Router();

// var checkCustomer = require('../middleware/checkCustomer.middleware')
// var checkUser = require('../middleware/checkUser.middleware');
// var Product= require('../models/product');
// var Category= require('../models/category');
var Film = require('../models/film');


router.get('/',function(req,res){
    var today = new Date();
    var dayWeek = [];
    var daylength=24*60*60*1000;
    var monday=today.getTime()-(today.getDay()-1)*daylength;
    for (var i=0;i<7;i++){
        var newMonday= new Date(monday);
        dayWeek.push(newMonday);
        monday=monday+daylength;
    }
    var dateRq=today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    Film.find({status:"showing"},function(err,fis){
        Film.find({status:"coming"},function(err,fic){
            if (err) return console.log(err);
        res.render('index',{
            films:fis,
            filmc:fic,
            dateRq:dateRq,
            dayWeek: dayWeek
            });
        })
    })
})





module.exports = router;