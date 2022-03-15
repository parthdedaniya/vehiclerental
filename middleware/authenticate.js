const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    console.log(token);
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyToken);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    console.log(rootUser);
    if (!rootUser) {
      throw new Error("User not found");
    } else {
      req.token = token;
      req.rootUser = rootUser;
      req.userId = rootUser._id;
    }

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token provided.");
    console.log("error: " + err);
  }
};

module.exports = authenticate;
