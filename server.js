//--------- EXPRESS AND MONGOOSE -------------//
const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
//-------------- DOTENV ----------------------//
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//------------ CONNECT TO MONGODB -------------//
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB"));

//--------------- MIDDLEWARE ----------------//
app.use(express.json());

//---------------- ROUTERS ------------------//
const registerRouter = require("./routers/registerRouter");
const loginRouter = require("./routers/loginRouter");
const contactsRouter = require("./routers/contactsRouter");
const logoutRouter = require("./routers/logoutRouter");
const protectedRouter = require("./routers/protectedRouter");

//----------------- ROUTES ------------------//
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/contacts", contactsRouter);
app.use("/logout", logoutRouter);
app.use("/protected", protectedRouter);
app.get("*", (_req, res) => {
  res.status(404).send("Error 404 - Not found");
});

//-------------- START SERVER -----------------//
app.listen(port, () => {
  console.log(`Server listening at : http//localhost:${port}`);
});
