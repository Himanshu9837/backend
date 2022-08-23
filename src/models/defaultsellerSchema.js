const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const alerturl = "alert.svg";
const attentionurl = "warn.svg";
const defaultsellerSchema = new mongoose.Schema({
  attentiontextarea: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
    default:
      "You are required to submit the following documention for authentication & verfication purpose",
  },
  alerttextarea: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
    default: "Alert",
  },
  alerticon: {
    type: { any: [Schema.Types.Mixed] },
    default: alerturl,
  },
  attentionicon: {
    type: { any: [Schema.Types.Mixed] },
    default: attentionurl,
  },
  
  documenttext: {
    type: { any: [Schema.Types.Mixed] },
    default:"You are required to submit the following document for verification 1. National ID Card 2. Photograph"
  },
    documentcount: {
    type: Number,
    default:2,
  }

});

const Defaultseller = mongoose.model("defaultseller", defaultsellerSchema);
module.exports = Defaultseller;
