const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const alerturl = "alert.svg";
const attentionurl = "warn.svg";
const sellerSchema = new mongoose.Schema({
  termcondition: {
    type: { any: [Schema.Types.Mixed] },
    required: true,
  },
  sellerapproval: {
    type: { any: [Schema.Types.Mixed] },
    default: "pendding",
  },
  withdrawalsellerapproval: {
    type: { any: [Schema.Types.Mixed] },
    default: "Lock",
  },
  sellerapprovalaccount: {
    type: Boolean,
    default: false,
  },
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
  alertbox: {
    type: Boolean,
    default: false,
  },
  attentiontbox: {
    type: Boolean,
    default: true,
  },
  sellerRestriction: {
    type: Boolean,
    default: false,
  },
  sellerlistingRestriction: {
    type: Boolean,
    default: false,
  },
  sellerwithdrawalRestriction: {
    type: Boolean,
    default: false,
  },
  documenttext: {
    type: { any: [Schema.Types.Mixed] },
    default:"you are required to upload the following documents 1)ID card , 2)photography"
  },
  documents: {
    type: { any: [Schema.Types.Mixed] },
    default: []
  },
  identitydocuments: {
    type: { any: [Schema.Types.Mixed] },
    default: []
  },
  documentcount: {
    type: Number,
    default:2,
  },
  aprovelaccounts: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  isidentitydocuments: {
    type: Boolean,
    default: false,
  },
  isdocuments: {
    type: Boolean,
    default: false,
  },
  iswithdrawalidentity: {
    type: Boolean,
    default: false,
  },
  iswithdrawaldocuments: {
    type: Boolean,
    default: false,
  },
  sellerapprovalstatus: {
    type: Boolean,
    default: false,
  },
  withdrawalapprovalstatus: {
    type: Boolean,
    default: false,
  },
  withdrawalcontent: {
    type: String,
    default: "Submit your Documentation",
  },
  withdrawaldocuments: {
    type: [],
  },
  withdrawalidentity: {
    type: [],
  },
  commission:{
    type: Boolean,
    default: true,
  },
  commissionpercentage:{
    type: Number,
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

const Seller = mongoose.model("seller", sellerSchema);
module.exports = Seller;
