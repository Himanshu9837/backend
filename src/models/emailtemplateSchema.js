const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const emailtemplateSchema=new mongoose.Schema({
    emailtext:{
        type: String,
    },
    currencysymbole:{      
        type: String,
    },
    templatename:{      
        type: String,
    },
    isenable:{
        type: Boolean,
        default:true,
    },
})
const emailtemplate=mongoose.model("emailtemplate",emailtemplateSchema);
module.exports=emailtemplate;