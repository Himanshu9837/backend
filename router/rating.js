const express = require("express");
const router = express.Router();
const ratingController = require("../src/controllers/ratingcontroller");
const authenticate = require("../src/middleware/Authenticate");

router.post("/addrating/",ratingController.addrating); 
router.get("/fetchrating/(:id)", ratingController.fetchrating); 
router.post("/addbuyerrating/",ratingController.addbuyerrating); 
router.get("/fetchbuyerrating/(:id)", ratingController.fetchbuyerrating);
router.get("/orderreating/(:id)", ratingController.orderreating);    
module.exports = router;