const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const landingpageSchema = new mongoose.Schema({    
  bannerheading: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  topheading: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  offerheading: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  percentagenumber: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  seotopheading: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  bannerheadingenable: {
    require: false,
    type: Boolean,
    default: false,
  },
  bannerimageenable: {
    require: false,
    type: Boolean,
    default: false,  
  },
  divenable: {
    require: false,
    type: Boolean,
    default: true,  
  },
  bannerheadinglayout: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  bannerimagelayout: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  bannerpara: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  bannerparalayout: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  bannerparaenable: {
    require: false,
    type: Boolean,
    default: false,
  },
    offerbannerenable: {
    require: false,
    type: Boolean,
    default: false,
  },
  bannerimage: {                  
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  bannerbackgroundimage: {                  
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  topimage: {                  
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const landingpage = mongoose.model("landingpage", landingpageSchema);

module.exports = landingpage;
