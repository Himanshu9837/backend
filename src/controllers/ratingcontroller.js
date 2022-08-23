const Seller = require("../models/ratingSchema");
const buyerrating = require("../models/buyerratingSchema");


class Rating{
async addrating(req,res){
    console.log(req.body)
    const sellerId=req.body.sellerId;
    const userId=req.body.userId;
    const orderId=req.body.orderId;
    const rating=req.body.rating;
    if(!sellerId){
        return res.status(400).json("seller id required");
    }
    if(!userId){
        return res.status(400).json("user id required");
    }
    if(!orderId){
        return res.status(400).json("order id required");
    }
    if(!rating){
        return res.status(400).json("rating required");
    }
    try{
      const data={
        sellerId:sellerId,
        userId:userId,
        orderId:orderId,
        rating:rating,
      }
      const savedata=new Seller(data);
      savedata.save().then((result)=>{
          return res.status(200).json("Save data");
      });
    }catch(error){
        console.log(error)
    }
}

async addbuyerrating(req,res){
    console.log(req.body)
    const sellerId=req.body.sellerId;
    const userId=req.body.userId;
    const orderId=req.body.orderId;
    const rating=req.body.rating;
    if(!sellerId){
        return res.status(400).json("seller id required");
    }
    if(!userId){
        return res.status(400).json("user id required");
    }
    if(!orderId){
        return res.status(400).json("order id required");
    }
    if(!rating){
        return res.status(400).json("rating required");
    }
    try{
      const data={
        sellerId:sellerId,
        userId:userId,
        orderId:orderId,
        rating:rating,
      }
      const savedata=new buyerrating(data);
      savedata.save().then((result)=>{
          return res.status(200).json("Save data");
      });
    }catch(error){
        console.log(error)
    }
}
async fetchbuyerrating(req,res){
    const id=req.params.id;
    try{
     const like=await Seller.find({userId:id,rating:"like"}).count();
     const dislike=await Seller.find({userId:id,rating:"dislike"}).count();
     return res.status(200).json({like,dislike})
    }catch(error){
        console.log(error)
    }
}


async fetchrating(req,res){
    const id=req.params.id;
    try{
     const like=await Seller.find({sellerId:id,rating:"like"}).count();
     const dislike=await Seller.find({sellerId:id,rating:"dislike"}).count();
     return res.status(200).json({like,dislike})
    }catch(error){
        console.log(error)
    }
}
async orderreating(req,res){
    const id=req.params.id;
    try{
       const data=await Seller.findOne({orderId:id});
       return res.status(200).json(data.rating); 
    }catch(error){
        console.log(error)
    }
}
}
module.exports=new Rating();