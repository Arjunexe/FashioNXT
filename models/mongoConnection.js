var mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    return console.log("Database connected!");
  } catch (err) {
    return console.log(err);
  }
}
module.exports = connectDB
