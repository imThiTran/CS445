var express = require('express')
var router = express.Router();

// var checkCustomer = require('../middleware/checkCustomer.middleware')
// var checkUser = require('../middleware/checkUser.middleware');
// var Product= require('../models/product');
// var Category= require('../models/category');
var Film = require('../models/film');
var Showtime= require('../models/showtime');

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
    var dateRq=today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    var newFis=[];
    Film.find({status:"showing"},function(err,fis){
        for(var i=0;i<fis.length;i++){
            for(var j=0;j<fis[i].showtime.length;j++){
                if (fis[i].showtime[j].date==dateRq) newFis.push(fis[i]);
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
        var dateRq=time.getDate()+'/'+(time.getMonth()+1)+'/'+time.getFullYear();
        var newFis=[];
        Film.find({status:"showing"},function(err,fis){
            for(var i=0;i<fis.length;i++){
                for(var j=0;j<fis[i].showtime.length;j++){
                    if (fis[i].showtime[j].date==dateRq) newFis.push(fis[i]);
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