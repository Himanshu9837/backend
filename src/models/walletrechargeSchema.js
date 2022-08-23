const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const walletrechargeSchema=new mongoose.Schema({
    amount: {
        type: Number,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
      },
    paymethodstatus:{
        type: String,
     },
     paydetails:{
        type: Array,
        default: [],
     },
  
})
const walletrecharge=mongoose.model("walletrecharge",walletrechargeSchema);
module.exports=walletrecharge;