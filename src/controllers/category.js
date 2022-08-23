const Categories = require("../models/categorySchema");
const express = require("express");
const Order = require("../models/orderSchema");
const jwt = require("jsonwebtoken");
const Products = require("../models/productSchema");
const cartData = require("../models/cartSchema");
const authenticate = require("../middleware/Authenticate");
const mongoose = require("mongoose");
const e = require("express");
require("dotenv").config();

class Category {
  constructor() {
    return {
      categoryList: this.categoryList.bind(this),
      addCategory: this.addCategory.bind(this),
      childCategory: this.childCategory.bind(this),
      deleteCategory: this.deleteCategory.bind(this),
      parentCategory: this.parentCategory.bind(this),
      editCategory: this.editCategory.bind(this),
      updateCategory: this.updateCategory.bind(this),
      dragAnddrop: this.dragAnddrop.bind(this),
      removeimage: this.removeimage.bind(this),
      searchgame: this.searchgame.bind(this),
      gamedropdowns: this.gamedropdowns.bind(this),
      gamedropinfo: this.gamedropinfo.bind(this),
      allbasecategory: this.allbasecategory.bind(this),
      categoryviamataurl: this.categoryviamataurl.bind(this),
      newarrivalcategory: this.newarrivalcategory.bind(this),
      topgames: this.topgames.bind(this),
      filtercategory: this.filtercategory.bind(this),
    };
  }

  async categoryList(req, res) {
    try {
      let text = 0;
      const categories = await Categories.find();
      let finalOutput;
      for await (const category of categories) {
        console.log(categories.length);
        finalOutput = await this.getNodeData(text);
      }

      return await res.status(200).json({ data: finalOutput });
    } catch (e) {
      console.log(e);
    }
  }

  async getNodeData(productId = text) {
    try {
      const categoryResult = await Categories.find({ pid: productId });

      const output = [];
      if (categoryResult.length > 0) {
        for await (const category of categoryResult) {
          const subObject = {};
          subObject["category"] = category.name;
          subObject["objectID"] = category._id;
          subObject["nodes"] = await this.getNodeData(category._id);
          if (Object.values(subObject).length != 0)
            output.push(JSON.parse(JSON.stringify(subObject)));
        }
      }

      return output;
    } catch (e) {
      console.log(e);
    }
  }

  async addCategory(req, res) {
    // console.log(req.files);
    console.log(JSON.stringify(req.files, null, 2));
    const check = JSON.stringify(req.files, null, 2);
    var pid = req.params.id;
    const { name } = req.body; //getting data by object destructuring
    const categorycontent = req.body.categorycontent;
    const categoryheading = req.body.categoryheading;
    const imagebackgroundcolor = req.body.imagebackgroundcolor;
    const metaurl = name.replace(/ /g, "-");
    const metakeyword = req.body.metakeyword;
    const metatitle = req.body.metatitle;
    const metadescription = req.body.metadescription;
    const isfilterd=req.body.isfilterd;
    const isenable=req.body.isenable; 
    if (!name) {
      //adminuser should fill all feild
      return res.status(422).json({ error: "Plz fill all feild" });
    }

    try {
      const checkdata = await Categories.findOne({ name: name,pid:pid });
      if (!checkdata) {
        if (req.body.isfeatured == "false") {
          let categoryimage = req.files.categoryimage[0].location;
          let coverimage = req.files.coverimage[0].location;
          let categorylogo = req.files.categorylogo[0].location;
          let categorythumblinimage =
            req.files.categorythumblinimage[0].location;
            let sliderbannerimage =
            req.files.sliderbannerimage[0].location;
          if (pid == "61a47cc82be9cb1463acd562") {
            const categoriesdata = new Categories({
              name,
              pid,
              categoryimage,
              coverimage,
              sliderbannerimage,
              categorylogo,
              categorythumblinimage,
              categorycontent,
              categoryheading,
              imagebackgroundcolor,
              metaurl,
              isenable,
              metakeyword,
              metatitle,
              metadescription,
            });
            await categoriesdata.save(); //saving data in user constant
          } else {
            const metaurl = "";
            const categoriesdata = new Categories({
              name,
              pid,
              categoryimage,
              coverimage,
              sliderbannerimage,
              categorylogo,
              categorythumblinimage,
              categorycontent,
              categoryheading,
              imagebackgroundcolor,
              metaurl,
              isenable,
              metakeyword,
              metatitle,
              metadescription,
            });
            await categoriesdata.save();
          }
          res.status(201).json({ message: "categories created sucessfully" });
        } else {
          const metaurl = "";
          const categoriesdata = new Categories({
            name,
            pid,
            metaurl,
            isfilterd,
            metakeyword,
            metatitle,
            isenable,
            metadescription,
          });
          await categoriesdata.save(); //saving data in user constant
          res.status(201).json({ message: "categories created sucessfully" });
        }
      } else {
        return res.status(400).json({ message: "Category already exsists" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async childCategory(req, res) {
    var id = req.params.id;
    try {
      const childcat = await Categories.find({ pid: id });
      if (!childcat) {
        return res.status(400).json({ message: "No category found" });
      } else {
        return res.status(200).json({
          message: "Listing sucessfull",
          success: true,
          result: childcat,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async parentCategory(req, res) {
    try {
      const parentcat = await Categories.find({ pid: 0 });
      if (!parentcat) {
        return res.status(400).json({ message: "No category found" });
      } else {
        return res.status(200).json({
          message: "Listing sucessfull",
          success: true,
          result: parentcat,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCategory(req, res) {
    try {
      const data = await Products.find({ category: req.params.id });
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
        // const deleteseller = await Products.findByIdAndRemove({ _id: productid });
        const oders = await Order.find({ productId: productid });
        if (oders.length > 0) {
          for await (const orderdata of oders) {
            const orderid = orderdata._id;
            const datad = await Order.findByIdAndRemove({ _id: orderid });
          }
        }
        const datas = await Products.findByIdAndRemove({ _id: productid });
      }

      Categories.findByIdAndRemove(req.params.id).then((category) => {
        if (category) {
          return res
            .status(200)
            .json({ success: true, message: "category is deleted!" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "category not found!" });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async editCategory(req, res) {
    let id = req.params.id;
    try {
      const categoryData = await Categories.findOne({ _id: id });
      if (!categoryData) {
        return res.status(400).json({
          success: false,
          message: "Data not found",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Find category Data",
          result: categoryData,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateCategory(req, res) {
    let id = req.params.id;
    const question = JSON.parse(req.body.questions);
    const answer = JSON.parse(req.body.answers);
    console.log(question);
    const output = [];
    const output1 = [];
    var q = req.body.questionindex;
    var a = req.body.answerindex;
    console.log(req.body);
    try {
      const existscategory = await Categories.findOne({ _id: id });
      if (!existscategory) {
        return res.status(400).json({ message: "No category found" });
      } else {
        let updatecat = {};
        if (req.body.isenable == "false") {
          updatecat.isenable = req.body.isenable;
          updatecat.storemetaurl=req.body.metaurl;
          updatecat.metaurl='';
          const data = await Products.find({ category: req.params.id });
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
        } else {
          updatecat.isenable = req.body.isenable;
          if(existscategory.metaurl==''){
            updatecat.metaurl = existscategory.storemetaurl;
          }else{
          if (existscategory.metaurl == req.body.metaurl) {
            updatecat.metaurl = req.body.metaurl;
          }
  
          if (existscategory.metaurl != req.body.metaurl) {
            const checkdata = await Categories.findOne({
              metaurl: req.body.metaurl,
            });
            if (!checkdata) {
              updatecat.metaurl = req.body.metaurl;
            } else {
              return res.status(400).json("Meta url already exsists");
            }
          }
        }
      }
        updatecat.name = req.body.names;
       
        updatecat.metatitle = req.body.metatitle;
        updatecat.metakeyword = req.body.metakeyword;
        if (req.body.isfilterd == "true") {
          updatecat.isfilterd = req.body.isfilterd;
        } else {
          updatecat.isfilterd = req.body.isfilterd;
        }
        if (req.body.isfeatured == "true") {
          updatecat.isfeatured = req.body.isfeatured;
        }
        if (req.body.isfeatured == "false") {
          const catdata = await Categories.find({
            isfeatured: true,
            pid: "61a47cc82be9cb1463acd562",
          });

          const count = catdata.length;
          console.log(count);
          if (count < 7) {
            return res.status(400).json("Must be six in Top Selling Games");
          } else {
            updatecat.isfeatured = req.body.isfeatured;
          }
        }
        if (req.body.questions) {
          for (const set of question) {
            output.push(set);
          }
          updatecat.questions = output;
        }
        if (req.body.answers) {
          for (const sets of answer) {
            output1.push(sets);
          }
          updatecat.answers = output1;
        }
        updatecat.isfilterd = req.body.isfilterd;
        updatecat.istopgames = req.body.istopgames;
        updatecat.isnewArrivalfeatured = req.body.isnewArrivalfeatured;
        updatecat.metadescription = req.body.metadescription;
        updatecat.imagebackgroundcolor = req.body.imagebackgroundcolor;
        updatecat.categorycontent = req.body.categorycontent;
        updatecat.categoryheading = req.body.categoryheading;
        if (req.files.categoryimage) {
          let categoryimage = req.files.categoryimage[0].location;
          updatecat.categoryimage = categoryimage;
        }
           if (req.files.sliderbannerimage) {
          let sliderbannerimage = req.files.sliderbannerimage[0].location;
          updatecat.sliderbannerimage = sliderbannerimage;
        }
        if (req.files.coverimage) {
          let coverimage = req.files.coverimage[0].location;
          updatecat.coverimage = coverimage;
        }
        if (req.files.categorylogo) {
          let categorylogo = req.files.categorylogo[0].location;
          updatecat.categorylogo = categorylogo;
        }
        if (req.files.categorythumblinimage) {
          let categorythumblinimage =
            req.files.categorythumblinimage[0].location;
          updatecat.categorythumblinimage = categorythumblinimage;
        }
        await Categories.findByIdAndUpdate(id, updatecat);
        return res.status(200).json({
          message: "Successfully update category",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async dragAnddrop(req, res) {
    let id = req.params.id;
    try {
      let updatepid = {};
      updatepid.pid = req.body.parentobjectID;
      await Categories.findByIdAndUpdate(id, updatepid);
      return res.status(200).json({
        message: "Successfully update category parent",
        result: updatepid,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async removeimage(req, res) {
    const id = req.params.id;
    try {
      const existscategory = await Categories.findOne({ _id: id });
      if (!existscategory) {
        return res.status(400).json({ error: " No category found" });
      } else {
        let updatecat = {};
        updatecat.images = "";
        await Categories.findByIdAndUpdate(id, updatecat);
        return res.status(200).json({
          message: "successfilly remove category image",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async allbasecategory(req, res) {
    const output=[]
    try {
      const catdata = await Categories.find({
        pid: "61a47cc82be9cb1463acd562",
        isfeatured: true,
        isenable: true,
      });
    for await(const cat of catdata){
          const catid=cat._id;
          const productdata = await Products.find({
            category: catid,
            stock: { $gt: 0 },
          }).count()
          output.push(productdata)
    }
    // console.log(output);
      return res.status(200).json({catdata,output});
    } catch (error) {
      console.log(error);
    }
  }

  async newarrivalcategory(req, res) {
    try {
      const catdata = await Categories.find({
        pid: "61a47cc82be9cb1463acd562",
        isnewArrivalfeatured: true,
        isenable: true,
      });
      return res.status(200).json(catdata);
    } catch (error) {
      console.log(error);
    }
  }
  async searchgame(req, res) {
    const searchgame = req.params.id;
    try {
      const fetchgames = await Categories.find({
        pid: "61a47cc82be9cb1463acd562",
        name: { $regex: searchgame, $options: "i" },
      });
      if (!fetchgames) {
        return res.status(400).json({ message: "No game found" });
      }
      return res.status(200).json(fetchgames);
    } catch (error) {
      console.log(error);
    }
  }
  async gamedropdowns(req, res) {
    const parentid = req.params.id;
    const arraydata = [];
    try {
      const fetchdropdown = await Categories.find({ pid: parentid });
      for await (const fetchdata of fetchdropdown) {
        const childiddata = fetchdata._id;
        const datafetch = await Categories.find({ pid: childiddata });
        arraydata.push(datafetch);
      }
      // const children = fetchdropdown.concat(arraydata);
      if (!fetchdropdown) {
        return res.status(400).json({ message: "No field found" });
      } else {
        return res
          .status(200)
          .json({ outerdata: fetchdropdown, innerdata: arraydata });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async gamedropinfo(req, res) {
    const parentid = req.params.id;
    try {
      const fetchinfo = await Categories.find({ pid: parentid });
      return res.status(200).json(fetchinfo);
    } catch (error) {
      console.log(error);
    }
  }
  async categoryviamataurl(req, res) {
    const categoryname = req.params.id;
    try {
      const categoriesdata = await Categories.findOne({
        metaurl: categoryname,
      });
      return res.status(200).json(categoriesdata);
    } catch (error) {
      console.log(error);
    }
  }
  // async catpro(req,res){
  //  const categoryid="61d06f2342424a65d194d02c";
  //   try{
  //    const data=await Products.find();
  //      for await(const proddata of data){
  //       const catid=proddata.category;
  //       if(catid==categoryid){
  //         const productid=proddata._id;

  //         const data1 = await cartData.find();
  //         for await (const cart of data1) {
  //           const cartdata = cart.items;
  //           for await (const itemdata of cartdata) {
  //             const proid = itemdata.productId;
  //             console.log(proid)
  //             console.log(productid)
  //             if(proid==productid) {
  //               console.log("check");
  //               const items = itemdata._id;
  //               const cartId = cart._id;
  //               const filtered = cartdata.filter((element) => {
  //                 return element._id != items;
  //               });
  //               const subTotal = filtered.reduce(
  //                 (previousValue, currentValue) =>
  //                   previousValue + currentValue.total,
  //                 0
  //               );
  //               const qtyTotal = filtered.reduce(
  //                 (previousValue, currentValue) =>
  //                   previousValue + currentValue.quantity,
  //                 0
  //               );
  //               const result = await cartData.findByIdAndUpdate(
  //                 { _id: cartId },
  //                 { items: filtered, subTotal: subTotal, totalquantity: qtyTotal},
  //                 { new: true }
  //               );
  //             }else{
  //             console.log("hii")
  //             }
  //           }
  //         }
  //          const deleteseller = await Products.findByIdAndRemove({ _id: productid });
  //       }
  //     }
  //     const deletecat = await Categories.findByIdAndRemove({ _id: categoryid });
  //     return res.status(200).json({message:"updated"});
  //   }catch(error){
  //     console.log(error);
  //   }
  // }
  async filtercategory(req, res) {
    const parentid = req.params.id;
    const arraydata = [];
    try {
      const fetchdropdown = await Categories.find({
        pid: parentid,
        isfilterd: true,
      });
      for await (const fetchdata of fetchdropdown) {
        const childiddata = fetchdata._id;
        const datafetch = await Categories.find({ pid: childiddata });
        arraydata.push(datafetch);
      }
      // const children = fetchdropdown.concat(arraydata);
      if (!fetchdropdown) {
        return res.status(400).json({ message: "No field found" });
      } else {
        return res
          .status(200)
          .json({ outerdata: fetchdropdown, innerdata: arraydata });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async topgames(req,res){
    try{
     const data=await Categories.find({istopgames:true});
     return res.status(200).json(data)
    }catch(err){
      console.log(err)
    }
  }
}
module.exports = new Category();
