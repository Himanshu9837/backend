const Seller = require("../models/sellerSchema");
const order = require("../models/orderSchema");
const Wallet = require("../models/walletSchema");
const Walletrecharge = require("../models/walletrechargeSchema");
const Paymentgateway = require("../models/paymentgatewaysSchema");
const Withdrawalrequest = require("../models/withdrawalrequestSchema");
const Withdrawalwallet = require("../models/paymentstatusSchema");
// const Defaultseller = require("../models/defaultsellerSchema");
// const verification = require("../models/sellerverficationSchema");
// const Withdrawal = require("../models/withdrawalSchema");
// const Products = require("../models/productSchema");
const User = require("../models/userSchema");
const express = require("express");

const sgMail = require("@sendgrid/mail");
const { ADDRGETNETWORKPARAMS } = require("dns");
require("dotenv").config();

class withdrawal_walllet {
  async wallettotal(req, res) {
    const user_id = req.params.id;
    try {
      const data = await Wallet.findOne({ userId: user_id });
      if (!data) {
        return res.status(200).json(0);
      } else {
        return res.status(200).json(data.total);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sellerwithdarawalrequest(req, res) {
    const userid = req.params.id;
    try {
      // console.log(req.body)
      // const seller = await Seller.findOne({ _id: userid });
      // const userid = seller.userId;
      const user = await User.findOne({ _id: userid });
      const senderemail = user.email;

      const username = user.username;
      const id = user.id;
      const amount = req.body.amount;
      const paymethod = req.body.paymethod;
      const paydetails = req.body.paydetails;
      const cancelresion = req.body.cancelresion;
      if(!amount){
        return res.status(400).json("Amount required");
      }
      if(!paymethod){
        return res.status(400).json("paymethod required");
      }
      if(!paydetails){
        return res.status(400).json("paydetails required");
      }
      const withdrawal = {
        amount: amount,
        paymethod: paymethod,
        paydetails: paydetails,
        cancelresion: cancelresion,
        userId: userid,
      };
      const withdrawaldata = new Withdrawalrequest(withdrawal);
      withdrawaldata.save().then((result) => {
        sgMail.setApiKey(
          "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"
        );
        const msg = {
          to: "info@esports4g.com",
          from: "info@esports4g.com", // Change to your verified sender
          subject: "New withdrawal request",
          text: "Withdrawal request",
          html: `
              <p style="color:green;"> Hi,
              The seller, ${username}, with ID number ${id} desires to withdraw Rs ${amount}. Please continue with the next steps.</p>  `,
        };
        sgMail.send(msg).then(() => {
          console.log("Email sent");
        });
        return res.status(200).json("Request send sucessfully");
      });
    } catch (error) {
      console.log(error);
    }
  }
  async withdrawallist(req, res) {
    try {
      const data = await Withdrawalrequest.find().sort({_id:-1});
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  async sellerwithdrawallist(req, res) {
    const userid = req.params.id;
    try {
      const data = await Withdrawalrequest.find({ userId: userid });
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  async addpaymentmethodstatus(req, res) {
    const paymentgatewaydata = req.body.paymentmethod;
    try {
      const data = {
        paymentgateway: paymentgatewaydata,
      };
      const paymethod = new Withdrawalwallet(data);
      paymethod.save();
      return res.status(200).json("Save payment status methode successfully");
    } catch (error) {
      console.log(error);
    }
  }
  async updatepaymentmethodstatus(req, res) {
    const id = "62440059fbaad8fd510a8a4e";
    const walletstatus = req.body.walletstatus;
    const paypalstatus = req.body.paypalstatus;
    try {
      const data = {};
      data.walletstatus = walletstatus;
      data.paypalstatus = paypalstatus;
      await Withdrawalwallet.findByIdAndUpdate(id, data);
      return res.status(200).json("update payment status methode successfully");
    } catch (error) {
      console.log(error);
    }
  }
  async addpaymentmethod(req, res) {
    const paymentgateway = req.body.paymentgateway;
    const paymentgatewaykey = req.body.paymentgatewaykey;
    const paymentgatewaysecretkey = req.body.paymentgatewaysecretkey;
    const payementfee = req.body.payementfee;
    const payementfeegst = req.body.payementfeegst;
    const payementfixamountfee = req.body.payementfixamountfee;
    const payementfixamountfeegst = req.body.payementfixamountfeegst;
    const status = req.body.status;
    try {
      const data = {
        paymentgateway: paymentgateway,
        paymentgatewaykey: paymentgatewaykey,
        paymentgatewaysecretkey: paymentgateway,
        paymentgatewaysecretkey: paymentgatewaysecretkey,
        payementfee: payementfee,
        payementfeegst: payementfeegst,
        payementfixamountfee: payementfixamountfee,
        payementfixamountfeegst: payementfixamountfeegst,
        status: status,
      };
      const paymethod = new Paymentgateway(data);
      paymethod.save();
      return res.status(200).json("Save payment methode successfully");
    } catch (error) {
      console.log(error);
    }
  }
  async fetchpaymentmethods(req, res) {
    const methods = await Paymentgateway.find();
    if (methods.length < 1) {
      return res.status(400).json("No data found");
    } else {
      return res.status(200).json(methods);
    }
  }
  async editpaymentmethods(req, res) {
    const id = req.params.id;
    try {
      const methods = await Paymentgateway.findOne();
      if (!methods) {
        return res.status(400).json("No data found");
      } else {
        return res.status(200).json(methods);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updatepaymentmethod(req, res) {
    const id = req.params.id;
    const paymentgateway = req.body.paymentgateway;
    const paymentgatewaykey = req.body.paymentgatewaykey;
    const paymentgatewaysecretkey = req.body.paymentgatewaysecretkey;
    const payementfee = req.body.payementfee;
    const payementfeegst = req.body.payementfeegst;
    const payementfixamountfee = req.body.payementfixamountfee;
    const payementfixamountfeegst = req.body.payementfixamountfeegst;
    const status = req.body.status;
    try {
      const data = {};
      data.paymentgateway = paymentgateway;
      data.paymentgatewaykey = paymentgatewaykey;
      data.paymentgatewaysecretkey = paymentgatewaysecretkey;
      data.payementfee = payementfee;
      data.payementfeegst = payementfeegst;
      data.payementfixamountfee = payementfixamountfee;
      data.payementfixamountfeegst = payementfixamountfeegst;
      data.status = status;
      await Paymentgateway.findByIdAndUpdate(id, data);
      return res.status(200).json("update payment  methode successfully");
    } catch (error) {
      console.log(error);
    }
  }
  async enablepaymentsmethod(req,res){
    try{
     const data=await Paymentgateway.find({status:true});
     if(data.length<1){
       return res.status(400).json('No payment method enable')
     }else{
       return res.status(200).json(data);
     }
    }catch(error){
      console.log(error)
    }
  }
  async paymentfee(req,res){
    // console.log(req.body)
    const paymethod=req.body.paymethod;
    const price=req.body.price;
    try{
     const paymentdata=await Paymentgateway.findOne({paymentgateway:paymethod});
     const payementfee=paymentdata.payementfee;
     const payementfeegst=paymentdata.payementfeegst;
     const payementfixamountfee=paymentdata.payementfixamountfee;
     const payementfixamountfeegst=paymentdata.payementfixamountfeegst;
     if(payementfee>0 &&  payementfixamountfee>0 ){
       const paymentfeecalculation=payementfee/100*price
       const paymentfeegestcalculation=payementfeegst/100*paymentfeecalculation
       const totalfee=paymentfeecalculation+paymentfeegestcalculation;
       const paymentfixamountfeecalculation=payementfixamountfee/100*price;
       const paymentfixamountfeegestcalculation=payementfixamountfeegst/100*paymentfixamountfeecalculation;
       const totalfix=paymentfixamountfeecalculation+paymentfixamountfeegestcalculation;
       const total=totalfee+totalfix;
       var finaltotal=price+total;
      return res.status(200).json({result:finaltotal,servicefee:total});
      }
       if(payementfee>0 ){
         const paymentfeecalculation=payementfee/100*price
         const paymentfeegestcalculation=payementfeegst/100*paymentfeecalculation
        const total=paymentfeecalculation+paymentfeegestcalculation;
          const finaltotal=price+total;
         return res.status(200).json({result:finaltotal,servicefee:total});        
        }
        if(payementfixamountfee>0 ){
          const paymentfixamountfeecalculation=payementfixamountfee/100*price;
          const paymentfixamountfeegestcalculation=payementfixamountfeegst/100*paymentfixamountfeecalculation;
          const totalfix=paymentfixamountfeecalculation+paymentfixamountfeegestcalculation;
           const finaltotal=price+totalfix;
          return res.status(200).json({message:"Done",result:finaltotal,servicefee:totalfix});        
         }
         if(payementfee==0){
          return res.status(200).json({result:price,servicefee:0}); 
         }
    }catch(error){
      console.log(error)
    }
  }
  async walletrecharge(req,res){
    try{
       const userid=req.body.userId;
       const userdetails=await User.findOne({_id:userid})
       const username=userdetails.username;
       const id=userdetails.id;
       const amount=req.body.amount;
       const paymethodstatus=req.body.status;
       const paydetails=req.body.details;
       const data={
         userId:userid,
         amount:amount,
         paymethodstatus:paymethodstatus,
         paydetails:paydetails,
       }
       const walletrecharges=new Walletrecharge(data);
       walletrecharges.save().then(async(result) => {
         const walletdetails=await Wallet.findOne({userId:userid})
         const totalamount=walletdetails.total+parseInt(amount);
         const walletid=walletdetails._id;
         const walletdata={};
         walletdata.total=totalamount;
         await Wallet.findByIdAndUpdate(walletid,walletdata);
        sgMail.setApiKey(
          "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"
        );
        const msg = {
          to: "info@esports4g.com",
          from: "info@esports4g.com", // Change to your verified sender
          subject: "User Wallet Recharge",
          text: "Wallet Recharge",
          html: `
              <p style="color:green;"> Hi,
              The User, ${username}, with ID number ${id} rechagre wallet Rs ${amount}. Please continue with the next steps.</p>`,
        };
        sgMail.send(msg).then(() => {
          console.log("Email sent");
        });
      });

       return res.status(200).json('Rechagre request submit');
    }catch(error){
      console.log(error);
    }
  }
 async updatewallet(req,res){
  const id=req.params.id;
  const amount=req.body.amount;
  try{
     const walletdata=await Wallet.findOne({userId:id})
     const walletid=walletdata._id;
   const finaltotal=walletdata.total+parseInt(amount);
     const data={};
      data.total=finaltotal;
      await Wallet.findByIdAndUpdate(walletid,data).then(async(result) => {
        const userdata=await User.findOne({_id:id})
        const useremial=userdata.email;
        const userid=userdata.id;
        const username=userdata.username;
       sgMail.setApiKey(
         "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"
       );
       const msg = {
         to: useremial,
         from: "info@esports4g.com", // Change to your verified sender
         subject: "User Wallet Topup",
         text: "Wallet Topup",
         html: `
             <p style="color:green;"> Hi,
             The User, ${username}, with ID number ${userid} Topup wallet Rs ${amount}. </p>`,
       };
       sgMail.send(msg).then(() => {
         console.log("Email sent");
       });
     });
     return res.status(200).json("Wallet Update successfully");
  }catch(error){
    console.log(error)
  }
  }
  async withdrawaldatadetails(req,res){
    const id=req.params.id
    try{
        const data=await Withdrawalrequest.findOne({_id:id});
        if(!data){
          return res.status(400).json("no data found");
        }else{
          return res.status(400).json(data);
        }
    }catch(error){
      console.log(error)
    }
  }
  async payop(req,res){
    const amount=req.body.amount;
    const currency=req.body.currency;
    try{
      var length=10;
      var chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
     const order=`${amount}:${currency}:${result}:cdcd15c20ddc51b6b91f799c`;
     const crypto = require('crypto');
     const hash = crypto.createHash('sha256', '').update(order).digest('hex');
     return res.status(200).json({signature:hash,orderid:result});
    }catch(error){
      console.log(error)
    }
  }
}
module.exports = new withdrawal_walllet();
