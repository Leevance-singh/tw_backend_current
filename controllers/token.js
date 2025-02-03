// creating signed token
// create token for user and get user details from token for verification
const jwt = require("jsonwebtoken");
const secret = "Shreya123#";
function makeToken(userObj) {
  // console.log("token",userObj);
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
