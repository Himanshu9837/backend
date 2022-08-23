const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const currencySchema=new mongoose.Schema({
    currencyname:{
        type: String,
    },
    currencysymbole:{      
        type: String,
    },
    countryname:{      
        type: String,
    },
    isenable:{
        type: Boolean,
        default:true,
    },
})
const currency=mongoose.model("currency",currencySchema);
module.exports=currency;