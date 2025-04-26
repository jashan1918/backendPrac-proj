//in this we are gonna authenticate the user before they go to any new route and we will return req.user = user so we can get user deatils in the route

import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"



export const verifyJwt = asyncHandler(async(req,res,next) => {

 try {

        const authHeader = req.header("Authorization")
         const token =  req.cookies?.accessToken || authHeader?.replace("Bearer ", "");
   
         if(!token) {
           throw new ApiError(401, "Unauthorized request")
         }
   
         const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
   
       const user = await User.findById(decodedInfo?._id).select("-password -refreshToken")
   
       if(!user) {
           throw new ApiError(401, "invalid Access Token")
       }
   
       req.user = user;
       next();
 } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token")  
 }

})