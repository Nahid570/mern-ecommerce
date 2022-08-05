const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const {
  cloudinaryUploadProductImages,
  cloudinaryUploadBrandImages,
} = require("../utils/cloudinary");
const SearchFeatures = require("../utils/SearchFeatures");
const cloudinary = require("cloudinary").v2;

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
    return next(new ErrorHandler(error?.message, 404));
  }
});

// Update Product ->> ADMIN
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  // check if there any images to update
  let images;
  let imagesLink = [];
  if (req?.files?.images) {
    images = req?.files?.images;

    // destroy images which store in cloudinary
    if (product?.images?.length > 0) {
      for (let i = 0; i < product?.images?.length; i++) {
        const imageId = product?.images[i]?.public_id;
        await cloudinary.uploader.destroy(imageId);
      }
    }
    // upload new images to cloudinary
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
  }
  // Update brand logo
  let brand;
  if (req?.files?.logo) {
    // destroy brand logo which already stored in cloudinary
    const logoId = product?.brand?.logo?.public_id;
    if (logoId) {
      await cloudinary.uploader.destroy(logoId);
    }
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

  //Update product sepcification
  let spece = [];
  if (req?.body?.specification) {
    req?.body?.specification?.forEach((spec) => spece.push(spec));
  }
  // product created by user
  const user = req?.user?.id;

  product = await Product.create({
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
});

// Delete Product ->> ADMIN
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  // find the product to delete
  const product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  if (product?.images?.length > 0) {
    for (let i = 0; i < product?.images?.length; i++) {
      const imageId = await product?.images[i]?.public_id;
      await cloudinary.uploader.destroy(imageId);
    }
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});

// Get All Products
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const resultPerPage = 12;
  const productsCount = await Product.countDocuments();
  const searchFeature = new SearchFeatures(Product.find(), req?.query)
    .search()
    .filter();
  let products = await searchFeature?.query;
  let filteredProductsCount = products.length;

  searchFeature.pagination(resultPerPage);

  products = await searchFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});
