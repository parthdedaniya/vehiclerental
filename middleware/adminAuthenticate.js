const jwt = require("jsonwebtoken");
const Admin = require("../model/adminSchema");

const adminAuthenticate = async (req, res, next) => {
  try {
    const token = req.cookies.admintoken;
    const verifyToken = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

    const rootAdmin = await Admin.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
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
