//---------------- EXPRESS ------------------//
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

//* Working with cookies in server
router.use(cookieParser());

//------------- SECRET --------------//
const secret = process.env.DB_SECRET;

//------------- ROUTE ---------------//
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  //* 1- Check email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "ERROR 401 - Incorrect email",
    });
  }
  //* 2 - Compare user's password to hash in database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "ERROR 401 - Incorrect password",
    });
  }

  //* 3 - Authentification

  // *! 3.1 - Generate a token with jsonwebtoken
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "120s" });
  // *! 3.2 - Store token in a cookie called "jwt" and send it to client in response with a message of successful login
  return res
    .cookie("jwt", token, { httpOnly: true, secure: false })
    .status(200)
    .json({ message: "You logged in successfully" });
});

module.exports = router;
