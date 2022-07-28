const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadAvatarImages = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      folder: "mern-ecommerce/avatar",
    });
    fs.unlink(fileToUpload, (err) => {
      if (err) throw new Error(err.message);
      return;
    });
    return data;
  } catch (error) {
    fs.unlink(fileToUpload, (err) => {
      if (err) throw new Error(err.message);
      return;
    });
    return error;
  }
};

module.exports = { cloudinaryUploadAvatarImages };
