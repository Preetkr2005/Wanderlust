const listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/Review.js");
const ExpressError = require("../utils/ExpressError.js");

const isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //make a new property in session object where we store user want to access path before login
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const Listing = await listing.findById(id);
  if (!Listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
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

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of the review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = {
  isloggedin,
  saveRedirectUrl,
  isOwner,
  validateReview,
  isReviewAuthor
};
