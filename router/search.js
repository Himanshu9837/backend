const express = require("express");


const router = express.Router();


const searcController = require("../src/controllers/searchcontroller");


//admin routes
router.post("/addsearchdata", searcController.addsearchdata);      
router.get("/fetchsearch", searcController.fetchsearch);
router.post("/updatesearch/(:id)", searcController.updatesearch); 
module.exports = router;
