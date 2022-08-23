const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const badgeseconfigSchema=new mongoose.Schema({
 badgesenablesetting:{
    type: Boolean,
},
})
const badgeseconfig=mongoose.model("badgeseconfig",badgeseconfigSchema);
module.exports=badgeseconfig;