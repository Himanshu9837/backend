const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const contactusSchema=new mongoose.Schema({
    username: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      useremailemail:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    subject: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      message:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
   
})
const contactus=mongoose.model("contactus",contactusSchema);
module.exports=contactus;