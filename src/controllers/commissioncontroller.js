const Seller = require("../models/sellerSchema");
const order = require("../models/orderSchema");
const commission = require("../models/commissionSchema");


const User = require("../models/userSchema");
const express = require("express");

const sgMail = require("@sendgrid/mail");
const { Module } = require("module");
require("dotenv").config();

class Commission {
 async addcommission(req,res){
     try{
       const commissionpercentage=req.body.commissionpercentage;
       const applyedtotamount=req.body.applyedtotamount;
       const applyedfrom=req.body.applyedfrom
       const data={
        commissionpercentage:commissionpercentage,
        applyedtotamount:applyedtotamount,
        applyedfrom:applyedfrom
       }
       const result =new commission(data);
       result.save();
       return res.status(200).json("commission save");
     }catch(error){
         console.log(error)
     }
 }

}
module.exports= new Commission();