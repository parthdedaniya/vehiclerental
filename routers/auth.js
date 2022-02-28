const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const authenticate = require("../middleware/authenticate");
const userSchema = require("../model/userSchema");
const adminSchema = require("../model/adminSchema");
const vehicleSchema = require("../model/vehicleSchema");
const bookingDetails = require("../model/bookingDetails");
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

const { $where } = require("../model/userSchema");
const res = require("express/lib/response");

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
    const city = req.rootUser.city;
    const pincode = req.rootUser.pincode;
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
        city,
        pincode,
        regno,
        rentamount,
        available,
      });
      const vehicleAdd = await vehicle.save();
      userSchema.findByIdAndUpdate(
        owner,
        { $push: { vehicles: { vehicle: vehicle._id } } },
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
router.get("/allvehicle", (req, res) => {
  // console.log(req.query);
  if (req.query.wheels || req.query.company || req.query.city) {
    vehicleSchema.find(
      {
        $and: [
          { available: true },
          {
            $or: [
              { wheels: req.query.wheels },
              { company: req.query.company },
              {
                city: {
                  $regex: "^" + req.query.city,
                  $options: "i",
                },
              },
            ],
          },
        ],
      },
      (err, vehicle) => {
        if (err) {
          console.log(err);
        } else {
          // console.log("working");
          res.send(vehicle);
        }
      }
    );
  }
  // if (req.query.city) {
  //   vehicleSchema.find(
  //     {
  //       city: {
  //         $regex: "^" + req.query.city,
  //         $options: "i",
  //       },
  //     },
  //     (err, vehicle) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.send(vehicle);
  //       }
  //     }
  //   );
  // }
  else {
    vehicleSchema.find({ available: true }, (err, vehicle) => {
      if (err) {
        console.log(err);
      } else {
        // console.log("this is working");
        res.send(vehicle);
      }
    });
  }
});

//vehicle by wheels

// router.get("/allvehicle/wheels:id", (req, res) => {
//   vehicleSchema.find(
//     { available: true, wheels: req.params.id },
//     (err, vehicle) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(vehicle);
//         res.send(vehicle);
//       }
//     }
//   );
// });

// router.get("/allvehicle?wheels=:wh", (req, res) => {
//   console.log("working");
//   const ww = req.params.wh;
//   console.log(wh);
//   vehicleSchema.find(
//     { available: true, wheels: req.params.id },
//     (err, vehicle) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(vehicle);
//         res.send(vehicle);
//       }
//     }
//   );
// });

// router.get("/allvehicle?wheels=4", (req, res) => {
//   vehicleSchema.find({ available: true, wheels: 4 }, (err, vehicle) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(vehicle);
//     }
//   });
// });

//user's vehicle data
router.get("/uservehicle", authenticate, (req, res) => {
  vehicleSchema.find({ owner: req.rootUser._id }, (err, vehicle) => {
    if (err) {
      console.log(err);
    } else {
      res.send(vehicle);
    }
  });
});

//remove vehicle
router.delete("/deletevehicle/:id", async (req, res) => {
  const id = req.params.id;
  //const userid = rootUser._id;
  await vehicleSchema
    .findByIdAndRemove(id, (err, vehicle) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Vehicle deleted successfully");
      }
    })
    .clone();

  // userSchema.findByIdAndUpdate(
  //   req.rootUser._id,
  //   { $unset: { vehicles: [{ _id: req._id }] } },
  //   (err, user) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("User db updated successfully");
  //     }
  //   }
  // );
  res.send("vehicle removed from vehicle db");
});

router.put("/deletevehiclefromuser/:id", authenticate, async (req, res) => {
  //const userid = rootUser._id;
  const vid = req.params.id;

  await userSchema.findByIdAndUpdate(
    req.rootUser._id,
    { $unset: { vehicles: [{ _id: req._id }] } },
    (err, v) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.send("vehicle removed from user profile");
  // await userSchema.findById(userid,(err,res) => {
  //   res.save();

  // })
});

//user details by id

router.get("/userbyid/:id", (req, res) => {
  const uid = req.params.id;
  //console.log(uid);
  userSchema.findById(uid, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

//all user data

router.get("/allusersdata", (req, res) => {
  userSchema.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

//vehicles details by id

router.get("/vehicledetail/:id", (req, res) => {
  const vid = req.params.id;
  //console.log(vid);
  vehicleSchema.findById(vid, (err, vehicle) => {
    if (err) {
      console.log("1");
      console.log(err);
    } else {
      console.log("2");
      res.send(vehicle);
    }
  });
});

//book vehicle

router.post("/bookvehicle", async (req, res) => {
  console.log(req.body);
  const startDate = req.body.startDate;
  const startTime = req.body.startTime;
  const endDate = req.body.endDate;
  const endTime = req.body.endTime;
  const bookedVehicle = req.body.bookedVehicle;
  const vehicleOwner = req.body.vehicleOwner;
  const bookedBy = req.body.bookedBy;

  try {
    const booking = new bookingDetails({
      bookedVehicle,
      vehicleOwner,
      bookedBy,
      startDate,
      // startTime,
      endDate,
      // endTime,
    });
    const starthour = startTime.slice(0, 2);
    const startmin = startTime.slice(3);
    const endhour = endTime.slice(0, 2);
    const endmin = endTime.slice(3);

    booking.startDate.setHours(starthour, startmin);
    booking.endDate.setHours(endhour, endmin);
    // console.log(startTime);
    // console.log(startmin);
    // console.log(endTime);
    // console.log(endmin);
    const book = await booking.save();
    res.status(201).json({ message: "vehicle booked successfully" });
    // console.log(booking.startDate.getHours());
    // console.log(booking.startDate.getMinutes());
  } catch (err) {
    console.log(err);
  }
  // vehicleSchema.findByIdAndUpdate(
  //   req.body.bookedVehicle,
  //   { available: false },
  //   (err, vehicle) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("Vehicle status updated");
  //     }
  //   }
  // );
});

setInterval(() => {
  bookingDetails.find({}, (err, booking) => {
    if (err) {
      console.log(err);
    } else {
      booking.map((b) => {
        if (
          new Date().toISOString().split("T")[0] ===
          b.startDate.toISOString().split("T")[0]
        ) {
          if (
            ("0" + new Date().getHours()).slice(-2) +
              ":" +
              ("0" + new Date().getMinutes()).slice(-2) ===
            ("0" + b.startDate.getHours()).slice(-2) +
              ":" +
              ("0" + b.startDate.getMinutes()).slice(-2)
          ) {
            vehicleSchema.findByIdAndUpdate(
              b.bookedVehicle,
              { available: false },
              (err, vehicle) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("status updated of " + vehicle._id);
                }
              }
            );
          }
        }
      });
    }
  });
}, 60000);

//user's booking details

router.get("/user/bookings", authenticate, (req, res) => {
  const uid = req.rootUser._id;
  // console.log(uid);

  bookingDetails.find({ bookedBy: uid }, (err, bookings) => {
    if (err) {
      console.log(err);
    } else {
      res.send(bookings);
    }
  });
});

//update vehicle status

setInterval(() => {
  bookingDetails.find({}, (err, booking) => {
    if (err) {
      console.log(err);
    } else {
      booking.map((b) => {
        if (
          new Date().toISOString().split("T")[0] ===
          b.endDate.toISOString().split("T")[0]
        ) {
          if (
            ("0" + new Date().getHours()).slice(-2) +
              ":" +
              ("0" + new Date().getMinutes()).slice(-2) ===
            ("0" + b.endDate.getHours()).slice(-2) +
              ":" +
              ("0" + b.endDate.getMinutes()).slice(-2)
          ) {
            vehicleSchema.findByIdAndUpdate(
              b.bookedVehicle,
              { available: true },
              (err, vehicle) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("status updated of " + vehicle._id);
                }
              }
            );
            bookingDetails.findByIdAndUpdate(
              b.id,
              { completed: true },
              (err, book) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(book.id + " completed");
                }
              }
            );
          }
        }
      });
    }
  });
}, 60000);

//get all booking details

router.get("/getbookingdetails", (req, res) => {
  bookingDetails.find({}, (err, booking) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(booking);
      res.send(booking);
    }
  });
});

router.get("/signout", (req, res) => {
  console.log("Log out page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
