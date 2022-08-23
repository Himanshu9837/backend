const badgesconditon = require("../models/badgesconditionSchema");
const badges = require("../models/badgesSchema");
const Seller = require("../models/sellerSchema");   
const Order = require("../models/orderSchema");
const badgeseconfig = require("../models/badgeseconfigSchema");
class Badges {
  async addcondtion(req, res) {
    const conditionname = req.body.conditionname;
    try {
      const data = {
        conditionname: conditionname,
      };
      const conditiondata = new badgesconditon(data);
      conditiondata.save().then((result) => {
        return res.status(200).json("Add successfully");
      });
    } catch (error) {
      console.log(error);
    }
  }
  async fetchcondition(req, res) {
    try {
      const data = await badgesconditon.find();
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  async addbadges(req, res) {
    console.log(req.body);
    try {
      const badgename = req.body.badgename;
      const badgediscription = req.body.badgediscription;
      let badgesicon = req.files.badgesicon[0].location;
      const badgesenable = req.body.badgesenable;
      const conditionId = req.body.conditionid;
      if(!badgename){
        return res.status(400).json('Badge name required');
      }
      if(!badgediscription){
        return res.status(400).json('Badge Discription required');
      }
      const badgesdata = {
        badgename: badgename,
        badgediscription: badgediscription,
        badgesicon: badgesicon,
        badgesenable: badgesenable,
        conditionId: conditionId,
      };
      const data = new badges(badgesdata);
      data.save().then((result) => {
        return res.status(200).json("Add successfully");
      });
    } catch (error) {
      console.log(error);
    }
  }
  async applybadges(req, res) {
    const userid = req.params.id;
    const checkdata = [];
    const verified = [];
    var sum = 0;
    var sum1 = 0;
    var sum2 = 0;
    try {
      const badgesdata = await badges
        .find({ badgesenable: true })
        .populate("conditionId");
      
      for await (const conditiondata of badgesdata) {
        const condition = conditiondata.conditionId.conditionname;
        //  return res.json(condition)
     
        if (condition == "seller verification") {
          const sellerdata = await Seller.findOne({
            userId: userid,
            isverified: true,
          });
          if (sellerdata) {
            verified.push(conditiondata.badgesicon);
          }
        }
      }
        var date = new Date();
        const sellerdata = await Seller.findOne({ userId: userid });
        const sellerId = sellerdata._id;
       
        const sellerdate=sellerdata.dateCreated;
        const currentmonth=date.getMonth()+1;
        const currentyear = date.getFullYear();
        const sellermonth = sellerdate.getMonth()+1;
        const sellerday = sellerdate.getDate();
        const selleryear = sellerdate.getFullYear();
        const plusyear=currentyear-selleryear
        
        const plusmonth=currentmonth-sellermonth;
        if(plusmonth>=0){
            const payload = {
                "deviceId": "a-1",
                "date":sellerday,
                "year": selleryear+plusyear,
                "month": sellermonth-2 // months start from 0 = January, so 11 = December 
            }
            
           
            var from = new Date(Date.UTC(payload.year, payload.month + plusmonth,payload.date, 1)).toISOString(); 
           
        }else{
            const payload = {
                "deviceId": "a-1",
                "date":sellerday,
                "year": selleryear+plusyear,
                "month": sellermonth-1
            }
            const minmonth=Math.abs(plusmonth)+1;
            
            var from = new Date(Date.UTC(payload.year, payload.month - minmonth,payload.date, 1)).toISOString(); 
           
           
        }
  
        for await (const conditiondata of badgesdata) {
          const condition = conditiondata.conditionId.conditionname;
      if (condition == "seller up to 100") {
         const badgesdata = await Order.find({ selerId: sellerId,  dateCreated: {
            $gte: from,
            $lt:  date
        } }).populate(
            "productId"
          );
          //   return res.json(badgesdata)
          for await (const pro of badgesdata) {
            const proprice = pro.productId.price;
            sum += parseInt(proprice);
          }
        
          if (sum > 100) {
            checkdata.push(conditiondata.badgesicon);
          }
        }
       }
       for await (const conditiondata of badgesdata) {
        const condition = conditiondata.conditionId.conditionname;
         if (condition == "seller up to 1000") {
          const sellerdata = await Seller.findOne({ userId: userid });
          const sellerId = sellerdata._id;
          const badgesdata = await Order.find({ selerId: sellerId ,dateCreated: {
            $gte: from,
            $lt:  date
        }}).populate(
            "productId"
          );
          //   return res.json(badgesdata)
          for await (const pro of badgesdata) {
            const proprice = pro.productId.price;
            sum1 += parseInt(proprice);
          }
          
          if (sum1 > 1000) {
            checkdata.push(conditiondata.badgesicon);
          }
        }
       } 
       for await (const conditiondata of badgesdata) {
        const condition = conditiondata.conditionId.conditionname;
        if (condition == "seller up to 1500") {
          const sellerdata = await Seller.findOne({ userId: userid });
          const sellerId = sellerdata._id;
          const badgesdata = await Order.find({ selerId: sellerId ,dateCreated: {
            $gte: from,
            $lt:  date
        } }).populate(
            "productId"
          );
          //   return res.json(badgesdata)
          for await (const pro of badgesdata) {
            const proprice = pro.productId.price;
            sum2 += parseInt(proprice);
          }
          
          if (sum2 > 1500) {
            checkdata.push(conditiondata.badgesicon);
          }
        }
      }
      return res.status(200).json({ verified, checkdata });
    } catch (error) {}
  }

async fetchbadges(req,res){
  try{
     const badge=await badges.find();
     return res.status(200).json(badge);
  }catch(error){
    console.log(error)
  }
}
async editbadges(req,res){
  const id=req.params.id;
  try{
     const badge=await badges.findOne({_id:id}).populate("conditionId");
     if(!badge){
      return res.status(200).json("No badges found");
     }else{
     return res.status(200).json(badge);
     }
  }catch(error){
    console.log(error)
  }
}
async updatebadges(req,res){
  console.log(req.files.badgesicon)
  const id =req.params.id;
  const badgesenable=req.body.badgesenable;
  const badgename=req.body.badgename;
  const conditionid=req.body.conditionid;
  const badgediscription=req.body.badgediscription;
  // const badgesicon = req.files.badgesicon[0].location;
  try{
     const badgedata={};
     badgedata.badgesenable=badgesenable;
     badgedata.badgename=badgename;
     badgedata.badgediscription=badgediscription;
     badgedata.conditionId=conditionid;
     if (req.files.badgesicon) {
      let badgesicon = req.files.badgesicon[0].location;
      badgedata.badgesicon=badgesicon;
    } 
     await badges.findByIdAndUpdate(id,badgedata).then((result)=>{
       return res.status(200).json('Bages update')
     });
  }catch(error){
    console.log(error)
  }
}
async deletebadges(req,res){
  const id=req.params.id;
  try{
    await badges.findByIdAndRemove(id).then((result)=>{
    return res.status(200).json("Badges Delete Sucessfully");
    })
  }catch(error){
    console.log(error);
  }
}
//  async addconfig(req,res){
//   const data={
//     badgesenablesetting:true
//   }
//   const test =new badgeseconfig(data);
//   test.save();
// }
async fetchbadgesconfig(req,res){
  try{
    const data=await badgeseconfig.findOne();
    return res.status(200).json(data);
  }catch(error){
    console.log(error)
  }
}
 async updatebadgeconfig(req,res){
   console.log(req.body)
   try{
   const id =req.params.id;
   const condition=req.body.condition;
  const data={};
  data.badgesenablesetting=condition
  await badgeseconfig.findByIdAndUpdate(id,data);
  return res.status(200).json("update sucessfully");
   }catch(error){
     console.log(error);
   }
}
}
module.exports = new Badges();
