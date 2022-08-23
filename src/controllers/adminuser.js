const Adminusers = require("../models/adminSchema");
const Metapages = require("../models/metapagesSchema");
const Adminrestriction = require("../models/adminrestrictionSchema");
const fixerrate = require("../models/fixerrateSchema");
const Homepage = require("../models/homepageSchema");
const Currency = require("../models/currencySchema");
const Landingpage = require("../models/landingpageSchema");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/Authenticate");
const mongoose = require("mongoose");
require("dotenv").config();

class Admin {
  async adminregister(req, res) {
    const { fname, lname, email, password, cpassword,admin,author,publisher,modifier } = req.body; //getting data by object destructuring

    if (!fname || !lname || !email || !password || !cpassword) {
      //adminuser should fill all feild
      return res.status(422).json({ error: "Plz fill all feild" });
    }
    try {
      const userExist = await Adminusers.findOne({ email: email }); //this connects email from userschema.js to this email from auth.js
      if (userExist) {
        return res.status(422).json({ error: "Email already exists" });
      } else if (password != cpassword) {
        return res.status(422).json({ error: "Password didnt match" });
      } else {
        const adminuser = new Adminusers({
          fname,
          lname,
          email,
          password,
          cpassword,
          admin,
          author,
          publisher,
          modifier,
        }); // adding data to database || if both key and value and are same no need to write twice
        //hashing done before save
        await adminuser.save(); //saving data in user constant
        res.status(201).json({ message: "Admin registetred sucessfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async adminlogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "Fill all field" });
    }
    try {
      const adminLogin = await Adminusers.findOne({ email, email });

      if (adminLogin) {
        console.log(adminLogin.password);
        const isMatch = await bcrypt.compare(password, adminLogin.password);
        const tokenData = {
          name: adminLogin.fname,
          email: adminLogin.email,
          id: adminLogin._id,
          admin: adminLogin.admin,
          author: adminLogin.author,
          publisher: adminLogin.publisher,
          modifier: adminLogin.modifier,
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
          expiresIn: "10h",
        });

        console.log(`the token is :- ${token}`);

        res.cookie("jwtoken", token, {
          //takes name:string and value:string(this value comes from userschema )
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true, //for secure connection
        });
        if (!isMatch) {
          return res.status(400).json({ error: "Invalied Credentials" });
        } else {
          return res.json({
            message: "Login Successfull",
            tokenData: tokenData,
            accesstoken: token,
          });
        }
      } else {
        return res.status(400).json({ error: "Invalied Credentials" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async adminlist(req, res) {
    try {
      const admindata = await Adminusers.find().sort({ _id: -1 });
      return res.status(200).json({
        success: true,
        message: "listing successfully",
        result: admindata,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async adminedit(req, res) {
    const id = req.params.id;
    try {
      const editdata = await Adminusers.findOne({ _id: id });
      if (!editdata) {
        return res.status(401).json({ error: "No data found" });
      } else {
        return res.status(200).json({ success: true, result: editdata });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateadmin(req, res) {
    console.log(req.body);
    const dataaray=JSON.parse(req.body.restriction)
    const id = req.params.id;
    const output=[];
    const restriction=req.body.restriction
    try {
      if (!req.body.fname || !req.body.lname || !req.body.email) {
        //user should fill all feild
        return res.status(422).json({ error: "plz fill all feild" });
      }
      const admin = await Adminusers.findOne({ _id: id });
      if (!admin) {
        return res.status(400).json({ error: "Admin not found" });
      } else {
        Adminusers.findById(id, async function (err, updateadmin) {
          if (err) return false;
          updateadmin.fname = req.body.fname;
          updateadmin.restrictionstatus = req.body.restrictionstatus;
          updateadmin.lname = req.body.lname;
          updateadmin.email = req.body.email;
          updateadmin.admin = req.body.admin;
          updateadmin.author = req.body.author;
          updateadmin.publisher = req.body.publisher;
          updateadmin.modifier = req.body.modifier;
          if (req.files.adminimage) {
            updateadmin.image = req.files.adminimage[0].location;
          }
          if(req.body.restriction){
             for(const set of dataaray){
                 output.push({[set]:true});
           }
           updateadmin.restrictions=output
            
          }
          
          if (req.body.currentp !== "") {
            const isMatch = await bcrypt.compare(
              req.body.currentp,
              admin.password
            );
            if (!isMatch) {
              return res
                .status(400)
                .json({ error: "current password incorrect" });
            } else {
              if (req.body.password == req.body.cpassword) {
                updateadmin.password = req.body.password;
                updateadmin.cpassword = req.body.cpassword;
              } else {
                return res
                  .status(400)
                  .json({ error: "password & confirm password is not match" });
              }
            }
          }
          updateadmin.save();
          return res
            .status(200)
            .json({ success: true, message: "Admin update sucessfully" });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deleteadmin(req, res) {
    const id = req.body.adminid;
    try {
      for await (const data of id) {
        Adminusers.findByIdAndRemove(data, (err) => {});
      }
      return res.status(200).json({
        success: true,
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async homepagedynamic(req, res) {
    // console.log(req.body)
    const bannerheading = req.body.bannerheading;
    const aboutmarketpalce = req.body.aboutmarketpalcecontaint;
    const bottomcontaint = req.body.bottomcontaint;
    try {
      const homedata = {};
      homedata.bannerheading = bannerheading;
      homedata.aboutmarketpalce = aboutmarketpalce;
      homedata.bottomcontaint = bottomcontaint;
      if (req.files) {
        homedata.bannerimage = req.files.bannerimage[0].location;
      }
      if (req.files) {
        homedata.bottomimage = req.files.bottomimage[0].location;
      }
      if (req.files) {
        homedata.aboutimage = req.files.aboutimage[0].location;
      }
      if (req.files) {
        homedata.howitsworkimage = req.files.howitsworkimage[0].location;
      }
      const resultData = await Homepage.create(homedata);
      return res.status(200).json({ message: "Save successfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async updatehome(req, res) {
    try {
      const id=req.params.id;
      const homedata = {};
      homedata.bannerheading = req.body.bannerheading;
      homedata.aboutmarketpalce = req.body.aboutmarketpalce;
      homedata.bottomcontaint = req.body.bottomcontaint;
      homedata.bannerheadinglayout = req.body.bannerheadinglayout;
      homedata.aboutmarketpalcelayout = req.body.aboutmarketpalcelayout;
      homedata.bottomcontaintlayout = req.body.bottomcontaintlayout;
      if (req.files.bannerimage) {
        homedata.bannerimage = req.files.bannerimage[0].location;
      }
      if (req.files.bottomimage) {
        homedata.bottomimage = req.files.bottomimage[0].location;
      }
      if (req.files.aboutimage) {
        homedata.aboutimage = req.files.aboutimage[0].location;
      }
      if (req.files.howitsworkimage) {
        homedata.howitsworkimage = req.files.howitsworkimage[0].location;
      }
      await Homepage.findByIdAndUpdate(id, homedata);
      return res.status(200).json({ message: "update successfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async homepagedata(req, res) {
    try {
      const data = await Homepage.findOne({ _id: "6222e6ba1b83345a1ca0b71a" });
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  async landingpagedynamic(req, res) {
    const bannerheading = req.body.bannerheading;
    const bannerheadinglayout = req.body.bannerheadinglayout;
    const bannerimagelayout = req.body.bannerimagelayout;
    const landinddata = {};
    landinddata.bannerheading = bannerheading;
    landinddata.bannerheadinglayout = bannerheadinglayout;
    landinddata.bannerimagelayout = bannerimagelayout;
    landinddata.percentagenumber = req.body.percentagenumber;
    landinddata.offerheading = req.body.offerheading;
    landinddata.bannerpara = req.body.bannerpara;
    landinddata.bannerparalayout = req.body.bannerparalayout;
    if (req.files.bannerimage) {
      landinddata.bannerimage = req.files.bannerimage[0].location;
    }
    if (req.files.bannerbackgroundimage) {
      landinddata.bannerbackgroundimage = req.files.bannerbackgroundimage[0].location;
    }
    const resultData = await Landingpage.create(landinddata);
    return res.status(200).json({ message: "Save successfully" });
  }
  async editladingpage(req, res) {
    const id = req.params.id;
    try {
      const data = await Landingpage.findOne({ _id: id });
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchladingpage(req, res) {
    const id = req.params.id;
    try {
      const data = await Landingpage.findOne({});
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  async updatelanding(req, res) {
    const id = req.params.id;
    console.log(req.body);
    try {
      const landinddata = {};
      landinddata.bannerheading = req.body.bannerheading;
      landinddata.bannerheadinglayout = req.body.bannerheadinglayout;
      landinddata.bannerimagelayout = req.body.bannerimagelayout;
      landinddata.bannerimageenable = req.body.bannerimageenable;
      landinddata.percentagenumber = req.body.percentagenumber;
      landinddata.offerheading = req.body.offerheading;
      landinddata.offerbannerenable = req.body.offerbannerenable;
      landinddata.bannerheadingenable = req.body.bannerheadingenable;
      landinddata.topheading = req.body.topheading;
      landinddata.divenable=req.body.divenable;
      landinddata.seotopheading = req.body.seotopheading;
      landinddata.bannerpara = req.body.bannerpara;
      landinddata.bannerparalayout = req.body.bannerparalayout;
      landinddata.bannerparaenable = req.body.bannerparaenable;
      // landinddata.bottomcontaintlayout=req.body.bottomcontaintlayout;
      if (req.files.bannerimage) {
        landinddata.bannerimage = req.files.bannerimage[0].location;
      }
      if (req.files.bannerbackgroundimage) {
        landinddata.bannerbackgroundimage = req.files.bannerbackgroundimage[0].location;
      }
      if (req.files.topimage) {
        landinddata.topimage = req.files.topimage[0].location;
      }
      await Landingpage.findByIdAndUpdate(id, landinddata);
      return res.status(200).json({ message: "update successfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async addrestriction(req,res){
    try{
       const restriction=req.body.restriction;
       const data={
        restriction:restriction
       }
       const adddata=new Adminrestriction(data);
       adddata.save().then((result)=>{
         return res.status(200).json('Add successfully');
       });
    }catch(error){
      console.log(error)
    }
  }
  async allrestrictions(req,res){
    try{
     const data=await Adminrestriction.find();
     return res.status(200).json(data);
    }catch(error){
      console.log(error)
    }
  }
  async addmetapages(req,res){
    try{
     const metatitle=req.body.metatitle;
     const metakeyword=req.body.metakeyword;
     const metadescription=req.body.metadescription;
     const pagename=req.body.pagename;
     const data={
      metatitle:metatitle,
      metakeyword:metakeyword,
      metadescription:metadescription,
      pagename:pagename
    }
    const savedata=new Metapages(data);
    savedata.save().then((result)=>{
      return res.status(200).json('Data save successfully');
    });
    }catch(error){
      console.log(error)
    }
  }
  async editmetapages(req,res){
    const id=req.params.id;
    try{
    const data=await Metapages.findOne({_id:id});
    if(!data){
      return res.status(404).json('Nod data found')
    }else{
      return res.status(200).json(data) 
    }
    }catch(error){
      console.log(error)
    }

  }async fetchmatapages(req,res){
    const id=req.params.id;
    try{
      const data=await Metapages.findOne({pagename:id});
      if(!data){
        return res.status(404).json('Nod data found')
      }else{
        return res.status(200).json(data) 
      }
    }catch(error){
      console.log(error)
    }
  }
  async updatemetapages(req,res){
    const id=req.params.id;
    try{
     const metatitle=req.body.metatitle;
     const metakeyword=req.body.metakeyword;
     const metadescription=req.body.metadescription;
     const pagename=req.body.pagename;
     const data={}
     data.metatitle=metatitle
     data.metakeyword=metakeyword
     data.metadescription=metadescription
     data.pagename=pagename
     await Metapages.findByIdAndUpdate(id,data).then((result)=>{
      return res.status(200).json('Data Update successfully');
    });
    }catch(error){
      console.log(error)
    }
  }
  async listmetapages(req,res){
    try{
     const data=await Metapages.find();
     return res.status(200).json(data);

    }catch(error){
      console.log(error)
    }
  }
}
module.exports = new Admin();
