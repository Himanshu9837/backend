const express = require("express");
const Adminauthenticate = require("../src/middleware/adminauthentication"); 
require("dotenv").config();
const router = express.Router();
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
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `image-${Date.now()}.jpeg`);
        },
      }),
    });


const BadgesController = require("../src/controllers/badgescontroller");

 router.post("/addcondtion",Adminauthenticate,BadgesController.addcondtion);  
router.post("/updatebadgeconfig/(:id)",Adminauthenticate,BadgesController.updatebadgeconfig);     
 router.get("/fetchcondition",Adminauthenticate,BadgesController.fetchcondition);  
 router.get("/applybadges/(:id)", BadgesController.applybadges); 
 router.get("/fetchbadges", BadgesController.fetchbadges);         
 router.get("/fetchbadgesconfig", BadgesController.fetchbadgesconfig);
 router.delete("/deletebadges/(:id)",Adminauthenticate,BadgesController.deletebadges);
  router.get("/editbadges/(:id)", BadgesController.editbadges);    
 router.post("/addbadges",Adminauthenticate,upload("esports-category-images").fields([{ name: 'badgesicon', maxCount: 1 }]), BadgesController.addbadges); 
 router.post("/updatebadges/(:id)",Adminauthenticate,upload("esports-category-images").fields([{ name: 'badgesicon', maxCount: 1 }]), BadgesController.updatebadges); 
module.exports = router;
