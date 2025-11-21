    const mongoose=require("mongoose");
    require("dotenv").config();

    const mongdb_url=process.env.MONGODB_CONN;  

    mongoose.connect(mongdb_url)
    .then(()=>{
        console.log("connected to DB");
    }).catch((e)=>{
        console.log("mongo error", e)
    })