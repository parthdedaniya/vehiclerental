const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  userimg: {
    type: String,
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
  dob: {
    type: Date,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  vehicles: [
    {
      vehicle: {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    },
  ],
  license: {
    type: String,
    required: true,
  },
  dob: Date,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
