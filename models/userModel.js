//----------- MONGOOSE -------------//
const mongoose = require("mongoose");

//------------ SCHEMA --------------//
const UserSchema = mongoose.Schema({
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
  // To disable the "_v" attribute in our Schema
  // versionKey: false,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
