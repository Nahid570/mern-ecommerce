const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_CONN, () => {
    console.log("MongoDB Connected");
  });
};

module.exports = connectDatabase;
