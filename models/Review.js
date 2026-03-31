const mongoose = require("mongoose")
const {Schema} = require("mongoose");

const ReviewSchema = new Schema({
    Comment:{
       type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

const Review = new mongoose.model("Review", ReviewSchema);

module.exports = Review;