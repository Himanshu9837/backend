const Cartdata = require("../models/cartSchema");
const Product = require("../models/productSchema");
const Seller = require("../models/sellerSchema");
const User = require("../models/userSchema");
class Cart {
  async addItmeToCart(req, res) {
    const { userId, itemId } = req.body;
    let data = null;
    const quantity = Number.parseInt(req.body.quantity);
    let cart = await Cartdata.findOne({ userId: userId });
    const productDetails = await Product.findById(itemId);
    const sellerId1 = productDetails.sellerId;
    const user = await Seller.findOne({ _id: sellerId1 });
    const sellerId = user.userId;

    if (cart) {
      let indexFound = cart.items.findIndex((p) => p.productId == itemId);
      console.log(indexFound);
      if (indexFound != -1 && quantity > 0) {
        console.log(cart.items[indexFound].quantity);
        cart.items[indexFound].productId = itemId;
        cart.items[indexFound].sellerId = sellerId;
        cart.items[indexFound].quantity =
          cart.items[indexFound].quantity + quantity;
        cart.items[indexFound].total =
          cart.items[indexFound].quantity * productDetails.price;
        cart.items[indexFound].price = productDetails.price;
        cart.subTotal = parseFloat(cart.items
          .map((item) => item.total)
          .reduce((acc, curr) => acc + curr));
        cart.totalquantity = cart.items
          .map((item) => item.quantity)
          .reduce((acc, curr) => acc + curr);
      } else if (indexFound == -1 && quantity > 0) {
        cart.items.push({
          productId: itemId,
          sellerId: sellerId,
          quantity: quantity,
          price: productDetails.price,
          total: parseFloat(productDetails.price * quantity),
        });
        cart.subTotal = parseFloat(cart.items
          .map((item) => item.total)
          .reduce((acc, curr) => acc + curr));
        cart.totalquantity = cart.items
          .map((item) => item.quantity)
          .reduce((acc, curr) => acc + curr);
      } else {
        return res.status(400).json({ message: "Invalid Request" });
      }
      cart = new Cartdata(cart);
      data = await cart.save();
    } else {
      const cartData = {
        userId: userId,
        items: [
          {
            productId: itemId,
            sellerId: sellerId,
            quantity: quantity,
            total: parseFloat(productDetails.price * quantity),
            price: productDetails.price,
          },
        ],
        subTotal: parseFloat(productDetails.price * quantity),
        totalquantity: parseInt(quantity),
      };
      cart = new Cartdata(cartData);
      data = await cart.save();
    }
    return res.status(200).send({
      message: "Add to cart successfully",
      data: data,
    });
  }
  async cartdata(req, res) {
    let user = req.params.id;
    const arraydata = [];
    try {
      const cartinfo = await Cartdata.find({ userId: user })
        .populate("items.productId")
        .populate("items.sellerId")
        .populate({ path: "items.productId", populate: "category" });
      //       for await(const items of cartinfo){
      //         const itemdetails=items.items;
      //         for await(const prodetails of itemdetails){
      //         const sellerid=prodetails.sellerId;
      //         const userdetails=await Seller.findOne({_id:sellerid})
      //         const userid=userdetails.userId;
      //         const data=await User.findOne({_id:userid});
      // arraydata.push(data)
      //         }
      //       }
      if (!cartinfo) {
        return res.status(400).json({ error: "cart is empty" });
      } else {
        return res.status(200).json(cartinfo);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deletecart(req, res) {
    const id = req.params.id;
    const cartId = req.body.cartId;
    try {
      let cart = await Cartdata.findOne({ _id: cartId });
      const items = cart.items;
      const filtered = items.filter((element) => {
        return element._id != id;
      });
      const subTotal = filtered.reduce(
        (previousValue, currentValue) => previousValue + currentValue.total,
        0
      );
      const qtyTotal = filtered.reduce(
        (previousValue, currentValue) => previousValue + currentValue.quantity,
        0
      );
      const result = await Cartdata.findByIdAndUpdate(
        { _id: cartId },
        { items: filtered, subTotal: subTotal, totalquantity: qtyTotal },
        { new: true }
      );
      return res.json({ res: result });
    } catch (error) {
      console.log(error);
    }
  }
  async cartupdate(req, res) {
    const productId = req.params.id;
    const cartId = req.body.cartId;
    const qty = req.body.quantity;
    const productDetails = await Product.findById(productId);
    const price = productDetails.price * qty;
    try {
      const updatecart = await Cartdata.updateOne(
        { _id: cartId, "items.productId": productId },
        { $set: { "items.$.quantity": qty, "items.$.total": price } }
      );

      const cart = await Cartdata.findOne({ _id: cartId });
      const items = cart.items;
      const filtered = items.filter((element) => {
        return element._id;
      });
      const subTotal = filtered.reduce(
        (previousValue, currentValue) => previousValue + currentValue.total,
        0
      );
      const qtyTotal = filtered.reduce(
        (previousValue, currentValue) => previousValue + currentValue.quantity,
        0
      );
      const result = await Cartdata.findByIdAndUpdate(
        { _id: cartId },
        { items: filtered, subTotal: subTotal, totalquantity: qtyTotal },
        { new: true }
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  }
  async checkusercart(req, res) {
    const userid = req.params.userid;
    console.log(userid);
    const productid = req.params.productid;
    console.log(productid);
    // const checkdata = "items." + productid;
    try {
      const data = await Cartdata.findOne({ userId: userid });
      if (!data) {
        return res.status(200).json(true);
      } else {
        const items = data.items;
        const filtered = items.filter((element) => {
          return element.productId == productid;
        });
        if (filtered.length == 0) {
          return res.status(200).json(true);
        }

        const productqtycart = filtered[0].quantity;
        const product = await Product.findOne({ _id: productid });
        const check = product.stock;
        if (productqtycart >= check) {
          return res.status(200).json(false);
        } else {
          return res.status(200).json(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new Cart();
