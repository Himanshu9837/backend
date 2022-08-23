const express = require("express");
// var cors = require('cors')
const app = require("../app");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const productController = require("../src/controllers/product");
const authenticate = require("../src/middleware/Authenticate");
const path = require("path");
require("dotenv").config();
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
      metadata: function (req, files, cb) {
        cb(null, { fieldName: files.fieldname });
      },
      key: function (req, files, cb) {
        cb(null, `image-${Date.now()}.jpeg`);
      } ,
    }),
  });
//user routes

//product rounters
router.post("/addproduct",upload("esports-products-images").array("images", 5),productController.addproducts);
router.get("/productlist", productController.productlist);
router.delete("/deleteproduct/(:id)", productController.deleteProduct);
router.get("/editproduct/(:id)", productController.editProduct);
router.post("/updateproduct/(:id)",upload("esports-products-images").array("images", 3), productController.updateProduct);
router.get("/productdetails/(:id)", productController.productdetails);
router.get("/thumblinstatus", productController.thumbnailstatus);
 router.delete("/removeimages/(:id)",productController.removeimages);
 router.get("/categoryproducts/(:categoryname)",productController.categoryproducts);
 router.get("/newarrivalproducts/",productController.newarrivalproducts);
 router.get("/newcatarrivalproducts/(:id)",productController.newcatarrivalproducts);
 router.get("/maximumpriceitem",productController.maximumpriceitem);
 router.get("/minimumpriceitem",productController.minimumpriceitem);
 router.get("/cartdata",productController.cartdata);
 router.get("/catpro",productController.catpro);
 router.get("/productlist1",productController.productlist1);
 router.post("/filterpro/(:id)",productController.filterpro);
 router.get("/searchproduct/(:id)",productController.searchproduct); 
 router.get("/sortcategoryproducts/(:id)",productController.sortcategoryproducts); 
 router.get("/test",productController.testing); 
module.exports = router;