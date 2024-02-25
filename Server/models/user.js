const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    id : {
        type : Number,
        unique : true,
        required : true
    },
    phone_number : {
        type : Number,
        required : true
    },
    priority : {
        type : Number,
        enum : [0,1,2],
        default : 0
    }
})

const User = mongoose.model('user',UserSchema)
module.exports = User