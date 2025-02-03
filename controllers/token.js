// creating signed token
// create token for user and get user details from token for verification
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
function makeToken(userObj,verifyEmail=false) {
  // console.log("token",userObj);
  if(verifyEmail){
    const payload ={
      email:userObj.email
    }
    return jwt.sign(payload, secret, { expiresIn: "1 m"});
  }
  const payload = {
    email: userObj.email,
    id: userObj._id,
  };
  return jwt.sign(payload, secret, { expiresIn: '1 h'});
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  makeToken,
  getUser,
};
