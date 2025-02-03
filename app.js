const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const todoRouter = require("./routes/todoRouter");
app.use(cookieParser());
app.use(express.static("/public"));
app.use(express.urlencoded());
app.use(todoRouter);
app.listen(7000,(err,data)=>{
    if(err)
        console.log("Server is not connected!!");
    else{
        console.log("Server is connected at port 7000");
    }
})