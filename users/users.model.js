//email => unique,required
//password
//fullName
//avatarURL
//description
//createDate
//lastModifiedAt
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required: true,
        unique: true,
    },
    password:{
        type : String,
        required: true,
    },
    fullName:{
        type : String,
        required: true,
    },
    avatarUrl:{
        type : String,
    },
    description:{
        type : String,
    },
    createDate:{
        type : Date,
        default: new Date(),
    },
    lastModifiedAt:{
        type : Date,
    },
});

const usersModel = mongoose.model('Users',userSchema);

module.exports = usersModel;