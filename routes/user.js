var express = require('express')
var router = express.Router();


var Film = require('../models/film');
var Showtime= require('../models/showtime');
var Bill=require('../models/bill');
var Chair= require('../models/chair');
var User= require('../models/user');
 var fs=require('fs-extra');

router.get('/',function(req,res){
    User.findOne({email:req.session.user},function(err,us){
        if (err) return console.log(err);
        if (us ){
            res.render('user/info',{
                user:us
            })
        }

    })
    
})

router.get('/change-info',function(req,res){
    User.findOne({email:req.session.user},function(err,us){
        if (err) return console.log(err);
        if (us ){
            res.render('user/change-info',{
                user:us
            })
        }

    })
})

router.post('/change-info',function(req,res){
    var imageFile =(req.files != null)? req.files.image.name:"";
    var fullname=req.body.fullname;
    var phone = req.body.phone;
    var gender=req.body.gender;
    var birthday=req.body.birthday;
    var pimage=req.body.pimage;
    User.findOne({email:req.session.user},function(err,us){
        if (err) return console.log(err);
        if (us ){
            us.fullname=fullname;
            us.phone=phone;
            us.gender=gender;
            us.birthday=birthday;
            if (imageFile != ""){
            us.photo=imageFile;
            }
            us.save(function(err){
                if (err) return console.log(err);
                if (imageFile != ""){
                    if (pimage!=""){
                        fs.remove('public/img/users/'+us.email+'/'+pimage,function(err){
                            if (err) console.log(err);  
                            }); 
                        }    
                        var userImage =req.files.image;
                        var path= 'public/img/users/'+ us.email +'/' + imageFile;
            
                        userImage.mv(path,function(err){
                                    if (err)return console.log(err);
                            });
                    }  
                    res.render('user/info',{
                        user:us
                    })
            });    
        }
    })
})

router.post('/check-pass',function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    User.findOne({email:email},function(err,us){
        if (err) return console.log(err);
        if (us){
            if (us.password==password) res.send("");
            else res.send("Mật khẩu hiện tại chưa đúng");
        }
    })
})

router.post('/change-pass/:email',function(req,res){
    var email=req.params.email;
    var oldpass=req.body.oldpass;
    var newpass=req.body.newpass;
    User.findOne({email:email},function(err,us){
        if (err) return console.log(err);
        if (us){
            if (us.password==oldpass){
                us.password=newpass;
                us.save();
                res.send("Đổi mật khẩu thành công");
            } 
            else {
                res.send("Đã bảo mật khẩu hiện tại không khớp rồi đm")
            }
        }
    })
})




module.exports = router;