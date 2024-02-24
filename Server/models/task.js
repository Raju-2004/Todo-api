const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String ,
        required : true
    },
    due_date : {
        type : Date,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    priority : {
        type : Number,
        default : 0
    },
    status : {
        type : String,
        enum : ['TODO','IN_PROGRESS','DONE'],
        default : 'TODO'
    },
    deleted_at : {
        type : Date,
        default : null
    }
},{ timestamps: true })

taskSchema.pre('save', function (next) {
    const today = new Date();
    const dueDate = new Date(this.due_date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        this.priority = 0;
    } else if (diffDays <= 2) {
        this.priority = 1;
    } else if (diffDays <= 4) {
        this.priority = 2;
    } else {
        this.priority = 3;
    }

    next();
});

const Task = mongoose.model('Task',taskSchema)
module.exports = Task