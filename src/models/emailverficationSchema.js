const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const emailverficationSchema=new mongoose.Schema({
    reset: {
        type: { any: [Schema.Types.Mixed] },
    },
    expireToken:Date,
    email:{
        type:String,
    },
    verifystatus:{
        type:Boolean,
        default: false
    },
})
const emailverfication=mongoose.model("emailverfication",emailverficationSchema);
module.exports=emailverfication;