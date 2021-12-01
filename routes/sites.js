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
    var monday=today.getTime()-(today.getDay()-1)*daylength;
    for (var i=0;i<14;i++){
        var newMonday= new Date(monday);
        dayWeek.push(newMonday);
        monday=monday+daylength;
    }
    var dateRq=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var newFis=[];
    Film.find({status:"showing"},function(err,fis){
        for(var i=0;i<fis.length;i++){
            for(var j=0;j<fis[i].showtime.length;j++){
                if (fis[i].showtime[j].date==dateRq) {newFis.push(fis[i]); break;}
            }
        }
        Film.find({status:"coming"},function(err,fic){
            if (err) return console.log(err);
            res.render('index',{
            filmslide:fis,
            films:newFis,
            filmc:fic,
            dateRq:dateRq,
            dayWeek: dayWeek
            });
        })
    })
})

router.get('/bill',function(req,res){
    var billid=req.query.billid;
    var chair=[];
    Bill.findOne({idB:billid},function(err,b){
        chair=b.seat;
        b.checkout=1;
        b.save();
        res.render('order/ordered',{
            billid:billid
        });
    })
    setTimeout(() => {
        for(var i=0;i<chair.length;i++){
            Chair.findOne({_id:chair[i].idChair},function(err,ch){
                ch.available=0;
                ch.save();
            })
        }
    }, 5);
    
})

router.get('/:time',function(req,res){
    var today = new Date();
    var time=new Date(parseInt(req.params.time));
    if (time.getDate()==(today.getDate())) return res.redirect('/');
        var dayWeek = [];
        var daylength=24*60*60*1000;
        var monday=today.getTime()-(today.getDay()-1)*daylength;
        for (var i=0;i<14;i++){
            var newMonday= new Date(monday);
            dayWeek.push(newMonday);
            monday=monday+daylength;
        }
        var dateRq=time.getFullYear()+'-'+(time.getMonth()+1)+'-'+(time.getDate()<10?"0"+time.getDate():time.getDate());
        var newFis=[];
        Film.find({status:"showing"},function(err,fis){
            for(var i=0;i<fis.length;i++){
                for(var j=0;j<fis[i].showtime.length;j++){
                    if (fis[i].showtime[j].date==dateRq) {newFis.push(fis[i]); break;}
                }
            }
            Film.find({status:"coming"},function(err,fic){
                if (err) return console.log(err);
            res.render('index',{
                filmslide:fis,
                films:newFis,
                filmc:fic,
                dateRq:dateRq,
                dayWeek: dayWeek
                });
            })
        })
})





module.exports = router;