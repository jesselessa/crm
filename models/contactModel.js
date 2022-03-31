//----------- MONGOOSE -------------//
const mongoose = require("mongoose");

//------------ SCHEMA --------------//
const ContactSchema = mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Number, required: true },
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
