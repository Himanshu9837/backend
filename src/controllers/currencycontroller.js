const Currency = require("../models/currencySchema");
const fixerrate = require("../models/fixerrateSchema");

class Currencies{
    async addcurrency(req, res) {
      console.log(req.body)
        const currencyname = req.body.currencyname;
        const countryname = req.body.countryname;
        if(!currencyname){
          return res.status(400).json("currency name required");
        }
        if(!countryname){
          return res.status(400).json("country name required");
        }
        try {
          const data = {
            currencyname: currencyname,
            countryname:countryname
          };
          const dataset = new Currency(data);
          dataset.save().then((result) => {
            return res.status(200).json("Save successfully");
          });
        } catch (error) {
          console.log(error);
        }
      }
      async fetchcurrency(req, res) {
        try {
          const data = await Currency.find({isenable:true});
          return res.status(200).json(data);
        } catch (error) {
          console.log(error);
        }
      }
      async updatefetchcurrency(req, res) {
        const id=req.params.id
        try {
          const data={};
           data.isenable=req.body.isenable;
           data.currencyname=req.body.currencyname;
           data.countryname=req.body.countryname;
          await Currency.findByIdAndUpdate(id,data);
          return res.status(200).json('update successfully');
        } catch (error) {
          console.log(error);
        }
      }
      async fetchfixerallrate(req, res) {
        try {
          const data = await fixerrate.find();
          return res.status(200).json(data);
        } catch (error) {
          console.log(error);
        }
      }
      async fetchrateprice(req,res){
          const code=req.params.currency;
          try{
          const data=await fixerrate.find();
          const check=data[0].rates[code];   
          return res.status(200).json(check)
          }catch(error){
              console.log(error)
          }
      }
      async updatecurrencyrate(req,res){
        const id=req.params.id;
        try{  
       const Fixer = require('fixer-node')
       const fixer = new Fixer('a74922ea4990cea2abb78309ae5b629d')
        const base = await fixer.base({ base: 'USD' })
           const fixerrates=base.rates;
           const fixerbase=base.base;
           const fixerdate=base.date;
           const fixers={}
           fixers.rates=fixerrates,
           fixers.base=fixerbase,
           fixers.date=fixerdate
           await fixerrate.findByIdAndUpdate(id,fixers)
           return res.status(200).json("Update rate sucessfully")
        }catch(err){
          console.log(err)
        }
      }
      async editcurrency(req,res){
        const id=req.params.id;
        try{
        const data=await Currency.findOne({_id:id});
        if(!data){
          return res.status(200).json("NO data found")
        }else{
        return res.status(200).json(data);
        }
        }catch(err){
          console.log(err)
        }
      }
}
module.exports=new Currencies;