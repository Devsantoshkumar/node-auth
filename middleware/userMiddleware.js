import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) =>{
    
    const token = req.cookies.token;
    const uId = req.params.id;
    
    if(!token){
        return res.status(401).json({message: "Authentication is required"});
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        res.userId = decodedToken.userId;
        if(uId !== decodedToken.userId){
            return res.status(404).json({message: "Access denied"});
        }
        next();  
    } catch (error) {
        res.status(500).json({error: "Invalid token"})
    }
}



export default authMiddleware;