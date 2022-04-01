const express = require("express");
const router = express.Router();
//------------- AUTHENTIFICATION --------------//
const jwt = require("jsonwebtoken");
const secret = process.env.DB_SECRET;

//--------------- MIDDLEWARES -----------------//

//* Check if the incoming request has a jwt
const authorization = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).json({
      message: "ERROR 403 - Forbidden access ! You have to login first.",
    });
  }
  try {
    const data = jwt.verify(token, secret);
    req.userId = data.id;
    console.log("User authentified - Access granted");
  } catch (error) {
    return res.status(403).json({
      message: "ERROR 403 - Forbidden access ! You have to login first.",
    });
  }
  next();
};

//---------------- ROUTE ---------------------//

//* Logout
router.get("/", authorization, (_req, res) => {
  try {
    res.clearCookie("jwt", { path: "/" }).status(200).json({
      message: "You successfully logged out !",
    });
  } catch (error) {
    return res.status(400).json({
      message: " Something went wrong",
      error: ` 
      ${error}}`,
    });
  }
});

module.exports = router;
