const mongoose = require("mongoose");
MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const connectDB = main()
  .then(() => {
    console.log("connection success");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

module.exports = connectDB;
