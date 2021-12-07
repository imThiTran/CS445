var express = require('express')
var router = express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');

router.get('/detail/:slug',function(req,res){
    var slug = req.params.slug;
    var newDate=[];
    Film.findOne({slug:slug},function(err,fi){
        if (fi){
        var newDate1=fi.showtime.filter(function(result){
            return (result.closed==0)
        })
        newDate=Array.from(new Set(newDate1.map(function(result){
            return result.date;
        })));
        res.render('films/detail',{
            film:fi,
            showtime:fi.showtime,
            date:newDate,
        });
    }
    })
})

router.post('/loadTime',function(req,res){
    var value=req.body.value;
    var nameEN=req.body.nameEN;
    var timeCode="";
    Showtime.find({$and:[{nameEN:nameEN},{"date":value},{closed:0}]},function(err,fi){
        fi.sort(function(a, b){
            if (a.time.toLowerCase() < b.time.toLowerCase()) {return -1;}
            if (a.time.toLowerCase() > b.time.toLowerCase()) {return 1;}
            return 0;
        });
        // newTime=Array.from(new Set(fi.map(function(result){
        //     return result.time;
        // })));
        for(var i=0;i<fi.length;i++){
            var Ctime=(fi[i].time.split(':'))[0];
            timeCode=timeCode+`<input value="`+fi[i].time+`" type="radio" class="choosetime btn-check" name="time" id="`+(i+1)+`-outlined" autocomplete="off">
            <label class="btn btn-primary  btn-seat1" for="`+(i+1)+`-outlined">`+fi[i].time+(Ctime>=12?` PM`:` AM`)+`</label>`
        }
    })
    setTimeout(() => {
        res.send({timeCode:timeCode});
    },20);
        
})

router.get('/search',function(req,res){
    var film= req.query.film;
    Film.aggregate([{ $match: {status:"Đang khởi chiếu" }},{ $sample: { size: 4 } }],function(err,filmslide){
    Film.find({},function(err,fi){
        var newFi=fi.filter(function(rs){
            return (rs.nameEN.toLowerCase().indexOf(film.toLowerCase())!==-1) || (rs.nameVN.toLowerCase().indexOf(film.toLowerCase())!==-1);
        })
            res.render('films/category',{
                filmslide:filmslide,
                filmtype:newFi,
                type:"Tìm theo tên"
                    });
        })
    })
})

router.get('/type/:type',function(req,res){
    var type= req.params.type;
    Film.aggregate([{ $match: {status:"Đang khởi chiếu" }},{ $sample: { size: 4 } }],function(err,filmslide){
    Film.find({type:type,status:{'$ne':"Đã chiếu xong"}},function(err,fi){
        res.render('films/category',{
            filmslide:filmslide,
            filmtype:fi,
            type:type
                });
            })
        })
})

router.get('/status/:status',function(req,res){
    var status=req.params.status;
    Film.aggregate([{ $match: {status:"Đang khởi chiếu" }},{ $sample: { size: 4 } }],function(err,filmslide){
    if (status=="all"){
        Film.find({status:{'$ne':"Đã chiếu xong"}},function(err,fi){
            res.render('films/category',{
                filmslide:filmslide,
                filmtype:fi,
                type: "Tất cả phim"
            })
        })
    }else {
        Film.find({status:status},function(err,fi){
            res.render('films/category',{
                filmslide:filmslide,
                filmtype:fi,
                type: status
            })
        })
    }
    })
})
// router.post('/loadRoom',function(req,res){
//     var time=req.body.time;
//     var nameEN= req.body.nameEN;
//     var date=req.body.date;
//     var roomCode="";
//     Showtime.find({$and:[{nameEN:nameEN},{"date":date},{time:time}]},function(err,fi){
//         fi.sort(function(a, b){
//             if (a.room < b.room) {return -1;}
//             if (a.room > b.room) {return 1;}
//             return 0;
//         });
//         for(var i=0;i<fi.length;i++){
//             if (i==0)roomCode=roomCode+`<option value="`+fi[i].room+`" selected>CINEMA`+fi[i].room+`</option>`;
//             else roomCode=roomCode+`<option value="`+fi[i].room+`">CINEMA`+fi[i].room+`</option>`
//         }
//     })
//     setTimeout(() => {
//         res.send({roomCode:roomCode});
//     },3);
// })


module.exports = router;