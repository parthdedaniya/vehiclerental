const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new mongoose.Schema({
  name: String,
  company: String,
  color: String,
  average: Number,
  age: Number,
  capacity: Number,
  owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
  registrationNo: String,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
