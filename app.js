const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PATH = 8080;
MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listings.js")
const reviews = require("./routes/reviews.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("connection success");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use("/listings", listings)
app.use("/listing/:id/reviews", reviews)

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
