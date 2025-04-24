import dotenv from "dotenv"
dotenv.config()

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

  


const uploadOnCloudinary = async(localFilePath) => {

    try{
        if(!localFilePath) return null
        //upload file on category
       const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
        })

        // //file has been uploaded successfully
        // console.log("File has been uploaded successfully", 
        //    response.url
        // );

        fs.unlinkSync(localFilePath);
        return response;

    
    }catch(error){
        fs.unlinkSync(localFilePath) //Remove the locally saved temporary file if the request is failed

        console.error("Cloudinary upload failed ❌", error); // Add this!
        return null; // Also add this to make sure `undefined` is not returned silently

    }
}


export {uploadOnCloudinary}