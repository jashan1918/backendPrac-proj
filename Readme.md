this is a practice project i am not building it myself i am gonna be following along with someone but i think that it will be pretty good for my core concepts and ofc some good practices too

1. the first thing i learnt in this project is how to properly structure the files and folders to initialize a perfect backend project

a. first we create a couple folders like public with temp and gitkeep in it
b. more folders like controllers db middlewares models routes utils 
c. then some important files like index.js constatns.js app.js and index.js in the db for server
d. define some more files like gitignore prettierignore prettierrc 

2. then i got to know about the better way to connect mongodb to the backend like a standarized way to catch errors and all

a. first wrap the mongoose.connect in a try catch block and process.exit(1) in the catch
b. connect the server using .env variables
c.call the function in the index.js file 
d. use .then there so you can use app.listen after the database is connected to immediately start the http server

3. next i learned about the asyncHandler :-  this is used like it is a middleware but creaetd in utils and used as a utility middleware and it is used to remove the repetiveness of the try and catch block which we have to use in every single route that we create and rather we can just pass it through this middleware instead 

a. first create a function that will take the requesthandler as an argument and it will return a middleware(function) which is like (req,res,next)
b. then that middleware function will have the promise logic promise.resolve (requesthadnler(req,res,next)) .catch ((err) => next(err))

4. then comes the APIERROR AND API RESPONSE :- These are used to like structure the data whether it is the error or the response 
API ERROR
a.  you create an extended error class with some fields inside the constructor realted to erros and stuff then you assign values to those errors to custome variable using 'this' keyword

APIRESPONSE 
a. here you just create a class and then constructor with some fields and then assign values to the custom variables

5. then there came the usermodel and videomodel but they are just like models and what is new in them?? 
the express hooks adn the custom methods that you can define to perform some actions

PRE HOOK FOR THE PASSWORD ;- this hook is defined to create like a check that is done before saving the password and it hashes the password before saving it also checks if it is modified 

userSchema.pre("save", async function() {
 if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});



