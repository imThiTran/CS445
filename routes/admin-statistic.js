var express = require('express')
var router = express.Router();
var fs = require('fs-extra');

var User=require('../models/user');
var Bill = require('../models/bill');
var Film=require('../models/film');


function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
}
router.get('/',function(req,res){
        var thisMonth=(new Date()).getMonth();
        var thisYear=(new Date()).getFullYear();
        var days=daysInMonth(thisMonth+1,thisYear);
        // var from=new Date(thisYear,thisMonth,1);
        // var to=new Date(thisYear,thisMonth,days);
        var salesDay=new Array(days);
        var salesMonth=new Array(12);
        var listFilm=[];
        Bill.find({},function(err,bi){
                Film.find({},function(err,fi){
                var salesFilm=new Array(fi.length);
                for (var i=0;i<fi.length;i++){
                        salesFilm[i]=0;
                        listFilm.push(fi[i].nameEN);
                        for (var j=0;j<bi.length;j++){
                                if (bi[j].nameEN==fi[i].nameEN){
                                        for (var k=0;k<bi[j].seat.length;k++){
                                                salesFilm[i]=parseInt(salesFilm[i])+bi[j].seat[k].priceChair;
                                        }
                                }
                        }
                }
                for (var j=0;j<days;j++){
                        salesDay[j]=0;
                        for (var i=0;i<bi.length;i++){
                        if ((bi[i].createdAt.getMonth())==thisMonth && bi[i].createdAt.getFullYear()==thisYear 
                                && (j+1)==bi[i].createdAt.getDate()){
                                        salesDay[j]=parseInt(salesDay[j])+parseInt(bi[i].totalPrice);
                                }
                        }
                }
                for(var i=0;i<12;i++){
                        salesMonth[i]=0;
                        for (var j=0;j<bi.length;j++){
                                if (bi[j].createdAt.getFullYear()==thisYear && i==bi[j].createdAt.getMonth()){
                                        salesMonth[i]=parseInt(salesMonth[i])+parseInt(bi[j].totalPrice)
                                }
                        }
                }
                
                res.render('admin/admin-statistic',{
                        listFilm:listFilm,
                        dayNumbers:days,
                        salesDay:salesDay,
                        salesMonth:salesMonth,
                        salesFilm:salesFilm,
                        });
                })
        })
        
})

router.post('/day-in-month',function(req,res){
        var thisMonth=parseInt((req.body.month.split('-'))[1])-1;
        var thisYear=(req.body.month.split('-'))[0];
        var days=daysInMonth(thisMonth+1,thisYear);
        // var from=new Date(thisYear,thisMonth,1);
        // var to=new Date(thisYear,thisMonth,days);
        var salesDay=new Array(days);
        Bill.find({},function(err,bi){
                for (var j=0;j<days;j++){
                        salesDay[j]=0;
                        for (var i=0;i<bi.length;i++){
                        if ((bi[i].createdAt.getMonth())==thisMonth && bi[i].createdAt.getFullYear()==thisYear 
                                && (j+1)==bi[i].createdAt.getDate()){
                                        salesDay[j]=parseInt(salesDay[j])+parseInt(bi[i].totalPrice);
                                }
                        }
                }
                res.send({
                        dayNumbers:days,
                        salesDay:salesDay,
                        thisMonth:thisMonth+1,
                        thisYear:thisYear
                        });
        })

})

router.post('/month-in-year',function(req,res){
        var thisYear=(req.body.year);
        // var from=new Date(thisYear,thisMonth,1);
        // var to=new Date(thisYear,thisMonth,days);
        var salesMonth=new Array(12);
        Bill.find({},function(err,bi){
                for(var i=0;i<12;i++){
                        salesMonth[i]=0;
                        for (var j=0;j<bi.length;j++){
                                if (bi[j].createdAt.getFullYear()==thisYear && i==bi[j].createdAt.getMonth()){
                                        salesMonth[i]=parseInt(salesMonth[i])+parseInt(bi[j].totalPrice)
                                }
                        }
                }
                res.send({
                        salesMonth:salesMonth,
                        thisYear:thisYear
                        });
        })

})


module.exports = router;