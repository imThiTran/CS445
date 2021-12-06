var mongoose = require('mongoose')

var SnackSchema = mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    slug:{
        type:String,
    },
    price:{
        type:Number,
        require:true,
    },
    block:{
        type: Number,
        require:true,
    },
    photo:{
        type:String,
    },
})

var Snack = module.exports = mongoose.model('snacks',SnackSchema);