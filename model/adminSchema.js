const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  adminimg: String,
  email: String,
  password: String,
  phone: Number,
  address: String,
  dob: String,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//generating token
adminSchema.methods.generateAuthTokenAdmin = async function () {
  try {
    let token = await jwt.sign({ _id: this._id }, process.env.ADMIN_SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log("this: " + err);
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
