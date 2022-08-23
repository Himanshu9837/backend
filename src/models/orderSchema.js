const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const invoicesequencing = require("../config/invoicesequencing");
const sequencing = require("../config/ordersequencing");
let OrderSchema = new Schema(
  {
    id: String,
    orders: {
      type: Array,
      default: [],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    selerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
    quantity: {
      type: Number,
    },
    invoiceid: {
      type: Number,
      default:0,
    },
    subtotal: {
      type: Number,
    },
    // items: [productSchema],
    paymentmode: {
      type: String,
    },
    account_username: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    fullname: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    status: {
      type: String,
    },
    paymentfee: {
      type: Number,
      default:0,
    },
    account_email: {
      type: String,
    },
    account_password: {
      type: String,
    },
    account_specialnote: {
      type: String,
    },
    account_dob: {
      type: String,
    },
    account_country: {
      type: String,
    },
    account_userfullname: {
      type: String,
    },
    secret_question: {
      type: String,
    },
    secret_answer: {
      type: String,
    },
    order_status: {
      type: { any: [Schema.Types.Mixed] },
      default: "Processing",
    },
    confirm_by_seller: {
      type: { any: [Schema.Types.Mixed] },
      default: true,
    },
    view_by_seller: {
      type: { any: [Schema.Types.Mixed] },
      default: false,
    },
    details_by_seller: {
      type: { any: [Schema.Types.Mixed] },
      default: false,
    },
    buyer_confirm: {
      type: { any: [Schema.Types.Mixed] },
      default: false,
    },
    buyer_cancel:{
      type: { any: [Schema.Types.Mixed] },
      default: false,
    },
    seller_cancel:{
      type: { any: [Schema.Types.Mixed] },
      default: false,
    },
    issellerrating:{
      type: { any: [Schema.Types.Mixed] },
      default: false,
    },
    isbuyerrating:{
      type: { any: [Schema.Types.Mixed] },
      default: false,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    selllerId: {
      type: Schema.Types.ObjectId,
      ref: "seller",
    },
    sms_option: {
      type: Boolean,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "USER",
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
OrderSchema.pre("save", function (next) {
    let doc = this;
    sequencing
      .getSequenceNextValue("order_id")
      .then((counter) => {
        console.log("asdasd", counter);
        if (!counter) {
          sequencing
            .insertCounter("order_id")
            .then((counter) => {
              doc.id = "ESP"+counter;
              console.log(doc);
              next();
            })
            .catch((error) => next(error));
        } else {
          doc.id ="ESP"+counter;
          next();
        }
      })
      .catch((error) => next(error));
  });
  OrderSchema.pre("save", function (next) {
    let doc = this;
    invoicesequencing
      .getSequenceNextValue("invoice_id")
      .then((counter) => {
        console.log("asdasd", counter);
        if (!counter) {
          invoicesequencing
            .insertCounter("invoice_id")
            .then((counter) => {
              doc.invoiceid = counter;
              console.log(doc);
              next();
            })
            .catch((error) => next(error));
        } else {
          doc.invoiceid =counter;
          next();
        }
      })
      .catch((error) => next(error));
  });

module.exports = mongoose.model("order", OrderSchema);
