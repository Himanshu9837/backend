const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const walletSchema=new mongoose.Schema({
    total:{
        type: Number,
        default:0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
      },
      selllerwithdrawal:{
        type: Boolean,
        default:true,
    },
})
const wallet=mongoose.model("wallet",walletSchema);
module.exports=wallet;