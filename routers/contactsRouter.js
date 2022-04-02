const express = require("express");
const router = express.Router();
//------------- AUTHENTIFICATION --------------//
const jwt = require("jsonwebtoken");
const secret = process.env.DB_SECRET;
const cookieParser = require("cookie-parser");

//------------------- MODELS ------------------//
const Contact = require("../models/contactModel");
const User = require("../models/userModel");

//--------------- MIDDLEWARES -----------------//

//* Working with cookies in server
router.use(cookieParser());

//* Check if incoming request has our cookie (called "jwt")
const authorization = (req, res, next) => {
  // *! 1 - If no cookie, access to controller prohibited
  const token = req.cookies.jwt;
  if (!token) {
    res.status(403).json({
      message: "Forbidden access ! You have to login first.",
    });
  }
  // *! 2 - If cookie, check token to obtain data ; however, if error, access to controller prohibited
  try {
    // *! 3- Declare new properties in the request object to make it easier for us to access token's data
    const data = jwt.verify(token, secret);
    // *! 4 - Create req.userId and assign the value of the id in the token (same for req.userRole)
    req.userId = data.id;
    req.userRole = data.role;
  } catch (error) {
    return res.status(403).json({
      message: "Forbidden access ! You have to login first.",
    });
  }
  // *! 5 - Access given to controller
  next();
};

//---------------- ROUTES ---------------------//

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
    });
  }
});

//* Get all user's contacts
router.get("/:userId", authorization, async (req, res) => {
  const contacts = await Contact.find({ userId: req.params.userId });
  res.status(200).json({
    data: contacts,
    nb: contacts.length, //usersContacts
  });
});

//* Update a contact
router.put("/:userId/:contactId", authorization, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.contactId, {
      name: req.body.name,
      ...req.body,
    });
    res.status(201).json({
      message: "Contact updated",
      description: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

//* Search by query strings
router.get("/:userId/filter", authorization, async (req, res) => {
  try {
    const contact = await Contact.find(req.query);
    console.log(req);
    res.status(200).json(contact);
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
});

//* Delete a contact
router.delete("/:userId/:contactId", authorization, async (req, res) => {
  try {
    await Contact.findOneAndDelete(req.params.contactId);
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
});

module.exports = router;
