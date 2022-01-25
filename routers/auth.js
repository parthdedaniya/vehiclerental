const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello main page auth js");
});

router.post("/register", (req, res) => {
  console.log(req.body);
  res.json({ message: req.body });
  //res.send("My register page");
});

module.exports = router;
