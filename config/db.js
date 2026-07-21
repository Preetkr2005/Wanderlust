const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const ATLAS_URL = process.env.ATLASDB_URL;

const connectDB = main()
  .then(() => {
    console.log("connection success");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(ATLAS_URL);
}

module.exports = connectDB;
