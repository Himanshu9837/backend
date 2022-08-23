const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const aboutusSchema=new mongoose.Schema({
    topheading:{
        type: String,
    },
    toppara:{
        type: String,
    },
    topimage:{
        type: { any: [Schema.Types.Mixed] },
    },
    taglineheading:{
        type: { any: [Schema.Types.Mixed] },
    },
    taglineparagraph:{
        type: { any: [Schema.Types.Mixed] },
    },
    record1:{
        type: { any: [Schema.Types.Mixed] },
    },
    record2:{
        type: { any: [Schema.Types.Mixed] },
    },
    record3:{
        type: { any: [Schema.Types.Mixed] },
    },
    record4:{
        type: { any: [Schema.Types.Mixed] },
    },
    middleicon: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      middleheading:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    middlepara:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    bottoumheading:{
        type: String,
    },
    lastheading:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    lasticon:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
})
const aboutuspage=mongoose.model("aboutuspage",aboutusSchema);
module.exports=aboutuspage;