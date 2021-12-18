var User= require('../models/user');

module.exports = function(req,res,next){
    var todaymls=(new Date()).getTime();
    User.find({},function(err,us){
        if (err) return console.log(err);
        for (var i=0;i<us.length;i++){
            if (us[i].block.type!=0 && us[i].block.dateto!=""){
                if (todaymls>=us[i].block.realdate) {
                    us[i].block={type:0,dateto:"",realdate:""};
                    us[i].save();
                }
            }
        }
        setTimeout(() => {
            next();
        }, 5);
    })
}