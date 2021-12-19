var express = require('express')
var router = express.Router();
var fs = require('fs-extra');

var User=require('../models/user');
var Bill = require('../models/bill');

router.get('/',function(req,res){
        res.render('admin/admin-statistic');
})




module.exports = router;