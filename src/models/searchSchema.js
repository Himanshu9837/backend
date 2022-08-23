const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const searchSchema=new mongoose.Schema({
    searchbar:{
        type: Boolean,
        default:false,
    },
    accountsearch:{
        type: Boolean,
        default:false,
    },
    gamesearch:{
        type: Boolean,
        default:false,
    },
    productsearch:{
        type: Boolean,
        default:false,
    },
})
const searchbar=mongoose.model("searchbar",searchSchema);
module.exports=searchbar;