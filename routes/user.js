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
        var newUs=us.email;
        var index=newUs.indexOf('@');
        var newUs1=newUs.slice(0,index-3);
        var newUs2=newUs.slice(index);
        newUs=newUs1.concat('***',newUs2);
        if (err) return console.log(err);
        if (us ){
            res.render('user/info',{
                user:us,
                email:newUs
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
            var newUs=us.email;
            var index=newUs.indexOf('@');
            var newUs1=newUs.slice(0,index-3);
            var newUs2=newUs.slice(index);
            newUs=newUs1.concat('***',newUs2);
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
                        user:us,
                        email:newUs
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
                res.send("Mời nhập lại mật khẩu hiện tại")
            }
        }
    })
})
 router.get('/purchase',function(req,res){
     Bill.find({email:req.session.user},function(err,bi){
        var timeArr=[];
        var seatArr=[];
        var snackArr=[];
        var photoArr=[];
         for (var i=0;i<bi.length;i++){
             Film.findOne({nameEN:bi[i].nameEN},function(err,fi){
                 if (fi){ photoArr.push({id:fi.id, photo:fi.photo})};
             })
            var newSeat="";
            var newSnack="";
            var newDateArr = bi[i].date.split('-') ;
            var newDate=newDateArr[2]+'/'+newDateArr[1]+'/'+newDateArr[0];
            var timesc=((bi[i].time.split(':'))[0]>=12)?"PM":"AM";
            timeArr.push(newDate+' '+bi[i].time+' '+timesc);
            for (var j=0;j<bi[i].seat.length;j++){
                newSeat=newSeat+bi[i].seat[j].nameChair+ ((j==bi[i].seat.length-1)?" ":", ")
            }
            for (var k=0;k<bi[i].snacks.length;k++){
                newSnack=newSnack+bi[i].snacks[k].name+' x'+bi[i].snacks[k].quantity+ ((k==bi[i].snacks.length-1)?" ":", ")
            }
            seatArr.push(newSeat);
            snackArr.push(newSnack);
         }
         setTimeout(() => {
            res.render('user/purchase',{
                bill:bi,
                time:timeArr,
                seat:seatArr,
                snack:snackArr,
                photo:photoArr,
            });
         }, 10);
        
     })
 })



module.exports = router;