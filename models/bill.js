var mongoose = require('mongoose')

var BillSchema = mongoose.Schema({
    idB:{
        type: String
    },
    seat:{
        type:Array,
    },
    snacks:{
        type:Array,
    },
    type:{
        type: String,
        default:"uncheck"
    },
    room:{
        type:Number,
    },
    nameEN:{
        type:String,
    },
    time:{
        type:String,
    },
    date:{
        type:String,
    },
    totalPrice:{
        type:String
    },
    checkout:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updateddAr:{
        type:Date,
        default:Date.now
    },
})

var Bill = module.exports = mongoose.model('bills',BillSchema);