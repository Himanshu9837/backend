const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const badgesconditionSchema=new mongoose.Schema({
    conditionname:{
        type: String,
    },
})
const badgescondition=mongoose.model("badgescondition",badgesconditionSchema);
module.exports=badgescondition;