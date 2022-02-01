const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

require("./db/conn");
const userSchema = require("./model/userSchema");
//const adminSchema = require("./model/adminSchema");
//const vehicleSchema = require("./model/vehicleSchema");
//const bookingSchema = require("./model/bookingDetails");

app.use(express.json());

//we link the router files to make our route easy
app.use(require("./routers/auth"));

const PORT = process.env.PORT;

const middleware = (req, res, next) => {
  console.log("Middleware working...");
  next();
};

// app.get("/", (req, res) => {
//   res.send("Hello main page");
// });

app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
