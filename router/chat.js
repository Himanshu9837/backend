const { addMessage, getMessages ,addmychat,fetchmychat,updatemessages,chatnotification,updatechatnotification,fetchsearchchat,allchatuser,
    addchatwelcome,fetchwelcome,updatewelcome,searchchatuser,testchat} = require("../src/controllers/chatcontroller");
const router = require("express").Router();
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
router.post("/addmsg/",upload("esports-chat-files").array("chatimage", 4), addMessage);
router.post("/getmsg/", getMessages);
 router.post("/addmychat",addmychat);
 router.get("/fetchmychat/(:id)",fetchmychat);
 router.post("/updatemessages/(:id)",updatemessages);
 router.post("/updatechatnotification/(:id)",updatechatnotification);
 router.get("/chatnotification/(:id)",chatnotification); 
  router.get("/searchchatuser/(:id)",searchchatuser);  
 router.get("/fetchsearchchat/(:id)",fetchsearchchat);   
 router.get("/allchatuser",allchatuser);
 router.post("/addchatwelcome/", addchatwelcome); 
 router.get("/fetchwelcome",fetchwelcome);
 router.post("/updatewelcome/(:id)",updatewelcome);
 router.get("/test/(:id)",testchat); 
module.exports = router;