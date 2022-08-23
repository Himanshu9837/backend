const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: false },
      file: { type: { any: [Schema.Types.Mixed] }, required: false },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    reciver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    useroffline:{
      type:Boolean,
    },
    useronline:{
      type:Boolean,
    },
    useronchat:{
      type:Boolean,
    },
    seen:{
      type:Boolean,
      default:false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
