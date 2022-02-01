const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new mongoose.Schema({
  name: String,
  photo:{ data: Buffer,
  contentType: String},
  company: String,
  wheel: Number,
  color: String,
  average: Number,
  age: Number,
  capacity: Number,
  owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
  registrationNo: String,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
