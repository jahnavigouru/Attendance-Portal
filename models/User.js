const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    department: String,
    n_students: Number,
    attendance: [{name: String, 
                status:[{date: String,   
                          value: Number
                        }]
               }]
})

const User = mongoose.model('User', userSchema)

module.exports = User