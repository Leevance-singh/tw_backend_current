const {getUser} = require("../controllers/token");
const verifyUser =(req,res,next)=>{
    const userExists = getUser(req.cookies.mycookie);
    if(userExists)
        next();
    else
        res.send({message:"Please Login first!!",loginStatus:false});
}
module.exports={
    verifyUser
}