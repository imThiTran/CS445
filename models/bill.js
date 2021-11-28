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
    }
})

var Bill = module.exports = mongoose.model('bills',BillSchema);