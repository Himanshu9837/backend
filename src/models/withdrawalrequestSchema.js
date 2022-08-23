const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const withdrawarequestlSchema=new mongoose.Schema({
    amount: {
        type: Number,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
      },
    withdrawalstatus:{
        type: String,
        default:"Processing",
    },
    paymethod:{
        type: String,
     },
     paydetails:{
      type: { any: [Schema.Types.Mixed] },
     },
    cancelresion:{
        type: String,
     },
})
const withdrawalrequest=mongoose.model("withdrawalrequest",withdrawarequestlSchema);
module.exports=withdrawalrequest;