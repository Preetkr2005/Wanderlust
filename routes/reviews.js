const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/Review.js");
const AsyncWrap = require("../utils/AsyncWrap.js");
const listing = require("../models/listing.js");
const { validateReview, isloggedin, isReviewAuthor } = require("../middleware/middleware.js");

// add reviwes post route
router.post(
  "/",
  isloggedin,
  validateReview,
  AsyncWrap(async (req, res) => {
    // getting id from url
    let Ourlisting = await listing.findById(req.params.id);

    // get Review array data and save it in the new variable
    let newReview = new Review(req.body.Review);
    newReview.author = req.user._id;

    // push that fetched review in that reviwes array which is in lisitng collection
    Ourlisting.Review.push(newReview);

    //save that newReview in reviwes collection
    await newReview.save();

    //save that review data in listing collection
    await Ourlisting.save();
    req.flash("success", "New review Created!");

    res.redirect(`/listings/${Ourlisting._id}`);
  }),
);

// delete review route
router.delete(
  "/:reviewId",
  isloggedin,
  isReviewAuthor,
  AsyncWrap(async (req, res) => {
    let { reviewId, id } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review Deleted!");
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
