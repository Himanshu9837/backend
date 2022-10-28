const Order = require("../models/orderSchema");
const Seller = require("../models/sellerSchema");
const Wallet = require("../models/walletSchema");
// const fetch = require('node-fetch');
const fetch = require('node-fetch');
// const Cartdata = require("../models/cartSchema");
const Withdrawalwallet = require("../models/paymentstatusSchema");
const commission = require("../models/commissionSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");
const Cartdata = require("../models/cartSchema");
const Products = require("../models/productSchema");
const twilio = require("twilio");
var requestIp = require("request-ip");
const axios = require("axios");
const nodemailer = require("nodemailer");
const paypal = require("paypal-rest-sdk");
// const fetch = require('node-fetch');
const request = require("request");
class Orders {
  async ordercreate(req, res) {
    console.log(req.body);
    const items = req.body.products;
    console.log(items);
    const userid = req.body.userId;
    const paymentmod = req.body.paymentmod;
    const transid = req.body.transactionId;
    const bodydata = req.body.details;
    for (const cartdata of items) {
      // console.log(1);
      const productid = cartdata.productId;
      const proddata = await Products.findOne({ _id: productid });
      const productname=proddata.productname;
      const productprice=proddata.price;
      if(proddata.stock>0){
      const auto = proddata.autodelivery;
      console.log(auto);
      const accountemail = proddata.account_email;
      const accountpassword = proddata.account_password;
      const accountspecialnote = proddata.account_specialnote;
      const accountusername = proddata.account_username;
      const selerId = cartdata.selerId;
      const subtotal = cartdata.subtotal;
      const quantity = cartdata.quantity;
      const pricetotal=productprice*quantity;
      if (auto == true) {
        const cartData = {
          transactionId: transid,
          orders: bodydata,
          productId: productid,
          quantity: quantity,
          selerId: selerId,
          confirm_by_seller: true,
          details_by_seller: true,
          account_email: accountemail,
          account_password: accountpassword,
          account_specialnote: accountspecialnote,
          account_username: accountusername,
          order_status: "Delivered",
          userId: userid,
          paymentfee:paymentfee,
          paymentmode: "paypal",
        };
        const cart = new Order(cartData);
        cart.save();
      } else {
        const cartData = {
          transactionId: transid,
          orders: bodydata,
          productId: productid,
          quantity: quantity,
          selerId: selerId,
          userId: userid,
          paymentmode: "paypal",
        };
        const cart = new Order(cartData);
        cart.save();
      }
      const pro = await Products.findOne({ _id: productid }).populate(
        "category"
      );
      const gamename = pro.category.name;
      const stock = pro.stock;
      const total = stock - quantity;
      const cartresult = await Products.findByIdAndUpdate(
        { _id: productid },
        { stock: total },
        { new: true }
      );
      if(total<=0){
        console.log('outofstcok')
        const data = await Cartdata.find();
        for await (const cart of data) {
          const cartdata = cart.items;
          for await (const itemdata of cartdata) {
            const proid = itemdata.productId;
            if (proid == productid) {
              const items = itemdata._id;
              const cartId = cart._id;
              const filtered = cartdata.filter((element) => {
                return element._id != items;
              });
              const subTotal = filtered.reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue.total,
                0
              );
              const qtyTotal = filtered.reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue.quantity,
                0
              );
              const result = await Cartdata.findByIdAndUpdate(
                { _id: cartId },
                { items: filtered, subTotal: subTotal, totalquantity: qtyTotal },
                { new: true }
              );
            }
          }
        }
      }
      //cart empty
      const cartuser = await Cartdata.findOne({ userId: userid });
      const cartid = cartuser._id;
      const itemss = [];
      const result = await Cartdata.findByIdAndUpdate(
        { _id: cartid },
        { items: itemss, subTotal: 0, totalquantity: 0 },
        { new: true }
      );
      //seller details
      const seller = await Seller.findOne({ _id: selerId }).populate("userId");
      const selleremail = seller.userId.email;
      const sellerphone = seller.userId.phone;
      const buyer = await User.findOne({ _id: userid });
      const buyeremail = buyer.email;

      const buyerphone = buyer.phone;
      console.log(buyerphone);
      //lastorder details
      const lastorder = await Order.findOne({}).sort({ _id: -1 }).limit(1);
      const orderid = lastorder.id;
      const ordermongo=lastorder._id;
      const orderinvoce=lastorder.invoiceid;
      //seller sms
      const accountSid = "123"; // Your Account SID from www.twilio.com/console
      const authToken = "123"; // Your Auth Token from www.twilio.com/console

      const twilio = require("twilio");
      const client = new twilio(accountSid, authToken);

      client.messages
        .create({
          body:
            "Your have new order  order-ID is-" +
            orderid +
            " & Game is-" +
            gamename,
          to: sellerphone, // Text this number
          from: "+12603015654", // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
      //seller email
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(
        "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"
      );
      const msg = {
        to: selleremail, // Change to your recipient
        from: "info@esports4g.com", // Change to your verified sender
        subject: "New Order",
        text: "you have new order",
        html:
          `<html>
          <body
            style="margin: 0;
            padding:0;
            background: #f9f9f9;
            "
            >
          <div
            class="emailtemplate"
            style="
              position:relative;
              font-family: sans-serif
            "
          >
            <div style="text-align: center;
            background:#044767;
            width:80%;
            margin:auto;
            ">
              <img
                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                style="height: 80px;"
              />
            </div>
            <div style="
            text-align: center;
            background:#F7F7F7;
            width:80%;
            margin:auto;
            padding: 3rem 0;
            ">
              <img
                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657624189503.jpeg"
                style="height: 120px;
          
                "
              />
              <h3
                style="color: #000;
                text-align: center;
                font-size: 20px;
                margin: 15px 0;"
                >
                MAIL TO SELLER REGARDING ORDER
                </h3>
            </div>
          
            <div
               style="
               text-align: center;
            background:#fff;
            width:80%;
            margin:auto;
            padding: 3rem 0;
               "
               >
                <p
                style="font-size: 18px;
                font-weight: 200;
                "
                >
                  Dear user,<br/>
                  Congratulations, you have a new order. To procced further, please click on the link below.
          Once you confirm the order, your respective customer will be informed.
                 <br/>
          </p>
          <div
          style="
          margin-top: 2rem;
          "
          >
            <a href="http://206.189.136.28:3010/dashboard/myorder/${ordermongo}"
            style="    text-decoration: none;
          color: #fff;
          background: #ED8E21;
          padding: 0.7rem 3rem;
          width: 100%;
          
          "
          >View Order</a>
          </div>
          
          
               </div>
               <div
               style="text-align: center;
               background:#e5eaf5;
               width:80%;
               margin:auto;
               padding: 1rem 0;"
               >
          
          
            <h3 className='footer_templete'
            style="text-align: center;
            font-size: 14px;
            color: #a7afb9;">
                      THANK YOU, TEAM ESPORTS4G
                  </h3>
                  <h3 className='footer_templete'
                  style="text-align: center;
                  font-size: 12px;
                  color: #a7afb9;"
                  >
                      Esports4g.com. All Right Reserved.
                  </h3>
            <div
              className="socialicons"
              style="
              width:215px;
              margin:auto;
              display:flex;
          
          
              "
            >
              <div className="icons" style="cursor: pointer; margin: 6px">
                <a target="_blank" href="https://www.facebook.com/Esports4G/">
                  <img
                    src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                    alt="not found"
                    style="width: 40px; height: 40px; border-radius: 50%"
                  />
                </a>
              </div>
               <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                height: 40px;
                                border-radius: 50%;
                               " />
                          </a>
                          </Link>
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
          
                          </a>
                          </Link>
          
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
                          </a>
                          </Link>
            </div>
          </div>
          </div>
          </div>
          </body>
          </html>`
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });

      //Buyer sms
      const buyeraccountSid = "123"; // Your Account SID from www.twilio.com/console
      const buyerauthToken = "123"; // Your Auth Token from www.twilio.com/console

      const buyertwilio = require("twilio");
      const buyerclient = new buyertwilio(buyeraccountSid, buyerauthToken);

      buyerclient.messages
        .create({
          body:
            "Thanku for order your order-ID is-" +
            orderid +
            " & Game is-" +
            gamename,
          to: buyerphone, // Text this number
          from: "+12603015654", // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
      //Buyer email
      const buyersgMail = require("@sendgrid/mail");
      buyersgMail.setApiKey(
        "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"
      );
      const nuyermsg = {
        to: buyeremail, // Change to your recipient
        from: "info@esports4g.com", // Change to your verified sender
        subject: "New Order",
        text: "you have new order",
        html:
         `<html>
         <body
           style="margin: 0;
           padding:0;
           background: #f9f9f9;
           "
           >
         <div
           class="emailtemplate"
           style="
             position:relative;
             font-family: sans-serif
           "
         >
           <div style="text-align: center;
           background:#044767;
           width:80%;
           margin:auto;
           ">
             <img
               src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
               style="height: 80px;"
             />
           </div>
           <div style="
           text-align: center;
           background:#F7F7F7;
           width:80%;
           margin:auto;
           padding: 3rem 0;
           ">
             <img
               src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657624189503.jpeg"
               style="height: 120px;
         
               "
             />
             <h3
               style="color: #000;
               text-align: center;
               font-size: 20px;
               margin: 15px 0;"
               >
               MAIL TO BUYER REGARDING ORDER
               </h3>
           </div>
         
           <div
              style="
              text-align: center;
           background:#fff;
           width:80%;
           margin:auto;
           padding: 3rem 0;
              "
              >
               <p
               style="font-size: 18px;
               font-weight: 200;
               "
               >
                 Dear user,<br/>
                 Thank you for your order. We hope you have great experience shopping at Esports4g.
                <br/>
         </p>
         <p>
           Email Id- ${buyeremail}
         </p>
         <p>
           Order Id-${orderid}
         </p>
         
         <div
         style="
         margin: 2rem 0;
         "
         >
           <a href="http://206.189.136.28:3010/dashboard/purchaseitem/${ordermongo}"
           style="    text-decoration: none;
         color: #fff;
         background: #ED8E21;
         padding: 0.7rem 3rem;
         width: 100%;
         
         "
         >View Order</a>
         </div>
         <p
         style="text-align: center;
                 font-size: 12px;
                 color: #a7afb9;"
         >
           To explore different game items and avail amazing discounts, visit our website https://esports4g.com/
         </p>
         
         
              </div>
              <div
              style="text-align: center;
              background:#e5eaf5;
              width:80%;
              margin:auto;
              padding: 1rem 0;"
              >
         
         
           <h3 className='footer_templete'
           style="text-align: center;
           font-size: 14px;
           color: #a7afb9;">
                     THANK YOU, TEAM ESPORTS4G
                 </h3>
                 <h3 className='footer_templete'
                 style="text-align: center;
                 font-size: 12px;
                 color: #a7afb9;"
                 >
                     Esports4g.com. All Right Reserved.
                 </h3>
           <div
             className="socialicons"
             style="
             width:215px;
             margin:auto;
             display:flex;
         
         
             "
           >
             <div className="icons" style="cursor: pointer; margin: 6px">
               <a target="_blank" href="https://www.facebook.com/Esports4G/">
                 <img
                   src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                   alt="not found"
                   style="width: 40px; height: 40px; border-radius: 50%"
                 />
               </a>
             </div>
              <div className="icons" style="cursor: pointer;
                     margin: 6px;
                    ">
                         <Link passHref={true}>
                         <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                             <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                               height: 40px;
                               border-radius: 50%;
                              " />
                         </a>
                         </Link>
                     </div>
                     <div className="icons" style="cursor: pointer;
                     margin: 6px;
                    ">
                         <Link passHref={true}>
                         <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                             <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                             height: 40px;
                             border-radius: 50%;
                            " />
         
                         </a>
                         </Link>
         
                     </div>
                     <div className="icons" style="cursor: pointer;
                     margin: 6px;
                    ">
                         <Link passHref={true}>
                         <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                             <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                             height: 40px;
                             border-radius: 50%;
                            " />
                         </a>
                         </Link>
           </div>
         </div>
         </div>
         </div>
         </body>
         </html>`,
      };
      buyersgMail
        .send(nuyermsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
        const buyersgMail1 = require("@sendgrid/mail");
        buyersgMail1.setApiKey(
          "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"
        );
        const invoicmsg = {
          to: buyeremail, // Change to your recipient
          from: "info@esports4g.com", // Change to your verified sender
          subject: "New Order",
          text: "you have new order",
          html:
           `<html>
           <body
             style="margin: 0;
             padding:0;
             background: #f9f9f9;
             "
             >
               <div
                    class="emailtemplate"
                    style="
                      position:relative;
                      font-family: sans-serif
                    "
                  >
                    <div style="text-align: center;
                    background:#1e1e1e;
                    width:80%;
                    margin:auto;
                    ">
                      <img
                        src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                        style="height: 80px;"
                      />
                    </div>
                    <div
                      style="
                        background: #fff;
                        width: 80%;
                        position:relative;
                        margin: auto;
                        padding: 2rem 0;
                      "
                    >
           
                      <h2
                        style="
                            margin: 0;
               font-family: sans-serif;
               letter-spacing: -1px;
               color: #dc8e3a;
               font-size: 24px;
               padding-left: 2rem;
                        "
                      >
                    Thanks for your order
                      </h2>
                      <div style="padding-left: 2rem;">
                        <span
                          className="passowrdlink"
                          style="font-size: 14px; color: #000"
                        >
                        Thanks for shopping with us. We'll send you the tracking number when you item ships.
                        </span>
                      </div>
           
                      <div
                      style="
                          background: #fff4e9;
               padding: 15px;
               margin: 2rem;
                      "
                      >
                       <h4
           
                       >
                         Your Order ID is ${orderid}
                       </h4>
                       <p>
                         A summary of your order is shown belown.To view the status of your order.
                       </p>
                       </div>
           
           <div
           style="margin:2rem;"
           >
                       <table
                       style="
                        font-family: arial, sans-serif;
             border-collapse: collapse;
             width: 100%;
                       "
                       >
                         <tr>
                           <th
                           style="
                            border: 1px solid #dddddd;
                            background: #dddddd;
             text-align: left;
             padding: 8px;
                           "
                           >Product Name</th>
                           <th
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;
             background: #dddddd;
                           "
                           >Qunatity</th>
                           <th
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;
             background: #dddddd;
                           "
                           >Payment Method</th>
                           <th
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;
             background: #dddddd;
                           "
                           >Price</th>
                           <th
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;
             background: #dddddd;
                           "
                           >Item Total</th>
           
                         </tr>
                         <tr>
                           <td
           
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;"
           
                           >${productname}</td>
                           <td
           
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;"
           
                           >${quantity}</td>
                           <td
           
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;"
           
                           >payment method</td>
                           <td
           
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;"
           
                           >${productprice}</td>
                           <td
           
                           style="
                            border: 1px solid #dddddd;
             text-align: left;
             padding: 8px;"
           
                           >${pricetotal}</td>
           
                         </tr>
           
           
                       </table>
                       </div>
           
           
                       <div
                       style="
                           text-align: right;
               margin: 2rem;
                       "
                       >
           
                         <table
                         style="
                         width:100%;
                         "
                         >
                           <tr>
                            <td
                            style="
                            width:90%
                            "
                            >Subtotal:</td>
                            <td>${pricetotal}</td>
                           </tr>
                           <tr>
                             <td
                             style="
                             width:90%
                             "
                             >Payment Fees:</td>
                             <td>${paymentfee}</td>
                           </tr>
                           <tr>
                             <td
                             style="
                             width:90%
                             "
                             >Grand Toatl:</td>
                             <td>${pricetotal+paymentfee}</td>
                           </tr>
                         </table>
                       </div>
           
           
           
           
           
           
                    </div>
                    <div
                    style="text-align: center;
                    background:#e5eaf5;
                    width:80%;
                    margin:auto;
                    padding: 1rem 0;"
                    >
           
           
                 <h3 className='footer_templete'
                 style="text-align: center;
                 font-size: 14px;
                 color: #a7afb9;">
                           THANK YOU, TEAM ESPORTS4G
                       </h3>
                       <h3 className='footer_templete'
                       style="text-align: center;
                       font-size: 12px;
                       color: #a7afb9;"
                       >
                           Esports4g.com. All Right Reserved.
                       </h3>
                 <div
                   className="socialicons"
                   style="
                   width:215px;
                   margin:auto;
                   display:flex;
           
           
                   "
                 >
                   <div className="icons" style="cursor: pointer; margin: 6px">
                     <a target="_blank" href="https://www.facebook.com/Esports4G/">
                       <img
                         src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                         alt="not found"
                         style="width: 40px; height: 40px; border-radius: 50%"
                       />
                     </a>
                   </div>
                    <div className="icons" style="cursor: pointer;
                           margin: 6px;
                          ">
                               <Link passHref={true}>
                               <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                   <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                     height: 40px;
                                     border-radius: 50%;
                                    " />
                               </a>
                               </Link>
                           </div>
                           <div className="icons" style="cursor: pointer;
                           margin: 6px;
                          ">
                               <Link passHref={true}>
                               <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                   <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                   height: 40px;
                                   border-radius: 50%;
                                  " />
           
                               </a>
                               </Link>
           
                           </div>
                           <div className="icons" style="cursor: pointer;
                           margin: 6px;
                          ">
                               <Link passHref={true}>
                               <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                   <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                   height: 40px;
                                   border-radius: 50%;
                                  " />
                               </a>
                               </Link>
                 </div>
               </div>
               </div>
               </div>
           </body>
           </html>`,
        };
        buyersgMail1
          .send(invoicmsg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
    }else{
      res.status(400).json("Product out of stock" )
    }
  }
    res.status(200).json({ message: "Order successfull created" });
  }

  // async orderlist(req, res) {
  //   const data = await order.find();
  //   return res.status(200).json(data);
  // }

  async updatestock(req, res) {
    const id = req.params.id;
    const cartId = req.body.cartId;
    const orderdetails = await Order.findOne({ transactionId: id });

    const data = orderdetails.itemname;
    console.log(orderdetails);
    const itemsquantity = orderdetails.itemqty;
    const filtered = data.filter((element) => {
      return element._id != id;
    });
    const filtered1 = itemsquantity.filter((element) => {
      return element._id != id;
    });

    for (let i = 0; i < filtered.length; i++) {
      // for await (const details1 of filtered1) {
      const pname = filtered[i];
      const pro = await Products.find({ metaurl: pname });
      for (let j = 0; j < pro.length; j++) {
        var pid = pro[j]._id;
        console.log(pid);
        var stock = pro[j].stock;
        const qty = filtered1[i];

        if (qty > 0) {
          const total = stock - qty;
          console.log(total);

          const result = await Products.findByIdAndUpdate(
            { _id: pid },
            { stock: total },
            { new: true }
          );
        }
      }
    }
    let cart = await Cartdata.findOne({ _id: cartId });

    const itemss = [];
    const result = await Cartdata.findByIdAndUpdate(
      { _id: cartId },
      { items: itemss, subTotal: 0, totalquantity: 0 },
      { new: true }
    );
    return res.status(200).json({ message: "updated" });
    // let updatedProduct = {};
    //     updatedProduct.stock = quantitystock;
    //    //
    //    // //hashing done before save
    //     await Products.findByIdAndUpdate(productID, updatedProduct);
    //
    //     return res.status(200).json({message:"update sucessfully"});
  }

  async checkorderlist(req, res) {
    const id = req.params.id;
    const check = await Order.findOne({ transactionId: id });
    console.log(check);
    if (!check) {
      return res.status(200).json("ok");
    } else {
      console.log(check);
      return res.status(200).json(check._id);
    }
  }

  async multipledelete(req, res) {
    const id = req.body.orderid;
    try {
      for await (const data of id) {
        Order.findByIdAndRemove(data, (err) => {});
      }
      return res.status(200).json({
        success: true,
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async orderdelete(req, res) {
    const id = req.params.id;
    try {
      Order.findByIdAndRemove(id, (err) => {
        if (!err) {
          return res.status(200).json({
            success: true,
            message: "deleted",
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "data not delete",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendsms(req, res) {
    const accountSid = "123"; // Your Account SID from www.twilio.com/console
    const authToken = "123"; // Your Auth Token from www.twilio.com/console

    const twilio = require("twilio");
    const client = new twilio(accountSid, authToken);

    client.messages
      .create({
        body: "Your have new order  order-ID is-ESP1",
        to: "+918527826031", // Text this number
        from: "+12603015654", // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
    return res.status(200).json({ message: "sms send" });

    // const accountSid = "AC9ea9eca1fc017cf732e9940dd276c5a4";
    // const authToken = "199592c7416519635d0f80951fcee283";
    // const client = require('twilio')(accountSid, authToken);

    // client.messages
    //       .create({from:'+12603015654', to:'+919555139005',body: 'Hi there'})
    //       .then(message => console.log(message.sid));
  }
  async email(req, res) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(
      "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"
    );
    const msg = {
      to: "guliamanish92@gmail.com", // Change to your recipient
      from: "info@esports4g.com", // Change to your verified sender
      subject: "New Order",
      text: "you have new order",
      html: "<strong>orderID : Esp1</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async selectorder(req, res) {
    const id = req.params.id;
    try {
      const orderdata = await Order.find({ _id: id }).populate("productId").populate("userId");
      if (!orderdata) {
        return res.status(400).json({ message: "not find" });
      } else {
        return res.status(200).json({ result: orderdata });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async selectorder(req, res) {
    const id = req.params.id;
    try {
      const orderdata = await Order.find({ _id: id }).populate("productId").populate("userId");
      if (!orderdata) {
        return res.status(400).json({ message: "not find" });
      } else {
        return res.status(200).json({ result: orderdata });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async orderststuschange(req, res) {
    const id = req.params.id;
    const status = req.body.status;
    try {
      const updateorder = {};
      updateorder.order_status = status;
      await Order.findByIdAndUpdate(id, updateorder);
      return res.status(200).json({ message: "order update successfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async order_confirm_by_seller(req, res) {
    const id = req.params.id;
    try {
      const updateorder = {};
      updateorder.order_status = "Processing";
      updateorder.confirm_by_seller = true;
      await Order.findByIdAndUpdate(id, updateorder);
      const buyersgMail = require("@sendgrid/mail");
      buyersgMail.setApiKey(
        "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"
      );
      const order = await Order.findOne({ _id: id });
      const orderid = order.id;
      const userid = order.userId;
      const user = await User.findOne({ _id: userid });
      const buyeremail = user.email;
      const nuyermsg = {
        to: buyeremail, // Change to your recipient
        from: "info@esports4g.com", // Change to your verified sender
        subject: "Order confirm",
        text: "you order confirm",
        html:
         `<html>
         <body
           style="margin: 0;
           padding:0;
           background: #f9f9f9;
           "
           >
         <div
           class="emailtemplate"
           style="
             position:relative;
             font-family: sans-serif
           "
         >
           <div style="text-align: center;
           background:#044767;
           width:80%;
           margin:auto;
           ">
             <img
               src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
               style="height: 80px;"
             />
           </div>
           <div style="
           text-align: center;
           background:#F7F7F7;
           width:80%;
           margin:auto;
           padding: 3rem 0;
           ">
             <img
               src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657624189503.jpeg"
               style="height: 120px;
         
               "
             />
             <h3
               style="color: #000;
               text-align: center;
               font-size: 20px;
               margin: 15px 0;"
               >
               MAIL TO BUYER – CONFIRMATION OF ORDER
               </h3>
           </div>
         
           <div
              style="
              text-align: center;
           background:#fff;
           width:80%;
           margin:auto;
           padding: 3rem 0;
              "
              >
               <p
               style="font-size: 18px;
               font-weight: 200;
               "
               >
                 Dear user,<br/>
                 Congratulations on confirmation of your order with order id-${orderid}. Your order is now getting processed. You can check your order status from the order panel.
                <br/>
         </p>
         <p>
           We hope you had a great experience shopping with Esports4g
         </p>
         
         
         <div
         style="
         margin: 2rem 0;
         "
         >
           <a href="http://206.189.136.28:3010/dashboard/purchaseitem/${id}"
           style="    text-decoration: none;
         color: #fff;
         background: #ED8E21;
         padding: 0.7rem 3rem;
         width: 100%;
         
         "
         >View Order</a>
         </div>
         
         
              </div>
              <div
              style="text-align: center;
              background:#e5eaf5;
              width:80%;
              margin:auto;
              padding: 1rem 0;"
              >
         
         
           <h3 className='footer_templete'
           style="text-align: center;
           font-size: 14px;
           color: #a7afb9;">
                     THANK YOU, TEAM ESPORTS4G
                 </h3>
                 <h3 className='footer_templete'
                 style="text-align: center;
                 font-size: 12px;
                 color: #a7afb9;"
                 >
                     Esports4g.com. All Right Reserved.
                 </h3>
           <div
             className="socialicons"
             style="
             width:215px;
             margin:auto;
             display:flex;
         
         
             "
           >
             <div className="icons" style="cursor: pointer; margin: 6px">
               <a target="_blank" href="https://www.facebook.com/Esports4G/">
                 <img
                   src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                   alt="not found"
                   style="width: 40px; height: 40px; border-radius: 50%"
                 />
               </a>
             </div>
              <div className="icons" style="cursor: pointer;
                     margin: 6px;
                    ">
                         <Link passHref={true}>
                         <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                             <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                               height: 40px;
                               border-radius: 50%;
                              " />
                         </a>
                         </Link>
                     </div>
                     <div className="icons" style="cursor: pointer;
                     margin: 6px;
                    ">
                         <Link passHref={true}>
                         <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                             <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                             height: 40px;
                             border-radius: 50%;
                            " />
         
                         </a>
                         </Link>
         
                     </div>
                     <div className="icons" style="cursor: pointer;
                     margin: 6px;
                    ">
                         <Link passHref={true}>
                         <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                             <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                             height: 40px;
                             border-radius: 50%;
                            " />
                         </a>
                         </Link>
           </div>
         </div>
         </div>
         </div>
         </body>
         </html>`,
      };
      buyersgMail
        .send(nuyermsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
      return res
        .status(200)
        .json({ message: "Status update", result: updateorder });
    } catch (error) {
      console.log(error);
    }
  }

  async order_seller_rating(req, res) {
    const id = req.params.id;
    try {
      const updateorder = {};
      updateorder.issellerrating = true;
      await Order.findByIdAndUpdate(id, updateorder);
      return res.status(200).json({ message: "rating sucessfull" });
    } catch (error) {
      console.log(error);
    }
  }

  async order_buyer_rating(req, res) {
    const id = req.params.id;
    try {
      const updateorder = {};
      updateorder.isbuyerrating = true;
      await Order.findByIdAndUpdate(id, updateorder);
      return res.status(200).json({ message: "rating sucessfull" });
    } catch (error) {
      console.log(error);
    }
  }

  async details_by_seller(req, res) {
    const id = req.params.id;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const specialnote = req.body.specialnote;
    try {
      const updateorder = {};
      updateorder.order_status = "Delivered";
      updateorder.details_by_seller = true;
      updateorder.account_username = username;
      updateorder.account_email = email;
      updateorder.account_password = password;
      updateorder.account_specialnote = specialnote;
      await Order.findByIdAndUpdate(id, updateorder);
      const buyersgMail = require("@sendgrid/mail");
      buyersgMail.setApiKey(
        "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"
      );
      const order = await Order.findOne({ _id: id });
      const orderid = order.id;
      const userid = order.userId;
      const user = await User.findOne({ _id: userid });
      const buyeremail = user.email;
      const nuyermsg = {
        to: buyeremail, // Change to your recipient
        from: "info@esports4g.com", // Change to your verified sender
        subject: "Order Delivered",
        text: "you order Delivered",
        html:
          `<html>
          <body
            style="margin: 0;
            padding:0;
            background: #f9f9f9;
            "
            >
          <div
            class="emailtemplate"
            style="
              position:relative;
              font-family: sans-serif
            "
          >
            <div style="text-align: center;
            background:#044767;
            width:80%;
            margin:auto;
            ">
              <img
                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                style="height: 80px;"
              />
            </div>
            <div style="
            text-align: center;
            background:#F7F7F7;
            width:80%;
            margin:auto;
            padding: 3rem 0;
            ">
              <img
                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657624189503.jpeg"
                style="height: 120px;
          
                "
              />
              <h3
                style="color: #000;
                text-align: center;
                font-size: 20px;
                margin: 15px 0;"
                >
                MAIL TO BUYER-REGARDING DELIVERING OF ORDER
                </h3>
            </div>
          
            <div
               style="
               text-align: center;
            background:#fff;
            width:80%;
            margin:auto;
            padding: 3rem 0;
               "
               >
                <p
                style="font-size: 18px;
                font-weight: 200;
                "
                >
                  Dear user,<br/>
                  Your order with order id ${orderid} has been delivered to you. The credentials for the account will be received on the order dashboard. Kindly check your order.
                 <br/>
          </p>
          <p>
            Thank you for trusting Esports4g.
          </p>
          <p>
            Continue exploring more gaming items at jaw dropping prices at https://esports4g.com/
          </p>
          
          <div
          style="
          margin: 2rem 0;
          "
          >
            <a href="http://206.189.136.28:3010/dashboard/purchaseitem/${id}"
            style="    text-decoration: none;
          color: #fff;
          background: #ED8E21;
          padding: 0.7rem 3rem;
          width: 100%;
          
          "
          >View Order</a>
          </div>
          
          
               </div>
               <div
               style="text-align: center;
               background:#e5eaf5;
               width:80%;
               margin:auto;
               padding: 1rem 0;"
               >
          
          
            <h3 className='footer_templete'
            style="text-align: center;
            font-size: 14px;
            color: #a7afb9;">
                      THANK YOU, TEAM ESPORTS4G
                  </h3>
                  <h3 className='footer_templete'
                  style="text-align: center;
                  font-size: 12px;
                  color: #a7afb9;"
                  >
                      Esports4g.com. All Right Reserved.
                  </h3>
            <div
              className="socialicons"
              style="
              width:215px;
              margin:auto;
              display:flex;
          
          
              "
            >
              <div className="icons" style="cursor: pointer; margin: 6px">
                <a target="_blank" href="https://www.facebook.com/Esports4G/">
                  <img
                    src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                    alt="not found"
                    style="width: 40px; height: 40px; border-radius: 50%"
                  />
                </a>
              </div>
               <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                height: 40px;
                                border-radius: 50%;
                               " />
                          </a>
                          </Link>
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
          
                          </a>
                          </Link>
          
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
                          </a>
                          </Link>
            </div>
          </div>
          </div>
          </div>
          </body>
          </html>`,
      };
      buyersgMail
        .send(nuyermsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
      return res
        .status(200)
        .json({ message: "Status update", result: updateorder });
    } catch (error) {
      console.log(error);
    }
  }
  async complete_by_buyer(req, res) {
    const orderid = req.params.id;
    try {
      const sum = 0;
      const totalamount = [];
      const finalamountdata = [];
      const updateorder = {};
      updateorder.order_status = "Complete";
      updateorder.buyer_confirm = true;
      await Order.findByIdAndUpdate(orderid, updateorder);
      const orderdata = await Order.findOne({ _id: orderid });
      const productID = orderdata.productId;
      const sellerID = orderdata.selerId;
      // const orderid = orderdata.id;
      const productdata = await Products.findOne({ _id: productID });
      const productprice = productdata.price;
      const sellerdata = await Seller.findOne({ _id: sellerID });
      const selleruserid = sellerdata.userId;
      
      const sellercomission = sellerdata.commission;
      const buyersgMail = require("@sendgrid/mail");
      buyersgMail.setApiKey(
        "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"
      );
      // const d = new Date();

      // console.log(d);
      // let month =  (dd.getMonth() + 1).toString().padStart(2, "0");
      // let month = (d.getMonth() <= 9 ? "0" : "") + (d.getMonth() + 1);
      // let year = d.getFullYear();
      //  console.log(d)
      // const fromdate = `${year}-${month}-01T00:00:00.000Z`;
      //  var input_date = new Date(fromdate).toISOString();

      // console.log(fromdate);
      if (sellercomission == false) {
        var total = 0;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const sellerorder = await Order.find({
          selerId: sellerID,order_status:'Complete',
          createdAt: {
            $gte: new Date( date ),
            $lt: new Date( firstDay )
            // $lt: new Date(d).toISOString(),
          },
        });
        console.log(sellerorder);
        for (const products of sellerorder) {
          const proid = products.productId;

          const pro = await Products.findOne({ _id: proid });

          const proamount = pro.price;

          total += proamount;
        }
        console.log(total);

        // let totalamounts = totalamount.toString();
        const commissiondata = await commission.find();
        const heighest = await commission
          .findOne({})
          .sort({ applyedtotamount: -1 })
          .limit(1);
        const minimum = await commission
          .findOne({})
          .sort({ applyedtotamount: 1 })
          .limit(1);

        const mostheighest = heighest.applyedtotamount;
        const mostpercenage = heighest.commissionpercentage;

        const mostminimum = minimum.applyedtotamount;
        const minpercenage = minimum.commissionpercentage;

        if (total >= mostheighest) {
          const comissionpercentage = mostpercenage / 100;
          const finallcomssion = comissionpercentage * productprice;
          const finallprice = productprice - finallcomssion;
          finalamountdata.push(finallprice);
        } else if (total <= mostminimum) {
          console.log(minpercenage);
          const comissionpercentage = minpercenage / 100;
          const finallcomssion = comissionpercentage * productprice;
          const finallprice = productprice - finallcomssion;
          finalamountdata.push(finallprice);
        } else {
          for await (const comm of commissiondata) {
            if (total > comm.applyedtotamount) {
              const comissionpercentage = comm.commissionpercentage / 100;
              const finallcomssion = comissionpercentage * productprice;
              const finallprice = productprice - finallcomssion;
              finalamountdata.push(finallprice);
              break;
            }
          }
        }
        let totalfinal = finalamountdata.toString();
        console.log(totalfinal);
        const walletdata = await Wallet.findOne({ userId: selleruserid });
        if (!walletdata) {
          const wData = {
            total: totalfinal,
            userId: selleruserid,
          };
          const wallet = new Wallet(wData);
          wallet.save();
        } else {
          const totalprice =
            parseFloat(walletdata.total) + parseFloat(totalfinal);
          const updatewallet = {};
          updatewallet.total = totalprice;
          await Wallet.findByIdAndUpdate(walletdata._id, updatewallet);
        }
      } else {
        const sellercomissionrate=sellerdata.commissionpercentage;
        const comissionpercentage = sellercomissionrate / 100;
        const finallcomssion = comissionpercentage * productprice;
        const finallprice = productprice - finallcomssion;
        const walletdata = await Wallet.findOne({ userId: selleruserid });
        if (!walletdata) {
          const wData = {
            total: finallprice,
            userId: selleruserid,
          };
          const wallet = new Wallet(wData);
          wallet.save();
        } else {
          const totalprice = walletdata.total + finallprice;
          const updatewallet = {};
          updatewallet.total = totalprice;
          await Wallet.findByIdAndUpdate(walletdata._id, updatewallet);
        }
      }
      
      const user = await User.findOne({ _id: selleruserid });
      const buyeremail = user.email;
      const nuyermsg = {
        to: buyeremail, // Change to your recipient
        from: "info@esports4g.com", // Change to your verified sender
        subject: "Order Complete",
        text: "you order Complete",
        html:
          `<html>
          <body
            style="margin: 0;
            padding:0;
            background: #f9f9f9;
            "
            >
          <div
            class="emailtemplate"
            style="
              position:relative;
              font-family: sans-serif
            "
          >
            <div style="text-align: center;
            background:#044767;
            width:80%;
            margin:auto;
            ">
              <img
                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                style="height: 80px;"
              />
            </div>
            <div style="
            text-align: center;
            background:#F7F7F7;
            width:80%;
            margin:auto;
            padding: 3rem 0;
            ">
              <img
                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657624189503.jpeg"
                style="height: 120px;
          
                "
              />
              <h3
                style="color: #000;
                text-align: center;
                font-size: 20px;
                margin: 15px 0;"
                >
                MAIL TO SELLER – ORDER COMPLETE
                </h3>
            </div>
          
            <div
               style="
               text-align: center;
            background:#fff;
            width:80%;
            margin:auto;
            padding: 3rem 0;
               "
               >
                <p
                style="font-size: 18px;
                font-weight: 200;
                "
                >
                  Dear user,<br/>
                  You order has been successfully delivered. You can check your order status in the order dashboard.
                 <br/>
          </p>
          <p>
            Thank you for trusting Esports4g and to continue shopping visit https://esports4g.com/
          </p>
          
          
          <div
          style="
          margin: 2rem 0;
          "
          >
            <a href="http://206.189.136.28:3010/dashboard/myorder/${orderid}"
            style="    text-decoration: none;
          color: #fff;
          background: #ED8E21;
          padding: 0.7rem 3rem;
          width: 100%;
          
          "
          >View Order</a>
          </div>
          
          
               </div>
               <div
               style="text-align: center;
               background:#e5eaf5;
               width:80%;
               margin:auto;
               padding: 1rem 0;"
               >
          
          
            <h3 className='footer_templete'
            style="text-align: center;
            font-size: 14px;
            color: #a7afb9;">
                      THANK YOU, TEAM ESPORTS4G
                  </h3>
                  <h3 className='footer_templete'
                  style="text-align: center;
                  font-size: 12px;
                  color: #a7afb9;"
                  >
                      Esports4g.com. All Right Reserved.
                  </h3>
            <div
              className="socialicons"
              style="
              width:215px;
              margin:auto;
              display:flex;
          
          
              "
            >
              <div className="icons" style="cursor: pointer; margin: 6px">
                <a target="_blank" href="https://www.facebook.com/Esports4G/">
                  <img
                    src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                    alt="not found"
                    style="width: 40px; height: 40px; border-radius: 50%"
                  />
                </a>
              </div>
               <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                height: 40px;
                                border-radius: 50%;
                               " />
                          </a>
                          </Link>
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
          
                          </a>
                          </Link>
          
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
                          </a>
                          </Link>
            </div>
          </div>
          </div>
          </div>
          </body>
          </html>`,
      };
      buyersgMail
        .send(nuyermsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
      return res
        .status(200)
        .json({ message: "Status update", result: updateorder });
    } catch (error) {
      console.log(error);
    }
  }
  async orderlist(req, res) {
    try {
      const datearray = [];
      const orderlist = await Order.find()
        .sort({ _id: -1 })
        .populate("productId")
        .populate("selerId")
        .populate("userId");
        if(orderlist.length<=0){
          return res.status(400).json('no order found'); 
        }else{
        var clientIp = requestIp.getClientIp(req);
        const data1 = clientIp.split(":").pop();
        const res1 = await fetch(`http://ip-api.com/json/${data1}`);
        const user = await res1.json();
        var final = user;
        const time = final.timezone;
      for await (const data of orderlist) {
        const date = data.createdAt;
        var LocalDate = new Date(date);

        LocalDate.setMilliseconds(0);
        var options = { hour12: false };

        var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
          timeZone: time,
        });
        datearray.push(RemoteLocaleStr);
      }
    
      return res.status(200).json({ orderlist, datearray });
    }
    } catch (error) {
      console.log(error);
    }
  }
  async sellerorderlist(req, res) {
    const userid = req.params.id;
    try {
      const datearray = [];
      const sellerdata = await Seller.findOne({ userId: userid });
      if (!sellerdata) {
        return res.status(400).json({ message: "No seller found" });
      } else {
        const sellerId = sellerdata._id;
        const orderlist = await Order.find({ selerId: sellerId })
          .sort({ _id: -1 })
          .populate("productId")
          .populate("userId");
          if(orderlist.length<=0){
            return res.status(400).json({orderlist});
          }else{
          var clientIp = requestIp.getClientIp(req);
          const data1 = clientIp.split(":").pop();
          const res1 = await fetch(`http://ip-api.com/json/${data1}`);
          const user = await res1.json();
          var final = user;
          const time = final.timezone;
          for await (const data of orderlist) {
            const date = data.createdAt;
            var LocalDate = new Date(date);
    
            LocalDate.setMilliseconds(0);
            var options = { hour12: false };
    
            var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
              timeZone: time,
            });
            datearray.push(RemoteLocaleStr);
          }
        return res.status(200).json({ orderlist, datearray });
          }
    }
    } catch (error) {
      console.log(error);
    }
  }
  async buyerorderlist(req, res) {
    const userid = req.params.id;
    try {
      const datearray = [];
      const gamedata=[];
      const orderlist = await Order.find({ userId: userid })
        .sort({ _id: -1 })
        .populate("productId")
        .populate("selerId");
        if(orderlist.length<=0){
          return res.status(200).json(orderlist);
        }else{
          var clientIp = requestIp.getClientIp(req);
          const data1 = clientIp.split(":").pop();
          const res1 = await fetch(`http://ip-api.com/json/${data1}`);
          const user = await res1.json();
          var final = user;
          const time = final.timezone;
        for await(const data of orderlist){
          const date = data.createdAt;
          var LocalDate = new Date(date);
  
          LocalDate.setMilliseconds(0);
          var options = { hour12: false };
  
          var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
            timeZone: time,
          });
          datearray.push(RemoteLocaleStr);
        }

      return res.status(200).json({ orderlist, datearray });
        }
    } catch (error) {
      console.log(error);
    }
  }
  async notworking(req, res) {
    const orderid = req.params.id;
    try {
      const updateorder = {};
      updateorder.order_status = "Processing";
      updateorder.buyer_confirm = false;
      updateorder.details_by_seller = false;
      const orderdata = await Order.findOne({ _id: orderid });
      const sellerID = orderdata.selerId;
      const sellerdata = await Seller.findOne({ _id: sellerID });
      const selleruserid = sellerdata.userId;
      const buyersgMail = require("@sendgrid/mail");
      buyersgMail.setApiKey(
        "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"
      );
      await Order.findByIdAndUpdate(orderid, updateorder);
      const user = await User.findOne({ _id: selleruserid });
      const buyeremail = user.email;
      const nuyermsg = {
        to: buyeremail, // Change to your recipient
        from: "info@esports4g.com", // Change to your verified sender
        subject: "Order Not Working",
        text: "you order Not Working",
        html:
          `<html>
          <body
            style="margin: 0;
            padding:0;
            background: #f9f9f9;
            "
            >
          <div
            class="emailtemplate"
            style="
              position:relative;
              font-family: sans-serif
            "
          >
            <div style="text-align: center;
            background:#044767;
            width:80%;
            margin:auto;
            ">
              <img
                src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                style="height: 80px;"
              />
            </div>
            <div style="
            text-align: center;
            background:#F7F7F7;
            width:80%;
            margin:auto;
          
            ">
              <h3
                style="color: #fff;
                text-align: center;
                font-size: 20px;
                background: #ED8E21;
                margin: 0;
              padding: 1rem 0;
              background: #ED8E21;
                "
          
                >
          MAIL TO SELLER – ACCOUNT NOT WORKING
                </h3>
            </div>
          
            <div
               style="
               text-align: center;
            background:#fff;
            width:80%;
            margin:auto;
            padding: 3rem 0;
               "
               >
                <p
                style="font-size: 18px;
                font-weight: 200;
                "
                >
                  Dear user,<br/>
                  The information provided by you regarding the order is irrelevant. Kindly check the details.
                 <br/>
          </p>
          <p>
            Your order status is now processing.
          </p>
          <p
           style="text-align: center;
                  font-size: 12px;
                  color: #a7afb9;"
          >
            For any queries, you may contact the customer support at  https://esports4g.com/
          </p>
          
          
          
          
          
               </div>
               <div
               style="text-align: center;
               background:#e5eaf5;
               width:80%;
               margin:auto;
               padding: 1rem 0;"
               >
          
          
            <h3 className='footer_templete'
            style="text-align: center;
            font-size: 14px;
            color: #a7afb9;">
                      THANK YOU, TEAM ESPORTS4G
                  </h3>
                  <h3 className='footer_templete'
                  style="text-align: center;
                  font-size: 12px;
                  color: #a7afb9;"
                  >
                      Esports4g.com. All Right Reserved.
                  </h3>
            <div
              className="socialicons"
              style="
              width:215px;
              margin:auto;
              display:flex;
          
          
              "
            >
              <div className="icons" style="cursor: pointer; margin: 6px">
                <a target="_blank" href="https://www.facebook.com/Esports4G/">
                  <img
                    src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                    alt="not found"
                    style="width: 40px; height: 40px; border-radius: 50%"
                  />
                </a>
              </div>
               <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                height: 40px;
                                border-radius: 50%;
                               " />
                          </a>
                          </Link>
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
          
                          </a>
                          </Link>
          
                      </div>
                      <div className="icons" style="cursor: pointer;
                      margin: 6px;
                     ">
                          <Link passHref={true}>
                          <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                              <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                              height: 40px;
                              border-radius: 50%;
                             " />
                          </a>
                          </Link>
            </div>
          </div>
          </div>
          </div>
          </body>
          </html>`,
      };
      buyersgMail
        .send(nuyermsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
      return res.status(200).json("Order set to not working");
    } catch (error) {
      console.log(error);
    }
    
  }
  async buyercancleorder(req, res) {
    const id = req.params.id;
    try {
      const orderdat = await Order.findOne({ _id: id });
      // console.log(orderdat.orders[0].purchase_units[0].amount.value)
      const userid = orderdat.userId;
      const orderid = orderdat.id;
      const quantity=orderdat.quantity;
      const sellerid = orderdat.selerId;
      const sellerdata = await Seller.findOne({ _id: sellerid });
      const selleruserid = sellerdata.userId;
      const usersellerdata = await User.findOne({ _id: selleruserid });
      const selleremail = usersellerdata.email;
      const productID = orderdat.productId;
      const productdata = await Products.findOne({ _id: productID });
      const productprice = productdata.price;
      // const amount=orderdat.orders[0].purchase_units[0].amount.value;
      const stock = productdata.stock;
      const total = stock + quantity;
      const cartresult = await Products.findByIdAndUpdate(
        { _id: productID },
        { stock: total },
        { new: true }
      );

      const walletdata = await Wallet.findOne({ userId: userid });
      const walletid = walletdata._id;
      const wallettotal = walletdata.total;
      const finaltotal = wallettotal + productprice;
      const data = {};
      data.total = finaltotal;
      await Wallet.findByIdAndUpdate(walletid, data);
      const updateorder = {};
      updateorder.order_status = "Cancel by Buyer";
      updateorder.buyer_cancel = true;
      updateorder.buyer_confirm = false;
      updateorder.details_by_seller = false;
      updateorder.confirm_by_seller = false;
      await Order.findByIdAndUpdate(id, updateorder);
      const buyersgMail = require("@sendgrid/mail");
      buyersgMail.setApiKey(
        "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"
      );
      const nuyermsg = {
        to: selleremail, // Change to your recipient
        from: "info@esports4g.com", // Change to your verified sender
        subject: "Order Cancel",
        text: "you order Cancel",
        html:
          "<strong>Your order-ID is-" +
          orderid +
          "has Cancel by Buyer </strong>",
      };
      buyersgMail
        .send(nuyermsg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
      return res.status(200).json("Order canceled");
    } catch (error) {
      console.log(error);
    }
  }
  async walletorder(req, res) {
    console.log(req.body);
    const items = req.body.products;
    const userid = req.body.userId;
    const transid = req.body.transactionId;
    // const bodydata = req.body.details;
    const subtotal = req.body.subtotal;
    const userdetails = await User.findOne({ _id: userid });
    const username=userdetails.fullname;
    const useremail=userdetails.email;
    const useraddress=userdetails.address;
    const walletdata = await Wallet.findOne({ userId: userid });
    const wallettotal = walletdata.total;
    const walletid = walletdata._id;
    if (wallettotal < subtotal) {
      return res.status(400).json("insufficient amount");
    } else {
      if (items.length<1) {
        return res.status(400).json("Items required");
      }
      if (!userid) {
        return res.status(400).json("userid required");
      }
      if (!subtotal) {
        return res.status(400).json("subtotal required");
      }
      for (const cartdata of items) {
        // console.log(1);
        const productid = cartdata.productId;
        const proddata = await Products.findOne({ _id: productid });
        const productname=proddata.productname;
        const productprice=proddata.price;
        const paymentfee=0;
        if(proddata.stock>0){
        const auto = proddata.autodelivery;
        console.log(auto);
        const accountemail = proddata.account_email;
        const accountpassword = proddata.account_password;
        const accountspecialnote = proddata.account_specialnote;
        const accountusername = proddata.account_username;
        const selerId = cartdata.selerId;
        // const subtotal = cartdata.subtotal;
        const quantity = cartdata.quantity;
        if (auto == true) {
          const cartData = {
            transactionId: transid,
            orders: subtotal,
            fullname:username,
            address:useraddress,
            email:useremail,
            status:"Complete",
            productId: productid,
            quantity: quantity,
            selerId: selerId,
            confirm_by_seller: true,
            details_by_seller: true,
            account_email: accountemail,
            account_password: accountpassword,
            account_specialnote: accountspecialnote,
            account_username: accountusername,
            order_status: "Delivered",
            userId: userid,
            paymentmode: "wallet",
          };
          const cart = new Order(cartData);
          cart.save();
        } else {
          const cartData = {
            transactionId: transid,
            orders: subtotal,
            fullname:username,
            address:useraddress,
            email:useremail,
            status:"Complete",
            productId: productid,
            quantity: quantity,
            selerId: selerId,
            userId: userid,
            paymentmode: "wallet",
          };
          const cart = new Order(cartData);
          cart.save();
        }
        const pro = await Products.findOne({ _id: productid }).populate(
          "category"
        );
        const gamename = pro.category.name;
        const stock = pro.stock;
        const total = stock - quantity;
        const cartresult = await Products.findByIdAndUpdate(
          { _id: productid },
          { stock: total },
          { new: true }
        );
        if(total<=0){
          console.log('outofstcok')
          const data = await Cartdata.find();
          for await (const cart of data) {
            const cartdata = cart.items;
            for await (const itemdata of cartdata) {
              const proid = itemdata.productId;
              if (proid == productid) {
                const items = itemdata._id;
                const cartId = cart._id;
                const filtered = cartdata.filter((element) => {
                  return element._id != items;
                });
                const subTotal = filtered.reduce(
                  (previousValue, currentValue) =>
                    previousValue + currentValue.total,
                  0
                );
                const qtyTotal = filtered.reduce(
                  (previousValue, currentValue) =>
                    previousValue + currentValue.quantity,
                  0
                );
                const result = await Cartdata.findByIdAndUpdate(
                  { _id: cartId },
                  { items: filtered, subTotal: subTotal, totalquantity: qtyTotal },
                  { new: true }
                );
              }
            }
          }
        }
        //cart empty
        const cartuser = await Cartdata.findOne({ userId: userid });
        const cartid = cartuser._id;
        const itemss = [];
        const result = await Cartdata.findByIdAndUpdate(
          { _id: cartid },
          { items: itemss, subTotal: 0, totalquantity: 0 },
          { new: true }
        );
        const seller = await Seller.findOne({ _id: selerId }).populate(
          "userId"
        );
        const selleremail = seller.userId.email;
        const sellerphone = seller.userId.phone;
        const buyer = await User.findOne({ _id: userid });
        const buyeremail = buyer.email;
        const buyerphone = buyer.phone;
        console.log(buyerphone);
        const lastorder = await Order.findOne({}).sort({ _id: -1 }).limit(1);
        const orderid = lastorder.id;
        const ordermongo=lastorder._id;
        const accountSid = "123"; // Your Account SID from www.twilio.com/console
        const authToken = "123"; // Your Auth Token from www.twilio.com/console
        const twilio = require("twilio");
        const client = new twilio(accountSid, authToken);

        client.messages
          .create({
            body:
              "Your have new order  order-ID is-" +
              orderid +
              " & Game is-" +
              gamename,
            to: sellerphone, // Text this number
            from: "+12603015654", // From a valid Twilio number
          })
          .then((message) => console.log(message.sid));
        //seller email
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(
          "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"
        );
        const msg = {
          to: selleremail, // Change to your recipient
          from: "info@esports4g.com", // Change to your verified sender
          subject: "New Order",
          text: "you have new order",
          html:
           `<html>
           <body
             style="margin: 0;
             padding:0;
             background: #f9f9f9;
             "
             >
           <div
             class="emailtemplate"
             style="
               position:relative;
               font-family: sans-serif
             "
           >
             <div style="text-align: center;
             background:#044767;
             width:80%;
             margin:auto;
             ">
               <img
                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                 style="height: 80px;"
               />
             </div>
             <div style="
             text-align: center;
             background:#F7F7F7;
             width:80%;
             margin:auto;
             padding: 3rem 0;
             ">
               <img
                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657624189503.jpeg"
                 style="height: 120px;
           
                 "
               />
               <h3
                 style="color: #000;
                 text-align: center;
                 font-size: 20px;
                 margin: 15px 0;"
                 >
                 MAIL TO SELLER REGARDING ORDER
                 </h3>
             </div>
           
             <div
                style="
                text-align: center;
             background:#fff;
             width:80%;
             margin:auto;
             padding: 3rem 0;
                "
                >
                 <p
                 style="font-size: 18px;
                 font-weight: 200;
                 "
                 >
                   Dear user,<br/>
                   Congratulations, you have a new order. To procced further, please click on the link below.
           Once you confirm the order, your respective customer will be informed.
                  <br/>
           </p>
           <div
           style="
           margin-top: 2rem;
           "
           >
             <a href="http://206.189.136.28:3010/dashboard/myorder/${ordermongo}"
             style="    text-decoration: none;
           color: #fff;
           background: #ED8E21;
           padding: 0.7rem 3rem;
           width: 100%;
           
           "
           >View Order</a>
           </div>
           
           
                </div>
                <div
                style="text-align: center;
                background:#e5eaf5;
                width:80%;
                margin:auto;
                padding: 1rem 0;"
                >
           
           
             <h3 className='footer_templete'
             style="text-align: center;
             font-size: 14px;
             color: #a7afb9;">
                       THANK YOU, TEAM ESPORTS4G
                   </h3>
                   <h3 className='footer_templete'
                   style="text-align: center;
                   font-size: 12px;
                   color: #a7afb9;"
                   >
                       Esports4g.com. All Right Reserved.
                   </h3>
             <div
               className="socialicons"
               style="
               width:215px;
               margin:auto;
               display:flex;
           
           
               "
             >
               <div className="icons" style="cursor: pointer; margin: 6px">
                 <a target="_blank" href="https://www.facebook.com/Esports4G/">
                   <img
                     src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                     alt="not found"
                     style="width: 40px; height: 40px; border-radius: 50%"
                   />
                 </a>
               </div>
                <div className="icons" style="cursor: pointer;
                       margin: 6px;
                      ">
                           <Link passHref={true}>
                           <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                               <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                 height: 40px;
                                 border-radius: 50%;
                                " />
                           </a>
                           </Link>
                       </div>
                       <div className="icons" style="cursor: pointer;
                       margin: 6px;
                      ">
                           <Link passHref={true}>
                           <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                               <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                               height: 40px;
                               border-radius: 50%;
                              " />
           
                           </a>
                           </Link>
           
                       </div>
                       <div className="icons" style="cursor: pointer;
                       margin: 6px;
                      ">
                           <Link passHref={true}>
                           <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                               <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                               height: 40px;
                               border-radius: 50%;
                              " />
                           </a>
                           </Link>
             </div>
           </div>
           </div>
           </div>
           </body>
           </html>`,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });

        //Buyer sms
        const buyeraccountSid = "123"; // Your Account SID from www.twilio.com/console
        const buyerauthToken = "123"; // Your Auth Token from www.twilio.com/console

        const buyertwilio = require("twilio");
        const buyerclient = new buyertwilio(buyeraccountSid, buyerauthToken);

        buyerclient.messages
          .create({
            body:
              "Thanku for order your order-ID is-" +
              orderid +
              " & Game is-" +
              gamename,
            to: buyerphone, // Text this number
            from: "+12603015654", // From a valid Twilio number
          })
          .then((message) => console.log(message.sid));
        //Buyer email
        const buyersgMail = require("@sendgrid/mail");
        buyersgMail.setApiKey(
          "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"
        );
        const nuyermsg = {
          to: buyeremail, // Change to your recipient
          from: "info@esports4g.com", // Change to your verified sender
          subject: "New Order",
          text: "you have new order",
          html:
           `<html>
           <body
             style="margin: 0;
             padding:0;
             background: #f9f9f9;
             "
             >
           <div
             class="emailtemplate"
             style="
               position:relative;
               font-family: sans-serif
             "
           >
             <div style="text-align: center;
             background:#044767;
             width:80%;
             margin:auto;
             ">
               <img
                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                 style="height: 80px;"
               />
             </div>
             <div style="
             text-align: center;
             background:#F7F7F7;
             width:80%;
             margin:auto;
             padding: 3rem 0;
             ">
               <img
                 src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657624189503.jpeg"
                 style="height: 120px;
           
                 "
               />
               <h3
                 style="color: #000;
                 text-align: center;
                 font-size: 20px;
                 margin: 15px 0;"
                 >
                 MAIL TO BUYER REGARDING ORDER
                 </h3>
             </div>
           
             <div
                style="
                text-align: center;
             background:#fff;
             width:80%;
             margin:auto;
             padding: 3rem 0;
                "
                >
                 <p
                 style="font-size: 18px;
                 font-weight: 200;
                 "
                 >
                   Dear user,<br/>
                   Thank you for your order. We hope you have great experience shopping at Esports4g.
                  <br/>
           </p>
           <p>
             Email Id- ${buyeremail}
           </p>
           <p>
             Order Id-${orderid}
           </p>
           
           <div
           style="
           margin: 2rem 0;
           "
           >
             <a href="http://206.189.136.28:3010/dashboard/purchaseitem/${ordermongo}"
             style="    text-decoration: none;
           color: #fff;
           background: #ED8E21;
           padding: 0.7rem 3rem;
           width: 100%;
           
           "
           >View Order</a>
           </div>
           <p
           style="text-align: center;
                   font-size: 12px;
                   color: #a7afb9;"
           >
             To explore different game items and avail amazing discounts, visit our website https://esports4g.com/
           </p>
           
           
                </div>
                <div
                style="text-align: center;
                background:#e5eaf5;
                width:80%;
                margin:auto;
                padding: 1rem 0;"
                >
           
           
             <h3 className='footer_templete'
             style="text-align: center;
             font-size: 14px;
             color: #a7afb9;">
                       THANK YOU, TEAM ESPORTS4G
                   </h3>
                   <h3 className='footer_templete'
                   style="text-align: center;
                   font-size: 12px;
                   color: #a7afb9;"
                   >
                       Esports4g.com. All Right Reserved.
                   </h3>
             <div
               className="socialicons"
               style="
               width:215px;
               margin:auto;
               display:flex;
           
           
               "
             >
               <div className="icons" style="cursor: pointer; margin: 6px">
                 <a target="_blank" href="https://www.facebook.com/Esports4G/">
                   <img
                     src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                     alt="not found"
                     style="width: 40px; height: 40px; border-radius: 50%"
                   />
                 </a>
               </div>
                <div className="icons" style="cursor: pointer;
                       margin: 6px;
                      ">
                           <Link passHref={true}>
                           <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                               <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                 height: 40px;
                                 border-radius: 50%;
                                " />
                           </a>
                           </Link>
                       </div>
                       <div className="icons" style="cursor: pointer;
                       margin: 6px;
                      ">
                           <Link passHref={true}>
                           <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                               <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                               height: 40px;
                               border-radius: 50%;
                              " />
           
                           </a>
                           </Link>
           
                       </div>
                       <div className="icons" style="cursor: pointer;
                       margin: 6px;
                      ">
                           <Link passHref={true}>
                           <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                               <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                               height: 40px;
                               border-radius: 50%;
                              " />
                           </a>
                           </Link>
             </div>
           </div>
           </div>
           </div>
           </body>
           </html>`,
        };
        buyersgMail
          .send(nuyermsg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
          const buyersgMail1 = require("@sendgrid/mail");
        buyersgMail1.setApiKey(
          "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"
        );
          const invoicmsg = {
            to: buyeremail, // Change to your recipient
            from: "info@esports4g.com", // Change to your verified sender
            subject: "New Order",
            text: "you have new order",
            html:
             `<html>
             <body
               style="margin: 0;
               padding:0;
               background: #f9f9f9;
               "
               >
                 <div
                      class="emailtemplate"
                      style="
                        position:relative;
                        font-family: sans-serif
                      "
                    >
                      <div style="text-align: center;
                      background:#1e1e1e;
                      width:80%;
                      margin:auto;
                      ">
                        <img
                          src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657535823927.jpeg"
                          style="height: 80px;"
                        />
                      </div>
                      <div
                        style="
                          background: #fff;
                          width: 80%;
                          position:relative;
                          margin: auto;
                          padding: 2rem 0;
                        "
                      >
             
                        <h2
                          style="
                              margin: 0;
                 font-family: sans-serif;
                 letter-spacing: -1px;
                 color: #dc8e3a;
                 font-size: 24px;
                 padding-left: 2rem;
                          "
                        >
                      Thanks for your order
                        </h2>
                        <div style="padding-left: 2rem;">
                          <span
                            className="passowrdlink"
                            style="font-size: 14px; color: #000"
                          >
                          Thanks for shopping with us. We'll send you the tracking number when you item ships.
                          </span>
                        </div>
             
                        <div
                        style="
                            background: #fff4e9;
                 padding: 15px;
                 margin: 2rem;
                        "
                        >
                         <h4
             
                         >
                           Your Order ID is ${orderid}
                         </h4>
                         <p>
                           A summary of your order is shown belown.To view the status of your order.
                         </p>
                         </div>
             
             <div
             style="margin:2rem;"
             >
                         <table
                         style="
                          font-family: arial, sans-serif;
               border-collapse: collapse;
               width: 100%;
                         "
                         >
                           <tr>
                             <th
                             style="
                              border: 1px solid #dddddd;
                              background: #dddddd;
               text-align: left;
               padding: 8px;
                             "
                             >Product Name</th>
                             <th
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background: #dddddd;
                             "
                             >Qunatity</th>
                             <th
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background: #dddddd;
                             "
                             >Payment Method</th>
                             <th
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background: #dddddd;
                             "
                             >Price</th>
                             <th
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               background: #dddddd;
                             "
                             >Item Total</th>
             
                           </tr>
                           <tr>
                             <td
             
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;"
             
                             >${productname}</td>
                             <td
             
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;"
             
                             >${quantity}</td>
                             <td
             
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;"
             
                             >Wallet</td>
                             <td
             
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;"
             
                             >${productprice}</td>
                             <td
             
                             style="
                              border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;"
             
                             >${productprice*quantity}</td>
             
                           </tr>
             
             
                         </table>
                         </div>
             
             
                         <div
                         style="
                             text-align: right;
                 margin: 2rem;
                         "
                         >
             
                           <table
                           style="
                           width:100%;
                           "
                           >
                             <tr>
                              <td
                              style="
                              width:90%
                              "
                              >Subtotal:</td>
                              <td>${productprice*quantity}</td>
                             </tr>
                             <tr>
                               <td
                               style="
                               width:90%
                               "
                               >Payment Fees:</td>
                               <td>${paymentfee}</td>
                             </tr>
                             <tr>
                               <td
                               style="
                               width:90%
                               "
                               >Grand Toatl:</td>
                               <td>${productprice*quantity+paymentfee}</td>
                             </tr>
                           </table>
                         </div>
             
             
             
             
             
             
                      </div>
                      <div
                      style="text-align: center;
                      background:#e5eaf5;
                      width:80%;
                      margin:auto;
                      padding: 1rem 0;"
                      >
             
             
                   <h3 className='footer_templete'
                   style="text-align: center;
                   font-size: 14px;
                   color: #a7afb9;">
                             THANK YOU, TEAM ESPORTS4G
                         </h3>
                         <h3 className='footer_templete'
                         style="text-align: center;
                         font-size: 12px;
                         color: #a7afb9;"
                         >
                             Esports4g.com. All Right Reserved.
                         </h3>
                   <div
                     className="socialicons"
                     style="
                     width:215px;
                     margin:auto;
                     display:flex;
             
             
                     "
                   >
                     <div className="icons" style="cursor: pointer; margin: 6px">
                       <a target="_blank" href="https://www.facebook.com/Esports4G/">
                         <img
                           src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538802926.jpeg"
                           alt="not found"
                           style="width: 40px; height: 40px; border-radius: 50%"
                         />
                       </a>
                     </div>
                      <div className="icons" style="cursor: pointer;
                             margin: 6px;
                            ">
                                 <Link passHref={true}>
                                 <a target="_blank" href="https://www.instagram.com/esports4g_com/">
                                     <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657537992582.jpeg" alt="not found" style="width:40px ;
                                       height: 40px;
                                       border-radius: 50%;
                                      " />
                                 </a>
                                 </Link>
                             </div>
                             <div className="icons" style="cursor: pointer;
                             margin: 6px;
                            ">
                                 <Link passHref={true}>
                                 <a target="_blank" href="https://twitter.com/Esports4gdotcom/">
                                     <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657538938250.jpeg" alt="not found" style="width:40px ;
                                     height: 40px;
                                     border-radius: 50%;
                                    " />
             
                                 </a>
                                 </Link>
             
                             </div>
                             <div className="icons" style="cursor: pointer;
                             margin: 6px;
                            ">
                                 <Link passHref={true}>
                                 <a target="_blank" href="https://www.linkedin.com/company/esports4g-com/mycompany/">
                                     <img src="https://esports-category-images.s3.ap-south-1.amazonaws.com/document-1657539204082.jpeg" alt="not found" style="width:40px ;
                                     height: 40px;
                                     border-radius: 50%;
                                    " />
                                 </a>
                                 </Link>
                   </div>
                 </div>
                 </div>
                 </div>
             </body>
             </html>`,
          };
          buyersgMail1
            .send(invoicmsg)
            .then(() => {
              console.log("Email sent");
            })
            .catch((error) => {
              console.error(error);
            });
        }else{
          return res.status(400).json('Product out of stock');
        }
      }
      const walletdata = {};
      const decuctamount = wallettotal - subtotal;
      walletdata.total = decuctamount;
      await Wallet.findByIdAndUpdate(walletid, walletdata).then((result) => {
        res.status(200).json({ message: "Order successfull created" });
      });
    }
  }
async totalpurchase(req,res){
  const userid=req.params.id;
  try{
    var total = 0;
    const orders=await Order.find({userId:userid}).populate("productId");
    for await(const orderdata of orders){
      const amount =orderdata.productId.price;
      total += amount;
    }
    return res.status(200).json(total)
  }catch(error){
    console.log(error)
  }
}
async view_by_seller(req,res){
  const id = req.params.id;
  try {
    const updateorder = {};
    updateorder.order_status = "Delivering";
    updateorder.view_by_seller = true;
    await Order.findByIdAndUpdate(id, updateorder).then((result)=>{
      res.status(200).json("order set to delivering");
    }); 
}catch(error){
  console.log(error);
}
}
async sellercancleorder(req, res) {
  const id = req.params.id;
  try {
    const orderdat = await Order.findOne({ _id: id });
    // console.log(orderdat.orders[0].purchase_units[0].amount.value)
    const userid = orderdat.userId;
    const orderid = orderdat.id;
    const quantity=orderdat.quantity;
    const usersellerdata = await User.findOne({ _id: userid });
    const buyeremail = usersellerdata.email;
    const productID = orderdat.productId;
    const productdata = await Products.findOne({ _id: productID });
    const productprice = productdata.price;
    // const amount=orderdat.orders[0].purchase_units[0].amount.value;

    const stock = productdata.stock;
    const total = stock + quantity;
    const cartresult = await Products.findByIdAndUpdate(
      { _id: productID },
      { stock: total },
      { new: true }
    );

    const walletdata = await Wallet.findOne({ userId: userid });
    const walletid = walletdata._id;
    const wallettotal = walletdata.total;
    const finaltotal = wallettotal + productprice;
    const data = {};
    data.total = finaltotal;
    await Wallet.findByIdAndUpdate(walletid, data);
    const updateorder = {};
    updateorder.order_status = "Cancel by Seller";
    updateorder.seller_cancel = true;
    updateorder.buyer_confirm = false;
    updateorder.details_by_seller = false;
    updateorder.confirm_by_seller = false;
    await Order.findByIdAndUpdate(id, updateorder);
    const buyersgMail = require("@sendgrid/mail");
    buyersgMail.setApiKey(
      "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"
    );
    const nuyermsg = {
      to: buyeremail, // Change to your recipient
      from: "info@esports4g.com", // Change to your verified sender
      subject: "Order Cancel",
      text: "you order Cancel",
      html:
        "<strong>Your order-ID is-" +
        orderid +
        "has Cancel by Seller </strong>",
    };
    buyersgMail
      .send(nuyermsg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    return res.status(200).json("Order canceled");
  } catch (error) {
    console.log(error);
  }
}
}
module.exports = new Orders();
