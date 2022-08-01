const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const sendToken = require("../utils/sendToken");
const { cloudinaryUploadAvatarImages } = require("../utils/cloudinary");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendMail");
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

// Login a user
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req?.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email And Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const isPassMatched = await user.comparePassword(password);
  if (!isPassMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 201, res);
});

// Logout a user
exports.logoutUser = asyncHandler(async (req, res) => {
  if (!req?.cookies?.token) {
    res.json({
      success: false,
      message: "There is no cookie set to the request",
    });
  } else {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  }
});

// get user details
exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?.id);
  if (!user) {
    throw new Error("No user found!");
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Forget password
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req?.body?.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const resetToken = await user.getRestPasswordToken();
  await user.save();

  const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`;

  try {
    await sendEmail({
      email: user?.email,
      templateId: `${process.env.SENDGRID_RESET_TEMPLATE}`,
      data: {
        resetUrl: resetPasswordUrl,
      },
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user?.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req?.params?.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid reset password token", 404));
  }

  user.password = req?.body?.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Update Password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req?.user?.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req?.body?.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is Invalid", 400));
  }

  user.password = req?.body?.newPassword;
  await user.save();
  sendToken(user, 201, res);
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const userNewData = {
      name: req?.body?.name,
      gender: req?.body?.gender,
    };

    if (req?.file) {
      const user = await User.findById(req?.user?.id);
      const imageId = user?.avatar?.public_id;
      if (imageId) {
        await cloudinary.uploader.destroy(imageId);
      }
      const localPath = `public/images/avatar/${req?.file?.originalname}`;
      const avatarUpload = await cloudinaryUploadAvatarImages(localPath);
      userNewData.avatar = {
        public_id: avatarUpload?.public_id,
        url: avatarUpload?.secure_url,
      };
    }

    await User.findByIdAndUpdate(req?.user?.id, userNewData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
});

// ADMIN DASHBOARD
// Get all the users ->> ADMIN
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new ErrorHandler("No users found", 404));
  }
  res.status(200).json({
    success: true,
    users,
  });
});
