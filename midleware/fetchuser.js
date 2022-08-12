var jwt = require("jsonwebtoken");
var JWT_SECRET = "JaswinderS2412";
const fetchuser = (req, res, next) => {
  //get the user from the JWT toke and add id to req

  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ error: "Please authenticate user with valid token" });
  }
  try {
    const mystring = jwt.verify(token, JWT_SECRET);
    req.user = mystring.user;
    next();
  } catch (err) {
    res
    .status(401)
    .send({ error: "Please authenticate user with valid token" });
  }
};
module.exports = fetchuser;
