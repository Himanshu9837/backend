const Products = require("../models/productSchema");
const cartData = require("../models/cartSchema");
const Categories = require("../models/categorySchema");
const Seller = require("../models/sellerSchema");
const Order = require("../models/orderSchema");
const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const authenticate = require("../middleware/Authenticate");
const mongoose = require("mongoose");
const thumblincheck = require("../models/thumbnailstatusSchema");
const fs = require("fs-extra");
var requestIp = require("request-ip");
const request = require("request");
const axios = require('axios');
const fetch =require('cross-fetch');
const CC = require("currency-converter-lt");
require("dotenv").config();

class Product {
  async productlist(req, res) {
    const datearray=[];
    const productList = await Products.find({ stock: { $gt: 0 } })
      .populate("category").populate("userId")
      .sort({ _id: -1 });
     
      for await(const data of productList){
        
        const date=data.dateCreated;
        var clientIp = requestIp.getClientIp(req);
        const data1 = clientIp.split(":").pop();
        const res = await fetch(`http://ip-api.com/json/${data1}`);
         const user = await res.json();
   
          var final = user;
          const time = final.timezone;
          var LocalDate = new Date(date);
       
          LocalDate.setMilliseconds(0);
          var options = { hour12: false };
          const LocalOffset = LocalDate.getTimezoneOffset();
          var RemoteLocaleStr = LocalDate.toLocaleString("en-GB", {
            timeZone: time,
          });
          console.log(RemoteLocaleStr)
          datearray.push(RemoteLocaleStr);
        
      //   }
      // })
    }
    if (!productList) {
      res.status(500).json({ success: false });
    }
    return res.status(200).json({
      success: true,
      message: "listing successfully",
      result: productList,datearray
    });
  }

  async addproducts(req, res) {
    try {
      console.log(req.body);
      let bodyData = req.body.data ? JSON.parse(req.body.data) : req.body;
      const data = req.body.productname;
     
    //   const string = data.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    //  const string1= string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,'').replace(/\s+/g, ' ').trim();
      const string1 = data.replace(/ /g, "-").toLowerCase();
      const metaData = string1.replace(/[^a-z0-9-]/gi, '');
      const findmetaurl = await Products.find({ productname: data }).count();
      if (findmetaurl == 0) {
        var metaURL = metaData;
      } else {
        const countmeta = findmetaurl + 1;
        var metaURL = metaData + "-" + countmeta;
      }
      const output = [];
      if (bodyData.category === "[object Object]") {
        return res.status(402).json({ error: "Please Select Category" });
      }
      if (!bodyData.productname) {
        return res.status(402).json({ error: "Please fill Product Title" });
      }
      if (!bodyData.qty) {
        return res.status(402).json({ error: "Please fill product Quantity" });
      }
      if (!bodyData.sellerid) {
        return res.status(402).json({ error: "Please fill seller id" });
      }
      if (!bodyData.stock) {
        return res.status(402).json({ error: "Please fill product stock" });
      }
      if (bodyData.images === "null") {
        return res.status(402).json({ error: "Please upload product Image" });
      }
      if (!bodyData.price) {
        return res.status(402).json({ error: "Please fill product price" });
      }
      if (bodyData.autodelivery == "true") {
        if (
          !bodyData.account_username ||
          !bodyData.account_email ||
          !bodyData.account_password
        ) {
          return res.status(402).json({
            error: "Please fill all account details on automatic delivery",
          });
        }
      }
      const myArray = bodyData.dropdownname.split(",");
      const myArray2 = bodyData.subdropdown.split(",");
      var result = Object.assign.apply(
        {},
        myArray.map((v, i) => ({ [v]: myArray2[i] }))
      );
      // const productList = await Products.count();
      // const sku = productList + 1;
      const filedata = req.files;
      for await (const file of filedata) {
        const results = file.location;
        output.push(results);
      }
      const date = Date.now() + 172800000;
      const productData = {};
      productData.productname = bodyData.productname;
      productData.expireToken = date;
      productData.timeperiod = bodyData.timeperiod;
      productData.sortdescription = bodyData.sortdescription;
      productData.longdescription = bodyData.longdescription;
      productData.qty = bodyData.qty;
      productData.metaurl = metaURL;
      if (bodyData.autodelivery == 'true') {
        productData.account_username = bodyData.account_username;
        productData.account_email = bodyData.account_email;
        productData.account_password = bodyData.account_password;
        productData.account_specialnote = bodyData.account_specialnote;
      }
      productData.autodelivery = bodyData.autodelivery;
      productData.stock = bodyData.stock;
      productData.price = bodyData.price;
      productData.metatitle = bodyData.metatitle;

      if (bodyData.sellerid) {
        productData.sellerId = bodyData.sellerid;
        const userdata = await Seller.findOne({ _id: bodyData.sellerid });
        const userid = userdata.userId;
        productData.userId = userid;
      } else {
        productData.sellerId = "62381d59d765939fdd90756e";
        productData.userId = "621737aad78160a48d5605a1";
      }

      productData.metakeyword = bodyData.metakeyword;
      productData.metadescription = bodyData.metadescription;
      productData.category = mongoose.Types.ObjectId(bodyData.category);
      productData.images = output;
      productData.categorydetails = result;
      const resultData = await Products.create(productData);
      // productData.save()
      // const resultData = await Products.create(productData);
      return res.status(201).json({
        success: true,
        message: "data save successfully",
        result: resultData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.id;
    try {
      const deleteseller = await Products.findByIdAndRemove({ _id: id });
      const data = await cartData.find();
      for await (const cart of data) {
        const cartdata = cart.items;
        for await (const itemdata of cartdata) {
          const proid = itemdata.productId;
          if (proid == id) {
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
            const result = await cartData.findByIdAndUpdate(
              { _id: cartId },
              { items: filtered, subTotal: subTotal, totalquantity: qtyTotal },
              { new: true }
            );
          }
        }
      }
      const oders = await Order.find({ productId: id });
      if(oders.length>0){
      for await (const orderdata of oders) {
        const orderid = orderdata._id;
        const datad = await Order.findByIdAndRemove({ _id: orderid });
      }
    }
      if (!deleteseller) {
        return res.status(400).json({ error: "product not deleted" });
      } else {
        return res
          .status(200)
          .json({ message: "product Deleted Successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async editProduct(req, res) {
    try {
      var id = req.params.id;
      const editproduct = await Products.findOne({ _id: id }).populate(
        "category"
      );

      if (editproduct) {
        return res.status(200).json({
          success: true,
          message: "Products find",
          result: editproduct,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "data not found",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong", result: err });
    }
  }

  async updateProduct(req, res) {
    var id = req.params.id;
     console.log(req.body.timeperiod);
    try {
      const productExist = await Products.findOne({ _id: id });

      const output = [];
      // console.log(productExist);
      if (req.body.category === "[object Object]") {
        return res.status(402).json({ error: "Please Select Category" });
      }
      if (!req.body.productname) {
        return res.status(402).json({ error: "Please fill Product Title" });
      }
      if (!req.body.qty) {
        return res.status(402).json({ error: "Please fill product Quantity" });
      }
      if (!req.body.sellerid) {
        return res.status(402).json({ error: "Please fill seller id" });
      }
      if (req.body.images === "null") {
        return res.status(402).json({ error: "Please upload product Image" });
      }
      if (!req.body.stock) {
        return res.status(402).json({ error: "Please fill product stock" });
      }
      if (!req.body.price) {
        return res.status(402).json({ error: "Please fill product price" });
      }

      if (req.body.autodelivery == 'true') {
        if (
          !req.body.account_username ||
          !req.body.account_email ||
          !req.body.account_password
        ) {
          return res.status(402).json({
            error: "Please fill all account details on automatic delivery",
          });
        }
      }
      const myArray = req.body.dropdownname.split(",");
      const myArray2 = req.body.subdropdown.split(",");
      var result = Object.assign.apply(
        {},
        myArray.map((v, i) => ({ [v]: myArray2[i] }))
      );
      const filedata = req.files;
      for await (const file of filedata) {
        const results = file.location;
        output.push(results);
      }
      var i = req.body.imageindex;
      let count = output.length;

      if (!productExist) {
        return res.status(422).json({ error: "products not exists" });
      } else {
        let updatedProduct = { $set: {} };
        updatedProduct.productname = req.body.productname;
        updatedProduct.sortdescription = req.body.sortdescription;
        updatedProduct.longdescription = req.body.longdescription;
        if(req.body.timeperiod){
          const date = Date.now();
          updatedProduct.dateCreated = date; 
        updatedProduct.timeperiod = req.body.timeperiod;
        }
        updatedProduct.price = req.body.price;
        updatedProduct.qty = req.body.qty;
        if (req.body.autodelivery == 'true') {
          updatedProduct.account_username = req.body.account_username;
          updatedProduct.account_email = req.body.account_email;
          updatedProduct.account_password = req.body.account_password;
          updatedProduct.account_specialnote = req.body.account_specialnote;
        }
        if (req.body.autodelivery == 'false') {
          updatedProduct.account_username = "";
          updatedProduct.account_email = "";
          updatedProduct.account_password = "";
          updatedProduct.account_specialnote = "";
        }
        updatedProduct.sellerId = req.body.sellerid;
        if (req.body.sellerid) {
          const userdata = await Seller.findOne({ _id: req.body.sellerid });
          const userid = userdata.userId;
          updatedProduct.userId = userid;
        }
        updatedProduct.categorydetails = result;
        updatedProduct.autodelivery = req.body.autodelivery;
        updatedProduct.stock = req.body.stock;
        updatedProduct.metaurl = req.body.metaURL;
        updatedProduct.metatitle = req.body.metatitle;
        updatedProduct.metakeyword = req.body.metakeyword;
        updatedProduct.metadescription = req.body.metadescription;
        updatedProduct.category = mongoose.Types.ObjectId(req.body.category);
        if (req.body.imageindex) {
          for(let j=0;j<i.length;j++){
              if(i[j]!='undefined'){
                if(i.length!=output.length){ 
                for(let v=0;v<output.length;v++){
              const filelink = output[v];
              updatedProduct.$set["images." + i[j]] = filelink;  
                }
              }else{
                const filelink = output[j];
                updatedProduct.$set["images." + i[j]] = filelink;  
              }
          }
        }
        }
        //hashing done before save
        await Products.findByIdAndUpdate(id, updatedProduct, (err) => {
          
            return res.status(200).json({
              success: true,
              message: "Products update sucessfully",
            });
        }); //saving data in user constant
      }
    } catch (error) {
      console.log(error);
    }
  }
  async productdetails(req, res) {
    let url = req.params.id;
    const arraydata = [];
    try {
      const productdetail = await Products.find({ metaurl: url }).populate("userId");
      if (!productdetail) {
        return res.status(401).json({ error: "Not Found" });
      } else {
        const proddata=productdetail[0];
        const proddatacatgeory=productdetail[0].categorydetails[0];
        const proddatamaincatgeory=productdetail[0].category;
        const catdata=await Categories.findOne({_id:proddatamaincatgeory})
        const fetchdropdown = await Categories.find({
          pid: proddata.category,
         })
         for(let i=0;i<fetchdropdown.length;i++) {
          const childiddata = proddatacatgeory[fetchdropdown[i].name];
          arraydata.push(childiddata);
        }
        return res.status(200).json({productdetail,outerdata:fetchdropdown,inner:arraydata,maincategory:catdata.name});
      }
    } catch (error) {
      console.log(error);
    }
  }
  async thumbnailstatus(req, res) {
    try {
      const checkstatus = await thumblincheck.find({});
      return res.status(200).json({ result: checkstatus });
    } catch (error) {
      console.log(error);
    }
  }
  async removeimages(req, res) {
    const id = req.params.id;
    const productimage = req.body.imagename;
    console.log(productimage);
    try {
      let data = await Products.findOne({ _id: id });
      const index = data.images;
      const filtered = index.filter((element) => {
        return element != productimage;
      });
      const result = await Products.findByIdAndUpdate(
        { _id: id },
        { images: filtered },
        { new: true }
      );
      // console.log(filtered);
      return res(200).json({ message: "remove sucessfully" });
    } catch (error) {
      console.log(error);
    }
  }
  async categoryproducts(req, res) {
    const categoryname = req.params.categoryname;

    try {
      const categoriesdata = await Categories.findOne({
        metaurl: categoryname,
      });
      console.log(categoriesdata);
      if (!categoriesdata) {
        return res.status(400).json({ message: "No category found" });
      } else {
        const productdata = await Products.find({
          category: categoriesdata._id,
          stock: { $gt: 0 },
        }).populate("category").populate("userId");
        if (!productdata) {
          return res.status(400).json({ message: "No product found" });
        } else {
          return res.status(200).json(productdata);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async sortcategoryproducts(req, res) {
    const categoryid = req.params.id;

    try {
        const productdata = await Products.find({
          category: categoryid,
          stock: { $gt: 0 },
        }).populate("category").populate("userId").sort({_id:-1});
        if (!productdata) {
          return res.status(400).json({ message: "No product found" });
        } else {
          return res.status(200).json(productdata);
        }
      
    } catch (error) {
      console.log(error);
    }
  }
  async newarrivalproducts(req, res) {
    try {
      const output=[]
      const productList = await Products.find({ stock: { $gt: 0 } })
        .populate("category")
        .populate("userId")
        .sort({ _id: -1 })
        .limit(10);
          const filtered=productList.filter((element)=>{
        return element.category.isenable==true;
      })
      for await(const data of filtered){
        const productcreate=data.dateCreated;
        const proid=data._id;
        const result=productcreate.toISOString().split('T')[0]
        // console.log(result);
        const days=data.timeperiod;
        const date = new Date();
        const currentdate=date.toISOString().split('T')[0];
        const diffInMilliseconds = new Date(currentdate).getTime() - new Date(result).getTime()
        let TotalDays = Math.ceil(diffInMilliseconds / (1000 * 3600 * 24));
        console.log(TotalDays)
        if(days>TotalDays){
           output.push(data);
        }else{
         const data={}
         data.productstatus='Deactive';
         data.timeperiod=0;
         await Products.findByIdAndUpdate(proid,data);
        }
       }
      if (!productList) {
        return res.status(400).json({ message: "No product found" });
      } else {
        return res.status(200).json(output);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async newcatarrivalproducts(req, res) {
    const catid = req.params.id;
    const output=[];
    try {
      const productList = await Products.find({
        category: catid,
        stock: { $gt: 0 },
      })
        .populate("category")
        .populate("userId")
        .sort({ _id: -1 })
        .limit(10);
        const filtered=productList.filter((element)=>{
          return element.category.isenable==true;
        })
        for await(const data of filtered){
         const productcreate=data.dateCreated;
         const proid=data._id;
         const result=productcreate.toISOString().split('T')[0]
         // console.log(result);
         const days=data.timeperiod;
         const date = new Date();
         const currentdate=date.toISOString().split('T')[0];
         const diffInMilliseconds = new Date(currentdate).getTime() - new Date(result).getTime()
         let TotalDays = Math.ceil(diffInMilliseconds / (1000 * 3600 * 24));
         console.log(TotalDays)
         if(TotalDays>days){
            output.push(data);
         }else{
          const data={}
          data.productstatus='Deactive';
          await Products.findByIdAndUpdate(proid,data);
         }
        }
      if (!productList) {
        return res.status(400).json({ message: "No product found" });
      } else {
        return res.status(200).json(output);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async maximumpriceitem(req, res) {
    try {
      const data = await Products.findOne().sort({ price: -1 }).limit(1);
      return res.status(200).json(data.price);
    } catch (error) {
      console.log(error);
    }
  }
  async minimumpriceitem(req, res) {
    try {
      const data = await Products.findOne().sort({ price: 1 }).limit(1);
      return res.status(200).json(data.price);
    } catch (error) {
      console.log(error);
    }
  }
  async cartdata(req, res) {
    const pro = "621372456767743e3fa6bce5";
    const data = await cartData.find();
    for await (const cart of data) {
      const cartdata = cart.items;
      for await (const itemdata of cartdata) {
        const proid = itemdata.productId;
        if (proid == pro) {
          const items = itemdata._id;
          const cartId = cart._id;
          const filtered = cartdata.filter((element) => {
            return element._id != items;
          });
          const subTotal = filtered.reduce(
            (previousValue, currentValue) => previousValue + currentValue.total,
            0
          );
          const qtyTotal = filtered.reduce(
            (previousValue, currentValue) =>
              previousValue + currentValue.quantity,
            0
          );
          const result = await cartData.findByIdAndUpdate(
            { _id: cartId },
            { items: filtered, subTotal: subTotal, totalquantity: qtyTotal },
            { new: true }
          );
        }
      }
    }
    return res.status(200).json(data);
  }
  async catpro(req, res) {
    const categoryid = "61c4580b773ce52383268d9f";
    try {
      const data = await Products.find({ category: categoryid });
      for await (const proddata of data) {
        const productid = proddata._id;
        console.log(productid);
        const data1 = await cartData.find({
          items: { $elemMatch: { productId: productid } },
        });
        console.log(data1.length);
        if (data1.length > 0)
          for await (const cart of data1) {
            const cartId = cart._id;
            const cartdata = cart.items;
            for await (const itemdata of cartdata) {
              const proid = itemdata.productId;
              const items = itemdata._id;
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
              const result = await cartData.findByIdAndUpdate(
                { _id: cartId },
                {
                  items: filtered,
                  subTotal: subTotal,
                  totalquantity: qtyTotal,
                },
                { new: true }
              );
            }
          }
      }
      // const deleteseller = await Products.findByIdAndRemove({ _id: productid });

      //  const deletecat = await Categories.findByIdAndRemove({ _id: categoryid });
      return res.status(200).json({ message: "updated" });
    } catch (error) {
      console.log(error);
    }
  }
  async filterpro(req, res) {
    const filterdata = req.params.id;

    const parent = req.body.filtername;

    const checkdata = "categorydetails." + parent;

    try {
      const data = await Products.find({ [checkdata]: filterdata });

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  async productlist1(req, res) {
    const productList = await Products.find({ stock: { $gt: 0 } })
      .populate("category").populate("sellerId",{'sellerapprovalstatus':true})
      .sort({ _id: -1 });

      const data=await Products.find({ stock: { $gt: 0 } }).populate("category").populate("sellerId")
      const filtered=data.filter((element)=>{
        return element.sellerId.sellerapprovalstatus==true;
      })
    
    if (!productList) {
      res.status(500).json({ success: false });
    }
    return res.status(200).json({
      success: true,
      message: "listing successfully",
      result: filtered,
    });
  }
  async searchproduct(req, res) {
    const searchproduct = req.params.id;
    const productprice=[];
    try {
      const fetchpro = await Products.find({
        productname: { $regex: searchproduct, $options: "i" },
      }).populate("category");
      if (fetchpro.length<1) {
        return res.status(400).json({ message: "No product found" });
      }
      else{
        for await(const data of fetchpro){
          const priceproduct=data.price;
          let currencyConverter = new CC({
            from: "USD",
            to: "INR",
            amount: priceproduct,
            isDecimalComma: true,
          });
           const currencydata = await currencyConverter.convert(priceproduct);
           productprice.push(currencydata)
        }

      return res.status(200).json({fetchpro,productprice});
      }
    } catch (error) {
      console.log(error);
    }
  }
  async testing(req,res){
     try{
     const prodata=await Products.find();
     for await(const data of prodata){
      const productcreate=data.dateCreated;
      const result=productcreate.toISOString().split('T')[0]
      // console.log(result);
      const days=data.timeperiod;
      const date = new Date();
      const currentdate=date.toISOString().split('T')[0];
      const diffInMilliseconds = new Date(currentdate).getTime() - new Date(result).getTime()
      let TotalDays = Math.ceil(diffInMilliseconds / (1000 * 3600 * 24));
      console.log(TotalDays)
      
     }
    // const date1 = "2022-07-09T04:59:05.434+00:00"
    // const date2 = "2022-07-015T04:59:05.434+00:00"
    // const result=date1.split`T`[0]
    // const result1=date2.split`T`[0]
    // const diffInMilliseconds = new Date(result1).getTime() - new Date(result).getTime()
    // let TotalDays = Math.ceil(diffInMilliseconds / (1000 * 3600 * 24));
   
// return res.status(400).json(TotalDays);

     }catch(error){
      console.log(error);
     }
  }
}
module.exports = new Product();
