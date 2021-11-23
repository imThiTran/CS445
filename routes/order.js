var express = require('express');
var Chair = require('../models/chair');
var router = express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');

router.get('/',function(req,res){
    var time= req.query.time;
    var date = req.query.date;
    var room=req.query.room;
    var chairA=[],chairB=[],chairC=[],chairD=[],chairE=[],chairF=[],chairG=[],chairH=[],chairJ=[],chairK=[];
    Chair.find({$and:[{date:date},{time:time},{room:room}]}).sort({sorting:1}).exec(function(err,ch){
        for(var i=0;i<114;i++){
            if (i<12) chairA.push(ch[i]);
           else if (i<24) chairB.push(ch[i]);
           else if (i<36) chairC.push(ch[i]);
           else if (i<48) chairD.push(ch[i]);
           else if (i<60) chairE.push(ch[i]);
           else if (i<72) chairF.push(ch[i]);
           else if (i<84) chairG.push(ch[i]);
           else if (i<96) chairH.push(ch[i]);
           else if (i<108) chairJ.push(ch[i]);
           else if (i<114) chairK.push(ch[i]);
        }
        setTimeout(() => {
            res.render('order/orderSeat',{
                chairA:chairA,
                chairB:chairB,
                chairC:chairC,
                chairD:chairD,
                chairE:chairE,
                chairF:chairF,
                chairG:chairG,
                chairH:chairH,
                chairJ:chairJ,
                chairK:chairK,
            })
        }, 10);
     })
    
    
})

// router.post('/loadTime',function(req,res){
//     var value=req.body.value;
//     var nameEN=req.body.nameEN;
//     var timeCode="";
//     Showtime.find({$and:[{nameEN:nameEN},{"date":value}]},function(err,fi){
//         fi.sort(function(a, b){
//             if (a.time.toLowerCase() < b.time.toLowerCase()) {return -1;}
//             if (a.time.toLowerCase() > b.time.toLowerCase()) {return 1;}
//             return 0;
//         });
//         for(var i=0;i<fi.length;i++){
//             timeCode=timeCode+`<input type="radio" class="btn-check" onclick="handleClick(this) name="options-outlined" id="`+(i+1)+`-outlined" autocomplete="off">
//             <label class="btn btn-primary  btn-seat1" for="`+(i+1)+`-outlined">`+fi[i].time+`</label>`
//         }
//     })
//     setTimeout(() => {
//         res.send({timeCode:timeCode});
//     },3);
        
// })

module.exports = router;