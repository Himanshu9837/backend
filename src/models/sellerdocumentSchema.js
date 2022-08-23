const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const sellerdocumentSchema=new mongoose.Schema({
 documentstext:{
    type: { any: [Schema.Types.Mixed] },
    default:"submit your National Id card(front&back),passport photograph,live selfie"
  },
  totaldocuments:{
    type: { any: [Schema.Types.Mixed] },
    default:2,
  },
})
const sellerdocument=mongoose.model("sellerdocument",sellerdocumentSchema);
module.exports=sellerdocument;