var mongoose = require('mongoose')

var FilmSchema = mongoose.Schema({
    nameVN:{
        type : String,
        required:true,
    },
    nameEN:{
        type: String,
        required:true,
    },
    slug:{
        type: String,
    },
    showtime:{
        type: Array,
        default:[],
    },
    photo:{
        type: String,
        required:true,
    },
    director:{
        type: String,
        required:true,
    },
    actor:{
        type:String,
        required:true,
    },
    showdate:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    time:{
        type: String,
        required:true,
    },
    detail:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    agelimit:{
        type:String,
        required:true,
    },
    trailerId:{
        type:String
    },
})

var Film = module.exports = mongoose.model('films',FilmSchema);