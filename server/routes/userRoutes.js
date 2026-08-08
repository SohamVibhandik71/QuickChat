import express from "express";
import { checkAuth, login, signUp, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js"

const userRouter = express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",login);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.put("/update-profile", protectRoute, updateProfile);

export default userRouter;