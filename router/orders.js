const express = require("express");
// var cors = require('cors')
// const app = require("../app");
// const bcrypt = require("bcryptjs");
const router = express.Router();
// const jwt = require("jsonwebtoken");

const orderController = require("../src/controllers/orderController");

const authenticate = require("../src/middleware/Authenticate");
// const path = require("path");
require("../db/conn");
// const multer = require("multer");
 router.post("/orderdercreate",orderController.ordercreate);
 router.post("/walletorderdercreate",orderController.walletorder);
 router.get("/orderlist",orderController.orderlist);
router.delete("/selectdelete",orderController.multipledelete);
router.get("/checklist/(:id)",orderController.checkorderlist);
router.post("/updatestock/(:id)",orderController.updatestock);
router.delete("/orderdelete/(:id)",orderController.orderdelete);
router.get("/sendsms",orderController.sendsms);
router.get("/editorder/(:id)",orderController.selectorder);
router.post("/changestatus/(:id)",orderController.orderststuschange);
router.get("/email",orderController.email);
router.get("/sellerorderlist/(:id)",orderController.sellerorderlist);
router.get("/buyerorderlist/(:id)",orderController.buyerorderlist);
 router.post("/details_by_seller/(:id)",orderController.details_by_seller);
 router.post("/order_seller_rating/(:id)",orderController.order_seller_rating);
 router.post("/order_buyer_rating/(:id)",orderController.order_buyer_rating);
 router.post("/confirm_by_seller/(:id)",orderController.order_confirm_by_seller);
 router.post("/complete_by_buyer/(:id)",orderController.complete_by_buyer);
 router.post("/notworking/(:id)",orderController.notworking);
 router.post("/buyercancleorder/(:id)",orderController.buyercancleorder);
 router.post("/sellercancleorder/(:id)",orderController.sellercancleorder);
 router.get("/totalpurchase/(:id)",orderController.totalpurchase); 
 router.post("/view_by_seller/(:id)",orderController.view_by_seller);      
module.exports = router;