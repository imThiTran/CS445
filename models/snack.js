var mongoose = require('mongoose')

var SnackSchema = mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    slug:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    block:{
        type: Number,
        default:0,
    },
    photo:{
        type:String,
    },
})

var Snack = module.exports = mongoose.model('snacks',SnackSchema);