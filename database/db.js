const mongoose = require("mongoose");
const URL = process.env.MONGO_DB_URL;
async function connectDB() {
  try {
    await mongoose.connect(URL, {
      dbName: "authDB",
    });
    console.log("Mongo DB connected succesfully");
  } catch (error) {
    console.log("Connection Failed", error);
  }
}

module.exports = { connectDB };
