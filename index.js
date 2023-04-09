import mongoose from "mongoose";
import app from './src/app.js'
import config from "./src/config/index.js";

// iife to connect to database
(async ()=>{
try{
  // await mongoose.connect('mongodb://localhost:27017/ecomm')
  await mongoose.connect(config.MONGODB_URL)
  console.log("DB CONNECTED !");

  app.on('error',(err)=>{
    console.log("ERROR: ",err);
    throw err
  })

  // listen to port
  app.listen(config.PORT,()=>{
    console.log(`Listening on port ${config.PORT}`);
  })

}catch(err){
  console.log('ERROR: ',err);
  throw err
}
})()