var express = require('express')
var router = express.Router();
var fs = require('fs-extra');


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
    for(i=0;i<time.length;i++){
        Showtime.findOne({$and:[{date:date},{time:time[i]},{room:room[i]}]},function(err,st){   
            if (st)  check.push(st);
        })
    }
    setTimeout(() => {
        if (check.length!=0) return console.log("suat chieu da ton tai");
        else {
                for(var i=0;i<time.length;i++){
                var newst= new Showtime({
                        nameEN:nameEN,
                        date:date,
                        time:time[i],
                        room:room[i],
                    })
                    newst.save(function(err){
                        if (err) return console.log(err);
                    }) 
                    for (var j=0;j<114;j++){
                        var chair=new Chair({
                            nameChair:j,
                            nameEN:nameEN,
                            date:date,
                            time:time[i],
                            room:room[i]
                        })
                        chair.save(function(err){
                            
                        })
                    }
                }
                
        }
    }, 50);
    
    setTimeout(() => {
        res.redirect('/admin/showtime')
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