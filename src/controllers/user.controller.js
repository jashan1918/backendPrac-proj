import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"



 const registerUser = asyncHandler(async(req,res) => {
    
    //get user details from the frontend
    //validations server side/ in backend - not empty
    //check if the user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudiary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return response or else error

    const {fullname, username, email, password} = req.body;
    console.log("email : ", email);

    if(
        [fullname, username, email, password].some((field) => {
            return field?.trim() === ""
        })
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with this email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverimage[0].path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullname: fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: email,
        password: password,
        username: username.toLowerCase()

    })

   const userCreated = await User.findById(user._id).select("-password -refreshToken")

   if(!userCreated) {
    throw new ApiError(500, "something went wrong while registering an user")
   }
 
   return res.status(201).json(

    new ApiResponse(200, createdUser, "User registered Succesfully!")
   )

    
})

export {registerUser}