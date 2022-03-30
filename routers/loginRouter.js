//--------- EXPRESS - MONGOOSE ------------//
const express = require("express");
const router = express.Router();
//------------ AUTHENTIFICATION -------------//
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
//--------------- DOTENV ------------------//
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//---------------- MODEL ------------------//
const User = require("../models/userModel");

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// SECRET
const secret = process.env.DB_SECRET;

// ROUTE
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    //Check email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
    }

    //Compare login's password with the one registered by user
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //If the password is incorrect, an error message is displayed
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    //   Generate a token
    const token = jwt.sign({ id: user._id }, secret);

    //Add token to cookie :
    res.cookie("jwt", token, { httpOnly: true, secure: false });

    // Send cookie to user
    res.json({ success: "Cookie sent !" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "A problem happened",
    });
  }
});

module.exports = router;
