const mongoose=require('mongoose');

const UrlSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    originalUrl:{
        type: String,
        required: true
    },
    shortUrl:{
        type: String,
        required: true,
        unique: true
    },
    clicks:{
        type: Number,
        default: 0
    }
});

module.exports=mongoose.model('Url',UrlSchema,'Url');