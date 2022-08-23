const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stayloginSchema= new mongoose.Schema({
    days:{
        type:Number,
        required:true
    },
    date : {
        type:Date,
        default:Date.now
    },
})
const Staylogin=mongoose.model('Staylogin',stayloginSchema);
module.exports = Staylogin;