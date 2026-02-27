const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PATH = 8080;
MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const AsyncWrap = require("./utils/AsyncWrap.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/Review.js");

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

// using joi as a middleware, validation function for listing on server side
const validateListing = (req, res, next) => {
  let { err } = listingSchema.validate(req.body);
  if (err) {
    throw new ExpressError(400, err);
  } else {
    next();
  }
};

// validation function for review on server side using joi as a middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// index route
app.get(
  "/listings",
  AsyncWrap(async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// edit route
app.get(
  "/listings/:id/edit",
  AsyncWrap(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs", { Listing });
  }),
);
app.put(
  "/listings/:id",
  validateListing,
  AsyncWrap(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listing/${id}`);
  }),
);

// Add route
app.post(
  "/listings",
  validateListing,
  AsyncWrap(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Show route
app.get(
  "/listing/:id",
  AsyncWrap(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("Review");
    res.render("listings/show.ejs", { Listing });
  }),
);

// Delete Route
app.delete(
  "/listings/:id",
  AsyncWrap(async (req, res) => {
    const { id } = req.params;
    const DeleteListing = await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

// add reviwes post route
app.post(
  "/listing/:id/reviews",
  validateReview,
  AsyncWrap(async (req, res) => {
    // getting id from url
    let Ourlisting = await listing.findById(req.params.id);

    // get Review array data and sacve it in the new variable
    let newReview = new Review(req.body.Review);

    // push that fetched review in that reviwes array which is in lisitng collection
    Ourlisting.Review.push(newReview);

    //save that newReview in reviwes collection
    await newReview.save();

    //save that review data in listing collection
    await Ourlisting.save();

    res.redirect(`/listing/${Ourlisting._id}`);
  }),
);

// delete review route
app.delete(
  "/listing/:id/reviews/:reviewId",
  AsyncWrap(async (req, res) => {
    let { reviewId, id } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
  }),
);

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
