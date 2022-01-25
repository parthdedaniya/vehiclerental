const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  adminid: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;