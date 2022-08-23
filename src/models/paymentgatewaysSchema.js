const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paymentgatewaysSchema = new mongoose.Schema({
  paymentgateway: {
    type: String,
  },
  paymentgatewaykey: {
    type: String,
  },
  paymentgatewaysecretkey: {
    type: String,
  },
  payementfee: {
    type: Number,
    default:0
  },
  payementfeegst: {
    type: Number,
    default:0
  },
  payementfixamountfee: {
    type: Number,
    default:0
  },
  payementfixamountfeegst: {
    type: Number,
    default:0
  },
  status: {
    type: Boolean,
    default: false,
  },
});
const paymentgateway = mongoose.model("paymentgateway", paymentgatewaysSchema);
module.exports = paymentgateway;
