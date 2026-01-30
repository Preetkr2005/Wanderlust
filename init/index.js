const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const initData = require("./data");
const listing = require("../models/listing");

main().then(() => {
    console.log("connection success")
}).catch((err) =>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await listing.deleteMany({})
    await listing.insertMany(initData.data)
    console.log("sample data is transfer");
}

initDB();