const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
},{
    timestamps: true,
})


const Task = new mongoose.model('Task', taskSchema)

module.exports = Task