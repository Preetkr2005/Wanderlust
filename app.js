const express = require("express");
const app = express();
const PATH = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const ConnectDB = require("./config/db.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

ConnectDB;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(flash());
// expire date of data which is user used during the login

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next()
})

app.use("/listings", listings);
app.use("/listing/:id/reviews", reviews);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "page not found"));
}); // used for all the not created routes

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
  // res.send("something is Wrong");
});

app.listen(PATH, () => {
  console.log("server is listening to port 8080");
});
