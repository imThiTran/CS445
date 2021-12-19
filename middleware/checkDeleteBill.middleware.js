var Bill= require('../models/bill');

module.exports = function(req,res,next){
    Bill.deleteMany({checkout:0},function(err,bi){
        if (err) return console.log(err);
        next();
    });
}