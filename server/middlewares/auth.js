//JWT-Authentication middleware 
//its job is to verify that the request comes from a logged-in user before allowing the request to continue.

import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import User from "../models/User.js";

export const protectRoute = async (req,res,next) => {

    const token = req.headers.token; //expecting token in header from client

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    // decoded = {
    // userId: "64abc123...",
    // iat: ...,
    // exp: ... }

    const user = await User.findById(decoded.user_id).select("-password") // get everything except password

    if(!user) return res.json({success : false, message : "User Not Found!"});

    //if user found
    req.user = user; // adding to req object 

    next();

}

// controller to get authenticated user data assuming protectRoute is already checked the authentication and attached the user data to req obj

export const checkAuth = (req,res) => {
    res.json({success : true, user : req.user});
}
