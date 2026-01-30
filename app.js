const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PATH = 8080;
MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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

// index route
app.get("/listings", async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  res.render("listings/edit.ejs", { Listing });
});
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body });
  res.redirect(`/listing/${id}`);
});

// Add route
app.post("/listings", async (req, res) => {
  const { title, description, image, price, location, country } = req.body;
  const listings = await new listing({
    title: title,
    description: description,
    image: image,
    price: price,
    location: location,
    country: country,
  });

  listings.save();
  res.redirect("/listings");
});

// Show route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  res.render("listings/show.ejs", { Listing });
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const DeleteListing = await listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(PATH, () => {
  console.log("server is listening to port 8080");
});
