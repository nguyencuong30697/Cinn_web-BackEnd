//imgUrl
//viewNumber
//createAt
//content
//author
//lastModifiedAt
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imgUrl:{
        type : String,
        required: true,
    },
    viewNumber:{
        type : Number,
        default: 0,
    },
    content:{
        type : String,
        required: true,
    },
    author:{
        type : mongoose.Schema.Types.ObjectId,//kieu du lieu _id
        ref: 'Users', // ref voi ban User
        required: true,
    },
    createDate:{
        type : Date,
        default: new Date(),
    },
    lastModifiedAt:{
        type : Date,
    },
});

const postModel = mongoose.model('Posts',postSchema);

module.exports = postModel;