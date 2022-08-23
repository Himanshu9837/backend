const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const url = "http://p.kindpng.com/picc/s/451-4517876_default-profile-hd-png-download.png";
const coverurl = "http://mlbarsxvhdhb.i.optimole.com/E29lw0I.Pw8W~84f3/w:auto/h:auto/q:55/https://www.centerforglobaldata.org/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/admin-default-cover.jpg";
const sequencing = require("../config/sequencing");
const { TRUE } = require("node-sass");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  id: Number,
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  dateofbirth: {
    type: String,
    required: false,
  },
  zipcode: {
    type: Number,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    require: true,
    type: { any: [Schema.Types.Mixed] },
  },
  image: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
    default: url,
  },
  coverimage: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
    default: coverurl,
  },
  userurl: {
    require: false,
    type: { any: [Schema.Types.Mixed] },
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "Active",
  },
  activestatus: {
    type: Boolean,
    default: true,
  },
  onlinestatus:{
    type:Boolean,
  },
  inactivestatus: {
    type: Boolean,
    default: false,
  },
  banstatus: {
    type: Boolean,
    default: false,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  about: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resetToken: String,
  expireToken: Date,
  lastlogin: Date,
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//hashing passwordfindByIdAndUpdate
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    // this.cpassword= await bcrypt.hash(this.cpassword,12);
  }
  next();
});

//we are generating token

userSchema.methods.generateAuthToken = async function () {
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

//storing the message
userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message }); //key value pair is same
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};
userSchema.pre("save", function (next) {
  let doc = this;
  sequencing
    .getSequenceNextValue("user_id")
    .then((counter) => {
      console.log("asdasd", counter);
      if (!counter) {
        sequencing
          .insertCounter("user_id")
          .then((counter) => {
            doc.id = counter;
            console.log(doc);
            next();
          })
          .catch((error) => next(error));
      } else {
        doc.id = counter;
        next();
      }
    })
    .catch((error) => next(error));
});

//collection creation

const User = mongoose.model("USER", userSchema);

module.exports = User;
