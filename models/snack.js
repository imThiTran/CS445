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
    },
    block:{
        type: Number,
    },
    photo:{
        type:String,
    },
})

var Snack = module.exports = mongoose.model('snacks',SnackSchema);