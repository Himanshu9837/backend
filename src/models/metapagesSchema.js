const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const metapageSchema=new mongoose.Schema({
    metatitle: {
        type: { any: [Schema.Types.Mixed] },
      },
      metakeyword: {
        type: { any: [Schema.Types.Mixed] },
      },
      metadescription: {
        type: { any: [Schema.Types.Mixed] },
      },
      pagename: {
        type: { any: [Schema.Types.Mixed] },
      },
     
})
const metapage=mongoose.model("metapage",metapageSchema);
module.exports=metapage;