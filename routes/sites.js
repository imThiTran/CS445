var express = require('express')
var router = express.Router();

// var checkCustomer = require('../middleware/checkCustomer.middleware')
// var checkUser = require('../middleware/checkUser.middleware');
// var Product= require('../models/product');
// var Category= require('../models/category');
var Film = require('../models/film');


router.get('/',function(req,res){
    Film.find({status:"showing"},function(err,fis){
        Film.find({status:"coming"},function(err,fic){
        if (err) return console.log(err);
        res.render('index',{
            films:fis,
            filmc:fic,
            });
        })
    })
})





module.exports = router;