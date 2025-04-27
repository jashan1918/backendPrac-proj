import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId) => {

    try{

        const user = await User.findById(userId);
        const accessToken = user.generateToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return {accessToken,refreshToken}

    }catch(error) {
        throw new ApiError(500, "something went wrong while generating access or refresh token")
    }
} 

const registerUser = asyncHandler(async(req,res) => {
    
    //get user details from the frontend
    //validations server side/ in backend - not empty
    //check if the user already exists: username, username
    //check for images, check for avatar
    //upload them to cloudiary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return response or else error

    const {fullname, username, email, password} = req.body;
    const {files} = req;

    if(
        [fullname, username, email, password].some((field) => {
            return field?.trim() === ""
        })
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { username }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with this username or username already exists")
    }

    const avatarLocalPath = files?.avatar?.[0]?.path
    // const coverImageLocalPath = files?.coverImage?.[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){

        coverImageLocalPath = req.files.coverImage[0].path
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
        username: username,
        email: email,
        password: password,
        username: username.toLowerCase()

    })

   const userCreated = await User.findById(user._id).select("-password -refreshToken")

   if(!userCreated) {
    throw new ApiError(500, "something went wrong while registering an user")
   }
 
   return res.status(201).json(

    new ApiResponse(200, userCreated, "User registered Succesfully!")
   )

    
})

const loginUser = asyncHandler(async(req,res) => {

    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {username, email, password} = req.body;

    if(!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    if(!password) {
        throw new ApiError(400, "Password is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(!user) {
        throw new ApiError(401, "User with this username or email doesnt exist")
    }

    const passwordValid = await user.isPasswordCorrect(password);

    if(!passwordValid) {
        throw new ApiError(402, "username/email or password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //some options for cookies i forgot

    const options = {

        httpOnly : true,
        secure : true
    }

    res.status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(201,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in succesfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res) => {

   const user = await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {refreshToken: undefined}
    },
    {new : true}
)
const options = {
    httpOnly: true,
    secure: true
}

return res.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200,{}, "User Logged out Successfully"))

    
})

const refreshAccessToken = asyncHandler(async(req,res) => {

    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!refreshToken) {
        throw new ApiError(402, "Unauthorized request")
    }
    
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user) {
        throw new ApiError(400, "user does not exist")
    }

    if(refreshToken !== user.refreshToken){
        throw new ApiError(401, "Refresh token is invalid or used")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, newrefreshToken} = await user.generateAccessAndRefreshTokens()

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newrefreshToken, options)
    .json(
        new ApiResponse(200, 
            {
                accessToken, refreshToken: newrefreshToken
            },
            "Access Token refreshed")
    )
})


const changeCurrentPassword = asyncHandler(async(req,res) => {

//get the data from req.body old password and newpassword
//check if the data is given if not throw an error
//find the user by id get it from the req.user from middleware
//compare the old passwrod with the saved password using the method we created earlier bcrypt.compare
//if the password dont match throw an error of invalid password
//if the password matches set user.password to the new password
//after that save it in the database using validationsbeforesave false
//return the response saying that the password has been changed successfully 

        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword){
            throw new ApiError(402, "all fields are required")
        }
        if(oldPassword === newPassword) {
            throw new ApiError(403, "new password cannot be same as the old password")
        }

        const user = await User.findById(req.user?._id);

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect) {
            throw new ApiError(400, "your old password is wrong")
        }

        user.password = newPassword;
        await  user.save({validateBeforeSave: false});

        return res.status(200)
        .json(
            new ApiResponse(200,
                {},
                "Password changed succesfully"
            )
        )
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res.status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched Successfully"
    ))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser
}
