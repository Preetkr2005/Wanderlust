const listing = require("../models/listing");

const Index = async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
};

const RenderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

const Showlisting = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing
    .findById(id)
    .populate({ path: "Review", populate: { path: "author" } })
    .populate("owner");
  if (!Listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { Listing });
};

const Editlisitng = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  if (!Listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { Listing });
};

const Updatelisting = async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body });
  res.redirect(`/listings/${id}`);
};

const Addlisting = async (req, res, next) => {
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing is created");
  res.redirect("/listings");
};

const Deletelisting = async (req, res) => {
  const { id } = req.params;
  const DeleteListing = await listing.findByIdAndDelete(id);
  console.log(DeleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports = {
  Index,
  RenderNewForm,
  Showlisting,
  Editlisitng,
  Updatelisting,
  Addlisting,
  Deletelisting,
};
