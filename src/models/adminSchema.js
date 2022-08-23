const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const adminSchema= new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    image: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
        default: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_960_720.png",
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    admin: {
        type: Boolean,
        default: false,
    },
    author: {
        type: Boolean,
        default: false,
    },
    publisher: {
        type: Boolean,
        default: false,
    },
    modifier: {
        type: Boolean,
        default: false,
    },
    restrictionstatus: {
        type: Boolean,
        default: false,
    },
    restrictions:{
    type:Array,
    },
    date : {
        type:Date,
        default:Date.now
    },

})


//hashing password
adminSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,12);
        this.cpassword= await bcrypt.hash(this.cpassword,12);
    }
    next();
})

adminSchema.methods.generateAuthToken = async function () {
    //we use a method of userschema
    try {
      let tokenNew = jwt.sign({ _id: this._id }, process.env.SECRET_KEY); //it takes payload(must be unique ex->_id) and secret/private key [options,callback]
      this.tokens = this.tokens.concat({ token: tokenNew }); //it concats(joins string) one token to the other token in the Tokens section of mongoose schema
      await this.save();
      return tokenNew; //returning token so that we can use it in auth.js
    } catch (error) {
      //we are getting _id from mongodb || this refers to a particular user details
      console.log(error);
    }
  };



const Adminuser=mongoose.model('Admin',adminSchema);

module.exports = Adminuser;
