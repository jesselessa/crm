const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// CONNECT TO MONGODB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB"));

// MIDDLEWARES
app.use(express.json());
// app.use(cookieParser());

// START SERVER
app.listen(port, () => {
  console.log(`Server listening at : http//localhost:${8000}`);
});
