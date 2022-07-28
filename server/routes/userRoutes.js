const express = require("express");
const { registerUser } = require("../controllers/userController");
const { photoUpload, avatarResize } = require("../middlewares/photoUpload");

const userRouter = express.Router();

userRouter.post(
  "/register",
  photoUpload.single("avatar"),
  avatarResize,
  registerUser
);

module.exports = userRouter;
