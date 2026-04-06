const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const AsyncWrap = require("../utils/AsyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isloggedin, isOwner } = require("../middleware/middleware.js");
const listingController = require("../Controllers/listing.js");

// using joi as a middleware, validation function for listing on server side
const validateListing = (req, res, next) => {
  let { err } = listingSchema.validate(req.body);
  if (err) {
    throw new ExpressError(400, err);
  } else {
    next();
  }
};

// index route
router.get("/", AsyncWrap(listingController.Index));

// New Route
router.get("/new", isloggedin, listingController.RenderNewForm);

// edit route
router.get(
  "/:id/edit",
  isloggedin,
  isOwner,
  AsyncWrap(listingController.Editlisitng),
);

// update route
router.put(
  "/:id",
  isloggedin,
  isOwner,
  validateListing,
  AsyncWrap(listingController.Updatelisting),
);

// Add route
router.post(
  "/",
  isloggedin,
  validateListing,
  AsyncWrap(listingController.Addlisting),
);

// Show route
router.get("/:id", isloggedin, AsyncWrap(listingController.Showlisting));

// Delete Route
router.delete(
  "/:id",
  isloggedin,
  isOwner,
  AsyncWrap(listingController.Deletelisting),
);

module.exports = router;
