var express = require('express')
var router = express.Router();

var fs = require('fs-extra');

var User= require('../models/user');

var nodemailer = require('nodemailer')
//server gmail
var transporter =  nodemailer.createTransport({ // config mail server
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'doancots445@gmail.com', //Tài khoản gmail
        pass: 'fspnbgenkfzdnffh' //Mật khẩu tài khoản gmail
    },
    tls: {        
        rejectUnauthorized: false
    }
});


//get register
router.get('/register',function(req,res){
    res.render('auth/register',{
        mes:""
    });
})

//post register
router.post('/register',function(req,res){
    var email= req.body.email;
    var password= req.body.password;
    var fullname= req.body.fullname;
    var phone = req.body.phone;
    var birthday=req.body.birthday;
    User.findOne({email: email},function(err,user){
        if(err) return console.log(err);
        if (user) {
            res.render('auth/register',{
                mes: 'Email đã tồn tại',
                email:email,
                fullname:fullname,
                phone:phone,
                birthday:birthday
            })
        }
        else{
            var user=new User({
                email:email,
                password:password,
                fullname:fullname,
                admin:0,
                phone:phone,
                birthday:birthday
            });
            user.save(function(err){
                if (err) return console.log(err);
                fs.mkdir('public/img/users/'+ user.email, function(err){
                    if (err) return console.log(err);
                });
                res.render('auth/register',{
                    mes:'Đăng ký thành công'
                })
            })
           
        }
    })


})

//get login
router.get('/login',function(req,res){
    res.render('auth/login',{
        value: "",
        mes : ""
    });
})

//post login
router.post('/login',function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    User.findOne({email: email},function(err,user){
        if (err) return console.log(err);
        if (user){
            if (user.block.type!=0) {
                var mes="Tài khoản của bạn bị chặn đến "+user.block.dateto+" vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
                if (user.block.type=='non') 
                mes="Tài khoản của bạn bị chặn không thời hạn vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
                res.render('auth/login',{
                    value: email,
                    mes: mes
                })
            }
            else if (user.password== password){
                req.session.user = email; 
                res.redirect('/')
            }
            else {
                res.render('auth/login',{
                    value: email,
                    mes: 'Sai mật khẩu'
                })
            }
        }
        else {
            res.render('auth/login',{
                value:email,
                mes: 'Tài khoản không tôn tại'
            })
        }
    })
   
})

//get forgot
router.get('/forgot',function(req,res){
    res.render('auth/forgot',{
        value: "",
        mes : ""
    });
})

//post forgot
router.post('/forgot',function(req,res){
    var email= req.body.email;    
    User.findOne({email: email},function(err,user){
        if (err) return console.log(err);
        if (user){
            var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                from: 'doancots445@gmail.com',
                to: email,
                subject: 'MEGAS STAR',
                text: `Mật khẩu của bạn là: ${user.password}`
            }
            transporter.sendMail(mainOptions, function(err, info){
                if (err) {
                    console.log(err);   
                    res.render('auth/forgot',{
                        value:email,
                        mes: 'Gửi thất bại'
                    });                 
                } else {
                    console.log('Message sent: ' +  info.response);
                    res.render('auth/forgot',{
                        value:email,
                        mes: 'Gửi thành công'
                    });
                }
            });
        }else {
            res.render('auth/forgot',{
                value:email,
                mes: 'Tài khoản không tôn tại'
            })
        }
    })
   
})

//get logout
router.get('/logout',function(req,res){
    req.session.destroy();
    res.redirect('/');
})



module.exports = router;