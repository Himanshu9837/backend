const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const fixerrateSchema=new mongoose.Schema({
    date:{
        type: String,
    },
    base:{
        type: String,
    },
    rates: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },

})
const fixerrate=mongoose.model("fixerrate",fixerrateSchema);
module.exports=fixerrate;