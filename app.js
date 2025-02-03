//...................................Core Components
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const todoRouter = require("./routes/todoRouter");
const cors = require("cors");

//..................................Middleware's setup
app.use(cookieParser());
app.use(express.static("/public"));
app.use(express.urlencoded());
app.use(todoRouter);
app.use(cors({
    origin: '*',
}));

app.use((req, res, next) => {
  console.log("----request.method :", req.method);
  console.log("----request.url :"   , req.url); 
  next();
});
//.............................App initialization
app.listen(7000,(err,data)=>{
    if(err)
        console.log("Server is not connected!!");
    else{
        console.log("Server is connected at port 7000");
    }
}) 