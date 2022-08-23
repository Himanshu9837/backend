const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const commissionSchema=new mongoose.Schema({
    commissionpercentage:{
        type: Number,
     },
     applyedtotamount:{
        type: Number,
     },
     applyedfrom:{
      type: Number,
   },
})
const commission=mongoose.model("commission",commissionSchema);
module.exports=commission;