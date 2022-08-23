
const jwt = require('jsonwebtoken');
const Adminusers = require("../models/adminSchema");
const User = require("../models/userSchema");
require('dotenv').config();
const  Authenticate=async(req,res,next)=> {
    
    try {
        
        const token = req.headers.token;
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
       
       
        const adminUser=await Adminusers.findOne({_id:verifyToken.id})
     
        if (!adminUser) {
            throw new Error('admin not found')
        }
        //storing all data in req.token,req.rootUser,req.userId
        req.token = token;
        
        req.adminUser=adminUser
       
         req.adminID=adminUser._id;

         next();
    } catch (error) {
        res.status(401).send('Unauthorized:No token provided')
        console.log(error);
        
    }
   
}

module.exports= Authenticate;
