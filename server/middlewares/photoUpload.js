const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// storage
const multerStorage = multer.memoryStorage();

// check file type
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// Resize image before saving
const avatarResize = async (req, res, next) => {
  // check any image have or not
  if (!req?.file) return next();
  req.file.originalname = `avatar-${Date.now()}-${req?.file?.originalname}`;
  await sharp(req?.file?.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/avatar/${req?.file?.originalname}`));
  next();
};

// Resize image before saving
const productResize = async (req, res, next) => {
  // check any image have or not
  if (!req?.files?.images) return next();
  for (let i = 0; i < req?.files?.images?.length; i++) {
    req.files.images[i].originalname = `product-${Date.now()}-${
      req?.files?.images[i]?.originalname
    }`;
    await sharp(req?.files?.images[i]?.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(
        path.join(`public/images/products/${req?.files?.images[i]?.originalname}`)
      );
  }
  next();
};

// Resize image before saving
const brandResize = async (req, res, next) => {
  // check any image have or not
  if (!req?.files?.logo) return next();
  req.files.logo[0].originalname = `brand-${Date.now()}-${
    req?.files?.logo[0]?.originalname
  }`;
  await sharp(req?.files?.logo[0]?.buffer)
    .resize(150, 150)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/brands/${req?.files?.logo[0]?.originalname}`));
  next();
};

module.exports = { photoUpload, avatarResize, productResize, brandResize };
