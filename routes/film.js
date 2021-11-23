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
        })))
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
        for(var i=0;i<fi.length;i++){
            timeCode=timeCode+`<input type="radio" class="btn-check" name="options-outlined" id="`+(i+1)+`-outlined" autocomplete="off">
            <label class="btn btn-primary  btn-seat1" for="1-outlined">`+fi[i].time+`</label>`
        }
    })
    setTimeout(() => {
        res.send({timeCode:timeCode});
    },3);
        
})

module.exports = router;