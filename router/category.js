const express = require("express");
// var cors = require('cors')
const app = require("../app");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const categoryController = require("../src/controllers/category");
const authenticate = require("../src/middleware/Authenticate");
const Adminauthenticate = require("../src/middleware/adminauthentication"); 
const path = require("path");
require("../db/conn");
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
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, `image-${Date.now()}.jpeg`);
        },
      }),
    });

//category rounters
router.post("/addcategory/(:id)",Adminauthenticate,upload("esports-category-images").fields([{ name: 'categoryimage', maxCount: 1 }, { name: 'coverimage', maxCount: 1 },{ name: 'categorylogo', maxCount: 1 },{ name: 'categorythumblinimage', maxCount: 1 },{ name: 'sliderbannerimage', maxCount: 1 }]), categoryController.addCategory);
router.get("/categorylist",categoryController.categoryList);
router.get("/childcategorylist/(:id)", categoryController.childCategory);
router.get("/parentcategorylist", categoryController.parentCategory);
router.get("/deletecategorylist/(:id)",Adminauthenticate,categoryController.deleteCategory);
router.get("/editcategorylist/(:id)",categoryController.editCategory);
router.post("/updatecategorylist/(:id)",Adminauthenticate,upload("esports-category-images").fields([{ name: 'categoryimage', maxCount: 1 }, { name: 'coverimage', maxCount: 1 },{ name: 'categorylogo', maxCount: 1 },{ name: 'categorythumblinimage', maxCount: 1 },{ name: 'sliderbannerimage', maxCount: 1 }]), categoryController.updateCategory);
router.post("/draganddrop/(:id)", categoryController.dragAnddrop);
router.post('/removeimage/(:id)',categoryController.removeimage);
router.get('/searchgame/(:id)',categoryController.searchgame);
router.get('/gamedropdowns/(:id)',categoryController.gamedropdowns);
router.get('/gamedropinfo/(:id)',categoryController.gamedropinfo);
router.get('/allbasecategory',categoryController.allbasecategory);
router.get('/newarrivalcategory',categoryController.newarrivalcategory);
router.get('/categorydetails/(:id)',categoryController.categoryviamataurl);
router.get("/topgames",categoryController.topgames);
// router.delete('/catpro',categoryController.catpro);     
router.get('/filtercategory/(:id)',categoryController.filtercategory);

module.exports = router;
