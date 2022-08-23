const express = require("express");
// var cors = require('cors')
const app = require("../app");
const router = express.Router();
require("dotenv").config();
const withdrawal_wallletcontroller = require("../src/controllers/withdrawal_wallletcontroller");
const authenticate = require("../src/middleware/Authenticate");
const path = require("path");
require("../db/conn");


router.post("/sellerwithdarawalrequest/(:id)", withdrawal_wallletcontroller.sellerwithdarawalrequest);
router.get("/wallettotal/(:id)", withdrawal_wallletcontroller.wallettotal);
router.post("/updatewallet/(:id)", withdrawal_wallletcontroller.updatewallet);
router.get("/withdrawallist", withdrawal_wallletcontroller.withdrawallist);
router.get("/userwithdrawallist/(:id)", withdrawal_wallletcontroller.sellerwithdrawallist);
router.post("/addpaymentmethodstatus", withdrawal_wallletcontroller.addpaymentmethodstatus);
router.post("/updatepaymentmethodstatus", withdrawal_wallletcontroller.updatepaymentmethodstatus);
router.post("/addpaymentmethod", withdrawal_wallletcontroller.addpaymentmethod);
router.get("/paymentmethodlist", withdrawal_wallletcontroller.fetchpaymentmethods);
router.get("/editpaymentmethods/(:id)", withdrawal_wallletcontroller.editpaymentmethods);
router.post("/updatepaymentmethod/(:id)", withdrawal_wallletcontroller.updatepaymentmethod);
router.get("/enablepaymentmethode", withdrawal_wallletcontroller.enablepaymentsmethod);
router.post("/paymentfee", withdrawal_wallletcontroller.paymentfee);  
router.post("/walletrecharge", withdrawal_wallletcontroller.walletrecharge); 
router.get("/withdrawaldatadetails/(:id)", withdrawal_wallletcontroller.withdrawaldatadetails);
router.post("/payoporderid", withdrawal_wallletcontroller.payop);  
module.exports = router;