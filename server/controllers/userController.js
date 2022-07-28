const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const sendToken = require("../utils/sendToken");
const { cloudinaryUploadAvatarImages } = require("../utils/cloudinary");
require("dotenv").config();

// Register User
exports.registerUser = asyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error("User already exists, try different Email");

  const localPath = `public/images/avatar/${req?.file?.originalname}`;
  let avatarUpload;
  if (req?.file) {
    avatarUpload = await cloudinaryUploadAvatarImages(localPath);
  }

  const { name, email, gender, password } = req?.body;

  try {
    const user = await User.create({
      name,
      email,
      gender,
      password,
      avatar: {
        public_id: avatarUpload?.public_id,
        url: avatarUpload?.secure_url,
      },
    });
    sendToken(user, 201, res);
  } catch (error) {
    res.json(error.message);
  }
});
