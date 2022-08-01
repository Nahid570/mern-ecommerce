const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
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

module.exports = userRouter;
