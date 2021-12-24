var Bill= require('../models/bill');

module.exports = function(req,res,next){
    Bill.find({type:"uncheck"},function(err,bi){
        if (err) return console.log(err);
        for (var i=0;i<bi.length;i++){
            var newDay=new Date(bi[i].date);
            var timeArr=bi[i].time.split(':');
            newDay.setHours(timeArr[0],timeArr[1]);
            if ((newDay.getTime()-(1000*60*30))<=((new Date).getTime())){
                bi[i].expired=1;
                bi[i].save();
            }
        }
        setTimeout(() => {
            next();
        }, 10);
    });
}