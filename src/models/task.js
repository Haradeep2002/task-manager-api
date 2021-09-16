const mongoose = require('mongoose')

//schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    //this field is real
    owner: {
        //ObjectID
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //reference of other collection to create a link between both 
        ref: 'User'
    }
}, {
    //to get createdAt and updatedAt
    timestamps: true
})

//model
const Task = mongoose.model('Task', taskSchema)

module.exports = Task