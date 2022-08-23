const mongoose = require("mongoose");

const mychatSchema = mongoose.Schema(
  {
   sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("mychat", mychatSchema);