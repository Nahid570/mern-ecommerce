const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const {
  cloudinaryUploadProductImages,
  cloudinaryUploadBrandImages,
} = require("../utils/cloudinary");

// Create Product ->> ADMIN
exports.createProduct = asyncHandler(async (req, res, next) => {
  try {
    let images;
    if (req?.files?.images) {
      images = req?.files?.images;
    }
    // loop through images and upload product images to cloudinary
    let imagesLink = [];
    if (images?.length > 0) {
      for (let i = 0; i < images?.length; i++) {
        const localPath = `public/images/products/${req?.files?.images[i]?.originalname}`;
        const productImageUpload = await cloudinaryUploadProductImages(
          localPath
        );
        imagesLink.push({
          public_id: productImageUpload?.public_id,
          url: productImageUpload?.secure_url,
        });
      }
    }
    // Upload brand logo
    let brand;
    if (req?.files?.logo) {
      const localPath = `public/images/brands/${req?.files?.logo[0]?.originalname}`;
      const brandUpload = await cloudinaryUploadBrandImages(localPath);
      const brandLogo = {
        public_id: brandUpload?.public_id,
        url: brandUpload?.secure_url,
      };
      brand = {
        name: req?.body?.brandName,
        logo: brandLogo,
      };
    }
    // product sepcification
    let spece = [];
    if (req?.body?.specification) {
      req?.body?.specification?.forEach((spec) => spece.push(spec));
    }
    // product created by user
    const user = req?.user?.id;

    const product = await Product.create({
      ...req?.body,
      user,
      images: imagesLink,
      brand,
      specification: spece,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler("Something went wrong!", 404));
  }
});
