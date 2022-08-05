const express = require("express");
const {
  deleteProduct,
  createProduct,
  updateProduct,
  getAllProducts,
  getProducts,
  getProductDetails,
  getAdminProducts,
  createProductReview,
  getProductReviews,
  deleteReview,
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

productRouter.get("/products/all", getProducts);

productRouter.get("/product/:id", getProductDetails);

productRouter.get(
  "/admin/products",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminProducts
);

productRouter.put("/review", isAuthenticatedUser, createProductReview);

productRouter.get("/reviews/:id", getProductReviews);

productRouter.delete("/reviews/:id", isAuthenticatedUser, deleteReview);

module.exports = productRouter;
