const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const AsyncWrap = require("../utils/AsyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

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
router.get(
  "/",
  AsyncWrap(async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

// New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// edit route
router.get(
  "/:id/edit",
  AsyncWrap(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs", { Listing });
  }),
);
router.put(
  "/:id",
  validateListing,
  AsyncWrap(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  }),
);

// Add route
router.post(
  "/",
  validateListing,
  AsyncWrap(async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Show route
router.get(
  "/:id",
  AsyncWrap(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("Review");
    res.render("listings/show.ejs", { Listing });
  }),   
);

// Delete Route
router.delete(
  "/:id",
  AsyncWrap(async (req, res) => {
    const { id } = req.params;
    const DeleteListing = await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

module.exports = router;
