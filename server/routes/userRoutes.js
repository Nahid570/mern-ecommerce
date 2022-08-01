const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgetPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
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

userRouter.put("/password/update", isAuthenticatedUser, updatePassword);

userRouter.put(
  "/update/profile",
  photoUpload.single("avatar"),
  avatarResize,
  isAuthenticatedUser,
  updateProfile
);

userRouter.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers
);

userRouter.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSingleUser
);

userRouter.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateUserRole
);

userRouter.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = userRouter;
