const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

exports.isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req?.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access", 401));
  }

  const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);
  req.user = await User.findById(decodedData?.id);
  next();
});
