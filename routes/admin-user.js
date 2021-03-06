var express = require('express')
var router = express.Router();
var mkdir = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img')

var User=require('../models/user');


router.get('/',function(req,res){
    User.find({email:{'$ne':req.session.user}},function(err,us){
        res.render('admin/admin-user',{
            user:us
        })
    })
})
router.post('/decentralize',function(req,res){
    var email=req.body.email;
    var admin=req.body.admin;
    var hmtl="";
    User.findOne({email:email},function(err,us){
        if (err) return console.log(err);
        if (us){
            us.admin=admin;
            us.save(function(err){
                hmtl=`<option value="1"`+((us.admin==1)?`selected`:``)+`>Admin</option>
                <option value="0" `+((us.admin==0)?`selected`:``)+`>Member</option>`
                res.send(hmtl);
            });
        }
    })
})

router.post('/undoselect',function(req,res){
    var email=req.body.email;
    var hmtl="";
    User.findOne({email:email},function(err,us){
        if (err) return console.log(err);
        if (us){
            hmtl=`<option value="1"`+((us.admin==1)?`selected`:``)+`>Admin</option>
            <option value="0" `+((us.admin==0)?`selected`:``)+`>Member</option>`
            res.send(hmtl);
        }
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