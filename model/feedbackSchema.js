const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new mongoose.Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    vehicleName: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName: String,
    rating: Number,
    review: String,
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
