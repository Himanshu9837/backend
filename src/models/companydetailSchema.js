const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const companydetailSchema=new mongoose.Schema({
    contactusheading:{
        type: { any: [Schema.Types.Mixed] },
    },
    mobile:{
        type: String,
    },
    address: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      esportsemail:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    }
   
})
const companydetail=mongoose.model("companydetail",companydetailSchema);
module.exports=companydetail;