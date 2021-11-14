var mongoose = require('mongoose')

var FilmSchema = mongoose.Schema({
    nameVN:{
        type : String,
        required : true
    },
    nameEN:{
        type: String
    },
    slug:{
        type: String,
    },
    showtime:{
        type: Array,
    },
    photo:{
        type: String,
    },
    director:{
        type: String
    },
    actor:{
        type:String
    },
    showdate:{
        type:String
    },
    time:{
        type: String,
    },
    detail:{
        type:String,
    },
    status:{
        type:String,
    },
    agelimit:{
        type:Number,
    },
})

var Film = module.exports = mongoose.model('films',FilmSchema);