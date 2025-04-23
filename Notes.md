//as the name suggests this is for the notes 

## MULTER flow and usage 

1. multer is used to parse multi-part data
2. multer is used as utility to be used as a middleware where the file upload is needed
3. we store the file locally then upload it to the cloudinary then delte local
4. fs.unlinkSync() is used to cleanup (unlink is when the file is deleted from the data operating systems dont make the files disappear they just keep them linked and unlinked)


### Steps:
1. Use `diskStorage` with unique filename
2. In controller:
   - upload to Cloudinary
   - delete local file