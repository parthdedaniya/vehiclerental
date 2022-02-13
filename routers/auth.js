const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const authenticate = require("../middleware/authenticate");
//const User = require("../model/userSchema");
//const Vehicle = require("../model/vehicleSchema");
const cors = require("cors");
router.use(cors());

// router.use("/public/image/userimg", express.static("userimg"));
// router.use("/public/image/vehicleimg", express.static("vehicleimg"));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/image/" + file.fieldname);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

require("../db/conn");
const userSchema = require("../model/userSchema");
const adminSchema = require("../model/adminSchema");
const vehicleSchema = require("../model/vehicleSchema");
const { $where } = require("../model/userSchema");

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
router.post("/signup", upload.single("userimg"), async (req, res) => {
  // const {
  //   fname,
  //   lname,
  //   photo,
  //   email,
  //   password,
  //   phone,
  //   address,
  //   pincode,
  //   city,
  //   license,
  // } = req.body;

  const fname = req.body.fname;
  const lname = req.body.lname;
  const userimg = req.file.filename;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const address = req.body.address;
  const pincode = req.body.pincode;
  const city = req.body.city;
  const license = req.body.license;

  if (
    !fname ||
    !lname ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !pincode ||
    !city ||
    !license
  ) {
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
      userimg,
      email,
      password,
      phone,
      address,
      pincode,
      city,
      license,
    });

    const userRegister = await user.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post("/signin", async (req, res) => {
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
router.post("/adminsignin", async (req, res) => {
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

//user route
router.get("/userpage", authenticate, (req, res) => {
  res.send(req.rootUser);
});

//add vehicle
router.post(
  "/registervehicle",
  [authenticate, upload.single("vehicleimg")],
  async (req, res) => {
    // const {
    //   name,
    //   company,
    //   wheels,
    //   color,
    //   average,
    //   modelyear,
    //   capacity,
    //   regno,
    // } = req.body;

    const name = req.body.name;
    const vehicleimg = req.file.filename;
    const company = req.body.company;
    const wheels = req.body.wheels;
    const color = req.body.color;
    const average = req.body.average;
    const modelyear = req.body.modelyear;
    const capacity = req.body.capacity;
    const regno = req.body.regno;
    const rentamount = req.body.rentamount;
    const owner = req.rootUser._id;
    const available = true;

    if (
      !name ||
      !company ||
      !wheels ||
      !color ||
      !average ||
      !modelyear ||
      !capacity ||
      !regno ||
      !rentamount
    ) {
      return res.status(422).json({ error: "Pls fill required details" });
    }

    try {
      const vehicle = new vehicleSchema({
        name,
        vehicleimg,
        company,
        wheels,
        color,
        average,
        modelyear,
        capacity,
        owner,
        regno,
        rentamount,
        available,
      });
      const vehicleAdd = await vehicle.save();
      userSchema.findByIdAndUpdate(
        owner,
        { vehicles: { vehicle: vehicle._id } },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Vehicle added to users database");
          }
        }
      );
      res.status(201).json({ message: "vehicle added successfully" });
    } catch (err) {
      console.log(err);
    }
  }
);

//all vehicle data
router.get("/allvehicles", (req, res) => {
  vehicleSchema.find({ available: true }, (err, vehicle) => {
    if (err) {
      console.log(err);
    } else {
      res.send(vehicle);
    }
  });
});

router.get("/signout", (req, res) => {
  console.log("Log out page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
