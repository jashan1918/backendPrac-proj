class ApiError extends Error {

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode,
        this.data = null, //this is not needed in most of the caes but its here no need tho
        this.message = message,  //this can also be removed becasue the super already sets the message this can also be removed and the code will still work
        this.success = false,
        this.errors = errors

       
        //this is not needed too could be helpful to learn in the future
        if(stack) {

            this.stack = stack
        } else{
            Error.captureStackTrace(this,this.constructor);
        }
    }

   
} 

export { ApiError };




