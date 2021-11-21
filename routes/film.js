var express = require('express')
var router = express.Router();
var Film = require('../models/film');

router.get('/detail/:slug',function(req,res){
    var slug = req.params.slug;
    Film.findOne({slug:slug},function(err,fi){
        res.render('films/detail',{
            film:fi,
            showtime:fi.showtime,
        });
    })
})

module.exports = router;