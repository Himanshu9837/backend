const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const paymentstatusSchema=new mongoose.Schema({
    walletstatus:{
        type: Boolean,
        default:false,
    },
    paypalstatus:{
        type: Boolean,
        default:false,
    },
})
const paymentstatus=mongoose.model("paymentstatus",paymentstatusSchema);
module.exports=paymentstatus;