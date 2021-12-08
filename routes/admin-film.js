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
    if (imageFile=="") res.send({noti:'Bạn chưa thêm hình ảnh'}); 
    else {
    var nameEN= req.body.nameEN.trim();
    var nameVN= req.body.nameVN.trim();
    var time= req.body.time;
    var agelimit=parseInt(req.body.agelimit);
    var status= req.body.status;
    var slug = nameEN.replace(/\s+/g,'-').toLowerCase();
    var director=req.body.director;
    var type = req.body.type;
    var detail=req.body.detail;
    var showdate= req.body.showdate;
    var trailerArr = (req.body.trailerId).split('/');
    var trailerId = trailerArr[trailerArr.length-1];
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
    }
})

router.post('/editBtn',function(req,res){
    var id = req.body.id;
    var statusAjax="";
    var fi2;
    Film.findById(id,function(err,fi){
        if (err) return console.log(err);
        if (fi){
            fi2=fi;
            statusAjax=`<option value="Đang khởi chiếu"`+((fi.status=="Đang khởi chiếu")?`selected`:``)+`>Đang khởi chiếu</option>
            <option value="Sắp khởi chiếu"`+((fi.status=="Sắp khởi chiếu")?`selected`:``)+`>Sắp khởi chiếu</option>
            <option value="Đã chiếu xong"`+((fi.status=="Đã chiếu xong")?`selected`:``)+`>Đã chiếu xong</option>`
        }
    })
    setTimeout(() => {
        res.send({
            film:fi2,
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
router.post('/edit-film',function(req,res){
    var imageFile =  (req.files != null)? req.files.image.name:"";
    var pimage=req.body.pimage;
    var id=req.body.id;
    var nameEN= req.body.nameEN.trim();
    var nameVN= req.body.nameVN.trim();
    var time= req.body.time;
    var agelimit=req.body.agelimit;
    var status= req.body.status;
    var slug = nameEN.replace(/\s+/g,'-').toLowerCase();
    var director=req.body.director;
    var type = req.body.type;
    var detail=req.body.detail;
    var showdate= req.body.showdate;
    var trailerArr = (req.body.trailerId).split('/');
    var trailerId = trailerArr[trailerArr.length-1];
    var actor=req.body.actor;
    Film.findOne({slug: slug,_id : {'$ne':id}},function(err,f){
        if (err) console.log(err);
        if (f){
            var noti='Phim này đã tồn tại' ;
            res.send({noti: noti});
        } else {
            Film.findById(id,function(err,fi){
                if (err) console.log(err);
                fi.nameEN= nameEN;
                fi.nameVN= nameVN;
                fi.time= time;
                fi.agelimit= agelimit;
                fi.status= status;
                fi.director= director;
                fi.type= type;
                fi.detail= detail;
                fi.showdate= showdate;
                fi.trailerId= trailerId;
                fi.actor= actor;
                fi.nameEN= nameEN;
                if (imageFile != ""){
                    fi.photo= imageFile;
                }
                fi.save(function(err){
                    if (err)
                        console.log(err);
                    if (imageFile != ""){
                        if (pimage != ""){
                            fs.remove('public/img/films/'+id +'/'+ pimage,function(err){
                                if (err) console.log(err);

                            });
                        }

                        var filmImage =req.files.image;
                        var path= 'public/img/films/'+ id +'/' + imageFile;

                        filmImage.mv(path,function(err){
                            if (err)return console.log(err)
                        });
                        }
                        var imageAjax;
                        if (imageFile==""){
                            if (pimage != ""){
                                 imageAjax= "/img/films/"+id+"/"+pimage;
                            }
                            else imageAjax="/img/noimage.png"
                        }
                        else {
                            imageAjax= "/img/films/"+id+"/"+imageFile;
                        }
                            
                        res.send({
                            noti : "",
                            imageAjax:imageAjax,
                            agelimit:agelimit
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

router.post('/delete-film',function(req,res){
    var id =req.body.id;
    var path = 'public/img/films/'+ id;
    fs.remove(path,function(err){
        if (err) console.log(err);
        else {
            Film.findByIdAndRemove(id,function(err){
                if (err) console.log(err);
            });
            res.send("");
        }
    })
})

module.exports = router;