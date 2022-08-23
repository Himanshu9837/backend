const Searchs = require("../models/searchSchema");

class Search {
  async addsearchdata(req, res) {
    const searchdata = {
      searchbar: true,
      accountsearch: true,
      gamesearch: true,
      productsearch: true,
    };
    const data = new Searchs(searchdata);
    data.save();
    return res.status(200).json("Done");
  }
  async fetchsearch(req, res) {
    const data = await Searchs.find();
    return res.status(200).json(data);
  }

  async updatesearch(req, res) {
    const id = req.params.id;
    try {
      const data = {};
      data.searchbar = req.body.searchbar;
      data.accountsearch = req.body.accountsearch;
      data.gamesearch = req.body.gamesearch;
      data.productsearch = req.body.productsearch;
      await Searchs.findByIdAndUpdate(id, data);
      return res.status(200).json("Update successfully");
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new Search();
