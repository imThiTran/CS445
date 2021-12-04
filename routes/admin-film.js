var express = require('express')
var router = express.Router();
var mkdir = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img')


var Film= require('../models/film');


router.get('/',function(req,res){
    Film.find({},function(err,fi){
        res.render('admin/admin-film2',{
            films:fi
        })
    })
})


router.post('/add-film',function(req , res){
    var imageFile =(req.files != null)? req.files.image.name:"";
    var nameEN= req.body.nameEN;
    var nameVN= req.body.nameVN;
    var time= req.body.time;
    var agelimit=parseInt(req.body.agelimit);
    var status= req.body.status;
    var slug = nameEN.replace(/\s+/g,'-').toLowerCase();
    var director=req.body.director;
    var type = req.body.type;
    var detail=req.body.detail;
    var showdate= req.body.showdate;
    var trailerArr = (req.body.trailerId).split('=');
    var trailerId = trailerArr[1];
    var actor=req.body.actor;
    Film.findOne({$or:[{slug: slug},{nameVN:nameVN}]},function(err,fi){
        if (fi){
            var noti='Phim này đã tồn tại' ;
            res.send({noti: noti});
        }
        else {
            var film=new Film({
                nameEN:nameEN,
                nameVN:nameVN,
                agelimit:agelimit,
                time:time,
                trailerId:trailerId,
                status:status,
                director:director,
                showdate: showdate,
                type: type,
                detail: detail,
                photo:imageFile,
                slug:slug,
                actor:actor
            });
            film.save(function(err){
                if (err) return console.log(err);

                fs.mkdir('public/img/films/'+ film._id, function(err){
                    if (err) return console.log(err);
                });

                if (imageFile != ""){
                    var filmImage =req.files.image;
                    var path= 'public/img/films/'+ film._id +'/' + imageFile;

                    filmImage.mv(path,function(err){
                        if (err)return console.log(err)
                    });
                }
                var noti="";
                res.send({noti:noti})
            })
        }
    })

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
    var statusAjax="";
    var agelimitAjax="";
    var fi2;
    Film.findById(id,function(err,fi){
        if (err) return console.log(err);
        if (fi){
            fi2=fi;
            statusAjax=`<option value="Đang khởi chiếu"`+((fi.status=="Đang khởi chiếu")?`selected`:``)+`>Đang khởi chiếu</option>
            <option value="Sắp khởi chiếu"`+((fi.status=="Sắp khởi chiếu")?`selected`:``)+`>Sắp khởi chiếu</option>
            <option value="Đã chiếu xong"`+((fi.status=="Đã chiếu xong")?`selected`:``)+`>Đã chiếu xong</option>`
            agelimitAjax=`<label class="label-chitiet" for="">Rating</label>
            <div class="" style="display: flex; justify-content: center;">
            <div class="form-check rating">
            <input class="form-check-input" value="18" type="radio"
                name="agelimit" id="flexRadioDefault1"`+((fi.agelimit==18)?`checked`:``)+`>
            <label class="form-check-label"
                for="flexRadioDefault1">
                <img class="img-cs" style="width: 50%;"
                    src="/img/cs18.png">
            </label>
        </div>
        <div class="form-check rating">
            <input class="form-check-input" value="16" type="radio"
                name="agelimit" id="flexRadioDefault1" `+((fi.agelimit==16)?`checked`:``)+`>
            <label class="form-check-label"
                for="flexRadioDefault1">
                <img class="img-cs" style="width: 50%;"
                    src="/img/cs16.png">
            </label>
        </div>
        <div class="form-check rating">
            <input class="form-check-input" value="13" type="radio"
                name="agelimit" id="flexRadioDefault1" `+((fi.agelimit==13)?`checked`:``)+`>
            <label class="form-check-label"
                for="flexRadioDefault1">
                <img class="img-cs" style="width: 50%;"
                    src="/img/cs13.png">
            </label>
        </div>
        </div>`
        }
    })
    setTimeout(() => {
        res.send({
            film:fi2,
            agelimitAjax:agelimitAjax,
            statusAjax:statusAjax
        });
    }, 5);
})

router.post('/detailBtn',function(req,res){
    var id=req.body.id;
    Film.findById(id,function(err,fi){
        if (fi){
            res.send({film:fi})
        }
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