const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/Review.js");
const AsyncWrap = require("../utils/AsyncWrap.js");
const listing = require("../models/listing.js");
const {
  validateReview,
  isloggedin,
  isReviewAuthor,
} = require("../middleware/middleware.js");
const reviewController = require("../Controllers/review.js");

// add reviwes post route
router.post(
  "/",
  isloggedin,
  validateReview,
  AsyncWrap(reviewController.Addreview),
);

// delete review route
router.delete(
  "/:reviewId",
  isloggedin,
  isReviewAuthor,
  AsyncWrap(reviewController.Deletereview),
);

module.exports = router;
