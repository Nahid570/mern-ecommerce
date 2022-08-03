const express = require("express");
const { createProduct } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const {
  photoUpload,
  productResize,
  brandResize,
} = require("../middlewares/photoUpload");

const productRouter = express.Router();

productRouter.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  photoUpload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'logo', maxCount: 1 },
  ]),
  productResize,
  brandResize,
  createProduct
);

module.exports = productRouter;
