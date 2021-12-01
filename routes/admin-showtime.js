var express = require('express')
var router = express.Router();
var fs = require('fs-extra');
var shortid= require('shortid');


var Film= require('../models/film');
var Showtime= require('../models/showtime');
var Chair = require('../models/chair');

router.get('/',function(req,res){
    Film.find({status:"showing"},function(err,fi){
    Showtime.find({},function(err,st){
        res.render('admin/admin-showtime',{
            films:fi,
            showtimes:st
            })
        })
    })
    
})


router.post('/add-showtime',function(req , res){
    var nameEN = req.body.nameEN;
    var date=req.body.date;
    var time=req.body.time;
    var room=req.body.room;
    var check=[];
    if (typeof time == "string"){
        Film.findOne({nameEN:nameEN},function(err,fi){
            var fiShowtime=fi.showtime;
        Showtime.findOne({$or:[{$and:[{date:date},{time:time},{room:room}]},{$and:[{date:date},{time:time},{nameEN:nameEN}]}]},function(err,st){
            if (st) return console.log("suat chieu da ton tai");
            else{
                var id=shortid.generate()
                    fiShowtime.push({
                    idSt:id,
                    nameEN:nameEN,
                    date:date,
                    time:time,
                    room:room,
                })
                fi.showtime = fiShowtime;
                fi.save(function(err){
                    if (err) return console.log(err);
                });
                var newst= new Showtime({
                    idSt:id,
                    nameEN:nameEN,
                    date:date,
                    time:time,
                    room:room,
                })
                newst.save(function(err){
                    if (err) return console.log(err);
                }) 
                for (var j=1;j<115;j++){
                    var nameChair="";
                    var price=45000;
                    if (j<13) nameChair="A"+j;
                    else if(j<25) nameChair="B"+(j-12);
                    else if(j<37) nameChair="C"+(j-24);
                    else if(j<49) nameChair="D"+(j-36);
                    else if(j<61) nameChair="E"+(j-48);
                    else if(j<73) nameChair="F"+(j-60);
                    else if(j<85) nameChair="G"+(j-72);
                    else if(j<97) nameChair="H"+(j-84);
                    else if(j<109) nameChair="J"+(j-96);
                    else if(j<121) {nameChair="K"+(j-108);price=80000}
                    var chair=new Chair({
                        nameChair:nameChair,
                        showtimeId:id,
                        nameEN:nameEN,
                        date:date,
                        time:time,
                        room:room,
                        available:1,
                        sorting:j,
                        price:price,
                    })
                    chair.save(function(err){
                        if (err) return console.log(err);
                    })
                }
            }
        })
    })
    } else {
        for(i=0;i<time.length;i++){
            Showtime.findOne({$or:[{$and:[{date:date},{time:time},{room:room}]},{$and:[{date:date},{time:time},{nameEN:nameEN}]}]},function(err,st){   
                if (st)  check.push(st);
            })
        }
        setTimeout(() => {
            Film.findOne({nameEN:nameEN},function(err,fi){
            if (check.length>0) return console.log("suat chieu da ton tai");
            else {
                    for(var i=0;i<time.length;i++){
                        var fiShowtime = fi.showtime;
                        var id =shortid.generate();
                        fiShowtime.push({
                            idSt:id,
                            nameEN:nameEN,
                            date:date,
                            time:time[i],
                            room:room[i],
                        })   
                        var newst= new Showtime({
                            idSt:id,
                            nameEN:nameEN,
                            date:date,
                            time:time[i],
                            room:room[i],
                        })
                        newst.save(function(err){
                            if (err) return console.log(err);
                        }) 
                        for (var j=1;j<115;j++){
                            var nameChair="";
                            var price=45000;
                            if (j<13) nameChair="A"+j;
                            else if(j<25) nameChair="B"+(j-12);
                            else if(j<37) nameChair="C"+(j-24);
                            else if(j<49) nameChair="D"+(j-36);
                            else if(j<61) nameChair="E"+(j-48);
                            else if(j<73) nameChair="F"+(j-60);
                            else if(j<85) nameChair="G"+(j-72);
                            else if(j<97) nameChair="H"+(j-84);
                            else if(j<109) nameChair="J"+(j-96);
                            else if(j<121) {nameChair="K"+(j-108);price=80000}
                            var chair=new Chair({
                                nameChair:nameChair,
                                showtimeId:id,
                                nameEN:nameEN,
                                date:date,
                                time:time[i],
                                room:room[i],
                                available:1,
                                sorting:j,
                                price:price,
                            })
                            chair.save(function(err){
                            })
                        }
                    }
                        fi.showtime=fiShowtime;
                        fi.save(function(err){
                            if (err) return console.log(err);
                        });
                    
            }
        })
        }, 50);
    }
        setTimeout(() => {
        res.redirect('/admin/showtime');
        }, 100); 
        
})


router.post('/editBlock',function(req,res){
    var id = req.body.id;
    var block = req.body.block;
    Product.findById(id,function(err,p){
        if (err) return console.log(err);
        p.block=block;
        p.save(function(err){
            if (err) return console.log(err);
        })
    })
})

router.post('/editBtn',function(req,res){
    var id = req.body.id;
    var selectTime="";
    var selectRoom="";
    Showtime.findOne({idSt:id},function(err,st){
        if (err) return console.log(err);
        selectTime=`<select class="time form-select" style="width:210px">
        <option >Chọn giờ</option>
        <option value="9:00"`+((st.time=="09:00")?`selected`:``)+`>09:00 AM</option>
        <option value="11:00"`+((st.time=="11:00")?`selected`:``)+`>11:00 AM</option>
        <option value="13:00"`+((st.time=="13:00")?`selected`:``)+`>13:00 PM</option>
        <option value="15:00"`+((st.time=="15:00")?`selected`:``)+`>15:00 PM</option>
        <option value="17:00"`+((st.time=="17:00")?`selected`:``)+`>17:00 PM</option>
        <option value="19:00"`+((st.time=="19:00")?`selected`:``)+`>19:00 PM</option>
        <option value="21:00"`+((st.time=="21:00")?`selected`:``)+`>21:00 PM</option>
        <option value="23:00"`+((st.time=="23:00")?`selected`:``)+`>23:00 PM</option>
    </select>`
        selectRoom=`<select class="form-select room" style="width:210px">
        <option >Chọn phòng chiếu</option>
        <option value="1"`+((st.room==1)?`selected`:``)+`>CINEMA 1</option>
        <option value="2"`+((st.room==2)?`selected`:``)+`>CINEMA 2 </option>
        <option value="3"`+((st.room==3)?`selected`:``)+`>CINEMA 3</option>
        </select>`
            res.send({
                nameEN : st.nameEN,
                date:st.date,
                room:selectRoom,
                time:selectTime,
                })
    })
})

router.post('/edit-showtime/:id',function(req,res){
    var id=req.params.id;
    var date=req.body.date;
    var time=req.body.time;
    var room=req.body.room;
    var updateSt=[];
    Showtime.findOne({$and:[{date:date},{time:time},{room:room},{idSt:{'$ne':id}}]},function(err,st){
        if (err) return console.log(err);
        if (st){
            var noti='Bị trùng thời gian chiếu';
            res.send({noti:noti});
        } else {
            Film.findOne({"showtime.idSt":id},function(err,fi){
                if (err) return console.log(err);
                if (fi){
                updateSt=fi.showtime;
                for(var i=0;i<fi.showtime.length;i++){
                    if (updateSt[i].idSt==id) {
                        updateSt[i].time=time;
                        updateSt[i].room=room;
                        updateSt[i].date=date;
                    }
                }  
            } 
            })
            Showtime.findOne({idSt:id},function(err,st){
                if (err) return console.log(err);
                st.date=date;
                st.time=time;
                st.room=room;
                st.save();
            })
            Chair.updateMany({showtimeId:id},{$set: {  
                room: room,
                date:date,
                time:time,
        }},{multi:true},function(err,rs){
            if (err) return console.log(err);
        });
        setTimeout(() => {
            Film.updateOne({"showtime.idSt":id},{$set: {  
                showtime: updateSt, 
        }},function(err,rs){
            if(err) return console.log(err);
        })
        }, 10);
        res.send({noti:""});
        }
    })

})

router.post('/load-bynameEN',function(req,res){
    var nameEN=req.body.nameEN;
    var htmlCode="";
    Showtime.find({nameEN:nameEN},function(err,st){
        for (var i=0;i<st.length;i++){
            htmlCode=htmlCode+`<tr class="trClosest">
            <th scope="row">
                `+st[i].idSt+`
            </th>
            <td class="tdName" style="width: 20%;">
                <div>`+st[i].nameEN+`</div>
            </td>
            <td class="tdDate">
                `+st[i].date+`
            </td>
            <td class="tdTime">
                `+st[i].time+`
            </td>
            <td class="tdRoom">
                CINEMA `+st[i].room+`
            </td>

            <td>
                <div class="ad-btn" style="    width: 60px;">
                    <button type="button" class="btn-close btn-xoa" aria-label="Close"
                        style="margin-top: 30px;"></button>
                    <button type="button" class="btn btn-danger btn-buy editBtn" id="`+st[i].idSt+`"
                        style="width:100%; margin-top: 20px">Sửa</button>
                </div>
            </td>
        </tr>`
        }
    })
    setTimeout(() => {
        res.send({htmlCode:htmlCode});
    }, 3);
})
router.get('/search-product',function(req,res){
    var name=req.query.search;
    Product.find({category:{'$ne':'size'}},function(err,products){
        if (err) return console.log(err);
        var newPd= products.filter(function(result){
            return result.title.toLowerCase().indexOf(name.toLowerCase()) !== -1;
        })
        Category.find({slug:{'$ne':'size'} },function(err,cat){
        if (err) return console.log(err);
        res.render('admin/admin-products',{
            products: newPd,
            categories: cat
        })
    })
  })
})

router.get('/delete-product/:id',function(req,res){
    var id =req.params.id;
    var path = 'public/img/product_imgs/'+ id;
    fs.remove(path,function(err){
        if (err) console.log(err);
        else {
            Product.findByIdAndRemove(id,function(err){
                if (err) console.log(err);
            });
            req.flash('success','Product deleted ');
            res.redirect('/admin/products');
        }
    })
})

module.exports = router;