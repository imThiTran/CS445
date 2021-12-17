var User= require('../models/user');

module.exports = function(req,res,next){
    var user = req.session.user;
    User.findOne({email : user},function(err,us){
        if (err) return console.log(err);
        if (us){
            res.locals.userMdw = us;
        }
        else { res.locals.userMdw = ""};
        next();
    })
}