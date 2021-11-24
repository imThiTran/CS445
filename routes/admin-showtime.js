var express = require('express')
var router = express.Router();
var fs = require('fs-extra');
var shortid= require('shortid');


var Film= require('../models/film');
var Showtime= require('../models/showtime');
var Chair = require('../models/chair')
router.get('/',function(req,res){
    Film.find({},function(err,fi){
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
                            if (j<13) nameChair="A"+j;
                            else if(j<25) nameChair="B"+(j-12);
                            else if(j<37) nameChair="C"+(j-24);
                            else if(j<49) nameChair="D"+(j-36);
                            else if(j<61) nameChair="E"+(j-48);
                            else if(j<73) nameChair="F"+(j-60);
                            else if(j<85) nameChair="G"+(j-72);
                            else if(j<97) nameChair="H"+(j-84);
                            else if(j<109) nameChair="J"+(j-96);
                            else if(j<121) nameChair="K"+(j-108);
                            var chair=new Chair({
                                nameChair:nameChair,
                                showtimeId:id,
                                nameEN:nameEN,
                                date:date,
                                time:time[i],
                                room:room[i],
                                available:1,
                                sorting:j,
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

//get edit product

// router.get('/edit-product/:id',function(req,res){

//     var errors;
//     if (req.session.errors) errors =req.session.errors;
//     req.session.errors = null;
   
//     Category.find(function(err,cat){
//         Product.findById(req.params.id, function(err,p){
//             if (err) {
//                 console.log(err);
//                 res.redirect('admin/products');
//             } else {
//                 res.render('admin/edit-product',{
//                     id: p._id,
//                     title: p.title,
//                     categories: cat,
//                     price: p.price,
//                     category: p.category.replace(/\s+/g,'-').toLowerCase(),
//                     image:p.image
//                 });
//             }
//         })
        
//     })

// })
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
    Category.find({slug:{'$ne':'size'}},function(err,cats){
    Product.findById(id,function(err,p){
        if (err) return console.log(err);
        var htmlSelect ;
        cats.forEach(function(cat){ 
            htmlSelect=htmlSelect+`<option value="`+ cat.slug+ (cat.slug == p.category?`" selected="selected" >`:`"> `)+  cat.title+
            `</option>
         }); `
        })
        res.send({
            product : p,
            htmlSelect: htmlSelect
            })
        })
    })
})

router.post('/edit-product/:id',function(req,res){
    var imageFile =  (req.files != null)? req.files.image.name:""; 
    var title=req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var price=req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;
    var quantity = req.body.quantity;
    Product.findOne({slug: slug,_id : {'$ne':id}},function(err,p){
        if (err) console.log(err);
        if (p){
            var noti='Sản phẩm này đã tồn tại' ;
            res.send({noti: noti});
        } else {
            Product.findById(id,function(err,p){
                if (err) console.log(err);
                p.title= title;
                p.slug = slug;
                p.price=price;
                p.category = category;
                p.quantity = quantity;
                if (imageFile != ""){
                    p.image= imageFile;
                }
                p.save(function(err){
                    if (err)
                        console.log(err);
                    if (imageFile != ""){
                        if (pimage != "" && pimage != imageFile){
                            fs.remove('public/img/product_imgs/'+id +'/'+ pimage,function(err){
                                if (err) console.log(err);

                            });
                        }

                        var productImage =req.files.image;
                        var path= 'public/img/product_imgs/'+ id +'/' + imageFile;

                        productImage.mv(path,function(err){
                            if (err)return console.log(err)
                        });
                        }
                        var imageAjax;
                        if (imageFile==""){
                            if (pimage != ""){
                                 imageAjax= "/img/product_imgs/"+id+"/"+pimage;
                            }
                            else imageAjax="/img/noimage.jpg"
                        }
                        else {
                            imageAjax= "/img/product_imgs/"+id+"/"+imageFile;
                        }
                            
                        res.send({
                            noti : "",
                            imageAjax:imageAjax,
                    })
                        req.flash('succsess','Product editted');
                })
            })
        }
    })

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