//------------- EXPRESS ----------------//
const express = require("express");
const router = express.Router();
//----------- AUTHENTIFICATION ----------//
const bcrypt = require("bcrypt");

//--------------- MODEL -----------------//
const User = require("../models/userModel");

//--------------- ROUTE -----------------//
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });
  // Check if email already exists in DB
  if (user) {
    return res.status(409).json({
      message:
        "ERROR 409 - This email is already associated to an account in our database",
    });
  }

  // Check password's format
  const regex = /^(?=.*\d).{6,}$/;
  if (!regex.test(password)) {
    return res.status(400).json({
      message:
        "ERROR 400 - Your password must contain at least 6 characters and one digit",
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log("hashed password: ", hashedPassword);

  // Create a new user
  try {
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    console.log("user : ", user);
  } catch (error) {
    return res.status(400).json({
      message: "ERROR 400 - Invalid email or password",
    });
  }
  res.status(201).json({
    message: "New user  created",
  });
});

module.exports = router;
