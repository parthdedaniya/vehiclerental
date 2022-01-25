const mongoose = require("mongoose");
const User = require("./userSchema");
const Vehicle = require("./vehicleSchema");

const bookingSchema = new mongoose.Schema({
  bookedVehicle: Vehicle,
  bookedby: User,
  bookingTime: Date,
  bookingSlot: Number,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
