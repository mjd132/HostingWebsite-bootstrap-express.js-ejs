const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

//**DATABASE**//
const database = require("./database");
//**Routers**//
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const homeRouter = require("./homeRouter");
const adminRouter = require("./adminRouter");
// EJS setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/pages");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
// cookie and session setup
app.use(cookieParser());
app.use(
  session({
    secret: "Ali-Karamooz-Secret-Key",
    resave: false, // Don't save the session if it hasn't changed
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: {
      maxAge: 30 * 60 * 1000, // Set the session to expire in 1 hour (in milliseconds)
    },
  })
);
//database
database;
//error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

//Router Middleware
app.use(userRouter);
app.use(authRouter);
app.use(homeRouter);
// app.use(adminRouter.contentRouter);
// app.use(adminRouter.planRouter);
app.use(adminRouter.router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
