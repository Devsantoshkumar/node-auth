import User from "../model/userModel.js";
import Upload from "../model/uploadModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const signup = async(req, res) =>{
    try {

        const userData = new User(req.body);
        const {email} = userData;

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json("User already exist");
        }
        const savedUser = await userData.save();
        res.status(200).json(savedUser);

    } catch (error) {
        res.status(500).json(error.message)
    }
}



export const login = async (req, res) =>{
    try {

        const {email, password} = req.body;
        const userExist = await User.findOne({email});

        if(!userExist){
            return res.status(401).json({message: "Invalid email or password"});
        }
        
        const isValidPassword = await bcrypt.compare(password, userExist.password);

        if(!isValidPassword){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const existToken = req.cookies.token;
        if(existToken){
            return res.status(400).json({message: "Already login"});
        }
 
        const token = jwt.sign({userId: userExist._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true, maxAge: 3600000});
        res.status(200).json("Login successfully");

    } catch (error) {
        res.status(500).json(error.message);
    }
}


export const logout = async (req, res) =>{
    try {

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: "Login is required"});
        }

        res.clearCookie("token");
        res.json({message: "Logout successfully"});

    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error});
    }
}



export const update = async(req, res) =>{
    try {
        const id = req.params.id;
        const userExist = await User.findOne({_id: id});
        if(!userExist){
            return res.status(404).json({message: "user not found"});
        }


        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: "Server internal error"});
    }
}


export const upload = async (req, res) =>{
    try {

        if(!req.file){
           return res.status(404).json({message: "File is required"});
        }

        req.body.filename = req.file.filename;
        req.body.filePath = req.file.path;

        const uploadFIle = await new Upload(req.body);
        const uploadedFIle = await uploadFIle.save();
        res.status(200).json(uploadedFIle)

    } catch (error) {
        res.status(500).json({error: error});
    }
}