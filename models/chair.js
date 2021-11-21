var mongoose = require('mongoose')

var ChairSchema = mongoose.Schema({
    nameChair:{
        type : String,
    },
    showtimeId:{
        type: String,
    },
    nameEN:{
        type: String,
    },
    date:{
        type: String,
    },
    time:{
        type: String,
    },
    room:{
        type: Number
    },
})

var Chair = module.exports = mongoose.model('chairs',ChairSchema);