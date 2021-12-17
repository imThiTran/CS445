var User= require('../models/user');

module.exports = function(req,res,next){
    if (req.session.user){
        User.findOne({email:req.session.user},function(err,us){
            if (err) return console.log(err);
            if (us) next();
            else {
                res.render('auth/login',{
                value:"",
                mes:""
                })
            }
        })
    } else {
        res.render('auth/login',{
            value:"",
            mes:""
        })
    }
}