const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const { photoUpload, avatarResize } = require("../middlewares/photoUpload");

const userRouter = express.Router();

userRouter.post(
  "/register",
  photoUpload.single("avatar"),
  avatarResize,
  registerUser
);

userRouter.post("/login", loginUser);

userRouter.get("/logout", logoutUser);

userRouter.get("/user-details", isAuthenticatedUser, getUserDetails);

userRouter.post("/forget-password", forgetPassword);

userRouter.put("/password/reset/:token", resetPassword);

module.exports = userRouter;
