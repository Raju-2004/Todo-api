const mongoose = require('mongoose')

const SubTaskSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    task_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Task',
        required : true
    },
    created_at : {
        type : Date ,
        default : Date.now
    },
    updated_at : {
        type : Date,
        default : Date.now
    },
    deleted_at :{
        type : Date,
        default : null
    }
})

const SubTask = mongoose.model('SubTask',SubTaskSchema)

module.exports = SubTask