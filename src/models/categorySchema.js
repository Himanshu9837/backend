const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    pid:{
        type:String,
       },    
       categoryimage: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      sliderbannerimage: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      categoryimage: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      coverimage: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      imagebackgroundcolor: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      metaurl: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      metatitle: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      metadescription: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      metakeyword: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      categorylogo: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },    
      categorycontent: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      categoryheading: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      categorythumblinimage: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      storemetaurl: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      isfeatured: {
        type: Boolean,
        default: false,
      },
      istopgames: {
        type: Boolean,
        default: false,
      },
      isfilterd: {
        type: Boolean,
        default: false,
      },
      isenable: {
        type: Boolean,
        default: true,
      },
      isnewArrivalfeatured: {
        type: Boolean,
        default: false,
      },
      questions:{
        type:Array,
        },
        answers:{
          type:Array,
          },
    date : {
        type:Date,
        default:Date.now
    },
   })
const Categories=mongoose.model('Category',categorySchema);
module.exports = Categories;
