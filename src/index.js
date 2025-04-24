import dotenv from "dotenv"
dotenv.config({
    path: "./env",
  });

import express from "express";

import {app} from "./app.js"


import connectDB from './db/index.js'

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , () => {
        console.log("server is running on PORT", process.env.PORT)
    })
})
.catch((error) => {
    console.log("database error" , error);
})