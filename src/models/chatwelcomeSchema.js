const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const chatwelcomeSchema= new mongoose.Schema({
    welcomemsg:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    welcomeheading:{
        require: false,
        type: { any: [Schema.Types.Mixed] },
    },
    wecomelogo: {
        require: false,
        type: { any: [Schema.Types.Mixed] },
      },
     date : {
            type:Date,
            default:Date.now
        },

})
const chatwelcome=mongoose.model('chatwelcome',chatwelcomeSchema);

module.exports = chatwelcome;
