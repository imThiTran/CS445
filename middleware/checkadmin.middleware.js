var User= require('../models/user');

module.exports = function(req,res,next){
    User.findOne({email:req.session.user},function(err,us){
        if (err) return console.log(err);
        if (us){
            if (us.admin==1) next();
            else res.render('error');
        }
    })  
}