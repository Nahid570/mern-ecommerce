const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/sendToken");
require("dotenv").config();

// Register User
exports.registerUser = asyncHandler(async (req, res) => {
    const userExists = await User.findOne({ email: req?.body?.email });
    if (userExists) throw new Error("User already exists, try different Email");
//   const myCloud = await cloudinary.v2.uploader.upload(req?.body?.avatar, {
//     folder: "avatars",
//     width: 150,
//     crop: "scale",
//   });
  const { name, email, gender, password } = req?.body;
  console.log(name, email, gender, password);
  try {
    const user = await User.create({
      name,
      email,
      gender,
      password,
    //   avatar: {
    //     public_id: myCloud?.public_id,
    //     url: myCloud?.secure_url,
    //   },
    });
    sendToken(user, 201, res);
  } catch (error) {
    res.json(error.message);
  }
});
