const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ratingSchema= new mongoose.Schema({
    rating:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    sellerId:{
        type: Schema.Types.ObjectId,
        ref: "seller",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "USER",
      },
      orderId: {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
     date : {
            type:Date,
            default:Date.now
        },

})
const rating=mongoose.model('rating',ratingSchema);

module.exports = rating;
