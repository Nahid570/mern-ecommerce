const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api/v1", userRouter);

// handle error
app.use(notFound);
app.use(errorHandler);

module.exports = app;
