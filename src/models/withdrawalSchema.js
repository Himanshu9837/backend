const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const withdrawalSchema=new mongoose.Schema({
    withdrawalverfication:{
        type: Boolean,
        default:false,
    },
})
const withdrawalverfication=mongoose.model("withdrawalverfication",withdrawalSchema);
module.exports=withdrawalverfication;