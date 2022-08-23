const express = require("express");
// var cors = require('cors')
const app = require("../app");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");

const cartController = require("../src/controllers/cartController");

const authenticate = require("../src/middleware/Authenticate");
const path = require("path");
require("../db/conn");
const multer = require("multer");



//admin routes
router.post("/addtocart", cartController.addItmeToCart);
router.get("/cartinfo/(:id)", cartController.cartdata);
router.delete("/deletecart/(:id)", cartController.deletecart);
router.post("/updatecart/(:id)", cartController.cartupdate);
router.get("/checkusercart/:userid&:productid", cartController.checkusercart);
module.exports = router;