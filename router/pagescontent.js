const express = require("express");


const router = express.Router();


const pageController = require("../src/controllers/pagescontentcontroller");

// const path = require("path");
require("../db/conn");
require("dotenv").config();
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const User = require("../src/models/userSchema");
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
         cb(null, `image-${Date.now()}.jpeg`);
        },
      }),
    });
//admin routes
router.post("/addcompanydetails", pageController.addcompanydetails);         
router.get("/editcmpnydetails", pageController.editcmpnydetails);
router.post("/updatecmpnydetails/(:id)", pageController.updatecmpnydetails);    
router.post("/submitcontactus",pageController.submitcontactus); 
router.get("/editaboutus", pageController.editaboutus);      
router.post("/addaboutus",upload("esports-user-images").fields([{ name: 'topimage', maxCount: 1 }, { name: 'middleicon', maxCount: 5 },{ name: 'lasticon', maxCount: 5 }]),pageController.addaboutus);    
router.post("/updateaboutus/(:id)",upload("esports-user-images").fields([{ name: 'topimage', maxCount: 1 }, { name: 'middleicon', maxCount: 5 }, { name: 'lasticon', maxCount: 5 }]),pageController.updateaboutus);   
module.exports = router;
