const express = require("express");
// var cors = require('cors')
const app = require("../app");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");

const adminController = require("../src/controllers/adminuser");

const authenticate = require("../src/middleware/Authenticate");
const path = require("path");
require("../db/conn");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
    accessKeyId: process.env.SECRET_S3PROKEY,
    secretAccessKey: process.env.SECRET_S3PROSECRET,
    region: process.env.SECRET_S3PROREGION,
  });

  const upload = (bucketName) =>
    multer({
      storage: multerS3({
        s3,
        bucket: bucketName,
        metadata: function (req, files, cb) {
          cb(null, { fieldName: files.fieldname });
        },
        key: function (req, files, cb) {
          cb(null, `document-${Date.now()}.jpeg`);
        },
      }),
    });
const User = require("../src/models/userSchema");
const { rootCertificates } = require("tls");

//admin routes
router.post("/adminregister",adminController.adminregister);
router.post("/adminsignin", adminController.adminlogin);
router.get("/adminlist", adminController.adminlist);
router.get("/editadmin/(:id)", adminController.adminedit);
router.post("/homepagedynamicdata", adminController.homepagedynamic);
router.post("/landingpagedynamic", adminController.landingpagedynamic);  
router.post("/updateadmin/(:id)",upload("esports-user-images").fields([{ name: 'adminimage', maxCount: 1 }]),adminController.updateadmin);
router.delete("/admindelete",adminController.deleteadmin);
router.post("/updatehome/(:id)",upload("esports-category-images").fields([{ name: 'bannerimage', maxCount: 1 }, { name: 'bottomimage', maxCount: 1 },{ name: 'aboutimage', maxCount: 1 },{ name: 'howitsworkimage', maxCount: 1 }]),adminController.updatehome);
router.post("/updatelanding/(:id)",upload("esports-category-images").fields([{ name: 'bannerimage', maxCount: 1 },{ name: 'topimage', maxCount: 1 },{ name: 'bannerbackgroundimage', maxCount: 1 }]),adminController.updatelanding);
router.get("/editladingpage/(:id)",adminController.editladingpage);  
router.get("/fetchladingpage",adminController.fetchladingpage);    
router.get("/homedatafetch",adminController.homepagedata);    
router.post("/addrestriction",adminController.addrestriction);  
router.get("/allrestrictions",adminController.allrestrictions);    
router.post("/addmetapages",adminController.addmetapages);       
router.get("/editmetapages/(:id)",adminController.editmetapages);  
router.get("/fetchmatapages/(:id)",adminController.fetchmatapages); 
router.get("/listmetapages",adminController.listmetapages); 
router.post("/updatemetapages/(:id)",adminController.updatemetapages);      
module.exports = router;
