const express = require("express");
// var cors = require('cors')
const app = require("../app");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userController = require("../src/controllers/user");
const authenticate = require("../src/middleware/Authenticate");    
const Adminauthenticate = require("../src/middleware/adminauthentication"); 
const path = require("path");
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
//user routes
router.post("/api/userregister", userController.register);
router.post("/api/usersignin", userController.login);
router.post("/api/home", authenticate, userController.check);
router.get("/api/userlist",userController.fetchUser);
router.get("/api/deleteuser/(:id)",Adminauthenticate, userController.deleteUser);
router.get("/api/edituser/(:id)", userController.edit);
router.post("/api/updateuser/(:id)",authenticate,upload("esports-user-images").fields([{ name: 'image', maxCount: 1 }, { name: 'coverimage', maxCount: 1 }]), userController.update);
router.post("/api/adminupdateuser/(:id)",Adminauthenticate,upload("esports-user-images").fields([{ name: 'image', maxCount: 1 }, { name: 'coverimage', maxCount: 1 }]), userController.adminuserupdate);
router.get("/api/userprofile/(:id)", userController.profileUser);
router.post("/api/forgetpassword",userController.forgetpassword);
router.post("/api/newpassword/(:token)",userController.newpassword);
router.post("/api/updatecheckoutaddress/(:token)",userController.updatecheckoutaddress);
router.post("/api/deleteselecteduser",Adminauthenticate, userController.multipledelete);
router.post("/api/changeuserstatus",Adminauthenticate ,userController.changestatus);
router.post("/api/emailverification", userController.emailverify);
router.post("/api/emailsuccess/(:token)",userController.emailsuccess);
router.post("/api/emailstatus",userController.emailstatus);
router.post("/api/emailexists",userController.emailexists);
router.get("/api/usernameexists/(:username)",userController.usernameexists); 
router.get("/api/checklogin/(:email)",userController.checklogin);
router.post("/api/staylogin",userController.staylogindays);
router.get("/api/time",userController.timeSet);
router.delete("/api/userdelete/(:id)",userController.userdelete);
router.post("/api/updateonlinestatus/(:id)",userController.updateonlinestatus);
router.get("/api/searchuser/(:id)",userController.searchuser);
router.post("/api/adminchatregister", userController.adminchatregister);
router.post("/api/adminlogin", userController.adminlogin);
router.post("/api/updateadminchatuser/(:id)",upload("esports-user-images").fields([{ name: 'image', maxCount: 1 }]), userController.updateadminchatuser);
router.delete("/api/deleteadminchatuser/(:id)",userController.deleteadminchatuser);
router.get("/api/currency",userController.currency);
router.post("/api/updateprofileimage/(:id)",authenticate,upload("esports-user-images").fields([{ name: 'image', maxCount: 1 }]), userController.updateprofileimage);
module.exports = router;