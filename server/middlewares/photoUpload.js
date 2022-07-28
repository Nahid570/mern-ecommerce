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
  if (!req.file) return next();
  req.file.originalname = `avatar-${Date.now()}-${req?.file?.originalname}`;
  await sharp(req?.file?.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/avatar/${req?.file?.originalname}`));
  next();
};

module.exports = { photoUpload, avatarResize };
