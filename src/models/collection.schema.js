import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Name can't be empty"],
        trim:true,
        maxLength:[20,"Maximum length allowed is 20 chars"]
    }

},{timestamps:true})

export default mongoose.model("Collection",collectionSchema)