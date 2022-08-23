const express = require("express");
// var cors = require('cors')
const app = require("../app");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const currencycontroller = require("../src/controllers/currencycontroller");
const authenticate = require("../src/middleware/Authenticate");
const path = require("path");
require("../db/conn");
router.post("/addcurrency", currencycontroller.addcurrency);     
router.get("/fetchcurrency",currencycontroller.fetchcurrency); 
router.get("/fetchfixerallrate",currencycontroller.fetchfixerallrate);    
router.get("/fetchrateprice/(:currency)",currencycontroller.fetchrateprice);
router.get("/editcurrency/(:id)",currencycontroller.editcurrency);
router.post("/updatecurrencyrate/(:id)", currencycontroller.updatecurrencyrate); 
router.post("/updatefetchcurrency/(:id)", currencycontroller.updatefetchcurrency); 
module.exports = router;
