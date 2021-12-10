var express = require('express')
var router = express.Router();
var mkdir = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img')


var Film= require('../models/film');
var Snack =require('../models/snack');

router.get('/',function(req,res){
    Snack.find({},function(err,sn){
        res.render('admin/admin-snack',{
            snacks:sn
        })
    })
})

router.post('/add-snack',function(req , res){
    var imageFile =(req.files != null)? req.files.image.name:"";
    if (imageFile=="") res.send({noti:'Bạn chưa thêm hình ảnh'}); 
    else {
    var name=req.body.name;
    var slug=name.replace(/\s+/g,'-').toLowerCase();
    var price=req.body.price;
    Snack.findOne({slug:slug},function(err,sn){
        if (err) return console.log(err);
        if (sn) {
            res.send({noti:"Món này đã tồn tại"})
        } else {
            var snack=new Snack({
                name:name,
                slug:slug,
                price:price,
                photo:imageFile
            })
            snack.save(function(err){
                if (err) return console.log(err);
                fs.mkdir('public/img/snacks/'+ snack._id, function(err){
                    if (err) return console.log(err);
                });

                if (imageFile != ""){
                    var snackImage =req.files.image;
                    var path= 'public/img/snacks/'+ snack._id +'/' + imageFile;

                    snackImage.mv(path,function(err){
                        if (err)return console.log(err)
                    });
                }
                var noti="";
                res.send({noti:noti})
            });
            }
        })
    }
})

router.post('/editBlock',function(req,res){
    var id =req.body.id;
    var block=req.body.block;
    Snack.findById(id,function(err,sn){
        if (err) return console.log(err);
        if (sn){
            sn.block=block;
        }
        sn.save();
    })
})

router.post('/editBtn',function(req,res){
    var id = req.body.id;
    Snack.findById(id,function(err,sn){
        if (err) return console.log(err);
        if (sn){
            res.send({snack:sn})
        }
    })
})


router.post('/edit-snack',function(req,res){
    var id=req.body.idSnack;
    var imageFile =  (req.files != null)? req.files.image.name:"";
    var pimage=req.body.pimage;
    var name=req.body.name;
    var price=req.body.price;
    var slug=name.replace(/\s+/g,'-').toLowerCase();
    Snack.findOne({slug: slug,_id : {'$ne':id}},function(err,sn){
        if (err) console.log(err);
        if (sn){
            var noti='Phim này đã tồn tại' ;
            res.send({noti: noti});
        } else {
            Snack.findById(id,function(err,sn){
                if (err) console.log(err);
                sn.name=name;
                sn.price=price;
                sn.slug=slug;
                if (imageFile != ""){
                    sn.photo= imageFile;
                }
                sn.save(function(err){
                    if (err)
                        console.log(err);
                    if (imageFile != ""){
                        if (pimage != ""){
                            fs.remove('public/img/snacks/'+id +'/'+ pimage,function(err){
                                if (err) console.log(err);

                            });
                        }

                        var snackImage =req.files.image;
                        var path= 'public/img/snacks/'+ id +'/' + imageFile;

                        snackImage.mv(path,function(err){
                            if (err)return console.log(err)
                        });
                        }
                        var imageAjax;
                        if (imageFile==""){
                            imageAjax= "/img/snacks/"+id+"/"+pimage;
                        }
                        else {
                            imageAjax= "/img/snacks/"+id+"/"+imageFile;
                        }
                            
                        res.send({
                            noti : "",
                            imageAjax:imageAjax,
                    })
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

router.post('/delete-snack',function(req,res){
    var id =req.body.id;
    var path = 'public/img/snacks/'+ id;
    fs.remove(path,function(err){
        if (err) console.log(err);
        else {
            Snack.findByIdAndRemove(id,function(err){
                if (err) console.log(err);
            });
            res.send("");
        }
    })
})

module.exports = router;