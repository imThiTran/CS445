var mongoose = require('mongoose')

var FilmSchema = mongoose.Schema({
    nameVN:{
        type : String,
        require:true,
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
        require:true,
    },
    director:{
        type: String,
        require:true,
    },
    actor:{
        type:String,
        require:true,
    },
    showdate:{
        type:String,
        require:true,
    },
    type:{
        type:String,
        require:true,
    },
    time:{
        type: String,
        require:true,
    },
    detail:{
        type:String,
        require:true,
    },
    status:{
        type:String,
        require:true,
    },
    agelimit:{
        type:Number,
        require:true,
    },
    trailerId:{
        type:String
    },
})

var Film = module.exports = mongoose.model('films',FilmSchema);