import jwt from "jsonwebtoken";

//function to generate token for user
export const generateToken = (user_id) =>{
    const token = jwt.sign({user_id}, process.env.JWT_SECRET);
    return token;
}



