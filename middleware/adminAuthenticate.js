const jwt = require("jsonwebtoken");
const Admin = require("../model/adminSchema");
// var LocalStorage = require('node-localstorage').LocalStorage,
// localStorage = new LocalStorage('./scratch');

const adminAuthenticate = async (req, res, next) => {
  try {
    const token = req.cookies.admintoken;
    // console.log('LOCAL STORAGE NODE: ' + token1);
    // console.log(process.env.ADMIN_SECRET_KEY);
    console.log(token);
    const verifyToken = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    console.log(verifyToken);
    const rootAdmin = await Admin.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    // console.log(rootAdmin);
    if (!rootAdmin) {
      throw new Error("Admin not found");
    } else {
      req.token = token;
      req.rootAdmin = rootAdmin;
      req.adminId = rootAdmin._id;
    }

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token provided.");
    console.log("error: " + err);
  }
};

module.exports = adminAuthenticate;
