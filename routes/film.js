var express = require('express')
var router = express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');

router.get('/detail/:slug',function(req,res){
    var slug = req.params.slug;
    var newDate=[];
    Film.findOne({slug:slug},function(err,fi){
        newDate=Array.from(new Set(fi.showtime.map(function(result){
            return result.date;
        })));
        res.render('films/detail',{
            film:fi,
            showtime:fi.showtime,
            date:newDate,
        });
    })
})

router.post('/loadTime',function(req,res){
    var value=req.body.value;
    var nameEN=req.body.nameEN;
    var timeCode="";
    Showtime.find({$and:[{nameEN:nameEN},{"date":value}]},function(err,fi){
        fi.sort(function(a, b){
            if (a.time.toLowerCase() < b.time.toLowerCase()) {return -1;}
            if (a.time.toLowerCase() > b.time.toLowerCase()) {return 1;}
            return 0;
        });
        newTime=Array.from(new Set(fi.map(function(result){
            return result.time;
        })));
        for(var i=0;i<newTime.length;i++){
            timeCode=timeCode+`<input value="`+newTime[i]+`"onclick="handleClick(this);" type="radio" class="choosetime btn-check" name="time" id="`+(i+1)+`-outlined" autocomplete="off">
            <label class="btn btn-primary  btn-seat1" for="`+(i+1)+`-outlined">`+newTime[i]+`</label>`
        }
    })
    setTimeout(() => {
        res.send({timeCode:timeCode});
    },3);
        
})

router.post('/loadRoom',function(req,res){
    var time=req.body.time;
    var nameEN= req.body.nameEN;
    var date=req.body.date;
    var roomCode="";
    Showtime.find({$and:[{nameEN:nameEN},{"date":date},{time:time}]},function(err,fi){
        fi.sort(function(a, b){
            if (a.room < b.room) {return -1;}
            if (a.room > b.room) {return 1;}
            return 0;
        });
        for(var i=0;i<fi.length;i++){
            if (i==0)roomCode=roomCode+`<option value="`+fi[i].room+`" selected>CINEMA`+fi[i].room+`</option>`;
            else roomCode=roomCode+`<option value="`+fi[i].room+`">CINEMA`+fi[i].room+`</option>`
        }
    })
    setTimeout(() => {
        res.send({roomCode:roomCode});
    },3);
})

module.exports = router;