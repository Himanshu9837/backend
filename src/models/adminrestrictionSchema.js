const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const adminrestrictionSchema=new mongoose.Schema({
    restriction:{
        type: String,
    },
    pid:{
        type:String,
       },

})
const adminrestriction=mongoose.model("adminrestriction",adminrestrictionSchema);
module.exports=adminrestriction;