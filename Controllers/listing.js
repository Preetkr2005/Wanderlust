const listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken})

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

  let originalImageUrl = Listing.image.url
  originalImageUrl = originalImageUrl.replace("/upload","/uplaod/w_250")
  res.render("listings/edit.ejs", { Listing, originalImageUrl});
};

const Updatelisting = async (req, res) => {
  const { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body });

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  Listing.image = {url, filename}
  await listing.save()
  }

  req.flash("success", "Listing updated")
  res.redirect(`/listings/${id}`);
};

const Addlisting = async (req, res, next) => {

  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.Listing.location,
    limit: 1,
  })
  .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.Listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;

  newListing.geometry = response.body.features[0].geometry

  let savedListing = await newListing.save();
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
