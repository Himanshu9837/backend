const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const mongooseSoftDelete = require('mongoose-soft-delete');
const sequencing = require("../config/productsequencing");
const skusequencing = require("../config/productskusequencing");
const productSchema = new mongoose.Schema({
  id: Number,
  productname: {
    required: true,
    type: { any: [Schema.Types.Mixed] },
  },
  sortdescription: {
    type: String,
    default: "",
  },
  longdescription: {
    type: String,
    default: "",
  },
  images: {
    require: false,
   type: { any: [Schema.Types.Mixed] },
  },
  thumbnailimage: {
    type: { any: [Schema.Types.Mixed] },
  },
  imagename: {
    required: false,
    type: { any: [Schema.Types.Mixed] },
  },
  sku: {
    type: Number,
  },
  metatitle: {
    type: { any: [Schema.Types.Mixed] },
  },
  metakeyword: {
    type: { any: [Schema.Types.Mixed] },
  },
  metadescription: {
    type: { any: [Schema.Types.Mixed] },
  },
  price: {
    type: Number,
  },

  stock: {
    type: Number,
  },
  qty: {
    type: Number,
  
  },
  timeperiod: {
    type: Number,
  default:100
  },
  productactive: {
    type: Boolean,
    default:true
  },
  expireToken: Date,
  metaurl:{
    type: { any: [Schema.Types.Mixed] },
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  approval: {
    type: Boolean,
    default: false,
  },
  approval: {
    type: Boolean,
    default: true,
  },
  autodelivery: {
    type: Boolean,
    default: false,
  },
  account_username: {
    type: String, 
  },
  account_email: {
    type: String, 
  },
  account_password: {
    type: String, 
  },
  productstatus: {
    type: String, 
    default:'Active'
  },
  account_specialnote: {
    type: String, 
  },
  categorydetails:[],
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "seller",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "USER",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
// productSchema.plugin(mongooseSoftDelete, {
//   paranoid: true,
// });
productSchema.pre("save", function (next) {
  let doc = this;
  sequencing
    .getSequenceNextValue("product_id")
    .then((counter) => {
      console.log("asdasd", counter);
      if (!counter) {
        sequencing
          .insertCounter("product_id")
          .then((counter) => {
            doc.id = counter;
            console.log(doc);
            next();
          })
          .catch((error) => next(error));
      } else {
        doc.id = counter;
        next();
      }
    })
    .catch((error) => next(error));
});

productSchema.pre("save", function (next) {
  let doc = this;
  skusequencing
    .getSequenceNextValue("productsku_id")
    .then((counter) => {
      console.log("asdasd", counter);
      if (!counter) {
        skusequencing
          .insertCounter("productsku_id")
          .then((counter) => {
            doc.sku = counter;
            console.log(doc);
            next();
          })
          .catch((error) => next(error));
      } else {
        doc.sku = counter;
        next();
      }
    })
    .catch((error) => next(error));
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
