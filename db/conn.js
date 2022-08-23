const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://doadmin:5473R20G96IJDBSZ@db-mongodb-blr1-04567-4783fa0f.mongo.ondigitalocean.com/admin?tlsInsecure=true&ssl=true',{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true},function(err) {
    if(err) throw err
    console.log("DATABASE CONNECTED");
})


// const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://doadmin:8Z924G7wM1vK5Si3@db-mongodb-blr1-56346-78945172.mongo.ondigitalocean.com/admin?tlsInsecure=true&ssl=true', {
//     useNewUrlParser: true,
//     // useCreateIndex: true
// },function(err) {
//     if(err) throw err
//     console.log("DATABASE CONNECTED");
// })
