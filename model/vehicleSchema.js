const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new mongoose.Schema({
  name: String,
  photo: String,
  company: String,
  wheels: Number,
  color: String,
  average: Number,
  age: Number,
  capacity: Number,
  owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
  regno: String,
  available: Boolean,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
