var mongoose = require('mongoose')

var ShowtimeSchema = mongoose.Schema({
    nameEN:{
        type: String
    },
    idSt:{
        type:String,
    },
    date:{
        type:String,
    },
    time:{
        type: String,
    },
    room:{
        type:Number,
    },
    closed:{
        type:Number,
        default:0,
    },
})

var Showtime = module.exports = mongoose.model('showtime',ShowtimeSchema);