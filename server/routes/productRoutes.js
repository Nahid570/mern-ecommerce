const express = require("express");
const {
  deleteProduct,
  createProduct,
  updateProduct,
  getAllProducts,
} = require("../controllers/productController");
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
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
  ]),
  productResize,
  brandResize,
  createProduct
);

productRouter.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  photoUpload.fields([
    { name: "images", maxCount: 5 },
    { name: "logo", maxCount: 1 },
  ]),
  productResize,
  brandResize,
  updateProduct
);

productRouter.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct
);

productRouter.get("/products", getAllProducts);

module.exports = productRouter;
