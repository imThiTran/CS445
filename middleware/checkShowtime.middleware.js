var Showtime= require('../models/showtime');
var Film = require('../models/film');
const showtime = require('../models/showtime');

module.exports = function(req,res,next){
    var filmArr=[];
    var updateSt=[];
    var today= new Date();
    Showtime.find({},function(err,st){
        if (err) return console.log(err);
        for (var i=0;i<st.length;i++){
            var newDay=new Date(st[i].date);
            var timeArr=st[i].time.split(':');
            newDay.setHours(timeArr[0],timeArr[1]);
            if (newDay<=today) {
            st[i].closed=1;
            st[i].save();
            filmArr.push(st[i].idSt);
            }
        }
    })

     Film.find({},function(err,fi){
        if (err) return console.log(err);
        for(var i=0;i<fi.length;i++){
            var updateSt=fi[i].showtime;
             for(var j=0;j<updateSt.length;j++){
                var newDay1= new Date(updateSt[j].date);
                var timeArr1=updateSt[j].time.split(':');
                newDay1.setHours(timeArr1[0],timeArr1[1]);
                if (newDay1<=today) {
                    updateSt[j].closed=1;
                    }    
            }
            Film.updateOne({nameEN:fi[i].nameEN},{$set: {  
                        showtime: updateSt, 
                        }},function(err,rs){
                            if (err) return console.log(err);
                        })
        }
    })
    // setTimeout(() => {
    //     console.log(filmArr.length);
    //     if (filmArr.length>0){
    //         var i=0;
    //         filmArr.forEach(function(fiArr){
    //             Film.findOne({"showtime.idSt":fiArr},function(err,fi){
    //                 if (fi){
    //                 updateSt=fi.showtime;
    //                 for(var j=0;j<updateSt.length;j++){
    //                     // console.log(updateSt[j].idSt);
    //                     // if (updateSt[j].idSt==fiArr) console.log(updateSt[j].idSt); 
    //                     }
    //                 }
    //             })
                
    //             // setTimeout(() => {
    //             //     Film.updateOne({"showtime.idSt":fiArr},{$set: {  
    //             //         showtime: updateSt, 
    //             // }},function(err,rs){
    //             //     if (err) return console.log(err);
    //             // })
    //             // }, 50);
                
    //         })
    //     }
    // }, 60);
    next();
}