import mongoose from "mongoose";


const uploadScheam = new mongoose.Schema({
     filename: {
        type: String,
        required: true
     },
     filePath: {
        type: String,
        required: true
     }
})


export default mongoose.model("upload", uploadScheam);
