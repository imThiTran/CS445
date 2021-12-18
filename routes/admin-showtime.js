var express = require('express')
var router = express.Router();
var fs = require('fs-extra');
var shortid= require('shortid');


var Film= require('../models/film');
var Showtime= require('../models/showtime');
var Chair = require('../models/chair');

router.get('/',function(req,res){
    Film.find({status:"Đang khởi chiếu"},function(err,fi){
    Showtime.find({},function(err,st){
        res.render('admin/admin-showtime',{
            films:fi,
            showtimes:st,
            nameEN:""
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
    var today= new Date();
    if (typeof time == "string"){
        var newDay=new Date(date);
        var timeArr=time.split(':');
        newDay.setHours(timeArr[0],timeArr[1]);
        if (newDay<=today){
            res.send({noti:"Không được phép tạo suất chiếu trước giờ hiện tại"});
        } 
        else {
            Film.findOne({nameEN:nameEN},function(err,fi){
                var fiShowtime=fi.showtime;
            Showtime.findOne({$or:[{$and:[{date:date},{time:time},{room:room}]},{$and:[{date:date},{time:time},{nameEN:nameEN}]}]},function(err,st){
                if (st) res.send({noti:"suất chiếu này đã tồn tại"});
                else{
                    var id=shortid.generate()
                        fiShowtime.push({
                        idSt:id,
                        nameEN:nameEN,
                        date:date,
                        time:time,
                        room:room,
                        closed:0,
                    })
                    setTimeout(() => {
                        fi.showtime = fiShowtime;
                        fi.save(function(err){
                            if (err) return console.log(err);
                        });
                    }, 10);
                    
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
                    setTimeout(() => {
                        res.send({noti:""});
                    }, 20);
                }
            })
        })
        }
    } else {
        var checkTime=true;
        for(var i=0;i<time.length;i++){
            Showtime.findOne({$or:[{$and:[{date:date},{time:time[i]},{room:room}]},{$and:[{date:date},{time:time[i]},{nameEN:nameEN}]}]},function(err,st){   
                if (st)  check.push(st);
            })
            var newDay=new Date(date);
            var timeArr=time[i].split(':');
            newDay.setHours(timeArr[0],timeArr[1]);
            if (newDay<=today){
            checkTime=false;
            } 
        }
        setTimeout(() => {
            if (checkTime==false){
                res.send({noti:"Không được phép tạo suất chiếu trước giờ hiện tại"});
            }else {
                Film.findOne({nameEN:nameEN},function(err,fi){
                    if (check.length>0) res.send({noti:"trong các suất này có suất chiếu đã tồn tại"});
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
                                    closed:0
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
                                setTimeout(() => {
                                    res.send({noti:""});
                                }, 20);
                    }
                })
            }
        }, 50);
    }
        
})


router.post('/editBlock',function(req,res){
    var id = req.body.id;
    var closed = req.body.closed;
    var updateSt=[];
    var today=new Date();
    var check=false;
    Showtime.findOne({idSt:id},function(err,st){
        if (err) return console.log(err);
        var newDay=new Date(st.date);
        var timeArr=st.time.split(':');
        newDay.setHours(timeArr[0],timeArr[1]);
        if (newDay>today){
            check=true;
            st.closed=closed;
            st.save(function(err){
                if (err) return console.log(err);
            })
        } 
    })
    Film.findOne({"showtime.idSt":id},function(err,fi){
        if (err) return console.log(err);
        if (fi){
            updateSt=fi.showtime;
            for(var i=0;i<fi.showtime.length;i++){
                if (updateSt[i].idSt==id) {
                    updateSt[i].closed=closed;
                }
            }  
        } 
    })
    setTimeout(() => {
        if (check==true){
        Film.updateOne({"showtime.idSt":id},{$set: {  
                showtime: updateSt, 
        }},function(err,rs){
            if(err) return console.log(err);
        })
        res.send({noti:""});
        } else {
            res.send({noti:"Không thể mở vì suất chiếu này đã quá hạn"})
        }
        
    }, 10);

})

router.post('/editBtn',function(req,res){
    var id = req.body.id;
    var selectTime="";
    var selectRoom="";
    Showtime.findOne({idSt:id},function(err,st){
        if (err) return console.log(err);
        selectTime=`<select class="time form-select" style="width:210px">
        <option value="09:00"`+((st.time=="09:00")?`selected`:``)+`>09:00 AM</option>
        <option value="11:00"`+((st.time=="11:00")?`selected`:``)+`>11:00 AM</option>
        <option value="13:00"`+((st.time=="13:00")?`selected`:``)+`>13:00 PM</option>
        <option value="15:00"`+((st.time=="15:00")?`selected`:``)+`>15:00 PM</option>
        <option value="17:00"`+((st.time=="17:00")?`selected`:``)+`>17:00 PM</option>
        <option value="19:00"`+((st.time=="19:00")?`selected`:``)+`>19:00 PM</option>
        <option value="21:00"`+((st.time=="21:00")?`selected`:``)+`>21:00 PM</option>
        <option value="23:00"`+((st.time=="23:00")?`selected`:``)+`>23:00 PM</option>
    </select>`
        selectRoom=`<select class="form-select room" style="width:210px">
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
    var today=new Date();
    var newDay=new Date(date);
    var timeArr=time.split(':');
    newDay.setHours(timeArr[0],timeArr[1]);
    if (newDay<=today){
        res.send({noti:"Không được phép tạo suất chiếu trước giờ hiện tại"});
    } else {
        Showtime.findOne({$and:[{date:date},{time:time},{room:room},{idSt:{'$ne':id}}]},function(err,st){
            if (err) return console.log(err);
            if (st){
                var noti='Trùng suất chiếu';
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
    }
})

// router.post('/load-bynameEN',function(req,res){
//     var nameEN=req.body.nameEN;
//     var htmlCode="";
//     Showtime.find({nameEN:nameEN},function(err,st){
//         if (st.length!=0) htmlCode=`<form class="formDeleteAll" action="/admin/showtime/delete-all" method="post">`;
//         for (var i=0;i<st.length;i++){
//             var newDateArr = st[i].date.split('-') 
//             var newDate=newDateArr[2]+'/'+newDateArr[1]+'/'+newDateArr[0]; 
//             htmlCode=htmlCode+`
//             <tr class="trClosest">
//             <td>
//                                     <input class="form-check-input-del itemcheck" name="checkall" type="checkbox" value="`+st[i].idSt+`">
//                                 </td>
//             <th style="    width: 20px;">`+(i+1)+`</th>
//             <th scope="row">
//                 `+st[i].idSt+`
//             </th>
//             <td class="tdName" style="width: 20%;">
//                 <div>`+st[i].nameEN+`</div>
//             </td>
//             <td class="tdDate">
//                 `+newDate+`
//             </td>
//             <td class="tdTime">
//                 `+st[i].time+`
//             </td>
//             <td class="tdRoom">
//                 CINEMA `+st[i].room+`
//             </td>
//             <td>
//                                     <div class="form-check form-switch">
//                                         <input class="swclosed form-check-input" type="checkbox" role="switch"
//                                             id="`+st[i].idSt+`"`+((st[i].closed==0)?` checked`:``)+` 
//                                                 > 
//                                         <label class="form-check-label" for="flexSwitchCheckChecked"></label>
//                                     </div>
//                                 </td>
//             <td>
//                 <div class="ad-btn" style="    width: 60px;">
//                 <a class="confirmDeletion" href="/admin/showtime/delete-showtime/`+st[i].idSt+`"><button type="button" id="`+st[i].idSt+`" class="btnDelete btn-close btn-xoa" aria-label="Close"
//                 style="margin-top: 30px;"></button></a>
//                     <button type="button" class="btn btn-danger btn-buy editBtn" id="`+st[i].idSt+`"
//                         style="width:100%; margin-top: 20px">Sửa</button>
//                 </div>
//             </td>
//         </tr> 
//         `
//         }
//     })
//     setTimeout(() => {
//         htmlCode=htmlCode+`</form>`
//         res.send({htmlCode:htmlCode});
//     }, 25);
// })
router.get('/selectfilm/:nameEN',function(req,res){
    var nameEN=req.params.nameEN;
    Film.find({status:"Đang khởi chiếu"},function(err,fi){
        Showtime.find({nameEN:nameEN},function(err,st){
            res.render('admin/admin-showtime',{
                films:fi,
                showtimes:st,
                nameEN:nameEN
                })
            })
        })
})

router.post('/search-date',function(req,res){
    var datefrom=new Date(req.body.datefrom);
    var dateto=new Date(req.body.dateto);
    var nameEN= req.body.nameEN;
    var newSt=[];
    Film.find({status:"Đang khởi chiếu"},function(err,fi){
        if (nameEN!=''){
            Showtime.find({nameEN:nameEN},function(err,st){
                for (var i=0;i<st.length;i++){
                    var newDay=new Date(st[i].date);
                    var timeArr=st[i].time.split(':');
                    newDay.setHours(timeArr[0],timeArr[1]);
                    if (datefrom<=newDay && newDay<=dateto) newSt.push(st[i]);
                } 
            })
        } else {
            Showtime.find({},function(err,st){
                for (var i=0;i<st.length;i++){
                    var newDay=new Date(st[i].date);
                    var timeArr=st[i].time.split(':');
                    newDay.setHours(timeArr[0],timeArr[1]);
                    if (datefrom<=newDay && newDay<=dateto) newSt.push(st[i]);
                }  
            })
        }
        setTimeout(() => {
            res.render('admin/admin-showtime',{
                films:fi,
                showtimes:newSt,
                nameEN:nameEN,
                datefrom:req.body.datefrom,
                dateto:req.body.dateto
            }) 
        }, 5);
    })
})

router.get('/delete-showtime/:id',function(req,res){
    var id =req.params.id;
    var updateSt=[];
    Showtime.deleteOne({idSt:id},function(err,rs){
        if (err) return console.log(err);
    })
    Chair.deleteMany({showtimeId:id},function(err,rs){
        if (err) return console.log(err);
    });
    Film.findOne({"showtime.idSt":id},function(err,fi){
        if (fi){
        updateSt=fi.showtime.filter(function(rs){
            return (rs.idSt!=id);
        });
 
        setTimeout(() => {
            Film.updateOne({"showtime.idSt":id},{$set: {  
                showtime: updateSt, 
        }},function(err,rs){
            if(err) return console.log(err);
        })
        }, 10);
    }
    })
    res.redirect('back');
})

router.post('/delete-all',function(req,res){  
    var checkall = req.body.checkall;
    var updateSt=[];
    if (typeof checkall == "string"){
        Showtime.findOneAndRemove({idSt:checkall},function(err,st){
            if (err) return console.log(err);
            Chair.deleteMany({showtimeId:checkall},function(err,rs){
                if (err) return console.log(err);
            });
            Film.findOne({"showtime.idSt":checkall},function(err,fi){
                if (fi){
                updateSt=fi.showtime.filter(function(rs){
                    return (rs.idSt!=checkall);
                });
         
                setTimeout(() => {
                    Film.updateOne({"showtime.idSt":checkall},{$set: {  
                        showtime: updateSt, 
                }},function(err,rs){
                    if(err) return console.log(err);
                        })
                    }, 10);
                }
            })
        })
    } else {
        for (var i=0;i<checkall.length;i++){
            Showtime.findOneAndRemove({idSt:checkall[i]},function(err,st){
                if (err) return console.log(err);
            })
            Chair.deleteMany({showtimeId:checkall[i]},function(err,rs){
                if (err) return console.log(err);
            });
        //     Film.findOne({"showtime.idSt":checkall[i]},function(err,fi){
        //         if (fi){
        //         updateSt=fi.showtime;
        //         for (var j=0;j<updateSt.length;j++){
        //             console.log(updateSt[i]);
        //             if (checkall.indexOf(updateSt[j])!=-1) console.log('haha');
        //         }
        //             setTimeout(() => {
                        
        //                 // Film.updateOne({"showtime.idSt":checkall[i]},{$set: {
        //                 //     showtime: updateSt, 
        //                 //     }},function(err,rs){
        //                 // if(err) return console.log(err);
        //                 //     })
        //             }, 20);
                    
                    
        //         }
        //     })
        }   
        Film.find({},function(err,fi){
            if (err) return console.log(err);
            
            for(var i=0;i<fi.length;i++){
                updateSt=[];
                 for(var j=0;j<fi[i].showtime.length;j++){
                    if (checkall.indexOf(fi[i].showtime[j].idSt)==-1) {
                        updateSt.push(fi[i].showtime[j]);
                        }    
                }
                
                Film.updateOne({nameEN:fi[i].nameEN},{$set: {  
                            showtime: updateSt, 
                            }},function(err,rs){
                                if (err) return console.log(err);
                })
            }
            res.redirect('back');
        })
    }
})
module.exports = router;