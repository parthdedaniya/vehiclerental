const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userid: String,
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: Date,
});

const User = mongoose.model("User", userSchema);

const adminSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  adminid: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

const vehicleSchema = new mongoose.Schema({
  name: String,
  company: String,
  color: String,
  average: Number,
  age: Number,
  capacity: Number,
  owner: User,
  registrationNo: String,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

const bookingSchema = new mongoose.Schema({
  bookedVehicle: Vehicle,
  bookedby: User,
  bookingTime: Date,
  bookingSlot: Number,
});

const Booking = mongoose.model("Booking", bookingSchema);
