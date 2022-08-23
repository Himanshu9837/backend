const express = require("express");
// var cors = require('cors')
const app = require("../app");
const router = express.Router();
require("dotenv").config();
const commissioncontroller = require("../src/controllers/commissioncontroller");
const authenticate = require("../src/middleware/Authenticate");
const path = require("path");
require("../db/conn");


  router.post("/addcommission/", commissioncontroller.addcommission);
// router.get("/sellerwallet/(:id)", withdrawal_wallletcontroller.sellerwallet);
// router.get("/withdrawallist", withdrawal_wallletcontroller.withdrawallist);
// router.get("/sellerwithdrawallist/(:id)", withdrawal_wallletcontroller.sellerwithdrawallist);
// router.post("/addpaymentmethod", withdrawal_wallletcontroller.addpaymentmethod);
// router.post("/updatepaymentmethod", withdrawal_wallletcontroller.updatepaymentmethod);
module.exports = router;