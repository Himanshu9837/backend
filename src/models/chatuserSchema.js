const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatuserSchema = new mongoose.Schema({
userId: {
    type: Schema.Types.ObjectId,
    ref: "USER",
  },
});
const chatuser = mongoose.model("chatuser", chatuserSchema);
module.exports = chatuser;
