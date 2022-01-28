const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../db/conn");
const userSchema = require("../model/userSchema");
const adminSchema = require("../model/adminSchema");
const vehicleSchema = require("../model/vehicleSchema");

router.get("/", (req, res) => {
  res.send("Hello main page auth js");
});

//using promises
// router.post("/register", (req, res) => {
//   const { fname, lname, email, password, phone, address, dob } = req.body;
//   if (!fname || !lname || !email || !password || !phone || !address) {
//     return res.status(422).json({ error: "Pls fill required details" });
//   }
//   userSchema
//     .findOne({ email: email })
//     .then((userexist) => {
//       if (userexist) {
//         return res.status(422).json({ error: "email already exist" });
//       }
//       const user = new userSchema({
//         fname,
//         lname,
//         email,
//         password,
//         phone,
//         address,
//         dob,
//       });
//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "user registered successfully" });
//         })
//         .catch((err) => res.status(500).json({ error: "failed to register" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

//using async-await
router.post("/register", async (req, res) => {
  const { fname, lname, email, password, phone, address, dob } = req.body;
  if (!fname || !lname || !email || !password || !phone || !address) {
    return res.status(422).json({ error: "Pls fill required details" });
  }

  try {
    const userexist = await userSchema.findOne({ email: email });

    if (userexist) {
      return res.status(422).json({ error: "email already exist" });
    }

    const user = new userSchema({
      fname,
      lname,
      email,
      password,
      phone,
      address,
      dob,
    });

    const userRegister = await user.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Pls fill the details" });
    }

    const userLogin = await userSchema.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        res.json({ message: "User login successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//admin Login
router.post("/adminLogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Pls fill the details" });
    }

    const adminLogin = await adminSchema.findOne({
      email: email,
      password: password,
    });

    if (!adminLogin) {
      res.status(400).json({ error: "Invalid credentials" });
    } else {
      res.json({ message: "admin login successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//add vehicle
router.post("/addVehicle", async (req, res) => {
  const {
    name,
    company,
    color,
    average,
    age,
    capacity,
    owner,
    registrationNo,
  } = req.body;
  if (
    !name ||
    !company ||
    !color ||
    !average ||
    !age ||
    !capacity ||
    !owner ||
    !registrationNo
  ) {
    return res.status(422).json({ error: "Pls fill required details" });
  }
  try {
    const vehicle = new vehicleSchema({
      name,
      company,
      color,
      average,
      age,
      capacity,
      owner,
      registrationNo,
    });
    const vehicleAdd = await vehicle.save();
    res.status(201).json({ message: "vehicle added successfully" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
