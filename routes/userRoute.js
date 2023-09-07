import express from "express";
import { login, signup, update, logout, upload } from "../controller/userController.js";
import userMiddleware from "../middleware/userMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const route = express.Router();

route.post("/signup", signup)
route.post("/upload", uploadMiddleware.single("myfile"), upload)
route.get("/login", login)
route.put("/update/:id", userMiddleware, update);
route.get("/logout", logout)

export default route;