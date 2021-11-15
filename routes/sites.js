var express = require('express')
var router = express.Router();

// var checkCustomer = require('../middleware/checkCustomer.middleware')
// var checkUser = require('../middleware/checkUser.middleware');
// var Product= require('../models/product');
// var Category= require('../models/category');
var Film = require('../models/film');


router.get('/',function(req,res){
    var today = new Date();
    var dateRq=today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    Film.find({status:"showing"},function(err,fis){
        Film.find({status:"coming"},function(err,fic){
            if (err) return console.log(err);
        res.render('index',{
            films:fis,
            filmc:fic,
            dateRq:dateRq
            });
        })
    })
})





module.exports = router;