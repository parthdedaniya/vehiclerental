const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookedVehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
  vehicleOwner: { type: Schema.Types.ObjectId, ref: "User" },
  bookedBy: { type: Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  startTime: String,
  endDate: Date,
  endTime: String,
  completed: { type: Boolean, default: false },

  name: String,
  vehicleimg: String,
  company: String,
  color: String,
  average: Number,
  modelyear: Number,
  capacity: Number,
  rentamount: Number,
  regno: String,

  owner_fname: String,
  owner_lname: String,
  owner_userimg: String,
  owner_email: String,
  owner_phone: Number,
  owner_address: String,
  owner_pincode: Number,
  owner_city: String,

  user_fname: String,
  user_lname: String,
  user_userimg: String,
  user_email: String,
  user_phone: Number,
  user_address: String,
  user_pincode: Number,
  user_city: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
