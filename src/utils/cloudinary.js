import {v2 as cloudinary} from cloudinary
import fs from "fs"

cloudinary.config({
    cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME',
    api_key: 'process.env.',
    api_secret: 'process.env.'
})


const uploadOnCloudinary = async(localFilePath) => {

    try{
        if(!localFilePath) return null
        //upload file on category
       const response = await cloudinary.uplaoder.upload(localFilePath, {
                resource_type: "auto"
        })

        //file has been uploaded successfully
        console.log("File has been uploaded successfully", 
           response.url
        );
        return response;

    
    }catch(error){
        fs.unlinkSync(localFilePath) //Remove the locally saved temporary file if the request is failed

    }
}


export {uploadOnCloudinary}