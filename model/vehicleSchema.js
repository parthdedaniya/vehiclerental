const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new mongoose.Schema({
  name: String,
  vehicleimg: String,
  company: String,
  wheels: Number,
  color: String,
  average: Number,
  modelyear: Number,
  capacity: Number,
  rentamount: Number,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  city: { type: Schema.Types.String, ref: "User" },
  pincode: { type: Schema.Types.Number, ref: "User" },
  regno: String,
  available: Boolean,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
