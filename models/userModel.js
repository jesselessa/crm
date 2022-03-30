const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    minLength: 1,
    maxLength: 30,
  },
  surname: {
    type: String,
    minLength: 1,
    maxLength: 30,
  },
  email: {
    unique: true,
    type: String,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 100,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
