const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cors());
app.use(cookieParser());
dotenv.config({ path: "./config.env" });

app.use("/public", express.static("public"));

require("./db/conn");
//const userSchema = require("./model/userSchema");
//const adminSchema = require("./model/adminSchema");
//const vehicleSchema = require("./model/vehicleSchema");
// const bookingSchema = require("./model/bookingDetails");
// const feedbackSchema = require("./model/feedbackSchema");

app.use(express.json());

//we link the router files to make our route easy
app.use(require("./routers/auth"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
