const Seller = require("../models/sellerSchema");
const order = require("../models/orderSchema");
const commission = require("../models/commissionSchema");
const cartData = require("../models/cartSchema");
const Wallet = require("../models/walletSchema");
const Withdrawalrequest = require("../models/withdrawalrequestSchema");
const Defaultseller = require("../models/defaultsellerSchema");
const verification = require("../models/sellerverficationSchema");
const Withdrawal = require("../models/withdrawalSchema");
const Products = require("../models/productSchema");
const User = require("../models/userSchema");
const express = require("express");
const fetch =require('cross-fetch');
const countryList = require("country-list");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const request = require("request");
var requestIp = require("request-ip");

class Sellers {
  constructor() {
    return {
      createseller: this.createseller.bind(this),
      sellerdetails: this.sellerdetails.bind(this),
      sellerlist: this.sellerlist.bind(this),
      sellerdelete: this.sellerdelete.bind(this),
      editseller: this.editseller.bind(this),
      updateseller: this.updateseller.bind(this),
      selleraproval: this.selleraproval.bind(this),
      disapproved: this.disapproved.bind(this),
      sellerverification: this.sellerverification.bind(this),
      sellerverificationstatus: this.sellerverificationstatus.bind(this),
      selleraddproducts: this.selleraddproducts.bind(this),
      sms: this.sms.bind(this),
      sellerproduct: this.sellerproduct.bind(this),
      sellerconfigupdate: this.sellerconfigupdate.bind(this),
      withdrawalverificationstatus:
        this.withdrawalverificationstatus.bind(this),
      multipledelete: this.multipledelete.bind(this),
      changeverfiystatus: this.changeverfiystatus.bind(this),
      changeuserstatus: this.changeuserstatus.bind(this),
      updatedefaultseller: this.updatedefaultseller.bind(this),
      defaultsellerdetails: this.defaultsellerdetails.bind(this),
      checkselleravailability: this.checkselleravailability.bind(this),
      updatedocuments: this.updatedocuments.bind(this),
      sellerdetailstoadmin: this.sellerdetailstoadmin.bind(this),
      sellerproductlist: this.sellerproductlist.bind(this),
      sellereditproduct: this.sellereditproduct.bind(this),
      sellerupdateProduct: this.sellerupdateProduct.bind(this),
      sellerdeleteProduct: this.sellerdeleteProduct.bind(this),
      sellersoldproduct: this.sellersoldproduct.bind(this),
      sellersoldproduct: this.sellersoldproduct.bind(this),
      searchseller: this.searchseller.bind(this),    
      updatewithdrawaldocuments: this.updatewithdrawaldocuments.bind(this),
      sellersuccessfullorder: this.sellersuccessfullorder.bind(this),
      sellerflotorders: this.sellerflotorders.bind(this), 
      sellerdashboarddetails: this.sellerdashboarddetails.bind(this),
      test: this.test.bind(this),     
    }; 
  }
  //seller create
  async createseller(req, res) {
    let id = req.body.userId;
    console.log(req.files);
    const output = [];
    const output1 = [];
    let sellerafound = await Seller.findOne({ userId: id });
    console.log(sellerafound);
    if (sellerafound == null) {
      const filedata = req.files.documents;
      for await (const file of filedata) {
        const results = file.location;
        output.push(results);
      }
      const filedata1 = req.files.identitydocuments;
      for await (const file1 of filedata1) {
        const results1 = file1.location;
        output1.push(results1);
      }
      let bodyData = req.body.data ? JSON.parse(req, body.data) : req.body;
      const sellerData = {
        termcondition: bodyData.termcondition,
        userId: mongoose.Types.ObjectId(bodyData.userId),
        documents: output,
        identitydocuments:output1,
      };
      const resultData = await Seller.create(sellerData).then(async(result) => {
        const data = await Seller.find({}).sort({ _id: -1 }).limit(1);
        const sellerid = data[0].userId;
        sgMail.setApiKey(
          "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"
        );
        const msg = {
          to: "info@esports4g.com",
          from: "info@esports4g.com", // Change to your verified sender
          subject: "New Seller Registration",
          text: "Seller Account",
          html: `
          <html>
          <body style="margin:0;padding:0;background:#f9f9f9">
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
  <div style="
  text-align: center;
  background:#003399;
  width:80%;
  margin:auto;
  padding: 3rem 0;
  ">
    <img
      src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657612417286.jpeg"
      style="height: 60px;

      "
    />
    <h3
      style="color: #fff;
      text-align: center;
      font-size: 20px;
      margin: 15px 0;"
      >
      FOR ADMIN – APPROVING USER TO SELL
      </h3>
  </div>

  <div
  style="
  text-align: center;
background:#fff;
width:80%;
margin:auto;
padding: 3rem 0;
  "
  >
   <p
   style="font-size: 16px;
   font-weight: 200;
   "
   >
     Dear user,<br/>
     A user with registration Id ${sellerid} wants to register himself as a seller on Esports4g.
    <br/>
</p>
<span
style="font-size:16px;"
>
Please give the user permission to continue.<br/>
</span>

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
          </body></html> `,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });

        res.json({ message: "Request send for approvel" });
      });
    } else {
      return res.status(401).json({ error: "seller already exist" });
    }
  }
  //seller details
  async sellerdetails(req, res) {
    const id = req.params.id;
    try {
      const sellerExsist = await Seller.findOne({ userId: id }).populate("userId");
      if (!sellerExsist) {
        return res.status(400).json({ error: "seller not found" });
      } else {
        return res.status(201).json(sellerExsist);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller list
  async sellerlist(req, res) {
    try {
      const datearry = [];
      const sellerlist = await Seller.find()
        .populate("userId")
        .sort({ _id: -1 });
      if (sellerlist.length<=0) {
        return res.status(400).json(sellerlist);
      } else {
        var clientIp = requestIp.getClientIp(req);
        const data1 = clientIp.split(":").pop();
        const res1 = await fetch(`http://ip-api.com/json/${data1}`);
        const user = await res1.json();
        var final = user;
        const time = final.timezone;
        for await (const data of sellerlist) {
          // for(let i=0;i<=users.length;i++){
          const date = data.dateCreated;
          var LocalDate = new Date(date);

          LocalDate.setMilliseconds(0);
          var options = { hour12: false };

          var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
            timeZone: time,
          });
          datearry.push(RemoteLocaleStr);
        }
        return res.status(200).json({ result: sellerlist,date:datearry });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller delete
  async sellerdelete(req, res) {
    let id = req.params.id;
    try {
      const deleteseller = await Seller.findByIdAndRemove({ _id: id });
      if (!deleteseller) {
        return res.status(400).json({ error: "Seller not deleted" });
      } else {
        return res.status(200).json({ message: "Seller Deleted Successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller edit
  async editseller(req, res) {
    let id = req.params.id;
    const finalamountdata = [];
    try {
      const sellereditdata = await Seller.findOne({ _id: id }).populate(
        "userId"
      );
      if (!sellereditdata) {
        return res.status(400).json({ error: "seller data not found" });
      } else {
        var total = 0;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const sellerorder = await order.find({
          selerId: id,order_status:'Complete',
          createdAt: {
            $gte: new Date( date ),
            $lt: new Date( firstDay )
            // $lt: new Date(d).toISOString(),
          },
        });
        console.log(sellerorder);
        for (const products of sellerorder) {
          const proid = products.productId;

          const pro = await Products.findOne({ _id: proid });

          const proamount = pro.price;

          total += proamount;
        }
        console.log(total);

        // let totalamounts = totalamount.toString();
        const commissiondata = await commission.find();
        const heighest = await commission
          .findOne({})
          .sort({ applyedtotamount: -1 })
          .limit(1);
        const minimum = await commission
          .findOne({})
          .sort({ applyedtotamount: 1 })
          .limit(1);

        const mostheighest = heighest.applyedtotamount;
        const mostpercenage = heighest.commissionpercentage;

        const mostminimum = minimum.applyedtotamount;
        const minpercenage = minimum.commissionpercentage;

        if (total >= mostheighest) {

          finalamountdata.push(heighest);
        } else if (total <= mostminimum) {
 
          finalamountdata.push(minimum);
        } else {
          for await (const comm of commissiondata) {
            if (total > comm.applyedtotamount) {
              finalamountdata.push(comm);
              break;
            }
          }
        }
        return res.status(201).json({ result: sellereditdata,commission:finalamountdata });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller update
  async updateseller(req, res) {
    let id = req.params.id;
    console.log(req.body);
    const status = req.body.status;
    const withdrawalstatus=req.body.withdrawalstatus;
    try {
      const updatedata = await Seller.findOne({ _id: id }).populate("userId");
      const userid=updatedata.userId;
      if (!updatedata) {
        return res.status(400).json({ error: "seller not found" });
      } else {
        if (!req.body.alerttext || !req.body.attentiontext) {
          return res.status(422).json({ error: "plz fill all feild" });
        }
        Seller.findById(id, async function (err, updateseller) {
          if (err) return false;
          updateseller.attentiontextarea = req.body.attentiontext;
          updateseller.alerttextarea = req.body.alerttext;
          updateseller.documentcount = req.body.documentcount;
          
            updateseller.alertbox = req.body.alertboxstatus;
            if(req.body.isverified){
              if (updatedata.isverified != req.body.isverified) {
                updateseller.isverified = req.body.isverified;
              }
            }
          //  if (req.body.status) {
            
            if (updatedata.sellerapprovalstatus != status) {
              console.log(req.body.status)
              // updateseller.sellerapproval = req.body.status;
              if (status == true) {
                
                updateseller.sellerapprovalstatus = true;
                updateseller.sellerapproval="Approved";
                
                sgMail.setApiKey(
                  "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"
                );
                const msg = {
                  to: updatedata.userId.email,
                  from: "info@esports4g.com", // Change to your verified sender
                  subject: "Seller status",
                  text: "Seller Account",
                  html: `<html>
                  <body style="margin:0;padding:0;background:#f9f9f9">
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
                  <div style="
                  text-align: center;
                  background:#003399;
                  width:80%;
                  margin:auto;
                  padding: 3rem 0;
                  ">
                    <img
                      src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657612417286.jpeg"
                      style="height: 60px;
                
                      "
                    />
                    <h3
                      style="color: #fff;
                      text-align: center;
                      font-size: 20px;
                      margin: 15px 0;"
                      >
                APPROVAL MAIL TO SELLER
                      </h3>
                  </div>
                
                  <div
                     style="
                     text-align: center;
                  background:#fff;
                  width:80%;
                  margin:auto;
                  padding: 3rem 0;
                     "
                     >
                      <p
                      style="font-size: 14px;
                      font-weight: 200;
                      "
                      >
                        Dear user,<br/>
                        This is to inform you that your request regarding selling your accounts on Esports4g has been approved.
                       <br/>
                </p>
                <span
                style="font-size:14px;"
                >
                You are now eligible to put your accounts on sale on the website.<br/>
                </span>
                <p
                style="font-size:14px;"
                >
                Sell your game accounts and secure the best possible deals only on Esports4g. Hope you enjoy the experience at Esports4g.
                </p>
                <p
                style="font-size:14px;"
                >
                For any queries, you may contact the customer support at info@esports4g.com
                </p>
                
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
                  </body></html>
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
              } else if (status == false) {
                
                updateseller.sellerapprovalstatus = false;
                updateseller.sellerapproval="Disapproved";
              
                sgMail.setApiKey(
                  "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"
                );
                const msg = {
                  to: updatedata.userId.email,
                  from: "info@esports4g.com", // Change to your verified sender
                  subject: "Seller status",
                  text: "Seller Account",
                  html: `<html>
                  <body style="margin:0;padding:0;background:#f9f9f9">
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
                  <div style="
                  text-align: center;
                  background:#003399;
                  width:80%;
                  margin:auto;
                  padding: 3rem 0;
                  ">
                    <img
                      src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657612417286.jpeg"
                      style="height: 60px;
                
                      "
                    />
                    <h3
                      style="color: #fff;
                      text-align: center;
                      font-size: 20px;
                      margin: 15px 0;"
                      >
                      DISAPPROVAL MAIL
                      </h3>
                  </div>
                
                  <div
                     style="
                     text-align: center;
                  background:#fff;
                  width:80%;
                  margin:auto;
                  padding: 3rem 0;
                     "
                     >
                      <p
                      style="font-size: 14px;
                      font-weight: 200;
                      "
                      >
                        Dear user,<br/>
                        Your request for selling your game accounts on Esports4g has been disapproved as you did not meet the eligibility criteria.
                       <br/>
                </p>
                <span
                style="font-size:14px;"
                >
                Please double-check your documentation and details before attempting again.<br/>
                </span>
                
                
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
                  </body></html>
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
              }    
          }
         
          updateseller.withdrawalapprovalstatus = req.body.withdrawalapprovalstatus;
          updateseller.withdrawalcontent=req.body.withdrawalcontent;
          updateseller.isdocuments=req.body.isdocuments;
          if(req.body.isidentitydocuments==true || req.body.isdocuments==true){
           
            updateseller.sellerapproval="Disapproved";
          }
          updateseller.isidentitydocuments=req.body.isidentitydocuments;
           updateseller.iswithdrawaldocuments=req.body.iswithdrawaldocuments;
          updateseller.iswithdrawalidentity=req.body.iswithdrawalidentity;
          updateseller.sellerRestriction = req.body.sellerrestriction;
          updateseller.sellerlistingRestriction = req.body.sellerlisting;
          updateseller.sellerwithdrawalRestriction = req.body.sellerwithdarawal;
          updateseller.documenttext = req.body.documents;
          updateseller.totaldocuments = req.body.totaldocuments;
          updateseller.save();
          const updateuser={};
          updateuser.fullname=req.body.fullname;
          updateuser.dateofbirth=req.body.dateofbirth;
          updateuser.email=req.body.email;
          updateuser.address=req.body.address;
          updateuser.country=req.body.country;
          updateuser.city=req.body.city;
          updateuser.zipcode=req.body.zipcode;
          updateuser.phone=req.body.phone;
         updateuser.username=req.body.username;
          await User.findByIdAndUpdate(userid,updateuser);
          return res.status(200).json({
            success: true,
            message: "Seller update sucessfully",
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller aproved
  async selleraproval(req, res) {
    const id = req.params.id;
    try {
      const sellerExsist = await Seller.findOne({ _id: id });
      if (!sellerExsist) {
        return res.status(400).json({ error: "no seller found" });
      } else {
        var smtpTransport = require("nodemailer-smtp-transport");

        var transporter = nodemailer.createTransport(
          smtpTransport({
            service: "gmail",
            auth: {
              user: process.env.SECRET_USER, // my mail
              pass: process.env.SECRET_PASS,
            },
          })
        );
        let updateseller = {};
        updateseller.sellerapproval = 1;
        await Seller.findByIdAndUpdate(id, updateseller).then((result) => {
          transporter.sendMail({
            to: "avishekpandat@gmail.com",
            from: "Himanshuroox@gmail.com",
            subject: "Seller Approved ",
            html: `
            <p style="color:green;">Seller successfully Approved</p>
          
            `,
          });
          res.json({ message: "Seller successfully Approved" });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller disapproved
  async disapproved(req, res) {
    const id = req.params.id;
    try {
      const sellerExsist = await Seller.findOne({ _id: id });
      if (!sellerExsist) {
        return res.status(400).json({ error: "no seller found" });
      } else {
        var smtpTransport = require("nodemailer-smtp-transport");

        var transporter = nodemailer.createTransport(
          smtpTransport({
            service: "gmail",
            auth: {
              user: process.env.SECRET_USER, // my mail
              pass: process.env.SECRET_PASS,
            },
          })
        );
        let updateseller = {};
        updateseller.sellerapproval = 2;
        await Seller.findByIdAndUpdate(id, updateseller).then((result) => {
          transporter.sendMail({
            to: "avishekpandat@gmail.com",
            from: "Himanshuroox@gmail.com",
            subject: "Seller Disapproved ",
            html: `
            <p style="color:green;">Seller Disapproved</p>
          
            `,
          });
          res.json({ message: "Seller successfully Disapproved" });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller update toggel status on & off
  async sellerverification(req, res) {
    const status = req.params.id;
    console.log(status);
    try {
      const sellerData = {};
      (sellerData.sellerverfication = status),
        await verification.findByIdAndUpdate(
          "61ca9d28949e9f1f89426cbe",
          sellerData
        );
      if (status == "true") {
        // const withdrawal = {};
        // withdrawal.withdrawalverfication = false;
        // await Withdrawal.findByIdAndUpdate(
        //   "620b772d96be1f9a7e432b30",
        //   withdrawal
        // );
      } else if (status == "false") {
        // const withdrawal = {};
        // withdrawal.withdrawalverfication = true;
        // await Withdrawal.findByIdAndUpdate(
        //   "620b772d96be1f9a7e432b30",
        //   withdrawal
        // );
        const userdata=await User.find();
        for await(const users of userdata){
          const userid=users._id;
          const sellerdata=await Seller.find({userId:userid});
          if(sellerdata.length==0){
            const sellerData = {
              termcondition: "accepted",
              sellerapprovalstatus: true,
              userId: mongoose.Types.ObjectId(userid),
            };
            const resultData = await Seller.create(sellerData).then(
              (result) => {}
            );
          }
        }
      }
      return res.status(200).json({ message: "Done" });
    } catch (error) {
      console.log(error);
    }
  }
  //selller toggal status
  async sellerverificationstatus(req, res) {
    const findstatus = await verification.findOne({});
    if (!findstatus) {
      return res.status(400).json({ error: "no data found" });
    } else {
      return res.status(200).json(findstatus.sellerverfication);
    }
  }
  //seller withrawal status
  async withdrawalverificationstatus(req, res) {
    const findstatus = await Withdrawal.findOne({
      _id: "620b772d96be1f9a7e432b30",
    });
    if (!findstatus) {
      return res.status(400).json({ error: "no data found" });
    } else {
      return res.status(200).json({ result: findstatus });
    }
  }
  //seller add products
  async selleraddproducts(req, res) {
    try {
      console.log(req.body);
      const id = req.params.id;
      console.log(id);
      let bodyData = req.body.data ? JSON.parse(req.body.data) : req.body;
      const output = [];
      const drop = [];
      const data = req.body.productname;
      const metaData = data.replace(/ /g, "-");
      const findmetaurl = await Products.find({ metaurl: metaData }).count();
      if (findmetaurl == 0) {
        var metaURL = metaData;
      } else {
        const countmeta = findmetaurl + 1;
        var metaURL = metaData + "-" + countmeta;
      }
      const findseller = await Seller.findOne({ userId:id });
      const sellerId = findseller._id;
      console.log(sellerId)
      if (bodyData.category === "[object Object]") {
        return res.status(402).json({ error: "Please Select Category" });
      }
      if (!bodyData.productname) {
        return res.status(402).json({ error: "Please fill Product Title" });
      }
      if (!bodyData.qty) {
        return res.status(402).json({ error: "Please fill product Quantity" });
      }
      if (bodyData.images === "null") {
        return res.status(402).json({ error: "Please upload product Image" });
      }
      if (!bodyData.stock) {
        return res.status(402).json({ error: "Please fill product stock" });
      }
      if (!bodyData.price) {
        return res.status(402).json({ error: "Please fill product price" });
      }
      if (bodyData.autodelivery == 'true') {
        if (
          !bodyData.account_username ||
          !bodyData.account_email ||
          !bodyData.account_password
        ) {
          return res.status(402).json({
            error: "Please fill all account details on automatic delivery",
          });
        }
      }
      const myArray = bodyData.dropdownname.split(",");
      const myArray2 = bodyData.subdropdown.split(",");
      var result = Object.assign.apply(
        {},
        myArray.map((v, i) => ({ [v]: myArray2[i] }))
      );

      const filedata = req.files;
      for await (const file of filedata) {
        const results = file.location;
        output.push(results);
      }
      const productData = {};
      productData.productname = bodyData.productname;
      productData.sortdescription = bodyData.sortdescription;
      productData.longdescription = bodyData.longdescription;
      productData.timeperiod = bodyData.timeperiod;
      productData.metaurl = metaURL;
      if (bodyData.autodelivery == 'true') {
        productData.account_username = bodyData.account_username;
        productData.account_email = bodyData.account_email;
        productData.account_password = bodyData.account_password;
        productData.account_specialnote = bodyData.account_specialnote;
      }
      productData.autodelivery = bodyData.autodelivery;
      productData.qty = bodyData.qty;
      productData.price = bodyData.price;
      productData.stock = bodyData.stock;
      productData.category = mongoose.Types.ObjectId(bodyData.category);
      productData.sellerId = mongoose.Types.ObjectId(sellerId);
      productData.userId = mongoose.Types.ObjectId(id);
      productData.images = output;
      productData.categorydetails = result;
      const resultData = await Products.create(productData);
      return res.status(201).json({
        success: true,
        message: "data save successfully",
        result: resultData,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async sms(req, res) {
    const accountSid = "AC9ea9eca1fc017cf732e9940dd276c5a4"; // Your Account SID from www.twilio.com/console
    const authToken = "6aec9f7ad4a3de4c86befed693f547eb"; // Your Auth Token from www.twilio.com/console

    const twilio = require("twilio");
    const client = new twilio(accountSid, authToken);

    client.messages
      .create({
        body: "Hello from Node developer",
        // Text this number
        from: "+12603015654",
        to: "+917503437679", // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
  }
  async sellerproduct(req, res) {
    const id = req.params.id;
    try {
      let data = countryList.getData();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  //seller configration setting
  async sellerconfigupdate(req, res) {
    const id = req.params.id;
    console.log(req.body);
    try {
      const data = await Seller.findOne({ userId: id });
      if (!data) {
        return res.status(400).json({ message: "Seller not found" });
      } else {
        const sellerid = data._id;
        const updateseller = {};
        updateseller.alertbox = req.body.alertbox;
        updateseller.attentiontbox = req.body.attentiontbox;
        updateseller.attentiontextarea = req.body.attentiontextarea;
        updateseller.alerttextarea = req.body.alerttextarea;
        updateseller.documentstext = req.body.documentstext;
        await Seller.findByIdAndUpdate(sellerid, updateseller);
        return res.status(200).json({ message: "update seller successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //seller delete
  async multipledelete(req, res) {
    console.log(req.body);
    const id = req.body.sellerid;
    try {
      for await (const data of id) {
        Seller.findByIdAndRemove(data, (err) => {});
      }
      return res.status(200).json({
        success: true,
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
    }
  }
  //selller verfiy status channge

  async changeverfiystatus(req, res) {
    console.log(req.body);
    const status = req.body.status;
    const id = req.body.sellerid;
    try {
      for await (const data of id) {
        const userProfile = await Seller.findOne({ _id: data }).populate(
          "userId"
        );
        if (userProfile.sellerapproval != status) {
          let updatedata = {};
          if (status == "Approved") {
            updatedata.sellerapprovalstatus = true;   
            updatedata.sellerapproval = "Approved";
            updatedata.isdocuments = req.body.isdocuments;
            updatedata.isidentitydocuments = req.body.isidentitydocuments;
            updatedata.documenttext = req.body.documents;
            sgMail.setApiKey(
              "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"
            );
            const msg = {
              to: userProfile.userId.email,
              from: "info@esports4g.com", // Change to your verified sender
              subject: "Seller status",
              text: "Seller Account",
              html: `<html>
              <body style="margin:0;padding:0;background:#f9f9f9">
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
              <div style="
              text-align: center;
              background:#003399;
              width:80%;
              margin:auto;
              padding: 3rem 0;
              ">
                <img
                  src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657612417286.jpeg"
                  style="height: 60px;
            
                  "
                />
                <h3
                  style="color: #fff;
                  text-align: center;
                  font-size: 20px;
                  margin: 15px 0;"
                  >
            APPROVAL MAIL TO SELLER
                  </h3>
              </div>
            
              <div
                 style="
                 text-align: center;
              background:#fff;
              width:80%;
              margin:auto;
              padding: 3rem 0;
                 "
                 >
                  <p
                  style="font-size: 14px;
                  font-weight: 200;
                  "
                  >
                    Dear user,<br/>
                    This is to inform you that your request regarding selling your accounts on Esports4g has been approved.
                   <br/>
            </p>
            <span
            style="font-size:14px;"
            >
            You are now eligible to put your accounts on sale on the website.<br/>
            </span>
            <p
            style="font-size:14px;"
            >
            Sell your game accounts and secure the best possible deals only on Esports4g. Hope you enjoy the experience at Esports4g.
            </p>
            <p
            style="font-size:14px;"
            >
            For any queries, you may contact the customer support at info@esports4g.com
            </p>
            
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
              </body></html>
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
          } else if (status == "Disapproved") {
            updatedata.sellerapprovalstatus = false;
            updatedata.sellerapproval = "Disapproved";
            
            updatedata.isdocuments = req.body.isdocuments;
            updatedata.isidentitydocuments = req.body.isidentitydocuments;
            updatedata.documenttext = req.body.documents;
            sgMail.setApiKey(
              "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"
            );
            const msg = {
              to: userProfile.userId.email,
              from: "info@esports4g.com", // Change to your verified sender
              subject: "Seller status",
              text: "Seller Account",
              html: `<html>
              <body style="margin:0;padding:0;background:#f9f9f9">
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
              <div style="
              text-align: center;
              background:#003399;
              width:80%;
              margin:auto;
              padding: 3rem 0;
              ">
                <img
                  src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657612417286.jpeg"
                  style="height: 60px;
            
                  "
                />
                <h3
                  style="color: #fff;
                  text-align: center;
                  font-size: 20px;
                  margin: 15px 0;"
                  >
                  DISAPPROVAL MAIL
                  </h3>
              </div>
            
              <div
                 style="
                 text-align: center;
              background:#fff;
              width:80%;
              margin:auto;
              padding: 3rem 0;
                 "
                 >
                  <p
                  style="font-size: 14px;
                  font-weight: 200;
                  "
                  >
                    Dear user,<br/>
                    Your request for selling your game accounts on Esports4g has been disapproved as you did not meet the eligibility criteria.
                   <br/>
            </p>
            <span
            style="font-size:14px;"
            >
            Please double-check your documentation and details before attempting again.<br/>
            </span>
            
            
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
              </body></html>
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
          }
          updatedata.sellerapproval = status;
          await Seller.findByIdAndUpdate(data, updatedata);

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

  //user seller status change
  async changeuserstatus(req, res) {
    const status = req.body.status;
    const id = req.body.sellerid;
    try {     
      for await (const data of id) {
        const sellerdata = await Seller.findOne({ _id: data });
        const userid = sellerdata.userId;
        const userProfile = await User.findOne({ _id: userid });
        if (userProfile.status != status) {
          let updatedata = {};
          if (status == "Banned") {
            updatedata.banstatus = true;
            updatedata.activestatus = false;
          } else if (status == "Active") {
            updatedata.activestatus = true;
          }
          await User.findByIdAndUpdate(userid, updatedata);
          sgMail.setApiKey(
            "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"
          );
          const msg = {
            to: userProfile.email,
            from: "info@esports4g.com", // Change to your verified sender
            subject: "User Status",
            text: "User Account",
            html: `
            <p style="color:yellow;">Your status change</p>
            <h5>your profile on esporst4g.com is set to ${status}</h5>
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
  async updatedefaultseller(req, res) {
    try {
      const updatedocuments = {};
      updatedocuments.documentstext = req.body.documentstext;
      updatedocuments.attentiontextarea = req.body.attentiontext;
      updatedocuments.alerttextarea = req.body.alerttext;
      updatedocuments.documentcount = req.body.totaldocuments;
      await Defaultseller.findByIdAndUpdate(
        "621095478583f5cdaa682611",
        updatedocuments
      );
      return res.status(200).json({ message: "Update sucessfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async defaultsellerdetails(req, res) {
    try {
      const documents = await Defaultseller.findOne({
        _id: "621095478583f5cdaa682611",
      });
      if (!documents) {
        return res.status(400).json({ message: "No data found" });
      } else {
        return res.status(400).json(documents);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async checkselleravailability(req, res) {
    const id = req.params.id;
    try {
      const checkseller = await Seller.findOne({ userId: id });
      if (!checkseller) {
        return res.status(400).json(false);
      } else {
        return res.status(200).json(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updatedocuments(req, res) {
    const id = req.params.id;
    const output = [];
    const output1 = [];
    console.log(req.files)
    try {
      const predata = await Seller.findOne({ _id: id });
      const getdata = predata.documents;
      const getdata1=predata.identitydocuments;
      for await (const prefile of getdata) {
        const preresults = prefile;
        output.push(preresults);
      }
      for await (const prefile1 of getdata1) {
        const preresults1 = prefile1;
        output1.push(preresults1);
      }
      if(req.files.documents){
      const filedata = req.files.documents;
      for await (const file of filedata) {
        const results = file.location;
        output.push(results);
      }
    }
    if(req.files.identitydocuments){
      const filedata1 = req.files.identitydocuments;
      for await (const file1 of filedata1) {
        const results1 = file1.location;
        output1.push(results1);
      }
    }
      let count = output.length;
      let count1 = output1.length;
      const updatedocuments = {};
      if (count > 0 || count1>0) {
        updatedocuments.documents = output;
        updatedocuments.identitydocuments = output1;
        await Seller.findByIdAndUpdate(id, updatedocuments, (err) => {
          if (!err) {
            return res.status(200).json({
              success: true,
              message: "seller documents update sucessfully",
            });
          } else {
            return res.status(404).json({
              success: false,
              message: "seller documents not update",
            });
          }
        });
      } else {
        return res.status(404).json({ message: "select atleast one document" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updatewithdrawaldocuments(req, res) {
    const id = req.params.id;
    const output = [];
    const output1 = [];
    console.log(req.files)
    try {
      const predata = await Seller.findOne({ _id: id });
      const getdata = predata.withdrawaldocuments;
      const getdata1=predata.withdrawalidentity;
      for await (const prefile of getdata) {
        const preresults = prefile;
        output.push(preresults);
      }
      for await (const prefile1 of getdata1) {
        const preresults1 = prefile1;
        output1.push(preresults1);
      }
      if(req.files.withdrawaldocuments){
      const filedata = req.files.withdrawaldocuments;
      for await (const file of filedata) {
        const results = file.location;
        output.push(results);
      }
    }
    if(req.files.withdrawalidentity){
      const filedata1 = req.files.withdrawalidentity;
      for await (const file1 of filedata1) {
        const results1 = file1.location;
        output1.push(results1);
      }
    }
      let count = output.length;
      let count1 = output1.length;
      const updatedocuments = {};
      if (count > 0 || count1>0) {
        updatedocuments.withdrawaldocuments = output;
        updatedocuments.withdrawalidentity = output1;
        await Seller.findByIdAndUpdate(id, updatedocuments, (err) => {
          if (!err) {
            return res.status(200).json({
              success: true,
              message: "seller withdrawal documents update sucessfully",
            });
          } else {
            return res.status(404).json({
              success: false,
              message: "seller withdrawal documents not update",
            });
          }
        });
      } else {
        return res.status(404).json({ message: "select atleast one document" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async sellerdetailstoadmin(req, res) {
    const id = req.params.id;
    try {
      const userdata = await User.findOne({ id: id });
      if (!userdata) {
        return res.status(400).json({ message: "No user data found" });
      }
      //  for await(const user of data){
      const sellerdata = await Seller.findOne({ userId: userdata._id });
      if (!sellerdata) {
        return res.status(400).json({ message: "No seller data found" });
      }
      //  const userid=user.userId.id;
      //  if(userid==)
      return res
        .status(200)
        .json({ sellername: userdata.fullname, sellerID: sellerdata._id });
      //  }
    } catch (error) {
      console.log(error);
    }
  }
  async sellerproductlist(req, res) {
    const sellerid = req.params.id;
    console.log(sellerid)
    try {
      const datearray=[];
      const list = await Products.find({ sellerId: sellerid ,stock: { $gt: 0 }}).populate(
        "category"
      ).sort({_id:-1});
      if (list.length<=0) {
        return res.status(400).json({list});
      } else {
      //      for await(const data of list){
            
      //     const date=data.dateCreated;
      //    console.log(date)
      //     var clientIp = requestIp.getClientIp(req);
      //     const data1 = clientIp.split(":").pop();
      //     const res = await fetch(`http://ip-api.com/json/${data1}`);
      //      const user = await res.json();
     
      //       var final = user;
      //       const time = final.timezone;
      //       var LocalDate = new Date(date);
         
      //       LocalDate.setMilliseconds(0);
      //       var options = { hour12: false };
      //       const LocalOffset = LocalDate.getTimezoneOffset();
      //       var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
      //         timeZone: time,
      //       });
      //        console.log(RemoteLocaleStr)
      //       datearray.push(RemoteLocaleStr);
      // }
 return res.status(200).json({list,datearray});
      }
    } catch (error) {
      console.log(error);
    }
  }
  async sellereditproduct(req, res) {
    try {
      var id = req.params.id;
      const editproduct = await Products.findOne({ _id: id }).populate(
        "category"
      );

      if (editproduct) {
        return res.status(200).json(editproduct);
      } else {
        return res.status(404).json({
          success: false,
          message: "data not found",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong", result: err });
    }
  }
  async sellerupdateProduct(req, res) {
    try {
      const id = req.params.id;
      const bodyData = req.body.data ? JSON.parse(req.body.data) : req.body;
      console.log(bodyData);
      const productExist = await Products.findOne({ _id: id });
      const output = [];
      const imagei = [];
      if (bodyData.category === "[object Object]") {
        return res.status(402).json({ error: "Please Select Category" });
      }
      if (!bodyData.productname) {
        return res.status(402).json({ error: "Please fill Product Title" });
      }
      if (!bodyData.qty) {
        return res.status(402).json({ error: "Please fill product Quantity" });
      }
      if (bodyData.images === "null") {
        return res.status(402).json({ error: "Please upload product Image" });
      }
      if (!bodyData.stock) {
        return res.status(402).json({ error: "Please fill product stock" });
      }
      if (!bodyData.price) {
        return res.status(402).json({ error: "Please fill product price" });
      }
      if (bodyData.autodelivery == 'true') {
        if (
          !bodyData.account_username ||
          !bodyData.account_email ||
          !bodyData.account_password
        ) {
          return res.status(402).json({
            error: "Please fill all account details on automatic delivery",
          });
        }
      }
      const myArray = bodyData.dropdownname.split(",");
      const myArray2 = bodyData.subdropdown.split(",");
      var result = Object.assign.apply(
        {},
        myArray.map((v, i) => ({ [v]: myArray2[i] }))
      );
      if (bodyData.imageindex) {
        const filedata = req.files;
        for await (const file of filedata) {
          const results = file.location;
          output.push(results);
        }
      }
      var i = bodyData.imageindex;
      let count = output.length;
      if (!productExist) {
        return res.status(422).json({ error: "products not exists" });
      } else {
        let updatedProduct = { $set: {} };
        updatedProduct.productname = bodyData.productname;
        updatedProduct.sortdescription = bodyData.sortdescription;
        updatedProduct.longdescription = bodyData.longdescription;
        updatedProduct.price = bodyData.price;
            if(req.body.timeperiod){
          const date = Date.now();
          updatedProduct.dateCreated = date; 
        updatedProduct.timeperiod = req.body.timeperiod;
        }
        updatedProduct.metaurl = bodyData.metaurl;
        updatedProduct.metadescription = bodyData.metadescription;
        updatedProduct.metakeyword = bodyData.metakeyword;
        updatedProduct.metatitle = bodyData.metatitle;
        updatedProduct.qty = bodyData.qty;
        if (req.body.autodelivery == 'true') {
          updatedProduct.account_username = bodyData.account_username;
          updatedProduct.account_email = bodyData.account_email;
          updatedProduct.account_password = bodyData.account_password;
          updatedProduct.account_specialnote = bodyData.account_specialnote;
        }
        if (req.body.autodelivery == 'false') {
          updatedProduct.account_username = "";
          updatedProduct.account_email = "";
          updatedProduct.account_password = "";
          updatedProduct.account_specialnote = "";
        }
        updatedProduct.categorydetails = result;
        updatedProduct.autodelivery = bodyData.autodelivery;
        updatedProduct.stock = bodyData.stock;
        updatedProduct.category = mongoose.Types.ObjectId(bodyData.category);
        if (bodyData.imageindex) {
         
          for(let j=0;j<i.length;j++){
            console.log(i[j])
              if(i[j]!='undefined'){
                if(i.length!=output.length){
                for(let v=0;v<output.length;v++){
              const filelink = output[v];
              updatedProduct.$set["images." + i[j]] = filelink;  
                }
              }else{
                const filelink = output[j];
                updatedProduct.$set["images." + i[j]] = filelink;  
              }
          }
        }
        }
        
        await Products.findByIdAndUpdate(id, updatedProduct, (err) => {
          if (!err) {
            return res.status(200).json({
              success: true,
              message: "Products update sucessfully",
            });
          } else {
            return res.status(404).json({
              success: false,
              message: "product not update",
            });
          }
        }); //saving data in user constant
      }
    } catch (error) {
      console.log(error);
    }
  }
  async sellerdeleteProduct(req, res) {
    const id = req.params.id;
    try {
      const deleteseller = await Products.findByIdAndRemove({ _id: id });
      const data = await cartData.find();
      for await (const cart of data) {
        const cartdata = cart.items;
        for await (const itemdata of cartdata) {
          const proid = itemdata.productId;
          if (proid == id) {
            const items = itemdata._id;
            const cartId = cart._id;
            const filtered = cartdata.filter((element) => {
              return element._id != items;
            });
            const subTotal = filtered.reduce(
              (previousValue, currentValue) =>
                previousValue + currentValue.total,
              0
            );
            const qtyTotal = filtered.reduce(
              (previousValue, currentValue) =>
                previousValue + currentValue.quantity,
              0
            );
            const result = await cartData.findByIdAndUpdate(
              { _id: cartId },
              { items: filtered, subTotal: subTotal, totalquantity: qtyTotal },
              { new: true }
            );
          }
        }
      }
      const oders = await order.find({ productId: id });
      if(oders.length>0){
      for await (const orderdata of oders) {
        const orderid = orderdata._id;
        const datad = await order.findByIdAndRemove({ _id: orderid });
      }
    }
      if (!deleteseller) {
        return res.status(400).json({ error: "product not deleted" });
      } else {
        return res
          .status(200)
          .json({ message: "product Deleted Successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async sellersoldproduct(req, res) {
    const sellerid = req.params.id;
    try {
      const list = await order
        .find({ selerId: sellerid })
        .populate("productId")
        .populate("userId");
      console.log(list);
      if (!list) {
        return res.status(400).json({ message: "No data found" });
      } else {
        return res.status(200).json(list);
      }
    } catch (error) {
      console.log(error);
    }
  }
async searchseller(req,res){
  const userid=req.params.id;
try{
  const userdata=await User.findOne({id:userid});
  if(!userdata){
    return res.status(400).json({ message: "No user found" });
  }else{
     const user_id=userdata._id;
     const username=userdata.fullname;
    const fetchseller = await Seller.findOne({ userId:user_id});
   if (!fetchseller) {
     return res.status(400).json({ message: "No seller found" });
   }else{
   const sellerid=fetchseller._id
  return res.status(200).json({username,sellerid});
   }
}
}catch(error){
  console.log(error)
}
}
// async updatewithdrawaldocuments(req, res) {
//   const id = req.params.id;
//   const output = [];
//   try {
//     const predata = await Seller.findOne({ _id: id });
//     const getdata = predata.withdrawaldocuments;
// if(getdata.length>0){
//     for await (const prefile of getdata) {
//       const preresults = prefile;
//       output.push(preresults);
//     }
//   }
//     const filedata = req.files;
//     for await (const file of filedata) {
//       const results = file.location;
//       output.push(results);
//     }
//     console.log(output);
//     let count = output.length;
//     const updatedocuments = {};
//     if (count > 0) {
//       updatedocuments.withdrawaldocuments = output;
//       await Seller.findByIdAndUpdate(id, updatedocuments, (err) => {
//         if (!err) {
//           return res.status(200).json({
//             success: true,
//             message: "seller withdrawaldocuments update sucessfully",
//           });
//         } else {
//           return res.status(404).json({
//             success: false,
//             message: "seller withdrawaldocuments not update",
//           });
//         }
//       });
//     } else {
//       return res.status(404).json({ message: "select atleast one document" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
async sellersuccessfullorder(req,res){
  const sellerid=req.params.id
  try{
   const sellerpro=await order.find({selerId:sellerid,buyer_confirm:true}).sort({_id:-1})
   .populate("productId")
   .populate("userId");
   if(sellerpro.length<0){
    return res.status(400).json('No order found')
   }else{
     return res.status(200).json(sellerpro)
   }
  }catch(error){
    console.log(error)
  }
}
async sellerflotorders(req,res){
  const sellerid=req.params.id
  try{
   const sellerpro=await order.find({selerId:sellerid,buyer_confirm:false,buyer_cancel:false}).sort({_id:-1})
   .populate("productId")
   .populate("userId");
   if(sellerpro.length<0){
    return res.status(400).json('No order found')
   }else{
     return res.status(200).json(sellerpro)
   }
  }catch(error){
    console.log(error)
  }
}
async sellerdashboarddetails(req,res){
  try{
    var total = 0;
const sellerid=req.params.id;
const sellerdata=await Seller.findOne({_id:sellerid});
const userid=sellerdata.userId;
const wallet=await Wallet.findOne({userId:userid}) ;
const wallettotal=wallet.total;
const totalproduct=await Products.find({sellerId:sellerid}).count();
const orders=await order.find({selerId:sellerid}).populate("productId");
  for await(const orderdata of orders){
    const amount =orderdata.productId.price;
    total += amount;
  }
  const date = Date.now();
  const ordercount=await order.find({sellerId:sellerid,dateCreated:date}).count(); 
return res.status(200).json({totalproduct,wallettotal,total,ordercount})
  }catch(error){
    console.log(error)
  }
}
async test(req,res){
  try{
//     var elasticemail = require('elasticemail');
// var client = elasticemail.createClient({
//   username: 'info@esports4g.com',
//   apiKey: '8E28BF5D276A4360473B434C685A791E3DE2A915D39A21DCC14B29FAC8A4605C2373AABB494D9809487BA8290BD9A9F2'
// });
 
// var msg = {
//   from: 'info@esports4g.com',
//   // from_name: 'Esports4G',
//   to: 'himanshuroox@gmail.com',
//   subject: 'Hello',
//   body_text: 'hiii'
// };
 
// client.mailer.send(msg, function(err, result) {
//   if (err) {
//     return console.error(err);
//   }
 
//   console.log(result);
// });
var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
return res.status(200).json(firstDay)
  }catch(error){
    console.log(error)
  }
}
}
module.exports = new Sellers();
