var express = require('express')
var router = express.Router();

// var checkCustomer = require('../middleware/checkCustomer.middleware')
// var checkUser = require('../middleware/checkUser.middleware');
// var Product= require('../models/product');
// var Category= require('../models/category');



router.get('/',function(req,res){
    res.render('index');
})



module.exports = router;