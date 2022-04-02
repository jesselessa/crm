//---------------- EXPRESS ------------------//
const express = require("express");
const router = express.Router();
//------------- AUTHENTIFICATION --------------//
const jwt = require("jsonwebtoken");
const secret = process.env.DB_SECRET;
const cookieParser = require("cookie-parser");

//--------------- MIDDLEWARES -----------------//
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

//---------------- ROUTE ---------------------//
// * 1 - Remove value from cookie (remove jwt) and add authorization middleware to our new route
router.get("/", authorization, (_req, res) => {
  try {
    return res
      .clearCookie("jwt")
      .status(200)
      .json({
        message: "You have successfully logged out!",
      })
      .redirect("/");
  } catch (error) {
    return res.status(401).json({
      message: "Your token is not valid",
      error: `
            ${error}}`,
    });
  }
});

module.exports = router;
