const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/Review.js");
const AsyncWrap = require("../utils/AsyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");

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

// add reviwes post route
router.post(
  "/",
  validateReview,
  AsyncWrap(async (req, res) => {
    // getting id from url
    let Ourlisting = await listing.findById(req.params.id);

    // get Review array data and save it in the new variable
    let newReview = new Review(req.body.Review);

    // push that fetched review in that reviwes array which is in lisitng collection
    Ourlisting.Review.push(newReview);

    //save that newReview in reviwes collection
    await newReview.save();

    //save that review data in listing collection
    await Ourlisting.save();

    res.redirect(`/listings/${Ourlisting._id}`);
  }),
);

// delete review route
router.delete(
  "/:reviewId",
  AsyncWrap(async (req, res) => {
    let { reviewId, id } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;