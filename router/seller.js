const express = require("express");
// var cors = require('cors')
const app = require("../app");
const router = express.Router();
require("dotenv").config();
const sellerController = require("../src/controllers/sellercontroller");
const authenticate = require("../src/middleware/Authenticate");
const Adminauthenticate = require("../src/middleware/adminauthentication"); 
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
router.post("/createseller",upload("esports-seller-documents").fields([{name:"documents", maxCount:5},{name:"identitydocuments", maxCount:5}]) ,sellerController.createseller);
router.get("/sellerdetails/(:id)", sellerController.sellerdetails); 
router.get("/sellerlist",Adminauthenticate, sellerController.sellerlist);
router.delete("/sellerdelete", sellerController.multipledelete);
router.get("/selleredit/(:id)", sellerController.editseller);
router.post("/sellerapproval/(:id)", sellerController.selleraproval); 
router.post("/disapproved/(:id)", sellerController.disapproved); 
router.post("/verification/(:id)", sellerController.sellerverification); 
router.get("/withdrawalverificationstatus", sellerController.withdrawalverificationstatus);
router.post("/sms", sellerController.sms);
router.post("/changeuserstatus", sellerController.changeuserstatus);
router.post("/changesellerstatus", sellerController.changeverfiystatus);
router.get("/sellerverificationstatus", sellerController.sellerverificationstatus);
router.post("/sellerupdateconfig/(:id)", sellerController.sellerconfigupdate);
router.get("/sellerproduct/(:id)", sellerController.sellerproduct);  
router.get("/defaultdetails", sellerController.defaultsellerdetails);
router.get("/sellerdetailstoadmin/(:id)", sellerController.sellerdetailstoadmin);
router.post("/updatedefaultdetails", sellerController.updatedefaultseller);
router.get("/checkavailability/(:id)", sellerController.checkselleravailability);
router.post("/updatedocuments/(:id)",upload("esports-seller-documents").fields([{name:"documents", maxCount:5},{name:"identitydocuments", maxCount:5}]) ,sellerController.updatedocuments);
router.post("/updatewithdrawaldocuments/(:id)",upload("esports-seller-documents").fields([{name:"withdrawaldocuments", maxCount:5},{name:"withdrawalidentity", maxCount:5}]) ,sellerController.updatewithdrawaldocuments);
router.post("/selleraddproducts/(:id)",upload("esports-products-images").array("images", 10), sellerController.selleraddproducts);
router.post("/sellerupdate/(:id)",Adminauthenticate,sellerController.updateseller); 
router.get("/sellerproductlist/(:id)", sellerController.sellerproductlist); 
router.get("/sellereditproduct/(:id)", sellerController.sellereditproduct);   
router.post("/sellerupdateProduct/(:id)",upload("esports-products-images").array("images", 10), sellerController.sellerupdateProduct); 
router.delete("/sellerdeleteProduct/(:id)", sellerController.sellerdeleteProduct);
router.get("/sellersoldproduct/(:id)", sellerController.sellersoldproduct);  
router.get("/sellersoldproduct/(:id)", sellerController.sellersoldproduct); 
router.get("/searchseller/(:id)", sellerController.searchseller); 
router.get("/sellersuccessfullorder/(:id)", sellerController.sellersuccessfullorder); 
router.get("/sellerflotorders/(:id)", sellerController.sellerflotorders); 
router.get("/sellerdashboarddetails/(:id)", sellerController.sellerdashboarddetails); 
router.get("/test", sellerController.test); 
module.exports = router;