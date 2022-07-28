const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");

connectDatabase();



app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
