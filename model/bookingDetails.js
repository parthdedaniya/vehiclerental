const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookedVehicle: { type: Schema.Types.ObjectId, ref: "Vehicle" },
  vehicleOwner: { type: Schema.Types.ObjectId, ref: "User" },
  bookedBy: { type: Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  // startTime: Date,
  endDate: Date,
  // endTime: Date,
  completed: { type: Boolean, default: false },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
