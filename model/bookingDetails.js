const { mongoose, Schema } = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookedVehicle: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
  vehicleOwner: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookedby: [{ type: Schema.Types.ObjectId, ref: "User" }],
  startDate: Date,
  startTime: Date,
  endDate: Date,
  endTime: Date,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
