var mongoose = require('mongoose')

var FilmSchema = mongoose.Schema({
    nameVN:{
        type : String,
    },
    nameEN:{
        type: String,
        require:true,
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
    type:{
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
    trailerId:{
        type:String
    },
})

var Film = module.exports = mongoose.model('films',FilmSchema);