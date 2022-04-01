//--------- EXPRESS - MONGOOSE ------------//
const express = require("express");
const router = express.Router();
//------------ AUTHENTIFICATION -------------//
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
//--------------- DOTENV ------------------//
dotenv.config({ path: "./config.env" });

//---------------- MODEL ------------------//
const User = require("../models/userModel");

//------------- MIDDLEWARE ---------------//
router.use(cookieParser());

//------------- SECRET --------------//
const secret = process.env.DB_SECRET;

//------------- ROUTE ---------------//
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  //* Check email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "ERROR 401 - Incorrect email",
    });
  }
  //* Compare user's password to hash in database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "ERROR 401 - Incorrect password",
    });
  }

  //* Generate a token
  const token = jwt.sign({ id: user._id }, secret);

  //* Add token to cookie
  res.cookie("jwt", token, { httpOnly: true, secure: false });

  //* Send cookie to user
  res.status(200).json({ message: "Cookie sent !" });
});

module.exports = router;
