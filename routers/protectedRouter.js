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

//------------------ ROUTE --------------------//

//* We create a route which allows us to get the data from jwt. It can only be accessed if we have access to the jwt that is inside the cookie. If we don't, we will get an error.
//* Then we'll be able to make use of the new properties that we added to the request

router.get("/", authorization, (req, res) => {
  return res.json({ user: { id: req.userId, role: req.userRole } });
});
module.exports = router;
