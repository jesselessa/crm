const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//----------------- MODEL ---------------------//
const User = require("./models/userModel");

//------------ CONNECT TO MONGODB -------------//
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB"));

//--------------- MIDDLEWARES ----------------//
app.use(express.json());
// app.use(cookieParser());

//----------------- ROUTES ------------------//

//------------------- SignUp ---------------//
app.post("/register", async (req, res) => {
  //Check password's length:
  if (req.body.password.length < 8) {
    return res.status(400).json({
      error: "Invalid password format : it must contain at least 8 characters.",
    });
  }
  //Check if the email already exists:
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        error: "This email already exists. Please, enter another one",
      });
    }
  } catch (error) {
    return res.status(400).json({ message: "An error happened " });
  }

  //Pasword hash:
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  console.log("hashed password: ", hashedPassword);

  //Create new user:
  try {
    const user = await User.create({
      password: hashedPassword,
      firstname: req.body.firstname,
      surname: req.body.surname,
      email: req.body.email,
      birthdate: req.body.birthdate,
    });
    console.log("user : ", user);
    return res.status(201).json({
      message: `Account successfully created, welcome ${user.surname} ${user.surname} !`,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid data.",
    });
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`Server listening at : http//localhost:${8000}`);
});
