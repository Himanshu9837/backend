const mongoose = require("mongoose");
const dotenv = require("dotenv");
var crypto    = require('crypto');
const productroutes = require("./router/product");
const categoryroutes = require("./router/category");
const cartroutes = require("./router/cart");
const searchroutes = require("./router/search");
const badgesroutes = require("./router/badges");
const ratingroutes = require("./router/rating");
const routerpagescontent = require("./router/pagescontent");
const currencyroutes = require("./router/currency");
const emailtemplateroutes = require("./router/emailtemplate");
const orderroutes = require("./router/orders");
const adminroutes = require("./router/admin");
const commission = require("./router/commission");
const chat = require("./router/chat");
const withdrawal_walllet = require("./router/withdrawal_walllet");
const sellerroutes = require("./router/seller");
const express = require("express");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
const Users = require("./src/models/userSchema");
var cron = require('node-cron');
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const bodyParser = require("body-parser");
app.use(bodyParser.json());
dotenv.config({ path: "./config.env" });
require("./db/conn");
require("./router/user");

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.static('uploads'));
app.set('view engine', 'jade');
const User = require("./src/models/userSchema");
const Adminusers = require("./src/models/adminSchema");
const Category = require("./src/models/categorySchema");
app.use(require("./router/user"));
// app.get('/request',function(req, res, next){

// 	var postData = {
// 		"appId" : '88250adba3a00b66ddd766a3a05288',
// 		"orderId" : "17",
// 		"orderAmount" : "1",
// 		"orderCurrency" : 'INR',
// 		"orderNote" : 'OK',
// 		'customerName' : 'OK',
// 		"customerEmail" : 'ABCD@GMAIL.COM',
// 		"customerPhone" : '1234567890',
// 		"returnUrl" : 'http://206.189.136.28:5000/response/23',
// 		"notifyUrl" : 'http://206.189.136.28:5000/response'
// 	},
// 	mode = "TEST",
// 	secretKey = "2e222c0d6358f3abb7592ff9155eefc1a735dbc9",
// 	sortedkeys = Object.keys(postData),
// 	url="",
// 	signatureData = "";
// 	sortedkeys.sort();
// 	for (var i = 0; i < sortedkeys.length; i++) {
// 		k = sortedkeys[i];
// 		signatureData += k + postData[k];
// 	}
// 	var signature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
// 	postData['signature'] = signature;
// 	if (mode == "PROD") {
// 	  url = "https://www.cashfree.com/checkout/post/submit";
// 	} else {
// 	  url = "https://test.cashfree.com/billpay/checkout/post/submit";
// 	}
// 	res.render('request',{postData : JSON.stringify(postData),url : url});
// });
app.use("/api/product", productroutes);
app.use("/api/category", categoryroutes);
app.use("/api/admin", adminroutes);
app.use("/api/pages", routerpagescontent);
app.use("/api/order", orderroutes);
app.use("/api/seller", sellerroutes);   
app.use("/api/chat", chat);
app.use("/api/currency", currencyroutes);
app.use("/api/emailtemplate", emailtemplateroutes);
app.use("/api/search", searchroutes);
app.use("/api/badges", badgesroutes);
app.use("/api/rating", ratingroutes);
app.use("/api/cart", cartroutes);
app.use("/api/commission", commission);
app.use("/api/withdrawal_wallet", withdrawal_walllet);
const PORT = process.env.PORT;
app.use('/response/:id',function(req, res, next){
  res.redirect(`https://esports4g.com/checkout/payment/${req.params.id}`);
})
const server=app.listen(5000, () => {
  console.log(`server is running at port no 5000`);
});

const io = socket(server, {
  cors: {
    origin:process.env.SECRET_FRONTEND,
    credentials: true,
  },
});
 
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  // console.log(socket);
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.emit("connected");
    io.sockets.emit("online", userId);
    console.log(userId, "Is Online!", socket.id);
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:"+room);
  });
  socket.on("typing", (room) =>{ 
  socket.to(room).emit("typing")});

  socket.on("testing", (room) =>{ 
    socket.to(room).emit("testing")});

    socket.on("stop typing", (room) =>{ 
    socket.to(room).emit("stop typing")});
  
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(sendUserSocket)
    if (sendUserSocket) {
      socket.in(data.from).emit("msg-recieve", data.text,data.to,data.from);
    }
  });


  // socket.on("send-msg", (newMessageRecieved) => {
   
  //   // if (!chat.to) return console.log("chat.users not defined");

  //   newMessageRecieved.forEach((user) => {
  //     if (user.from == newMessageRecieved.to) return;

  //     socket.in(user.to).emit("message recieved", newMessageRecieved.text);
  //   });
  // });




  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(socket.id);
  });
});
