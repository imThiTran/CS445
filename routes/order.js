var express = require('express');
var Chair = require('../models/chair');
var router = express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var Snack = require('../models/snack');
var paypal= require('paypal-rest-sdk');
var Bill =require('../models/bill');
var shortid= require('shortid');
var Chair = require('../models/chair');

router.get('/',function(req,res){
    var time= req.query.time;
    var date = req.query.date;
    var nameEN=req.query.nameEN;
    var chairA=[],chairB=[],chairC=[],chairD=[],chairE=[],chairF=[],chairG=[],chairH=[],chairJ=[],chairK=[];
    Chair.find({$and:[{date:date},{time:time},{nameEN:nameEN}]}).sort({sorting:1}).exec(function(err,ch){
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
        Chair.countDocuments({$and:[{date:date},{time:time},{nameEN:nameEN},{available:1}]},function(err,ch2){
        Snack.find({block:0},function(err,sn){
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
                snack:sn,
                countAvai:ch2
                    })
                }, 10);
            })
        })
    })  
    
})

router.post('/ordering',function(req,res){
    var seat=req.body.seat;
    var quantity= req.body.quantity;
    var snack=req.body.snack;
    var chair=[];
    var snacks=[];
    var nameEN="";
    var date="";
    var time="";
    var room="";
    var photoSn=[];
    if (typeof seat !="string"){
    Chair.findOne({_id:seat[0]},function(err,ch){
        nameEN=ch.nameEN;
                date=ch.date;
                time=ch.time;
                room=ch.room;
    })
    for(var i=0;i<seat.length;i++){
        Chair.findOne({_id:seat[i]},function(err,ch){
            if (err) return console.log(err); 
            chair.push({
                nameChair:ch.nameChair,
                price:ch.price
            });
        })
    }
} else {
    Chair.findOne({_id:seat},function(err,ch){
        if (err) return console.log(err);
            nameEN=ch.nameEN;
            date=ch.date;
            time=ch.time;
            room=ch.room;
        chair.push({
            nameChair:ch.nameChair,
            price:ch.price
        });
    })
}
    for(var i=0;i<quantity.length;i++){
        if (quantity[i]!=0) snacks.push({
            name:snack[i],
            quantity:quantity[i],
        })
    }
    setTimeout(() => {
        if (snacks.length!=0){
            for (var i=0;i<snacks.length;i++)
            Snack.findOne({name:snacks[i].name},function(err,sn){
                photoSn.push({
                    photo:sn.photo,
                    id:sn._id,
                    price:sn.price,
                    });
            })
        }
    }, 5);
    setTimeout(() => {
        res.render('order/ordering',{
            chair:chair,
            nameEN:nameEN,
            date:date,
            time:time,
            room:room,
            snacks:snacks,
            photoSn:photoSn,
            seat:seat
        });
    }, 20);
    
})

router.post('/ordered',function(req,res){
    var total=0;
    var totalPrice=req.body.total;
    var snacks=req.body.snacks;
    var seat=req.body.seat;
    var quantitySn =req.body.quantitySn;
    var priceSn= req.body.priceSn;
    var idB= shortid.generate();
    var seat1=[];
    var seatB=[];
    var snArr = [];
    var items=[];
    var room="",nameEN="",time="",date="";
    if (typeof snacks!="undefined"){
        if(typeof snacks!="string"){
            for(var i=0;i<snacks.length;i++){
                snArr.push({
                    name:snacks[i],
                    quantity:quantitySn[i],
                    price:priceSn[i]
                })
            }
        }else {
            snArr.push({
                name:snacks,
                quantity:quantitySn,
                price:priceSn,
            })
        }
    }
    if (seat.indexOf(',') != -1){
        seat1=seat.split(',');
        Chair.findOne({_id:seat1[0]},function(err,ch){
            room=ch.room;
            nameEN=ch.nameEN;
            time=ch.time;
            date=ch.date;
        })
        for(var i=0;i<seat1.length;i++){
            Chair.findOne({_id:seat1[i]},function(err,ch){
                seatB.push({nameChair:ch.nameChair, priceChair:ch.price,idChair:ch._id},
                   )
            })
        }
    } else {
        Chair.findOne({_id:seat},function(err,ch){
            room=ch.room;
            nameEN=ch.nameEN;
            time=ch.time;
            date=ch.date;
            seatB.push({nameChair:ch.nameChair, priceChair:ch.price,idChair:ch._id},
                )
        })
    }
    setTimeout(() => {
        for(var i=0;i<seatB.length;i++){
            items.push({
                "name": "seat "+seatB[i].nameChair,
                "sku": "#"+(i+1)+"",
                "price": ((parseInt(seatB[i].priceChair))/22679).toFixed(1)+"",
                "currency": "USD",
                "quantity": 1
            })
        }
        setTimeout(() => {
            for(var i=0;i<snArr.length;i++){
                items.push({
                    "name": snArr[i].name,
                    "sku": "#"+(seatB.length+i+1)+"",
                    "price": (parseInt(snArr[i].price)/22679).toFixed(1)+"",
                    "currency": "USD",
                    "quantity": parseInt(snArr[i].quantity)
                })
            }
        }, 3);
        setTimeout(() => {
            for (var i=0;i<items.length;i++){
            total=(total+(parseFloat(items[i].price)*items[i].quantity));
        }
        }, 5);
        var bill =new Bill({
            idB:idB,
            seat:seatB,
            snacks: snArr,
            room:room,
            time:time,
            nameEN:nameEN,
            date:date,
            totalPrice:totalPrice
        })
        bill.save();
    }, 20);
    setTimeout(() => {
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/bill?billid="+idB,
                "cancel_url": "http://localhost:3000/cancle"
            },
            "transactions": [{
                "item_list": {
                    "items": items
                },
                "amount": {
                    "currency": "USD",
                    "total": total.toFixed(1)+"",
                },
                "description": "This is the payment description."
            }]
        };
        
        
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for(let i=0;i<payment.links.length;i++){
                    if(payment.links[i].rel=='approval_url'){
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    }, 30);
    
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