const express = require("express");
const router = express.Router();
//------------- AUTHENTIFICATION --------------//
const jwt = require("jsonwebtoken");
const secret = process.env.DB_SECRET;
//------------------- MODELS ------------------//
const Contact = require("../models/contactModel");
const User = require("../models/userModel");

//--------------- MIDDLEWARE -----------------//

//* Check if the incoming request has a jwt
const authorization = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).json({
      message: "Forbidden access ! You have to login first.",
      error: `${error}`,
    });
  }
  try {
    const data = jwt.verify(token, secret);
    req.userId = data.id;
    console.log("User authentified - Access granted");
    return next();
  } catch (error) {
    return res.status(403).json({
      message: "Forbidden access ! You have to login first.",
      error: `${error}`,
    });
  }
};

//---------------- ROUTES ---------------------//

//* Get all user's contacts
router.get("/:userId", authorization, async (req, res) => {
  const contacts = await Contact.find({ userId: req.params.userId }).select(
    "-__v"
  );
  res.status(200).json({
    data: contacts,
    nb: userContacts.length,
  });
});

//* Create a new contact
router.post("/:userId", authorization, async (req, res) => {
  const user = await User.findById(req.params.userId);

  try {
    const contact = await Contact.create({
      userId: user._id,
      ...req.body,
    });
    res.status(201).json({
      message: "New contact added to your list",
      description: contact,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      error: `${error}`,
    });
  }
});

//* Update a contact
router.put("/:userId/:contactId", authorization, async (req, res) => {
  try {
    const contact = await Contact.findOne(
      { _id: req.params.contactId },
      { userId: req.params.userId }
    ).findByIdAndUpdate(contact._id, req.body);
    res.status(201).json({
      message: "Contact updated",
      description: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong",
      error: `${error}`,
    });
  }
});

//* Delete a contact
router.delete("/:userId/:contactId", authorization, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete(
      { _id: req.params.contactId },
      { userId: req.params.userId }
    );
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      error: `${error}`,
    });
  }
});

module.exports = router;
