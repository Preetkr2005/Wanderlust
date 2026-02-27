const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review");

const listingSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1580741186862-c5d0bf2aff33?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1580741186862-c5d0bf2aff33?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v, // we use set for set a default image if somone not pass the value or image in the image section
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  Review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.Review } });
  }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
