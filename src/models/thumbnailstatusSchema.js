const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const thumbnailstatusSchema=new mongoose.Schema({
    thumbnailconfig:{
       type: Boolean,
  },
})
const thumbnailstatus=mongoose.model("thumbnailstatus",thumbnailstatusSchema);
module.exports=thumbnailstatus;