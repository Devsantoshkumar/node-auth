import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./upload");
    },
    filename: function (req, file, cb){
        const filename = `${Date.now()} - ${file.originalname}`;
        cb(null, filename);
    }
})



export default multer({storage});