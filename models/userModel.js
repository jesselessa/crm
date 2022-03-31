//----------- MONGOOSE -------------//
const mongoose = require("mongoose");

//------------ SCHEMA --------------//
const UserSchema = mongoose.Schema({
  username: { type: String, unique: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 100,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
