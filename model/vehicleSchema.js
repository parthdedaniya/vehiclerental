const mongoose = require("mongoose");
const User = require("./userSchema");

const vehicleSchema = new mongoose.Schema({
  name: String,
  company: String,
  color: String,
  average: Number,
  age: Number,
  capacity: Number,
  owner: User,
  registrationNo: String,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
