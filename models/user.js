var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    password:{
        type: String
    },
    fullname:{
        type: String,
        required : true
    },
    birthday:{
        type: String,
    },
    admin:{
        type: Number,
    },
    gender:{
        type: Number
    },
    phone:{
        type:String
    },
    photo:{
        type:String
    },
    block:{
        type: Number,
        default: 0,
    }
})

var User = module.exports = mongoose.model('User',UserSchema);