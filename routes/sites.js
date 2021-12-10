var express = require('express')
var router = express.Router();

// var checkCustomer = require('../middleware/checkCustomer.middleware')
// var checkUser = require('../middleware/checkUser.middleware');
// var Product= require('../models/product');
// var Category= require('../models/category');
var Film = require('../models/film');
var Showtime= require('../models/showtime');
var Bill=require('../models/bill');
var Chair= require('../models/chair');

router.get('/',function(req,res){
    var today = new Date();
    var dayWeek = [];
    var daylength=24*60*60*1000;
    if (today.getDay()==0){
    var monday=today.getTime()-6*daylength;
    } else {
    var monday=today.getTime()-(today.getDay()-1)*daylength;
    }
    for (var i=0;i<14;i++){
        var newMonday= new Date(monday);
        dayWeek.push(newMonday);
        monday=monday+daylength;
    }
    var dateRq=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()<10?"0"+today.getDate():today.getDate());
    var newFis=[];
    
    Film.find({status:"Đang khởi chiếu"},function(err,fis){
        for(var i=0;i<fis.length;i++){
            for(var j=0;j<fis[i].showtime.length;j++){
                if (fis[i].showtime[j].date==dateRq) {newFis.push(fis[i]); break;}
            }
        }
        Film.aggregate([{ $match: {status:"Đang khởi chiếu" }},{ $sample: { size: 4 } }],function(err,filmslide){
        Film.find({status:"Sắp khởi chiếu"},function(err,fic){
            if (err) return console.log(err);
            res.render('index',{
            filmslide:filmslide,
            films:newFis,
            filmc:fic,
            dateRq:dateRq,
            dayWeek: dayWeek
                });
            })
        })
    })
})

router.get('/bill',function(req,res){
    var billid=req.query.billid;
    var chair=[];
    var checkBill=[];
        Bill.findOne({idB:billid},function(err,b){
        Showtime.findOne({date:b.date,time:b.time,room:b.room,closed:1},function(err,st){
            if (err) return console.log(err);
            if (st) res.render('order/order-cancel');
            else {
                for (var i=0;i<b.seat.length;i++){
                    Bill.findOne({idB:{'$ne':billid},"seat.idChair":b.seat[i].idChair,checkout:1},function(err,bi){
                        if (bi) checkBill.push(bi); ;
                    })
                }
                setTimeout(() => {
                    if (checkBill.length==0){
                        chair=b.seat;
                        b.checkout=1;
                        b.save();
                        res.render('order/ordered',{
                        billid:billid
                });
                    }
                    else {
                        res.render('order/order-cancel');
                    }
                }, 10);  
            }
        })
        setTimeout(() => {
            if (chair.length>0){
            for(var i=0;i<chair.length;i++){
                Chair.findOne({_id:chair[i].idChair},function(err,ch){
                    ch.available=0;
                    ch.save();
                    })
                }
            }
        }, 25);
    })
    
})

router.get('/:time',function(req,res){
    var today = new Date();
    var time=new Date(parseInt(req.params.time));
    if (time.getDate()==(today.getDate())) return res.redirect('/');
        var dayWeek = [];
        var daylength=24*60*60*1000;
        if (today.getDay()==0){
            var monday=today.getTime()-6*daylength;
            } else {
            var monday=today.getTime()-(today.getDay()-1)*daylength;
            }
        for (var i=0;i<14;i++){
            var newMonday= new Date(monday);
            dayWeek.push(newMonday);
            monday=monday+daylength;
        }
        var dateRq=time.getFullYear()+'-'+(time.getMonth()+1)+'-'+(time.getDate()<10?"0"+time.getDate():time.getDate());
        var newFis=[];
        Film.find({status:"Đang khởi chiếu"},function(err,fis){
            for(var i=0;i<fis.length;i++){
                for(var j=0;j<fis[i].showtime.length;j++){
                    if (fis[i].showtime[j].date==dateRq) {newFis.push(fis[i]); break;}
                }
            }
        Film.aggregate([{ $match: {status:"Đang khởi chiếu" }},{ $sample: { size: 4 } }],function(err,filmslide){
            Film.find({status:"Sắp khởi chiếu"},function(err,fic){
                if (err) return console.log(err);
            res.render('index',{
                filmslide:filmslide,
                films:newFis,
                filmc:fic,
                dateRq:dateRq,
                dayWeek: dayWeek
                    });
                })
            })
        })
})





module.exports = router;