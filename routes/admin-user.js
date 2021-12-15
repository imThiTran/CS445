var express = require('express')
var router = express.Router();
var mkdir = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img')

var User=require('../models/user');
var Film= require('../models/film');
var Snack =require('../models/snack');

router.get('/',function(req,res){
    User.find({},function(err,us){
        res.render('admin/admin-user',{
            user:us
        })
    })
})

router.post('/blockbtn',function(req,res){
    var email=req.body.email;
    var block=req.body.block;
    var dateto="";
    var todaymls=(new Date()).getTime();
    var datetomls="";
    User.findOne({email:email},function(err,us){
        if (!(block=='non'|| block==0)){
             datetomls=todaymls+(block*86400000);
            var newdateto=new Date(datetomls);
            dateto=newdateto.getDate()+'/'+(newdateto.getMonth()+1)+'/'+newdateto.getFullYear()+' '+newdateto.getHours()+':'+((newdateto.getMinutes()<10)?'0'+newdateto.getMinutes():newdateto.getMinutes());
        };
        setTimeout(() => {
            var newBlock={type:block, dateto:dateto,realdate:datetomls};
            us.block=newBlock;
            us.save(function(err){
            if (err) return console.log(err);
            res.send({dateto:dateto});
        });
        }, 5);
    })
})

module.exports = router;