const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: [true, "This email is already in use"]
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
},
{
    timestamps : true,
    collection : "users"
});

module.exports = mongoose.model('User', userSchema);