//------------- EXPRESS ----------------//
const express = require("express");
const router = express.Router();
//----------- AUTHENTIFICATION ----------//
const bcrypt = require("bcrypt");
//--------------- MODEL -----------------//
const User = require("../models/userModel");
// MIDDLEWARES
app.use(express.json());

//--------------- ROUTE -----------------//
router.post("/", async (req, res) => {
  const regex = "^(?=D*d)S{6,}$";
  // Check password's length
  if (req.body.password.test(regex)) {
    return res.status(400).json({
      error: "Invalid password format : it must contain at least 8 characters.",
    });
  }
  // Check if the email already exists:
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        error: "This email already exists. Please, enter another one",
      });
    } // Example : navigate to login page
  } catch (error) {
    return res.status(400).json({ message: "An error happened " });
  }

  // Pasword hash:
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  console.log("hashed password: ", hashedPassword);

  // Create new user:
  try {
    await User.create({
      firstname: req.body.firstname,
      surname: req.body.surname,
      email: req.body.email,
      password: hashedPassword,
      description: req.body.description,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid data.",
    });
  }

  console.log("user : ", User);
  return res.status(201).json({
    message: `Account successfully created, welcome ${req.body.firstName} ${req.body.surname} ! `,
  });
});

module.exports = router;
