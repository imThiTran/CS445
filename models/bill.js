var mongoose = require('mongoose')

var BillSchema = mongoose.Schema({
    idB:{
        type: String
    },
    seat:{
        type:Array,
    },
    email:{
        type:String,
    },
    name:{
        type:String,
    },
    phone:{
        type:String,
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
        type:Number
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
    expired:{
        type:Number,
        default:0
    }
})

var Bill = module.exports = mongoose.model('bills',BillSchema);