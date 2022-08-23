const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const sellerverficationSchema=new mongoose.Schema({
 sellerverfication:{
    type: Boolean,
 },
})
const sellerverfication=mongoose.model("sellerverfication",sellerverficationSchema);
module.exports=sellerverfication;