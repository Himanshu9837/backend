const express = require("express");
const router = express.Router();
const templatecontroller = require("../src/controllers/email_templatecontroller");
const authenticate = require("../src/middleware/Authenticate");
const path = require("path");
require("../db/conn");
router.post("/addemailtemplate", templatecontroller.addemailtemplate);     
router.get("/edittemplate/(:id)",templatecontroller.edittemplate); 
router.post("/test",templatecontroller.test);    
 
module.exports = router;
