var express = require('express')
var router = express.Router();

router.get('/detail',function(req,res){
    res.render('films/detail');
})

module.exports = router;