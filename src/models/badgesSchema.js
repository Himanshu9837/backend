const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const badgesSchema=new mongoose.Schema({
    badgename:{
        type: String,
    },
    badgediscription:{
        type: String,
    },
    badgesicon: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
      badgesenable:{
        type: Boolean,
        default:false,
    },
    conditionId: {
        type: Schema.Types.ObjectId,
        ref: "badgescondition",
      },
})
const badges=mongoose.model("badges",badgesSchema);
module.exports=badges;