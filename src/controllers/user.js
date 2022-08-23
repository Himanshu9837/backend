const User = require("../models/userSchema");
const chatuser = require("../models/chatuserSchema");
const Order = require("../models/orderSchema");
const express = require("express");
const MyChat = require("../models/mychatSchema");
const jwt = require("jsonwebtoken");
const fetch = require("cross-fetch");
const verification = require("../models/sellerverficationSchema");
const Seller = require("../models/sellerSchema");
const Products = require("../models/productSchema");
const cartData = require("../models/cartSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/Authenticate");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const Emaildata = require("../models/emailverficationSchema");
const staylogin = require("../models/stayloginSchema");
const Wallet = require("../models/walletSchema");
var requestIp = require("request-ip");
const request = require("request");
const axios = require("axios");
class Users {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns  store users Data
   */

  async register(req, res) {
    console.log(req.body);
    const {
      fullname,
      username1,
      dateofbirth,
      email,
      phone,
      password,
      country,
    } = req.body; //getting data by object destructuring
    const username = username1.toLowerCase();
    try {
      const userExist = await User.findOne({ email: email }); //this connects email from userschema.js to this email from auth.js

      if (userExist) {
        return res.status(422).json({ error: "email already exists" });
        // } else if (password != cpassword) {
        //   return res.status(422).json({ error: "password did not match" });
      } else {
        const userurl = email.substring(0, email.indexOf("@"));

        const user = new User({
          fullname,
          username,
          dateofbirth,
          userurl,
          email,
          phone,
          password,
          country,
        }); // adding data to database || if both key and value and are same no need to write twice
        //hashing done before save
        await user.save(); //saving data in user constant
        const findstatus = await verification.findOne({
          _id: "61ca9d28949e9f1f89426cbe",
        });

        if (findstatus.sellerverfication == false) {
          console.log("hii");
          const sellerData = {
            termcondition: "accepted",
            sellerapprovalstatus: true,
            userId: mongoose.Types.ObjectId(user._id),
          };
          const resultData = await Seller.create(sellerData).then(
            (result) => {}
          );
        }
        const walletdata = {
          total: 0,
          userId: mongoose.Types.ObjectId(user._id),
        };
        const resultWallet = await Wallet.create(walletdata).then(
          (result) => {}
        );
        const chatdata = {
          userId: mongoose.Types.ObjectId(user._id),
        };
        const resultchat = await chatuser.create(chatdata).then((result) => {});

        const data = await User.find({}).sort({ _id: -1 }).limit(1);
        const useremail = data[0].email;
        const userename = data[0].username;
        sgMail.setApiKey(
          "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"
        );
        const msg = {
          to: useremail,
          from: "info@esports4g.com", // Change to your verified sender
          subject: "Registration successful",
          text: "Registration successful ",
          html: ` 
          <!DOCTYPE HTML>
          <html>
          <body style="
           margin:0;
           padding:0;
           background:#000000;
           padding: 3rem 0 3rem 0;
           ">
           <div
          class="emailtemplate"
          style="
          position:relative;
          font-family: sans-serif
          "
          >
          <div style="text-align: center;
          background:#fff;
          width:50%;
          margin:auto;
          ">
          <img
          src="https://esports-user-images.s3.ap-south-1.amazonaws.com/image-1660043978540.jpeg"
          style="
            width: 100%;
          "
          />
          <div style="
              height: 1px;
              width: 100%;
              background: #000;
          "></div>
          </div>
          <div style="text-align: center;
          background:#ffffff;
          width:50%;
          margin:auto;
          padding: 5rem 0 1rem 0;
          ">
          <h3
          style="color: #000;
          text-align: center;
          font-size: 20px;
          margin: 15px 0;
           color: #FF8000;
          "
          >
          Welcome
           <span style="color:#5F5F5F;">to</span>
            <span style="color:#5F5F5F;
            font-weight: 700;
            font-size: 20px;
            ">ESPORTS4G</span>
          </h3>
          <p style="
              font-size: 14px;
              color: #5F5F5F;
              margin-top: 2rem;
              text-align: center;
          ">${userename},<br>
              <span style="font-size:16px;
              color: #5F5F5F;
              font-weight: 700;
              ">Username</span>
          </p>
          </div>
          <div
          style="
          text-align: center;
          background:#F4F4F3;
          width:50%;
          margin:auto;
          padding: 1px 0;
          "
          >
          <p
          style="font-size: 14px;
          font-weight: 200;
          text-align: center;
          padding: 2rem;
          margin: 0;
          color: #5F5F5F;
          "
          >
          Welcome to a platform where you can find your favourite game with customized accounts, whether from your favourite seller or at a low price!
          We can't wait for you to go on a tour of the website and find yourself some fantastic stuff
          </p>
          
          </div>
          <div style="
          background-color: #fff;
              width: 50%;
              text-align: center;
              margin: auto;
              padding: 1px 0;
          ">
              <div style="
              
    margin: 1.5rem auto;
    align-items: center;
              ">
                  <p style="
                   font-size: 14px;
                   color: #5F5F5F;
                  ">See you around
                  <span>
                  <img  src="https://esports-user-images.s3.ap-south-1.amazonaws.com/image-1660049897668.jpeg"
                  style="width: 20px;
                  height: 17px;
                  padding-left: 4px;"
                  />
                  </span>
                  </p>
              </div>
              <link >
              <a href="https://esports4g.com/">
              <button style="
             border-radius: 4px;
              padding: 14px;
              background: #312641;
              border: none;
              outline: none;
              margin-top: 3rem;
              margin-bottom: 2rem;
              color: #fff;
              font-size: 14px;
              cursor: pointer;
              ">
                  Visit Website
              </button>
          </a>
          </link>
          
          </div>
          <div style="
              height: 1px;
              width: 100%;
              background: #000;
          "></div>
          <div
          style="text-align: center;
          background:#e5eaf5;
          width:50%;
          margin:auto;
          padding: 1rem 0;"
          >
          
          
          <h3 className='footer_templete'
          style="text-align: center;
          font-size: 14px;
          color: #5F5F5F;">
          THANK YOU, TEAM ESPORTS4G
          </h3>
          <h3 className='footer_templete'
          style="text-align: center;
          font-size: 12px;
          color: #5F5F5F;"
          >
          Esports4g.com. All Right Reserved.
          </h3>
          <div
          className="socialicons"
          style="
          width:170px;
          margin:auto;
          display:flex;
          
          
          "
          >
          <div className="icons" style="cursor: pointer; margin: 6px">
          <a target="_blank" href="https://www.facebook.com/Esports4G/">
          <img
          src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
          alt="not found"
          style="width: 30px; height: 30px; border-radius: 50%"
          />
          </a>
          </div>
          <div className="icons" style="cursor: pointer;
          margin: 6px;
          ">
          <Link passHref={true}>
          <a target="_blank" href="https://www.instagram.com/esports4g_com/">
          <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:30px ;
            height: 30px;
            border-radius: 50%;
           " />
          </a>
          </Link>
          </div>
          <div className="icons" style="cursor: pointer;
          margin: 6px;
          ">
          <Link passHref={true}>
          <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
          <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:30px ;
          height: 30px;
          border-radius: 50%;
          " />
          
          </a>
          </Link>
          
          </div>
          <div className="icons" style="cursor: pointer;
          margin: 6px;
          ">
          <Link passHref={true}>
          <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
          <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:30px ;
          height: 30px;
          border-radius: 50%;
          " />
          </a>
          </Link>
          </div>
          </div>
          </div>
          
          
          
          </div>
          
          </body>
          
          </html>
                    `,
        };
        sgMail.send(msg).then(() => {
          console.log("Email sent");
        });
        res.status(201).json({ message: "user registetred sucessfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    console.log(req.body);

    try {
      const { email, password, checked } = req.body; //getting email password by object destructring

      if (!email || !password) {
        return res.status(400).json({ error: "plz fill the data" });
      }
      const userLogin = await User.findOne({$or:[{email:email},{username:email}],isadmin: false });
      //  console.log(userLogin);
      
      if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password); //comparing hashed password with login passwords

        const tokenData = {};
        tokenData.name = userLogin.first_name;
        tokenData.email = userLogin.email;
        tokenData.id = userLogin._id;
        tokenData.username = userLogin.username;
        tokenData.isadmin = userLogin.isadmin;
        if (checked == true) {
          tokenData.sevendaylogin = true;
        } else {
          tokenData.sevendaylogin = false;
        }

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
          expiresIn: "10h",
        });
        if (checked == true) {
          const days = await staylogin.findOne({});
          const updatedays = days.days;
          console.log(updatedays);
          const dayscount = updatedays * 86400000;
          console.log(dayscount);
          const date = Date.now() + dayscount;
          console.log(date);
          const staytoken = {};
          staytoken.resetToken = token;
          staytoken.expireToken = date;
          await User.findByIdAndUpdate(userLogin._id, staytoken);
        } else {
          const date = Date.now() + 3600000;
          console.log(date);
          const staytoken = {};
          staytoken.resetToken = token;
          staytoken.expireToken = date;
          await User.findByIdAndUpdate(userLogin._id, staytoken);
        }
        console.log(`the token is :- ${token}`);

        res.cookie("jwtoken", token, {
          //takes name:string and value:string(this value comes from userschema )
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true, //for secure connection
        });

        if (!isMatch) {
          res.status(400).json({ error: "Invalid Credentials " }); //dono me invalid credential he dena hai taaki hacker ko pata na chale
        } else {
          const updateuserlogin = {};
          updateuserlogin.lastlogin = Date.now() + 10000;
          updateuserlogin.onlinestatus = true;
          await User.findByIdAndUpdate(userLogin._id, updateuserlogin);

          res.json({
            message: "user signin sucessfully",
            tokenData: tokenData,
            accesstoken: token,
          });
        }
      } else {
        res.status(400).json({ error: "Invalid Credentials" }); //dono me invalid credential he dena hai
      }
    } catch (error) {
      console.log(error);
    }
  }
  async check(req, res) {
    res.redirect("/home");
  }
  async fetchUser(req, res) {
    try {
      const datearry = [];
      const users = await User.find().sort({ _id: -1 });
      //  console.log(users);
      if (users.length <= 0) {
        return res.status(404).json({
          success: false,
          message: "data not found",
        });
      } else {
        var clientIp = requestIp.getClientIp(req);
        const data1 = clientIp.split(":").pop();
        const res1 = await fetch(`http://ip-api.com/json/${data1}`);
        const user = await res1.json();
        var final = user;
        const time = final.timezone;
        for await (const data of users) {
          // for(let i=0;i<=users.length;i++){
          const date = data.date;
          var LocalDate = new Date(date);

          LocalDate.setMilliseconds(0);
          var options = { hour12: false };

          var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
            timeZone: time,
          });
          datearry.push(RemoteLocaleStr);
        }
        console.log(datearry);
        return res.status(200).json({
          success: true,
          message: "listing successfully",
          result: users,
          date: datearry,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong", result: err });
    }
  }

  async deleteUser(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findOne({ _id: id });
      console.log(user.email);
      const useremail = user.email;
      const emailid = await Emaildata.findOne({ email: useremail });
      const emails = await Emaildata.findByIdAndRemove({ _id: emailid._id });
      const data = await User.findByIdAndRemove({ _id: id });
      const seler = await Seller.findOne({ userId: id });
      if (seler) {
        const data1 = await Seller.findByIdAndRemove({ _id: seler._id });
      }
      const pro = await Products.find({ userId: id });
      if (pro.length > 0) {
        for await (const prodata of pro) {
          const proid = prodata._id;
          const orderdata = await Products.findByIdAndRemove({ _id: proid });
        }
      }
      const oders = await Order.find({ userId: id });
      if (oders.length > 0) {
        for await (const orderdata of oders) {
          const orderid = orderdata._id;
          const datad = await Order.findByIdAndRemove({ _id: orderid });
        }
      }
      const check = await MyChat.find({
        $or: [{ $or: [{ sender: id }, { receiver: id }] }],
      });
      if (check.length > 0) {
        for await (const chatdata of check) {
          const chatid = chatdata._id;
          const datac = await MyChat.findByIdAndRemove({ _id: chatid });
        }
      }
      const cartdata = await cartData.findOne({ userId: id });
      if (cartdata) {
        const cart = await cartData.findByIdAndRemove({ _id: cartdata._id });
      }
      return res.status(200).json("done");
    } catch (error) {
      console.log(error);
    }
  }

  async edit(req, res) {
    try {
      var id = req.params.id;
      const edituser = await User.findOne({ _id: id });
      if (edituser) {
        return res.status(200).json({
          success: true,
          message: "User find",
          result: edituser,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "data not found",
          result: false,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong", result: err });
    }
  }

  async update(req, res) {
    var id = req.params.id;
    console.log(req.body);
    if (
      !req.body.fullname ||
      !req.body.username ||
      !req.body.dateofbirth ||
      !req.body.address ||
      !req.body.zipcode ||
      !req.body.city ||
      !req.body.country ||
      !req.body.email
    ) {
      //user should fill all feild
      return res.status(422).json({ error: "plz fill all feild" });
    }
    try {
      const userExist = await User.findOne({ _id: id }); //this connects email from userschema.js to this email from auth.js

      if (!userExist) {
        return res.status(422).json({ error: "user not exists" });
      } else {
        let emails = req.body.email;
        const userurl = emails.substring(0, emails.indexOf("@"));
        //   let updatedUser = {};
        //   updatedUser.email = req.body.email;
        //   updatedUser.fname = req.body.fname;
        //   updatedUser.lname = req.body.lname;
        //   updatedUser.dateofbirth = req.body.dateofbirth;
        //   updatedUser.address = req.body.address;
        //   if(req.file){
        //   updatedUser.image=req.file.filename;}
        //   updatedUser.zipcode = req.body.zipcode;
        //   updatedUser.city = req.body.city;
        //   updatedUser.country = req.body.country;
        //   updatedUser.phone = req.body.phone;
        User.findById(id, async function (err, updatedUser) {
          if (err) return false;
          updatedUser.email = req.body.email;

          updatedUser.fullname = req.body.fullname;
          updatedUser.dateofbirth = req.body.dateofbirth;
          updatedUser.username = req.body.username;
          updatedUser.address = req.body.address;
          updatedUser.about = req.body.about;
          if (req.files.image) {
            updatedUser.image = req.files.image[0].location;
          }
          if (req.files.coverimage) {
            updatedUser.coverimage = req.files.coverimage[0].location;
          }
          if (userExist.status != req.body.status) {
            updatedUser.status = req.body.status;
            if (req.body.status == "Banned") {
              updatedUser.banstatus = true;
              updatedUser.activestatus = false;
              sgMail.setApiKey(
                "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"
              );
              const msg = {
                to: userExist.email,
                from: "info@esports4g.com", // Change to your verified sender
                subject: "User Status",
                text: "User Status ",
                html: ` <html>
                              <body
                                style="margin: 0;
                                padding:0;
                                background: #f9f9f9;
                                "
                                >
                              <div
                                            class="emailtemplate"
                                            style="
                                              position:relative;
                                              font-family: sans-serif
                                            "
                                          >
                                            <div style="text-align: center;
                                            background:#1e1e1e;
                                            width:80%;
                                            margin:auto;
                                            ">
                                              <img
                                                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                                style="height: 80px;"
                                              />
                                            </div>
                                            <div
                                              style="
                                                background: #fff;
                                                width: 80%;
                                                position:relative;
                                                margin: auto;
                                                text-align: center;
                                                padding: 2rem 0;
                                              "
                                            >
                              
                                              <h2
                                                style="font-size: 1.4rem; font-weight: 900;margin: 0;"
                                              >
                                              BLOCK STATUS
                                              </h2>
                                              <div style="width: 80%; margin: 1.5rem auto 0rem">
                                                <span
                                                  className="passowrdlink"
                                                  style="font-size: 14px; color: #a7afb9"
                                                >
                                                Your account has been blocked from Esports4g. You no longer can access your account or the website . There were some activities performed under your account which were against the guidelines of the company.
                                                </span>
                                              </div>
                              
                                              <h5 className="note" style=" font-size: 13px;
                                              text-align: center;
                                              color: #a7afb9;
                                      padding: 1rem 0;
                                              ">
                                              If any queries, please get in touch with the customer support at https://esports4g.com/
                                            </h5>
                                            </div>
                                            <div
                                            style="text-align: center;
                                            background:#e5eaf5;
                                            width:80%;
                                            margin:auto;
                                            padding: 1rem 0;"
                                            >
                              
                              
                                         <h3 className='footer_templete'
                                         style="text-align: center;
                                         font-size: 14px;
                                         color: #a7afb9;">
                                                   THANK YOU, TEAM ESPORTS4G
                                               </h3>
                                               <h3 className='footer_templete'
                                               style="text-align: center;
                                               font-size: 12px;
                                               color: #a7afb9;"
                                               >
                                                   Esports4g.com. All Right Reserved.
                                               </h3>
                                         <div
                                           className="socialicons"
                                           style="
                                           width:215px;
                                           margin:auto;
                                           display:flex;
                              
                              
                                           "
                                         >
                                           <div className="icons" style="cursor: pointer; margin: 6px">
                                             <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                               <img
                                                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                                 alt="not found"
                                                 style="width: 40px; height: 40px; border-radius: 50%"
                                               />
                                             </a>
                                           </div>
                                            <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                             height: 40px;
                                                             border-radius: 50%;
                                                            " />
                                                       </a>
                                                       </Link>
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                              
                                                       </a>
                                                       </Link>
                              
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                                                       </a>
                                                       </Link>
                                         </div>
                                       </div>
                                       </div>
                                       </div>
                              </body>
                              </html>`,
              };
              sgMail.send(msg).then(() => {
                console.log("Email sent");
              });
            } else if (req.body.status == "Active") {
              updatedUser.activestatus = true;
              sgMail.setApiKey(
                "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"
              );
              const msg = {
                to: userExist.email,
                from: "info@esports4g.com", // Change to your verified sender
                subject: "User Status",
                text: "User Status ",
                html: `<html>
                              <body
                                style="margin: 0;
                                padding:0;
                                background: #f9f9f9;
                                "
                                >
                                <div
                                            class="emailtemplate"
                                            style="
                                              position:relative;
                                              font-family: sans-serif
                                            "
                                          >
                                            <div style="text-align: center;
                                            background:#1e1e1e;
                                            width:80%;
                                            margin:auto;
                                            ">
                                              <img
                                                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                                style="height: 80px;"
                                              />
                                            </div>
                                            <div
                                              style="
                                                background: #fff;
                                                width: 80%;
                                                position:relative;
                                                margin: auto;
                                                text-align: center;
                                                padding: 2rem 0;
                                              "
                                            >
                              
                                              <h2
                                                style="font-size: 1.4rem; font-weight: 900;margin: 0;"
                                              >
                                              ACTIVE STATUS
                                              </h2>
                                              <div style="width: 80%; margin: 1.5rem auto 0rem">
                                                <span
                                                  className="passowrdlink"
                                                  style="font-size: 14px; color: #a7afb9"
                                                >
                                                Congratulations! Your account linked with email *insert email id of user* has been activated. You can now access your account and avail all the user benefits on Esports4g.
                                                </span>
                                              </div>
                              
                                              <h5 className="note" style=" font-size: 13px;
                                              text-align: center;
                                              color: #a7afb9;
                                      padding: 1rem 0;
                                              ">
                                              If any queries, please get in touch with the customer support at https://esports4g.com/
                                            </h5>
                                            </div>
                                            <div
                                            style="text-align: center;
                                            background:#e5eaf5;
                                            width:80%;
                                            margin:auto;
                                            padding: 1rem 0;"
                                            >
                              
                              
                                         <h3 className='footer_templete'
                                         style="text-align: center;
                                         font-size: 14px;
                                         color: #a7afb9;">
                                                   THANK YOU, TEAM ESPORTS4G
                                               </h3>
                                               <h3 className='footer_templete'
                                               style="text-align: center;
                                               font-size: 12px;
                                               color: #a7afb9;"
                                               >
                                                   Esports4g.com. All Right Reserved.
                                               </h3>
                                         <div
                                           className="socialicons"
                                           style="
                                           width:215px;
                                           margin:auto;
                                           display:flex;
                              
                              
                                           "
                                         >
                                           <div className="icons" style="cursor: pointer; margin: 6px">
                                             <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                               <img
                                                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                                 alt="not found"
                                                 style="width: 40px; height: 40px; border-radius: 50%"
                                               />
                                             </a>
                                           </div>
                                            <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                             height: 40px;
                                                             border-radius: 50%;
                                                            " />
                                                       </a>
                                                       </Link>
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                              
                                                       </a>
                                                       </Link>
                              
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                                                       </a>
                                                       </Link>
                                         </div>
                                       </div>
                                       </div>
                                       </div>
                              </body>
                              </html>`,
              };
              sgMail.send(msg).then(() => {
                console.log("Email sent");
              });
            }
          }
          updatedUser.zipcode = req.body.zipcode;
          updatedUser.city = req.body.city;
          updatedUser.country = req.body.country;
          updatedUser.phone = req.body.phone;
          if (req.body.currentpassword != "undefined") {
            const isMatch = await bcrypt.compare(
              req.body.currentpassword,
              userExist.password
            );

            if (!isMatch) {
              res.status(400).json({ error: "current password incorrect" });
            } else {
              if (req.body.newpasswords == req.body.cpassword) {
                const passwords = await bcrypt.hash(req.body.newpasswords, 12);
                const cpasswords = await bcrypt.hash(req.body.cpassword, 12);
                updatedUser.password = passwords;
                updatedUser.cpassword = cpasswords;
              } else {
                res
                  .status(400)
                  .json({ error: "password & confirm password is not match" });
              }
            }
          }
          //hashing done before save
          await User.findByIdAndUpdate(id, updatedUser);
          // updatedUser.save();

          return res.status(200).json({
            success: true,
            message: "user update sucessfully",
          }); //saving data in user constant
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async adminuserupdate(req, res) {
    var id = req.params.id;
    console.log(req.body);
    if (
      !req.body.fullname ||
      !req.body.username ||
      !req.body.dateofbirth ||
      !req.body.address ||
      !req.body.zipcode ||
      !req.body.city ||
      !req.body.country ||
      !req.body.email
    ) {
      //user should fill all feild
      return res.status(422).json({ error: "plz fill all feild" });
    }
    try {
      const userExist = await User.findOne({ _id: id }); //this connects email from userschema.js to this email from auth.js

      if (!userExist) {
        return res.status(422).json({ error: "user not exists" });
      } else {
        let emails = req.body.email;
        const userurl = emails.substring(0, emails.indexOf("@"));
        //   let updatedUser = {};
        //   updatedUser.email = req.body.email;
        //   updatedUser.fname = req.body.fname;
        //   updatedUser.lname = req.body.lname;
        //   updatedUser.dateofbirth = req.body.dateofbirth;
        //   updatedUser.address = req.body.address;
        //   if(req.file){
        //   updatedUser.image=req.file.filename;}
        //   updatedUser.zipcode = req.body.zipcode;
        //   updatedUser.city = req.body.city;
        //   updatedUser.country = req.body.country;
        //   updatedUser.phone = req.body.phone;
        User.findById(id, async function (err, updatedUser) {
          if (err) return false;
          updatedUser.email = req.body.email;

          updatedUser.fullname = req.body.fullname;
          updatedUser.dateofbirth = req.body.dateofbirth;
          updatedUser.username = req.body.username;
          updatedUser.address = req.body.address;
          if (req.files.image) {
            updatedUser.image = req.files.image[0].location;
          }
          if (req.files.coverimage) {
            updatedUser.coverimage = req.files.coverimage[0].location;
          }
          if (userExist.status != req.body.status) {
            updatedUser.status = req.body.status;
            if (req.body.status == "Unactive") {
              updatedUser.banstatus = true;
              updatedUser.activestatus = false;
              sgMail.setApiKey(
                "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"
              );
              const msg = {
                to: userExist.email,
                from: "info@esports4g.com", // Change to your verified sender
                subject: "User Status",
                text: "User Status ",
                html: ` <html>
                              <body
                                style="margin: 0;
                                padding:0;
                                background: #f9f9f9;
                                "
                                >
                              <div
                                            class="emailtemplate"
                                            style="
                                              position:relative;
                                              font-family: sans-serif
                                            "
                                          >
                                            <div style="text-align: center;
                                            background:#1e1e1e;
                                            width:80%;
                                            margin:auto;
                                            ">
                                              <img
                                                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                                style="height: 80px;"
                                              />
                                            </div>
                                            <div
                                              style="
                                                background: #fff;
                                                width: 80%;
                                                position:relative;
                                                margin: auto;
                                                text-align: center;
                                                padding: 2rem 0;
                                              "
                                            >
                              
                                              <h2
                                                style="font-size: 1.4rem; font-weight: 900;margin: 0;"
                                              >
                                              BLOCK STATUS
                                              </h2>
                                              <div style="width: 80%; margin: 1.5rem auto 0rem">
                                                <span
                                                  className="passowrdlink"
                                                  style="font-size: 14px; color: #a7afb9"
                                                >
                                                Your account has been blocked from Esports4g. You no longer can access your account or the website . There were some activities performed under your account which were against the guidelines of the company.
                                                </span>
                                              </div>
                              
                                              <h5 className="note" style=" font-size: 13px;
                                              text-align: center;
                                              color: #a7afb9;
                                      padding: 1rem 0;
                                              ">
                                              If any queries, please get in touch with the customer support at https://esports4g.com/
                                            </h5>
                                            </div>
                                            <div
                                            style="text-align: center;
                                            background:#e5eaf5;
                                            width:80%;
                                            margin:auto;
                                            padding: 1rem 0;"
                                            >
                              
                              
                                         <h3 className='footer_templete'
                                         style="text-align: center;
                                         font-size: 14px;
                                         color: #a7afb9;">
                                                   THANK YOU, TEAM ESPORTS4G
                                               </h3>
                                               <h3 className='footer_templete'
                                               style="text-align: center;
                                               font-size: 12px;
                                               color: #a7afb9;"
                                               >
                                                   Esports4g.com. All Right Reserved.
                                               </h3>
                                         <div
                                           className="socialicons"
                                           style="
                                           width:215px;
                                           margin:auto;
                                           display:flex;
                              
                              
                                           "
                                         >
                                           <div className="icons" style="cursor: pointer; margin: 6px">
                                             <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                               <img
                                                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                                 alt="not found"
                                                 style="width: 40px; height: 40px; border-radius: 50%"
                                               />
                                             </a>
                                           </div>
                                            <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                             height: 40px;
                                                             border-radius: 50%;
                                                            " />
                                                       </a>
                                                       </Link>
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                              
                                                       </a>
                                                       </Link>
                              
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                                                       </a>
                                                       </Link>
                                         </div>
                                       </div>
                                       </div>
                                       </div>
                              </body>
                              </html>`,
              };
              sgMail.send(msg).then(() => {
                console.log("Email sent");
              });
            } else if (req.body.status == "Active") {
              updatedUser.activestatus = true;
              sgMail.setApiKey(
                "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"
              );
              const msg = {
                to: userExist.email,
                from: "info@esports4g.com", // Change to your verified sender
                subject: "User Status",
                text: "User Status ",
                html: `<html>
                              <body
                                style="margin: 0;
                                padding:0;
                                background: #f9f9f9;
                                "
                                >
                                <div
                                            class="emailtemplate"
                                            style="
                                              position:relative;
                                              font-family: sans-serif
                                            "
                                          >
                                            <div style="text-align: center;
                                            background:#1e1e1e;
                                            width:80%;
                                            margin:auto;
                                            ">
                                              <img
                                                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                                style="height: 80px;"
                                              />
                                            </div>
                                            <div
                                              style="
                                                background: #fff;
                                                width: 80%;
                                                position:relative;
                                                margin: auto;
                                                text-align: center;
                                                padding: 2rem 0;
                                              "
                                            >
                              
                                              <h2
                                                style="font-size: 1.4rem; font-weight: 900;margin: 0;"
                                              >
                                              ACTIVE STATUS
                                              </h2>
                                              <div style="width: 80%; margin: 1.5rem auto 0rem">
                                                <span
                                                  className="passowrdlink"
                                                  style="font-size: 14px; color: #a7afb9"
                                                >
                                                Congratulations! Your account linked with email *insert email id of user* has been activated. You can now access your account and avail all the user benefits on Esports4g.
                                                </span>
                                              </div>
                              
                                              <h5 className="note" style=" font-size: 13px;
                                              text-align: center;
                                              color: #a7afb9;
                                      padding: 1rem 0;
                                              ">
                                              If any queries, please get in touch with the customer support at https://esports4g.com/
                                            </h5>
                                            </div>
                                            <div
                                            style="text-align: center;
                                            background:#e5eaf5;
                                            width:80%;
                                            margin:auto;
                                            padding: 1rem 0;"
                                            >
                              
                              
                                         <h3 className='footer_templete'
                                         style="text-align: center;
                                         font-size: 14px;
                                         color: #a7afb9;">
                                                   THANK YOU, TEAM ESPORTS4G
                                               </h3>
                                               <h3 className='footer_templete'
                                               style="text-align: center;
                                               font-size: 12px;
                                               color: #a7afb9;"
                                               >
                                                   Esports4g.com. All Right Reserved.
                                               </h3>
                                         <div
                                           className="socialicons"
                                           style="
                                           width:215px;
                                           margin:auto;
                                           display:flex;
                              
                              
                                           "
                                         >
                                           <div className="icons" style="cursor: pointer; margin: 6px">
                                             <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                               <img
                                                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                                 alt="not found"
                                                 style="width: 40px; height: 40px; border-radius: 50%"
                                               />
                                             </a>
                                           </div>
                                            <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                             height: 40px;
                                                             border-radius: 50%;
                                                            " />
                                                       </a>
                                                       </Link>
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                              
                                                       </a>
                                                       </Link>
                              
                                                   </div>
                                                   <div className="icons" style="cursor: pointer;
                                                   margin: 6px;
                                                  ">
                                                       <Link passHref={true}>
                                                       <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                           <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                           height: 40px;
                                                           border-radius: 50%;
                                                          " />
                                                       </a>
                                                       </Link>
                                         </div>
                                       </div>
                                       </div>
                                       </div>
                              </body>
                              </html>`,
              };
              sgMail.send(msg).then(() => {
                console.log("Email sent");
              });
            }
          }

          updatedUser.zipcode = req.body.zipcode;
          updatedUser.city = req.body.city;
          updatedUser.country = req.body.country;
          updatedUser.phone = req.body.phone;
          if (req.body.currentpassword != "undefined") {
            const isMatch = await bcrypt.compare(
              req.body.currentpassword,
              userExist.password
            );

            if (!isMatch) {
              res.status(400).json({ error: "current password incorrect" });
            } else {
              if (req.body.newpasswords == req.body.cpassword) {
                const passwords = await bcrypt.hash(req.body.newpasswords, 12);
                const cpasswords = await bcrypt.hash(req.body.cpassword, 12);
                updatedUser.password = passwords;
                updatedUser.cpassword = cpasswords;
              } else {
                res
                  .status(400)
                  .json({ error: "password & confirm password is not match" });
              }
            }
          }
          //hashing done before save
          await User.findByIdAndUpdate(id, updatedUser);
          // updatedUser.save();

          return res.status(200).json({
            success: true,
            message: "user update sucessfully",
          }); //saving data in user constant
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async profileUser(req, res) {
    let url = req.params.id;
    try {
      const userProfile = await User.findOne({ username: url });
      if (!userProfile) {
        return res.status(401).json({ message: "No user found" });
      } else {
        return res
          .status(200)
          .json({ message: "User found", success: true, result: userProfile });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async forgetpassword(req, res) {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res
            .status(422)
            .json({ error: "User dont exists with that email" });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then((result) => {
          sgMail.setApiKey(
            "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"
          );
          const msg = {
            to: user.email,
            from: "info@esports4g.com", // Change to your verified sender
            subject: "Change password/ reset password",
            text: "Change password/ reset password",
            html: `
            <body style="background:#e1e5e8;
            margin:0px;
            ">
            <div
              class="emailtemplate"
              style="
                position:relative;
                font-family: sans-serif
              "
            >
              <div style="text-align: center;
              background:#1e1e1e;
              width:80%;
              margin:auto;
              ">
                <img
                  src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                  style="height: 80px;"
                />
              </div>
              <div
                style="
                  background: #fff;
                  width: 80%;
                  position:relative;
                  margin: auto;
                  text-align: center;
                "
              >
                <div class="innerimage" style="position: absolute;
                top: 0;
                left: 50%;
                padding-top:20px;
                transform: translateX(-50%);">
                  <img
                    src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657541624717.jpeg"
                    alt="not-found"
                    style="width: 160px"
                  />
                </div>
                <h2
                  style="font-size: 1.4rem; font-weight: 900;margin-top:6rem;"
                >
                  Forgot your password?
                </h2>
                <div style="width: 80%; margin: 1.5rem auto 4rem">
                  <span
                    className="passowrdlink"
                    style="font-size: 14px; color: #a7afb9"
                  >
                    Hi, Sorry to hear you’re having trouble logging into your Esports4g
                    account. If this was you, you can get right back into your account
                    by resetting your password now.
                  </span>
                </div>
                <a
                  style="
                    text-decoration: none;
                    color: #fff;
                    background: #000;
                    padding: 1rem 3rem;
                    width: 100%;
                  "
                  href="http://206.189.136.28:3010/resetpassword/${token}"
                >
                  Rest Your Password
                </a>
                <h5 className="note" style=" font-size: 13px;
                text-align: center;
                color: #a7afb9;
        padding: 1rem 0;
                ">
                  Please ignore the email if you did not submit the request.
              </h5>
              </div>
              <h3 className='footer_templete'
              style="text-align: center;
              font-size: 14px;
              color: #a7afb9;">
                        THANK YOU, TEAM ESPORTS4G
                    </h3>
                    <h3 className='footer_templete'
                    style="text-align: center;
                    font-size: 12px;
                    color: #a7afb9;"
                    >
                        Esports4g.com. All Right Reserved.
                    </h3>
              <div
                className="socialicons"
                style="
                width:215px;
                margin:auto;
                display:flex;
                
                "
              >
                <div className="icons" style="cursor: pointer; margin: 6px">
                  <a target="_blank" href="https://www.facebook.com/Esports4G/">
                    <img
                      src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                      alt="not found"
                      style="width: 40px; height: 40px; border-radius: 50%"
                    />
                  </a>
                </div>
                 <div className="icons" style="cursor: pointer;
                        margin: 6px;
                       ">
                            <Link passHref={true}>
                            <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                  height: 40px;
                                  border-radius: 50%;
                                 " />
                            </a>
                            </Link>
                        </div>
                        <div className="icons" style="cursor: pointer;
                        margin: 6px;
                       ">
                            <Link passHref={true}>
                            <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                height: 40px;
                                border-radius: 50%;
                               " />
        
                            </a>
                            </Link>
        
                        </div>
                        <div className="icons" style="cursor: pointer;
                        margin: 6px;
                       ">
                            <Link passHref={true}>
                            <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                height: 40px;
                                border-radius: 50%;
                               " />
                            </a>
                            </Link>
              </div>
            </div>
          </body>
            `,
          };
          sgMail.send(msg).then(() => {
            console.log("Email sent");
            return res.status(200).json("Email send");
          });
        });
      });
    });
  }
  async newpassword(req, res) {
    const newPassword = req.body.password;
    const cPassword = req.body.cpassword;
    const sentToken = req.params.token;
    if (newPassword == cPassword) {
      User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then((user) => {
          if (!user) {
            return res.status(422).json({ error: "Try again session expired" });
          }
          user.password = newPassword;
          user.cpassword = cPassword;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user.save().then((saveduser) => {
            res.json({ message: "password updated success" });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return res
        .status(400)
        .json("New password & Current password is not match");
    }
  }
  async updatecheckoutaddress(req, res) {
    const id = req.params.id;
    try {
      const updateaddress = await User.findOne({ _id: id });
      if (!updateaddress) {
        return res.status.json({ error: "User not found" });
      } else {
        const updateaddress = {};
        if (req.body.address) {
          updateaddress.address = req.body.address;
        }
        if (req.bod.city) {
          updateaddress.city = req.body.city;
        }
        if (req.body.country) updateaddress.country = req.body.country;
      }
      if (req.body.phone) {
        updateaddress.phone = req.body.phone;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async multipledelete(req, res) {
    console.log(req.body);
    const userid = req.body.userid;
    try {
      for await (const id of userid) {
        const user = await User.findOne({ _id: id });
        console.log(user.email);
        const useremail = user.email;
        const emailid = await Emaildata.findOne({ email: useremail });
        const emails = await Emaildata.findByIdAndRemove({ _id: emailid._id });
        const data = await User.findByIdAndRemove({ _id: id });
        const seler = await Seller.findOne({ userId: id });
        if (seler) {
          const data1 = await Seller.findByIdAndRemove({ _id: seler._id });
        }
        const pro = await Products.find({ userId: id });
        if (pro.length > 0) {
          for await (const prodata of pro) {
            const proid = prodata._id;

            const data = await Products.findByIdAndRemove({ _id: proid });
          }
        }
        const oders = await Order.find({ userId: id });
        if (oders.length > 0) {
          for await (const orderdata of oders) {
            const orderid = orderdata._id;
            const datad = await Order.findByIdAndRemove({ _id: orderid });
          }
        }
        const check = await MyChat.find({
          $or: [{ $or: [{ sender: id }, { receiver: id }] }],
        });
        if (check.length > 0) {
          for await (const chatdata of check) {
            const chatid = chatdata._id;
            const datac = await MyChat.findByIdAndRemove({ _id: chatid });
          }
        }
        const cartdata = await cartData.findOne({ userId: id });
        if (cartdata) {
          const cart = await cartData.findByIdAndRemove({ _id: cartdata._id });
        }
      }

      return res.status(200).json({
        success: true,
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async changestatus(req, res) {
    console.log(req.body);
    const status = req.body.status;
    const id = req.body.userid;
    try {
      for await (const data of id) {
        const userProfile = await User.findOne({ _id: data });
        if (userProfile.status != status) {
          let updatedata = {};
          updatedata.status = status;
          if (req.body.status == "Unactive") {
            updatedata.banstatus = true;
            updatedata.activestatus = false;
            sgMail.setApiKey(
              "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"
            );
            const msg = {
              to: userProfile.email,
              from: "info@esports4g.com", // Change to your verified sender
              subject: "User Status",
              text: "User Status ",
              html: ` <html>
                          <body
                            style="margin: 0;
                            padding:0;
                            background: #f9f9f9;
                            "
                            >
                          <div
                                        class="emailtemplate"
                                        style="
                                          position:relative;
                                          font-family: sans-serif
                                        "
                                      >
                                        <div style="text-align: center;
                                        background:#1e1e1e;
                                        width:80%;
                                        margin:auto;
                                        ">
                                          <img
                                            src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                            style="height: 80px;"
                                          />
                                        </div>
                                        <div
                                          style="
                                            background: #fff;
                                            width: 80%;
                                            position:relative;
                                            margin: auto;
                                            text-align: center;
                                            padding: 2rem 0;
                                          "
                                        >
                          
                                          <h2
                                            style="font-size: 1.4rem; font-weight: 900;margin: 0;"
                                          >
                                          BLOCK STATUS
                                          </h2>
                                          <div style="width: 80%; margin: 1.5rem auto 0rem">
                                            <span
                                              className="passowrdlink"
                                              style="font-size: 14px; color: #a7afb9"
                                            >
                                            Your account has been blocked from Esports4g. You no longer can access your account or the website . There were some activities performed under your account which were against the guidelines of the company.
                                            </span>
                                          </div>
                          
                                          <h5 className="note" style=" font-size: 13px;
                                          text-align: center;
                                          color: #a7afb9;
                                  padding: 1rem 0;
                                          ">
                                          If any queries, please get in touch with the customer support at https://esports4g.com/
                                        </h5>
                                        </div>
                                        <div
                                        style="text-align: center;
                                        background:#e5eaf5;
                                        width:80%;
                                        margin:auto;
                                        padding: 1rem 0;"
                                        >
                          
                          
                                     <h3 className='footer_templete'
                                     style="text-align: center;
                                     font-size: 14px;
                                     color: #a7afb9;">
                                               THANK YOU, TEAM ESPORTS4G
                                           </h3>
                                           <h3 className='footer_templete'
                                           style="text-align: center;
                                           font-size: 12px;
                                           color: #a7afb9;"
                                           >
                                               Esports4g.com. All Right Reserved.
                                           </h3>
                                     <div
                                       className="socialicons"
                                       style="
                                       width:215px;
                                       margin:auto;
                                       display:flex;
                          
                          
                                       "
                                     >
                                       <div className="icons" style="cursor: pointer; margin: 6px">
                                         <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                           <img
                                             src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                             alt="not found"
                                             style="width: 40px; height: 40px; border-radius: 50%"
                                           />
                                         </a>
                                       </div>
                                        <div className="icons" style="cursor: pointer;
                                               margin: 6px;
                                              ">
                                                   <Link passHref={true}>
                                                   <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                       <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                         height: 40px;
                                                         border-radius: 50%;
                                                        " />
                                                   </a>
                                                   </Link>
                                               </div>
                                               <div className="icons" style="cursor: pointer;
                                               margin: 6px;
                                              ">
                                                   <Link passHref={true}>
                                                   <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                       <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                       height: 40px;
                                                       border-radius: 50%;
                                                      " />
                          
                                                   </a>
                                                   </Link>
                          
                                               </div>
                                               <div className="icons" style="cursor: pointer;
                                               margin: 6px;
                                              ">
                                                   <Link passHref={true}>
                                                   <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                       <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                       height: 40px;
                                                       border-radius: 50%;
                                                      " />
                                                   </a>
                                                   </Link>
                                     </div>
                                   </div>
                                   </div>
                                   </div>
                          </body>
                          </html>`,
            };
            sgMail.send(msg).then(() => {
              console.log("Email sent");
            });
          } else if (req.body.status == "Active") {
            updatedata.activestatus = true;
            sgMail.setApiKey(
              "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"
            );
            const msg = {
              to: userProfile.email,
              from: "info@esports4g.com", // Change to your verified sender
              subject: "User Status",
              text: "User Status ",
              html: `<html>
                          <body
                            style="margin: 0;
                            padding:0;
                            background: #f9f9f9;
                            "
                            >
                            <div
                                        class="emailtemplate"
                                        style="
                                          position:relative;
                                          font-family: sans-serif
                                        "
                                      >
                                        <div style="text-align: center;
                                        background:#1e1e1e;
                                        width:80%;
                                        margin:auto;
                                        ">
                                          <img
                                            src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                            style="height: 80px;"
                                          />
                                        </div>
                                        <div
                                          style="
                                            background: #fff;
                                            width: 80%;
                                            position:relative;
                                            margin: auto;
                                            text-align: center;
                                            padding: 2rem 0;
                                          "
                                        >
                          
                                          <h2
                                            style="font-size: 1.4rem; font-weight: 900;margin: 0;"
                                          >
                                          ACTIVE STATUS
                                          </h2>
                                          <div style="width: 80%; margin: 1.5rem auto 0rem">
                                            <span
                                              className="passowrdlink"
                                              style="font-size: 14px; color: #a7afb9"
                                            >
                                            Congratulations! Your account linked with email *insert email id of user* has been activated. You can now access your account and avail all the user benefits on Esports4g.
                                            </span>
                                          </div>
                          
                                          <h5 className="note" style=" font-size: 13px;
                                          text-align: center;
                                          color: #a7afb9;
                                  padding: 1rem 0;
                                          ">
                                          If any queries, please get in touch with the customer support at https://esports4g.com/
                                        </h5>
                                        </div>
                                        <div
                                        style="text-align: center;
                                        background:#e5eaf5;
                                        width:80%;
                                        margin:auto;
                                        padding: 1rem 0;"
                                        >
                          
                          
                                     <h3 className='footer_templete'
                                     style="text-align: center;
                                     font-size: 14px;
                                     color: #a7afb9;">
                                               THANK YOU, TEAM ESPORTS4G
                                           </h3>
                                           <h3 className='footer_templete'
                                           style="text-align: center;
                                           font-size: 12px;
                                           color: #a7afb9;"
                                           >
                                               Esports4g.com. All Right Reserved.
                                           </h3>
                                     <div
                                       className="socialicons"
                                       style="
                                       width:215px;
                                       margin:auto;
                                       display:flex;
                          
                          
                                       "
                                     >
                                       <div className="icons" style="cursor: pointer; margin: 6px">
                                         <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                           <img
                                             src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                             alt="not found"
                                             style="width: 40px; height: 40px; border-radius: 50%"
                                           />
                                         </a>
                                       </div>
                                        <div className="icons" style="cursor: pointer;
                                               margin: 6px;
                                              ">
                                                   <Link passHref={true}>
                                                   <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                       <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                         height: 40px;
                                                         border-radius: 50%;
                                                        " />
                                                   </a>
                                                   </Link>
                                               </div>
                                               <div className="icons" style="cursor: pointer;
                                               margin: 6px;
                                              ">
                                                   <Link passHref={true}>
                                                   <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                       <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                       height: 40px;
                                                       border-radius: 50%;
                                                      " />
                          
                                                   </a>
                                                   </Link>
                          
                                               </div>
                                               <div className="icons" style="cursor: pointer;
                                               margin: 6px;
                                              ">
                                                   <Link passHref={true}>
                                                   <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                       <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                       height: 40px;
                                                       border-radius: 50%;
                                                      " />
                                                   </a>
                                                   </Link>
                                     </div>
                                   </div>
                                   </div>
                                   </div>
                          </body>
                          </html>`,
            };
            sgMail.send(msg).then(() => {
              console.log("Email sent");
            });
          }

          await User.findByIdAndUpdate(data, updatedata);
        }
      }
      return res.status(200).json({
        success: true,
        message: "Change status sucessfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  async emailverify(req, res) {
    const email = req.body.email;
    console.log(email);
    if (!email) {
      return res.status(400).json({ error: "plz fill Email" });
    }
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");
      Emaildata.findOne({ email: email, verifystatus: true }).then(
        async (user) => {
          if (user) {
            return res.status(422).json({ error: true });
          } else {
            const checkemail = await Emaildata.findOne({ email: email });
            if (!checkemail) {
              const date = Date.now() + 3600000;
              console.log(token);
              const user = new Emaildata({
                reset: token,
                expireToken: date,
                email: email,
              });
              console.log(user);
              user.save().then((result) => {
                sgMail.setApiKey(
                  "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"
                );
                const msg = {
                  to: email,
                  from: "info@esports4g.com", // Change to your verified sender
                  subject: "Esports Registration",
                  text: "Email verification",
                  html: `
                                    <body style="background:#e1e5e8;
                                    margin:0px;
                                    ">
                                    <div
                                      class="emailtemplate"
                                      style="
                                        position:relative;
                                        font-family: sans-serif
                                      "
                                    >
                                      <div style="text-align: center;
                                      background:#1e1e1e;
                                      width:80%;
                                      margin:auto;
                                      ">
                                        <img
                                          src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                          style="height: 80px;"
                                        />
                                      </div>
                                      <div
                                        style="
                                          background: #fff;
                                          width: 80%;
                                          position:relative;
                                          margin: auto;
                                          text-align: center;
                                          padding: 2.5rem 0;
                                        "
                                      >
                                        <div class="innerimage" style="position: absolute;
                                        top: 0;
                                        left: 50%;
                                        transform: translateX(-50%);">
                                          <img
                                            src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657602232916.jpeg"
                                            alt="not-found"
                                            style="width: 160px"
                                          />
                                        </div>
                                        <h2
                                          style="font-size: 1.4rem; font-weight: 900;margin-top:4rem;"
                                        >
                                        VERIFICATION MAIL DURING REGISTRATION
                                        </h2>
                                        <div style="width: 80%; margin: 1.5rem auto 4rem">
                                          <span
                                            className="passowrdlink"
                                            style="font-size: 14px; color: #a7afb9"
                                          >
                                          Hi,
                                          You’ve successfully signed up for an account on Esports4g.
                                          Confirm its you to proceed forward with the registration. Click here to activate your account (the link expires in 5 minutes)
                                          </span>
                                        </div>
                                        <a
                                          style="
                                            text-decoration: none;
                                            color: #fff;
                                            background: #000;
                                            padding: 1rem 3rem;
                                            width: 100%;
                                          "
                                          href="http://206.189.136.28:3010/emailverify/${token}"
                                        >
                                          Verify
                                        </a>
                                      </div>
                                      <h3 className='footer_templete'
                                      style="text-align: center;
                                      font-size: 14px;
                                      color: #a7afb9;">
                                                THANK YOU, TEAM ESPORTS4G
                                            </h3>
                                            <h3 className='footer_templete'
                                            style="text-align: center;
                                            font-size: 12px;
                                            color: #a7afb9;"
                                            >
                                                Esports4g.com. All Right Reserved.
                                            </h3>
                                      <div
                                        className="socialicons"
                                        style="
                                        width:215px;
                                        margin:auto;
                                        display:flex;
                                        
                                        "
                                      >
                                        <div className="icons" style="cursor: pointer; margin: 6px">
                                          <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                            <img
                                              src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                              alt="not found"
                                              style="width: 40px; height: 40px; border-radius: 50%"
                                            />
                                          </a>
                                        </div>
                                         <div className="icons" style="cursor: pointer;
                                                margin: 6px;
                                               ">
                                                    <Link passHref={true}>
                                                    <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                        <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                          height: 40px;
                                                          border-radius: 50%;
                                                         " />
                                                    </a>
                                                    </Link>
                                                </div>
                                                <div className="icons" style="cursor: pointer;
                                                margin: 6px;
                                               ">
                                                    <Link passHref={true}>
                                                    <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                        <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                        height: 40px;
                                                        border-radius: 50%;
                                                       " />
                                
                                                    </a>
                                                    </Link>
                                
                                                </div>
                                                <div className="icons" style="cursor: pointer;
                                                margin: 6px;
                                               ">
                                                    <Link passHref={true}>
                                                    <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                        <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                        height: 40px;
                                                        border-radius: 50%;
                                                       " />
                                                    </a>
                                                    </Link>
                                      </div>
                                    </div>
                                  </body>
                                    `,
                };
                sgMail
                  .send(msg)
                  .then(() => {
                    console.log("Email sent");
                  })
                  .catch((error) => {
                    console.error(error);
                  });
                res.json({ message: "check your email" });
              });
            } else {
              const emailid = checkemail._id;
              const date = Date.now() + 3600000;
              const user = {};
              (user.reset = token),
                (user.expireToken = date),
                (user.email = email),
                await Emaildata.findByIdAndUpdate(emailid, user).then(
                  (result) => {
                    sgMail.setApiKey(
                      "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"
                    );
                    const msg = {
                      to: email,
                      from: "info@esports4g.com", // Change to your verified sender
                      subject: "Esports Registration",
                      text: "Email verification",
                      html: `
                                        <body style="background:#e1e5e8;
                                    margin:0px;
                                    ">
                                    <div
                                      class="emailtemplate"
                                      style="
                                        position:relative;
                                        font-family: sans-serif
                                      "
                                    >
                                      <div style="text-align: center;
                                      background:#1e1e1e;
                                      width:80%;
                                      margin:auto;
                                      ">
                                        <img
                                          src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                                          style="height: 80px;"
                                        />
                                      </div>
                                      <div
                                        style="
                                          background: #fff;
                                          width: 80%;
                                          position:relative;
                                          margin: auto;
                                          text-align: center;
                                          padding: 2.5rem 0;
                                        "
                                      >
                                        <div class="innerimage" style="position: absolute;
                                        top: 0;
                                        left: 50%;
                                        transform: translateX(-50%);">
                                          <img
                                            src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657602232916.jpeg"
                                            alt="not-found"
                                            style="width: 160px"
                                          />
                                        </div>
                                        <h2
                                          style="font-size: 1.4rem; font-weight: 900;margin-top:4rem;"
                                        >
                                        VERIFICATION MAIL DURING REGISTRATION
                                        </h2>
                                        <div style="width: 80%; margin: 1.5rem auto 4rem">
                                          <span
                                            className="passowrdlink"
                                            style="font-size: 14px; color: #a7afb9"
                                          >
                                          Hi,
                                          You’ve successfully signed up for an account on Esports4g.
                                          Confirm its you to proceed forward with the registration. Click here to activate your account (the link expires in 5 minutes)
                                          </span>
                                        </div>
                                        <a
                                          style="
                                            text-decoration: none;
                                            color: #fff;
                                            background: #000;
                                            padding: 1rem 3rem;
                                            width: 100%;
                                          "
                                          href="http://206.189.136.28:3010/emailverify/${token}"
                                        >
                                          Verify
                                        </a>
                                      </div>
                                      <h3 className='footer_templete'
                                      style="text-align: center;
                                      font-size: 14px;
                                      color: #a7afb9;">
                                                THANK YOU, TEAM ESPORTS4G
                                            </h3>
                                            <h3 className='footer_templete'
                                            style="text-align: center;
                                            font-size: 12px;
                                            color: #a7afb9;"
                                            >
                                                Esports4g.com. All Right Reserved.
                                            </h3>
                                      <div
                                        className="socialicons"
                                        style="
                                        width:215px;
                                        margin:auto;
                                        display:flex;
                                        
                                        "
                                      >
                                        <div className="icons" style="cursor: pointer; margin: 6px">
                                          <a target="_blank" href="https://www.facebook.com/Esports4G/">
                                            <img
                                              src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                                              alt="not found"
                                              style="width: 40px; height: 40px; border-radius: 50%"
                                            />
                                          </a>
                                        </div>
                                         <div className="icons" style="cursor: pointer;
                                                margin: 6px;
                                               ">
                                                    <Link passHref={true}>
                                                    <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                                        <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                                          height: 40px;
                                                          border-radius: 50%;
                                                         " />
                                                    </a>
                                                    </Link>
                                                </div>
                                                <div className="icons" style="cursor: pointer;
                                                margin: 6px;
                                               ">
                                                    <Link passHref={true}>
                                                    <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                                        <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                                        height: 40px;
                                                        border-radius: 50%;
                                                       " />
                                
                                                    </a>
                                                    </Link>
                                
                                                </div>
                                                <div className="icons" style="cursor: pointer;
                                                margin: 6px;
                                               ">
                                                    <Link passHref={true}>
                                                    <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                                        <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                                        height: 40px;
                                                        border-radius: 50%;
                                                       " />
                                                    </a>
                                                    </Link>
                                      </div>
                                    </div>
                                  </body>
                                        `,
                    };
                    sgMail
                      .send(msg)
                      .then(() => {
                        console.log("Email sent");
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                    res.json({ message: "check your email" });
                  }
                );
            }
          }
        }
      );
    });
  }
  async emailsuccess(req, res) {
    const sentToken = req.params.token;
    Emaildata.findOne({ reset: sentToken, expireToken: { $gt: Date.now() } })
      .then((user) => {
        if (!user) {
          return res.status(422).json({ error: "Try again session expired" });
        }
        user.verifystatus = true;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "Email verify" });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async emailstatus(req, res) {
    const email = req.body.email;
    try {
      const status = await Emaildata.findOne({
        email: email,
        verifystatus: true,
      });
      if (!status) {
        return res.status(200).json({ message: false });
      } else {
        const emailcheck = status.verifystatus;
        return res.status(200).json({ message: emailcheck });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async emailexists(req, res) {
    const email = req.body.email;
    console.log(req.body);
    try {
      const emailcheck = await User.findOne({ email: email });
      if (!emailcheck) {
        return res.status(200).json({ message: true });
      } else {
        return res.status(200).json({ error: true });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async usernameexists(req, res) {
    const username = req.params.username;
    try {
      const usernamecheck = await User.findOne({ username: username });
      if (!usernamecheck) {
        return res.status(200).json({ message: "ok" });
      } else {
        return res.status(400).json({ error: "Username Already Exists" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async checklogin(req, res) {
    const email = req.params.email;
    try {
      User.findOne({ email: email, expireToken: { $gt: Date.now() } }).then(
        (user) => {
          if (!user) {
            return res.status(422).json(false);
          } else {
            return res.status(200).json(true);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async staylogindays(req, res) {
    const days = req.body.days;
    const id = "61fcda275b583c1a996a6f83";
    try {
      const daysdata = {};
      daysdata.days = days;
      await staylogin.findByIdAndUpdate(id, daysdata);
      return res.status(200).json({ message: "Days update successfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async timeSet(req, res) {
    var clientIp = requestIp.getClientIp(req);
    const data1 = clientIp.split(":").pop();
    const response = await axios.get(`http://ipinfo.io/${data1}/json`);
    var data = response.data;
    var final = data;
    const time = final.timezone;
    var LocalDate = new Date("2022-03-26T11:32:04.207+00:00");
    console.log(LocalDate);
    LocalDate.setMilliseconds(0);
    var options = { hour12: false };
    const LocalOffset = LocalDate.getTimezoneOffset();
    var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
      timeZone: time,
    });
    let ank = LocalDate.toLocaleString("en-US", { timeZone: time });
    console.log("your time zone " + ank);
    console.log(RemoteLocaleStr);
  }
  async userdelete(req, res) {
    const id = req.params.id;
    try {
      const data = await User.findByIdAndRemove({ _id: id });
      const seler = await Seller.findOne({ userId: id });
      const data1 = await Seller.findByIdAndRemove({ _id: seler._id });
      const pro = await Products.find({ userId: id });
      for await (const prodata of pro) {
        const proid = prodata._id;
        const data = await Products.findByIdAndRemove({ _id: proid });
      }
      const cartdata = await cartData.findOne({ userId: id });
      const cart = await cartData.findByIdAndRemove({ _id: cartdata._id });
      return res.status(200).json("done");
    } catch (error) {
      console.log(error);
    }
  }
  async updateonlinestatus(req, res) {
    const id = req.params.id;
    try {
      const chatdata = {};
      chatdata.onlinestatus = false;
      await User.findByIdAndUpdate(id, chatdata);
      return res.status(200).json("updated");
    } catch (error) {
      console.log(error);
    }
  }
  async searchuser(req, res) {
    const usename = req.params.id;
    try {
      const fetchuser = await User.find({
        $and: [
          {
            $or: [
              {
                fullname: { $regex: usename, $options: "i" },
              },
              { username: { $regex: usename, $options: "i" } },
            ],
          },
        ],
      });
      if (fetchuser.length < 1) {
        return res.status(400).json({ message: "No User found" });
      }
      return res.status(200).json(fetchuser);
    } catch (error) {
      console.log(error);
    }
  }

  async adminchatregister(req, res) {
    console.log(req.body);
    const { fullname, username, email, phone, password } = req.body; //getting data by object destructuring
    try {
      const userExist = await User.findOne({ email: email }); //this connects email from userschema.js to this email from auth.js

      if (userExist) {
        return res.status(422).json({ error: "email already exists" });
        // } else if (password != cpassword) {
        //   return res.status(422).json({ error: "password did not match" });
      } else {
        const userurl = email.substring(0, email.indexOf("@"));
        const isadmin = true;
        const user = new User({
          fullname,
          username,
          userurl,
          email,
          isadmin,
          phone,
          password,
        }); // adding data to database || if both key and value and are same no need to write twice
        //hashing done before save
        await user.save(); //saving data in user constant
        // const findstatus = await verification.findOne({
        //   _id: "61ca9d28949e9f1f89426cbe",
        // });

        // if (findstatus.sellerverfication == false) {
        //   console.log("hii");
        //   const sellerData = {
        //     termcondition: "accepted",
        //     sellerapprovalstatus: true,
        //     userId: mongoose.Types.ObjectId(user._id),
        //   };
        //   const resultData = await Seller.create(sellerData).then(
        //     (result) => {}
        //   );
        // }
        // const walletdata={
        //   total:0,
        //   userId: mongoose.Types.ObjectId(user._id),
        //   }
        // const resultWallet = await Wallet.create(walletdata).then(
        //   (result) => {}
        // );
        const chatdata = {
          userId: mongoose.Types.ObjectId(user._id),
        };
        const resultchat = await chatuser.create(chatdata).then((result) => {});

        // const data = await User.find({}).sort({ _id: -1 }).limit(1);
        // const useremail = data[0].email;
        sgMail.setApiKey(
          "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"
        );
        const msg = {
          to: "info@esports4g.com",
          from: "info@esports4g.com", // Change to your verified sender
          subject: "New Registration",
          text: "New Chat Admin Registration",
          html: ` <h4>New Chat Admin registered</h4>`,
        };

        res.status(201).json({ message: "user registetred sucessfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async adminlogin(req, res) {
    console.log(req.body);
    try {
      const { email, password } = req.body; //getting email password by object destructring
      if (!email || !password) {
        return res.status(400).json({ error: "plz fill the data" });
      }
      const userLogin = await User.findOne({ email: email, isadmin: true });
      if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password); //comparing hashed password with login passwords
        const tokenData = {};
        tokenData.name = userLogin.first_name;
        tokenData.email = userLogin.email;
        tokenData.id = userLogin._id;
        tokenData.username = userLogin.username;
        tokenData.isadmin = userLogin.isadmin;
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
          expiresIn: "10h",
        });
        console.log(`the token is :- ${token}`);
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });

        if (!isMatch) {
          res.status(400).json({ error: "Invalid Credentials " }); //dono me invalid credential he dena hai taaki hacker ko pata na chale
        } else {
          const updateuserlogin = {};
          updateuserlogin.lastlogin = Date.now() + 10000;
          updateuserlogin.onlinestatus = true;
          await User.findByIdAndUpdate(userLogin._id, updateuserlogin);
          res.json({
            message: "user signin sucessfully",
            tokenData: tokenData,
            accesstoken: token,
          });
        }
      } else {
        res.status(400).json({ error: "Invalid Credentials" }); //dono me invalid credential he dena hai
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateadminchatuser(req, res) {
    var id = req.params.id;
    console.log(req.body);
    if (
      !req.body.fullname ||
      !req.body.username ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.password
    ) {
      return res.status(422).json({ error: "plz fill all feild" });
    }
    try {
      const userExist = await User.findOne({ _id: id });

      if (!userExist) {
        return res.status(422).json({ error: "Adminuser not exists" });
      } else {
        let emails = req.body.email;
        User.findById(id, async function (err, updatedUser) {
          if (err) return false;
          updatedUser.email = req.body.email;
          updatedUser.fullname = req.body.fullname;
          updatedUser.username = req.body.username;
          if (req.files.image) {
            updatedUser.image = req.files.image[0].location;
          }
          updatedUser.phone = req.body.phone;
          if (req.body.currentpassword != "undefined") {
            const isMatch = await bcrypt.compare(
              req.body.currentpassword,
              userExist.password
            );
            if (!isMatch) {
              res.status(400).json({ error: "current password incorrect" });
            } else {
              if (req.body.newpasswords == req.body.cpassword) {
                const passwords = await bcrypt.hash(req.body.newpasswords, 12);
                const cpasswords = await bcrypt.hash(req.body.cpassword, 12);
                updatedUser.password = passwords;
                updatedUser.cpassword = cpasswords;
              } else {
                res
                  .status(400)
                  .json({ error: "password & confirm password is not match" });
              }
            }
          }
          await User.findByIdAndUpdate(id, updatedUser);
          return res.status(200).json({
            success: true,
            message: "Adminuser update sucessfully",
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deleteadminchatuser(req, res) {
    const id = req.params.id;
    try {
      const deleteadminuser = await User.findByIdAndRemove({ _id: id });
      return res.status(200).json("Deleted");
    } catch (error) {
      console.log(error);
    }
  }
  async currency(req, res) {
    const CC = require("currency-converter-lt");
    const currencyToSymbolMap = require("currency-symbol-map/map");
    let currencyConverter = new CC({
      from: "USD",
      to: "INR",
      amount: 1,
      isDecimalComma: true,
    });
    // const data = await currencyConverter.convert(1);
    // console.log(data); //or do something else
    return res.status(200).json(currencyToSymbolMap.EUR);
  }
  async updateprofileimage(req,res){
    const id=req.params.id;
    try{
      const updatedUser={}
      updatedUser.image = req.files.image[0].location;
      await User.findByIdAndUpdate(id,updatedUser).then((result)=>{
        return res.status(200).json('Profile Image Update Successfully');
      });
    }catch(error){
      console.log(error)
    }
  }
}
module.exports = new Users();
