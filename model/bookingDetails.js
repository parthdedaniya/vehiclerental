const { mongoose, Schema } = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookedVehicle: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
  bookedby: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookingTime: Date,
  bookingSlot: Number,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
