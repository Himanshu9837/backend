const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const homepageSchema= new mongoose.Schema({
    bannerheading:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
        
    },
    aboutmarketpalce:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    bottomcontaint:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
      
    },
    bannerimage: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
     bottomimage: {
            require: false,
            type: { any: [Schema.Types.Mixed] },
          },
          aboutimage: {
            require: false,
            type: { any: [Schema.Types.Mixed] },
          },
          howitsworkimage: {
            require: false,
            type: { any: [Schema.Types.Mixed] },
          },
          bannerheadinglayout: {
            require: false,
            type: { any: [Schema.Types.Mixed] },
          },
          aboutmarketpalcelayout: {
            require: false,
            type: { any: [Schema.Types.Mixed] },
          },
          bottomcontaintlayout: {
            require: false,
            type: { any: [Schema.Types.Mixed] },
          },
          date : {
            type:Date,
            default:Date.now
        },

})
const Homepage=mongoose.model('homepage',homepageSchema);

module.exports = Homepage;
